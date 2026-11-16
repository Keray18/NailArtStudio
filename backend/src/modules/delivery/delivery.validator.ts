import { z } from "zod";
import { RequestValidationSchema } from "../../middleware/validate.middleware";

export const deliveryQuoteSchema: RequestValidationSchema = {
  body: z.object({
    items: z
      .array(
        z.object({
          variantId: z.string().uuid("Invalid variant ID format"),
          quantity: z.number().int().min(1, "Quantity must be at least 1"),
        })
      )
      .min(1, "At least one item is required for a delivery quotation"),
    destinationPincode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Destination postal pincode must be exactly 6 digits")
      .optional(),
    destinationState: z.string().trim().optional(),
  }),
};
