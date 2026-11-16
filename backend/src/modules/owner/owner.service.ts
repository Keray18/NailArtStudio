import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export class OwnerService {
  /**
   * Lists all customer orders for authenticated merchant review.
   */
  async listOrders(limit = 100) {
    const orders = await prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        customer: true,
      },
    });

    return orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      createdAt: o.createdAt.toISOString(),
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      paymentReference: o.paymentReference,
      verificationStatus: o.verificationStatus,
      subtotal: Number(o.subtotal),
      deliveryCharge: Number(o.deliveryCharge ?? o.shippingFee ?? 0),
      totalAmount: Number(o.totalAmount),
      totalWeightGrams: o.totalWeightGrams,
      customer: {
        fullName: o.customer.fullName,
        phone: o.customer.phone,
        email: o.customer.email,
      },
      shippingAddress: o.shippingAddressSnapshot as any,
      items: o.items.map((i) => ({
        id: i.id,
        productName: i.productName,
        variantTitle: i.variantTitle,
        sku: i.sku,
        unitPrice: Number(i.unitPrice),
        weightGrams: i.weightGrams,
        quantity: i.quantity,
        lineTotal: Number(i.lineTotal),
      })),
      notes: o.notes,
      expiresAt: o.expiresAt ? o.expiresAt.toISOString() : null,
    }));
  }

  /**
   * Updates order fulfillment status or payment status.
   * Handles stock deduction upon payment confirmation, or stock release upon cancellation.
   */
  async updateOrderStatus(
    orderId: string,
    updates: {
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      trackingNumber?: string;
      courierPartner?: string;
      notes?: string;
    }
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");
    }

    return await prisma.$transaction(async (tx) => {
      // 1. If marking PAID from PENDING_VERIFICATION: Deduct actual inventory
      if (
        updates.paymentStatus === PaymentStatus.PAID &&
        order.paymentStatus !== PaymentStatus.PAID
      ) {
        for (const item of order.items) {
          await tx.productInventory.update({
            where: { variantId: item.variantId },
            data: {
              quantity: { decrement: item.quantity },
              reservedQuantity: { decrement: item.quantity },
            },
          });
        }
      }

      // 2. If cancelling an active order: Release reserved inventory
      if (
        updates.status === OrderStatus.CANCELLED &&
        order.status !== OrderStatus.CANCELLED &&
        order.paymentStatus !== PaymentStatus.PAID
      ) {
        for (const item of order.items) {
          await tx.productInventory.update({
            where: { variantId: item.variantId },
            data: {
              reservedQuantity: { decrement: item.quantity },
            },
          });
        }
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          ...(updates.status && { status: updates.status }),
          ...(updates.paymentStatus && {
            paymentStatus: updates.paymentStatus,
            verificationStatus: updates.paymentStatus === PaymentStatus.PAID ? "VERIFIED_BY_OWNER" : order.verificationStatus,
          }),
          ...(updates.trackingNumber && { trackingNumber: updates.trackingNumber }),
          ...(updates.courierPartner && { courierPartner: updates.courierPartner }),
          ...(updates.notes && { notes: updates.notes }),
        },
        include: { items: true, customer: true },
      });

      return updated;
    });
  }
}

export const ownerService = new OwnerService();
