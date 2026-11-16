import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { AppError } from "../../utils/appError";
import { DeliveryQuoteRequest, DeliveryQuoteResult } from "./delivery.types";

export class DeliveryService {
  /**
   * Calculates authoritative parcel weight and delivery charges.
   * Rate: ₹60 per kilogram based on independent delivery partner arrangement.
   * Packaging allowance: Standard 100g protective beauty mailer.
   */
  async calculateDeliveryQuote(request: DeliveryQuoteRequest): Promise<DeliveryQuoteResult> {
    // 1. Verify delivery is operationally enabled and billing method is confirmed
    if (!env.DELIVERY_ENABLED || env.DELIVERY_BILLING_METHOD === "UNCONFIRMED") {
      throw new AppError(
        "Delivery quotation is temporarily unavailable. Courier billing configuration pending merchant confirmation.",
        400,
        "DELIVERY_QUOTE_UNAVAILABLE"
      );
    }

    const { items, destinationPincode } = request;

    if (!items || items.length === 0) {
      throw new AppError("At least one item is required to calculate delivery charges.", 400, "BAD_REQUEST");
    }

    // 2. Validate destination pincode format if supplied
    if (destinationPincode && !/^\d{6}$/.test(destinationPincode.trim())) {
      throw new AppError("Destination pincode must be a valid 6-digit Indian postal code.", 400, "INVALID_PINCODE");
    }

    // 3. Resolve variants and verified weights from database
    const variantIds = items.map((i) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: {
        id: true,
        sku: true,
        weightGrams: true,
        isAvailable: true,
        isPublished: true,
        product: {
          select: {
            id: true,
            name: true,
            weightGrams: true,
            isPublished: true,
            isActive: true,
          },
        },
      },
    });

    if (variants.length !== variantIds.length) {
      throw new AppError("One or more requested product variants could not be found.", 404, "VARIANT_NOT_FOUND");
    }

    // 4. Calculate total item weight using verified variant weights
    let totalItemWeightGrams = 0;
    for (const item of items) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) {
        throw new AppError(`Variant ${item.variantId} not found.`, 404, "VARIANT_NOT_FOUND");
      }

      // Authoritative measured variant weight (falls back to parent product weight or 40g minimum)
      const measuredWeight = variant.weightGrams ?? variant.product.weightGrams ?? 40;
      if (measuredWeight <= 0) {
        throw new AppError(
          `Product variant ${variant.sku} has invalid weight (${measuredWeight}g).`,
          500,
          "INVALID_PRODUCT_WEIGHT"
        );
      }

      totalItemWeightGrams += measuredWeight * item.quantity;
    }

    // 5. Add verified packaging allowance (mailer, bubble wrap, instructions, adhesive card)
    const packagingWeightGrams = env.PACKAGING_WEIGHT_GRAMS;
    const totalParcelWeightGrams = totalItemWeightGrams + packagingWeightGrams;

    // 6. Compute billable weight and delivery charges at ₹60/kg
    const ratePerKg = env.DELIVERY_RATE_PER_KG; // ₹60.00
    const billingIncrement = env.DELIVERY_BILLING_METHOD as "CEIL_KG" | "PROPORTIONAL";

    let billableWeightGrams = totalParcelWeightGrams;
    let deliveryCharge = 0;

    if (billingIncrement === "CEIL_KG") {
      // Rounded up to whole kilograms with a 1 kg minimum slab
      billableWeightGrams = Math.max(1000, Math.ceil(totalParcelWeightGrams / 1000) * 1000);
      deliveryCharge = Math.round((billableWeightGrams / 1000) * ratePerKg);
    } else {
      // Continuous proportional billing
      billableWeightGrams = totalParcelWeightGrams;
      deliveryCharge = Math.max(
        15,
        Math.round((totalParcelWeightGrams / 1000) * ratePerKg)
      );
    }

    return {
      isServiceable: true,
      totalItemWeightGrams,
      packagingWeightGrams,
      totalParcelWeightGrams,
      billableWeightGrams,
      ratePerKg,
      deliveryCharge,
      billingIncrement,
      destinationPincode: destinationPincode?.trim(),
    };
  }
}

export const deliveryService = new DeliveryService();
