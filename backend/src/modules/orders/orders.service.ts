import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { AppError } from "../../utils/appError";
import { deliveryService } from "../delivery/delivery.service";
import { CreateOrderRequest, OrderSummaryResponse } from "./orders.types";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

export class OrdersService {
  /**
   * Generates a unique, non-guessable human-readable order reference.
   * Format: TNL-YYYYMMDD-XXXX (e.g. TNL-20261116-8341)
   */
  private generateOrderNumber(): string {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `TNL-${today}-${randomSuffix}`;
  }

  /**
   * Processes genuine guest checkout and creates an order transactionally.
   */
  async createGuestOrder(request: CreateOrderRequest): Promise<OrderSummaryResponse> {
    const { customer, shippingAddress, paymentMethod, items, idempotencyKey, notes } = request;

    // 1. Idempotency Check
    if (idempotencyKey) {
      const existing = await prisma.order.findUnique({
        where: { idempotencyKey },
        include: { items: true, customer: true },
      });
      if (existing) {
        return this.formatOrderResponse(existing);
      }
    }

    // 2. Validate payment method availability
    if (paymentMethod === "COD" && !env.COD_ENABLED) {
      throw new AppError(
        "Cash on Delivery is currently disabled by merchant policy.",
        400,
        "PAYMENT_METHOD_UNAVAILABLE"
      );
    }

    // 3. Resolve real variants from database
    const variantIds = items.map((i) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: {
        product: true,
        inventory: true,
      },
    });

    if (variants.length !== variantIds.length) {
      throw new AppError("One or more requested product variants do not exist.", 404, "VARIANT_NOT_FOUND");
    }

