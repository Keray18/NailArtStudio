import { apiClient } from "./apiClient";

export interface DeliveryQuoteRequest {
  items: Array<{ variantId: string; quantity: number }>;
  destinationPincode: string;
}

export interface DeliveryQuoteResponse {
  isServiceable: boolean;
  destinationPincode: string;
  totalMerchandiseWeightGrams: number;
  packagingWeightGrams: number;
  totalParcelWeightGrams: number;
  billableWeightGrams: number;
  billableWeightKg: number;
  ratePerKg: number;
  deliveryCharge: number;
  estimatedTransitDays: string;
  carrierNotice: string;
}

export const deliveryService = {
  async getQuote(request: DeliveryQuoteRequest): Promise<DeliveryQuoteResponse> {
    return apiClient.post<DeliveryQuoteResponse>("/delivery/quote", request);
  },
};

