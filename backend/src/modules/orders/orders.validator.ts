import { z } from "zod";
import { RequestValidationSchema } from "../../middleware/validate.middleware";

export const createOrderSchema: RequestValidationSchema = {
  body: z.object({
    customer: z.object({
      fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name must not exceed 100 characters"),
      phone: z
        .string()
        .trim()
        .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
      email: z
        .string()
        .trim()
        .email("Please enter a valid email address"),
    }),
    shippingAddress: z.object({
      addressLine1: z
        .string()
        .trim()
        .min(3, "House number and street address are required")
        .max(255),
      addressLine2: z.string().trim().max(255).optional(),
      landmark: z.string().trim().max(150).optional(),
      city: z.string().trim().min(2, "City is required").max(100),
      state: z.string().trim().min(2, "State is required").max(100),
      postalCode: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
      deliveryInstructions: z.string().trim().max(300).optional(),
    }),
    paymentMethod: z.enum(["UPI_MANUAL", "COD"], {
      errorMap: () => ({ message: "Payment method must be UPI_MANUAL or COD" }),
    }),
    items: z
      .array(
        z.object({
          variantId: z.string().uuid("Invalid variant ID format"),
          quantity: z.number().int().min(1, "Quantity must be at least 1").max(50, "Maximum quantity per item is 50"),
        })
      )
      .min(1, "At least one item is required to place an order"),
    idempotencyKey: z.string().trim().max(128).optional(),
    notes: z.string().trim().max(500).optional(),
  }),
};

export const submitUtrSchema: RequestValidationSchema = {
  params: z.object({
    orderNumber: z.string().trim().min(5),
  }),
  query: z.object({
    token: z.string().uuid("Invalid order access token"),
  }),
  body: z.object({
    utr: z
      .string()
      .trim()
      .min(6, "UTR / Transaction Reference must be at least 6 characters")
      .max(30, "UTR / Transaction Reference must not exceed 30 characters")
      .regex(/^[a-zA-Z0-9]+$/, "UTR must contain only alphanumeric characters"),
  }),
};

export const getOrderSchema: RequestValidationSchema = {
  params: z.object({
    orderNumber: z.string().trim().min(5),
  }),
  query: z.object({
    token: z.string().uuid("Invalid order access token"),
  }),
};
