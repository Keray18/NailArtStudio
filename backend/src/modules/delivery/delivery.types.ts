export interface DeliveryQuoteItemInput {
  variantId: string;
  quantity: number;
}

export interface DeliveryQuoteRequest {
  items: DeliveryQuoteItemInput[];
  destinationPincode?: string;
  destinationState?: string;
}

export interface DeliveryQuoteResult {
  isServiceable: boolean;
  totalItemWeightGrams: number;
  packagingWeightGrams: number;
  totalParcelWeightGrams: number;
  billableWeightGrams: number;
  ratePerKg: number;
  deliveryCharge: number;
  billingIncrement: "CEIL_KG" | "PROPORTIONAL";
  destinationPincode?: string;
}