    // 4. Verify publication and stock for each variant
    for (const item of items) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) {
        throw new AppError(`Variant ${item.variantId} not found.`, 404, "VARIANT_NOT_FOUND");
      }

      if (!variant.isPublished || !variant.product.isPublished || !variant.isAvailable) {
        throw new AppError(
          `Item '${variant.product.name} - ${variant.title}' is currently not available for purchase.`,
          400,
          "PRODUCT_UNAVAILABLE"
        );
      }

      const currentQty = variant.inventory?.quantity ?? 0;
      const reservedQty = variant.inventory?.reservedQuantity ?? 0;
      const availableToSell = Math.max(0, currentQty - reservedQty);

      if (availableToSell < item.quantity) {
        throw new AppError(
          `Insufficient stock for '${variant.product.name} - ${variant.title}'. Available: ${availableToSell}, requested: ${item.quantity}.`,
          400,
          "INSUFFICIENT_STOCK"
        );
      }
    }

    // 5. Calculate authoritative merchandise subtotal using database prices
    let subtotal = 0;
    const lineItemDetails = items.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId)!;
      const unitPrice = Number(variant.price);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      const weightGrams = variant.weightGrams ?? variant.product.weightGrams ?? 40;

      return {
        variantId: variant.id,
        productName: variant.product.name,
        variantTitle: variant.title,
        sku: variant.sku,
        unitPrice,
        weightGrams,
        quantity: item.quantity,
        lineTotal,
      };
    });

    // 6. Enforce mandatory merchandise subtotal minimum (₹999)
    const minOrder = env.MIN_ORDER_MERCHANDISE_SUBTOTAL;
    if (subtotal < minOrder) {
      throw new AppError(
        `Minimum merchandise order subtotal is ₹${minOrder}.00. Your current merchandise subtotal is ₹${subtotal.toFixed(2)}. Delivery charges do not count toward the minimum.`,
        400,
        "MINIMUM_ORDER_NOT_MET"
      );
    }

    // 7. Calculate authoritative delivery charges at ₹60/kg based on parcel weight
    const deliveryQuote = await deliveryService.calculateDeliveryQuote({
      items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      destinationPincode: shippingAddress.postalCode,
      destinationState: shippingAddress.state,
    });

    const deliveryCharge = deliveryQuote.deliveryCharge;
    const totalAmount = subtotal + deliveryCharge;
    const totalWeightGrams = deliveryQuote.totalParcelWeightGrams;
    const packagingWeightGrams = deliveryQuote.packagingWeightGrams;

    // 8. Determine payment status & expiration
    const dbPaymentMethod = paymentMethod === "UPI_MANUAL" ? PaymentMethod.UPI_MANUAL : PaymentMethod.COD;
    const dbPaymentStatus =
      paymentMethod === "UPI_MANUAL" ? PaymentStatus.PENDING_VERIFICATION : PaymentStatus.PENDING;
    const verificationStatus = "UNVERIFIED";

    // 2-hour hold for UPI payment verification; 24-hour hold for COD
    const expiresAt = new Date(Date.now() + (paymentMethod === "UPI_MANUAL" ? 2 : 24) * 60 * 60 * 1000);

    // 9. Atomic Prisma Transaction: Reserve stock and persist order
    const orderAccessToken = uuidv4();
    const orderNumber = this.generateOrderNumber();

    const createdOrder = await prisma.$transaction(async (tx) => {
      // A. Re-verify and reserve inventory
      for (const item of items) {
        const inv = await tx.productInventory.findUnique({
          where: { variantId: item.variantId },
        });

        if (!inv || inv.quantity - inv.reservedQuantity < item.quantity) {
          throw new AppError(
            `Stock changed during checkout. Insufficient inventory for variant ${item.variantId}.`,
            400,
            "INSUFFICIENT_STOCK"
          );
        }

        await tx.productInventory.update({
          where: { variantId: item.variantId },
          data: {
            reservedQuantity: { increment: item.quantity },
          },
        });
      }

      // B. Upsert Customer by phone
      let dbCustomer = await tx.customer.findFirst({
        where: { phone: customer.phone },
      });

      if (!dbCustomer) {
        dbCustomer = await tx.customer.create({
          data: {
            fullName: customer.fullName,
            phone: customer.phone,
            email: customer.email,
            isGuest: true,
          },
        });
      } else {
        dbCustomer = await tx.customer.update({
          where: { id: dbCustomer.id },
          data: {
            fullName: customer.fullName,
            email: customer.email,
          },
        });
      }

      // C. Create Address record
      const addressSnapshot = {
        fullName: shippingAddress.fullName || customer.fullName,
        phone: shippingAddress.phone || customer.phone,
        email: customer.email,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2 || null,
        landmark: shippingAddress.landmark || null,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        deliveryInstructions: shippingAddress.deliveryInstructions || null,
        country: "India",
      };

      await tx.address.create({
        data: {
          customerId: dbCustomer.id,
          fullName: addressSnapshot.fullName,
          phone: addressSnapshot.phone,
          addressLine1: addressSnapshot.addressLine1,
          addressLine2: addressSnapshot.addressLine2,
          landmark: addressSnapshot.landmark,
          city: addressSnapshot.city,
          state: addressSnapshot.state,
          postalCode: addressSnapshot.postalCode,
          country: "India",
        },
      });

      // D. Create Order record
      const order = await tx.order.create({
        data: {
          orderNumber,
          orderAccessToken,
          idempotencyKey: idempotencyKey || null,
          customerId: dbCustomer.id,
          status: OrderStatus.PENDING,
          paymentMethod: dbPaymentMethod,
          paymentStatus: dbPaymentStatus,
          verificationStatus,
          subtotal,
          deliveryCharge,
          shippingFee: deliveryCharge, // Keep backward compatible
          totalWeightGrams,
          packagingWeightGrams,
          totalAmount,
          shippingAddressSnapshot: addressSnapshot,
          notes: notes || null,
          expiresAt,
          items: {
            create: lineItemDetails.map((line) => ({
              variantId: line.variantId,
              productName: line.productName,
              variantTitle: line.variantTitle,
              sku: line.sku,
              unitPrice: line.unitPrice,
              weightGrams: line.weightGrams,
              quantity: line.quantity,
              lineTotal: line.lineTotal,
            })),
          },
        },
        include: {
          items: true,
          customer: true,
        },
      });

      return order;
    });

    return this.formatOrderResponse(createdOrder);
  }

  /**
   * Retrieves an order by orderNumber, guarded strictly by orderAccessToken.
   * Prevents unauthorized public order scraping.
   */
  async getOrderByNumberAndToken(orderNumber: string, token: string): Promise<OrderSummaryResponse> {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        customer: true,
      },
    });

    if (!order || order.orderAccessToken !== token) {
      throw new AppError("Order reference not found or invalid security token.", 404, "ORDER_NOT_FOUND");
    }

    return this.formatOrderResponse(order);
  }

  /**
   * Submits a customer's claimed UPI UTR / Transaction Reference.
   * Marks verificationStatus as 'UTR_SUBMITTED', leaves paymentStatus as 'PENDING_VERIFICATION'.
   * Does NOT mark as PAID until merchant confirms.
   */
  async submitCustomerUtr(orderNumber: string, token: string, utr: string): Promise<OrderSummaryResponse> {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, customer: true },
    });

    if (!order || order.orderAccessToken !== token) {
      throw new AppError("Order reference not found or invalid security token.", 404, "ORDER_NOT_FOUND");
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      return this.formatOrderResponse(order);
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentReference: utr.trim(),
        verificationStatus: "UTR_SUBMITTED",
        paymentNotes: `Customer submitted UTR: ${utr.trim()} at ${new Date().toISOString()}`,
      },
      include: { items: true, customer: true },
    });

    return this.formatOrderResponse(updated);
  }

  /**
   * Formats a database order into a clean, safe DTO.
   */
  private formatOrderResponse(order: any): OrderSummaryResponse {
    const address = (order.shippingAddressSnapshot as any) || {};

    return {
      orderNumber: order.orderNumber,
      orderAccessToken: order.orderAccessToken,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      verificationStatus: order.verificationStatus,
      paymentReference: order.paymentReference,
      subtotal: Number(order.subtotal),
      deliveryCharge: Number(order.deliveryCharge ?? order.shippingFee ?? 0),
      totalWeightGrams: order.totalWeightGrams,
      packagingWeightGrams: order.packagingWeightGrams,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : String(order.createdAt),
      items: (order.items || []).map((i: any) => ({
        id: i.id,
        productName: i.productName,
        variantTitle: i.variantTitle,
        sku: i.sku,
        unitPrice: Number(i.unitPrice),
        weightGrams: i.weightGrams,
        quantity: i.quantity,
        lineTotal: Number(i.lineTotal),
      })),
      shippingAddress: {
        fullName: address.fullName || "",
        phone: address.phone || "",
        addressLine1: address.addressLine1 || "",
        addressLine2: address.addressLine2 || undefined,
        landmark: address.landmark || undefined,
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
        deliveryInstructions: address.deliveryInstructions || undefined,
      },
    };
  }
}

export const ordersService = new OrdersService();
