import { ProductCardDTO } from "../products/products.types";

export interface SearchProductResultDTO {
  query: string;
  totalProducts: number;
  products: ProductCardDTO[];
  matchedCategories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

