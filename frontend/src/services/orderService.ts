import { apiClient } from "./apiClient";

export interface CreateOrderPayload {
  customer: {
    fullName: string;
    phone: string;
    email: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  paymentMethod: "UPI_MANUAL" | "COD";
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
  customerNotes?: string;
  idempotencyKey?: string;
}

export interface OrderItemDTO {
  id: string;
  productTitle: string;
  variantTitle: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  weightGrams: number;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  orderAccessToken: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: OrderItemDTO[];
  subtotal: number;
  deliveryCharge: number;
  totalWeightGrams: number;
  packagingWeightGrams: number;
  totalAmount: number;
  currency: string;
  paymentMethod: "UPI_MANUAL" | "COD";
  paymentStatus: "PENDING_VERIFICATION" | "PENDING" | "PAID" | "REFUNDED" | "FAILED";
  orderStatus: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  verificationStatus: string;
  paymentReference?: string;
  paymentNotes?: string;
  paymentDetails?: {
    upiVpa?: string;
    merchantName?: string;
    dynamicUpiUri?: string;
    instructions: string;
  };
  createdAt: string;
}

export const orderService = {
  async createGuestOrder(payload: CreateOrderPayload): Promise<OrderDTO> {
    return apiClient.post<OrderDTO>("/orders", payload);
  },

  async getOrderByNumber(orderNumber: string, token: string): Promise<OrderDTO> {
    return apiClient.get<OrderDTO>(`/orders/${encodeURIComponent(orderNumber)}`, {
      params: { token },
    });
  },

  async submitUtr(orderNumber: string, token: string, utr: string): Promise<OrderDTO> {
    return apiClient.patch<OrderDTO>(
      `/orders/${encodeURIComponent(orderNumber)}/utr`,
      { utr },
      { params: { token } }
    );
  },

  // Owner endpoints
  async getOwnerOrders(ownerSecret: string): Promise<OrderDTO[]> {
    return apiClient.get<OrderDTO[]>("/owner/orders", {
      headers: {
        "x-owner-secret": ownerSecret,
      },
    });
  },

  async updateOrderStatus(
    orderId: string,
    ownerSecret: string,
    update: { orderStatus?: string; paymentStatus?: string; paymentNotes?: string }
  ): Promise<OrderDTO> {
    return apiClient.patch<OrderDTO>(`/owner/orders/${orderId}/status`, update, {
      headers: {
        "x-owner-secret": ownerSecret,
      },
    });
  },
};

