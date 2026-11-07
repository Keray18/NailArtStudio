import { collectionsRepository, CollectionsRepository } from "./collections.repository";
import { CollectionSummaryDTO, CollectionDetailDTO } from "./collections.types";
import { NotFoundError } from "../../../utils/appError";
import { inventoryService } from "../../inventory/inventory.service";

export class CollectionsService {
  constructor(private repo: CollectionsRepository = collectionsRepository) {}

  public async getAllCollections(): Promise<CollectionSummaryDTO[]> {
    const records = await this.repo.findAllActive();
    return records.map((col) => ({
      id: col.id,
      name: col.name,
      slug: col.slug,
      tagline: col.tagline,
      description: col.description,
      bannerImageUrl: col.bannerImageUrl,
      isFeatured: col.isFeatured,
      sortOrder: col.sortOrder,
      productCount: col._count.products,
    }));
  }

  public async getCollectionBySlug(slug: string): Promise<CollectionDetailDTO> {
    const cleanSlug = slug.trim().toLowerCase();
    const record = await this.repo.findBySlug(cleanSlug);

    if (!record || !record.isActive) {
      throw new NotFoundError("Collection", cleanSlug);
    }

    return {
      id: record.id,
      name: record.name,
      slug: record.slug,
      tagline: record.tagline,
      description: record.description,
      bannerImageUrl: record.bannerImageUrl,
      isFeatured: record.isFeatured,
      sortOrder: record.sortOrder,
      productCount: record._count.products,
      products: record.products.map((item) => {
        const p = item.product;
        const primaryImg = p.images[0] || null;

        // Determine if any variant is in stock
        const hasStock = p.variants.some((v) => {
          const inv = v.inventory;
          if (!inv) return false;
          const status = inventoryService.determineStockStatus(
            inv.quantity,
            inv.reservedQuantity,
            inv.lowStockThreshold,
            v.isAvailable
          );
          return status.inStock;
        });

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          shortDescription: p.shortDescription,
          basePrice: Number(p.basePrice),
          compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
          category: {
            name: p.category.name,
            slug: p.category.slug,
          },
          primaryImage: primaryImg
            ? {
                url: primaryImg.url,
                altText: primaryImg.altText,
              }
            : null,
          inStock: hasStock,
        };
      }),
    };
  }
}

export const collectionsService = new CollectionsService();

