export interface CustomerInput {
  fullName: string;
  phone: string;
  email: string;
}

export interface ShippingAddressInput {
  fullName?: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  deliveryInstructions?: string;
}

export interface OrderItemInput {
  variantId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  customer: CustomerInput;
  shippingAddress: ShippingAddressInput;
  paymentMethod: "UPI_MANUAL" | "COD";
  items: OrderItemInput[];
  idempotencyKey?: string;
  notes?: string;
}

export interface OrderSummaryResponse {
  orderNumber: string;
  orderAccessToken: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  verificationStatus: string;
  paymentReference?: string | null;
  subtotal: number;
  deliveryCharge: number;
  totalWeightGrams: number;
  packagingWeightGrams: number;
  totalAmount: number;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    variantTitle: string;
    sku: string;
    unitPrice: number;
    weightGrams: number;
    quantity: number;
    lineTotal: number;
  }[];
  shippingAddress: ShippingAddressInput;
}

