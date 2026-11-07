import { searchRepository, SearchRepository } from "./search.repository";
import { SearchProductResultDTO } from "./search.types";
import { SearchQueryValidated } from "./search.validator";
import { ProductCardDTO } from "../products/products.types";
import { inventoryService } from "../../inventory/inventory.service";
import { mediaService } from "../../media/media.service";
import { PaginationMeta } from "../../../utils/apiResponse";

export class SearchService {
  constructor(private repo: SearchRepository = searchRepository) {}

  public async search(filters: SearchQueryValidated): Promise<{
    data: SearchProductResultDTO;
    meta: PaginationMeta;
  }> {
    const result = await this.repo.search(filters);

    const products: ProductCardDTO[] = result.products.map((p) => {
      const primaryImg = p.images[0] || null;

      const hasStock = p.variants.some((v) => {
        if (!v.inventory) return false;
        return inventoryService.determineStockStatus(
          v.inventory.quantity,
          v.inventory.reservedQuantity,
          v.inventory.lowStockThreshold,
          v.isAvailable
        ).inStock;
      });

      const isLowStock = p.variants.some((v) => {
        if (!v.inventory) return false;
        return inventoryService.determineStockStatus(
          v.inventory.quantity,
          v.inventory.reservedQuantity,
          v.inventory.lowStockThreshold,
          v.isAvailable
        ).isLowStock;
      });

      const attributes: Record<string, string> = {};
      for (const attr of p.attributes) {
        attributes[attr.name] = attr.value;
      }

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        shortDescription: p.shortDescription,
        basePrice: Number(p.basePrice),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        isFeatured: p.isFeatured,
        category: {
          id: p.category.id,
          name: p.category.name,
          slug: p.category.slug,
        },
        primaryImage: primaryImg
          ? {
              id: primaryImg.id,
              url: mediaService.getOptimizedImageUrl(primaryImg.url),
              altText: primaryImg.altText,
            }
          : {
              id: "placeholder",
              url: mediaService.getFallbackPlaceholderUrl(),
              altText: p.name,
            },
        variantCount: p.variants.length,
        inStock: hasStock,
        isLowStock,
        attributes,
      };
    });

    return {
      data: {
        query: result.query,
        totalProducts: result.totalProducts,
        products,
        matchedCategories: result.matchedCategories,
      },
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.totalProducts,
        totalPages: result.totalPages,
      },
    };
  }
}

export const searchService = new SearchService();

