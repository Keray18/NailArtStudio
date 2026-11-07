import { productsRepository, ProductsRepository } from "./products.repository";
import { ProductCardDTO, ProductDetailDTO, ProductDetailVariantDTO } from "./products.types";
import { ProductListQueryValidated } from "./products.validator";
import { NotFoundError } from "../../../utils/appError";
import { inventoryService } from "../../inventory/inventory.service";
import { mediaService } from "../../media/media.service";
import { PaginationMeta } from "../../../utils/apiResponse";

export class ProductsService {
  constructor(private repo: ProductsRepository = productsRepository) {}

  public async getProducts(filters: ProductListQueryValidated): Promise<{
    items: ProductCardDTO[];
    meta: PaginationMeta;
  }> {
    const result = await this.repo.findProducts(filters);

    const items: ProductCardDTO[] = result.products.map((p) => {
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
      items,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  public async getProductBySlug(slug: string): Promise<ProductDetailDTO> {
    const cleanSlug = slug.trim().toLowerCase();
    const p = await this.repo.findBySlug(cleanSlug);

    if (!p || !p.isActive || !p.isPublished) {
      throw new NotFoundError("Product", cleanSlug);
    }

    // Related products
    const relatedRecords = await this.repo.findRelated(p.categoryId, p.id, 4);
    const relatedProducts: ProductCardDTO[] = relatedRecords.map((rel) => {
      const primaryImg = rel.images[0] || null;

      const hasStock = rel.variants.some((v) => {
        if (!v.inventory) return false;
        return inventoryService.determineStockStatus(
          v.inventory.quantity,
          v.inventory.reservedQuantity,
          v.inventory.lowStockThreshold,
          v.isAvailable
        ).inStock;
      });

      const isLowStock = rel.variants.some((v) => {
        if (!v.inventory) return false;
        return inventoryService.determineStockStatus(
          v.inventory.quantity,
          v.inventory.reservedQuantity,
          v.inventory.lowStockThreshold,
          v.isAvailable
        ).isLowStock;
      });

      const attrs: Record<string, string> = {};
      for (const a of rel.attributes) {
        attrs[a.name] = a.value;
      }

      return {
        id: rel.id,
        name: rel.name,
        slug: rel.slug,
        sku: rel.sku,
        shortDescription: rel.shortDescription,
        basePrice: Number(rel.basePrice),
        compareAtPrice: rel.compareAtPrice ? Number(rel.compareAtPrice) : null,
        isFeatured: rel.isFeatured,
        category: {
          id: rel.category.id,
          name: rel.category.name,
          slug: rel.category.slug,
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
              altText: rel.name,
            },
        variantCount: rel.variants.length,
        inStock: hasStock,
        isLowStock,
        attributes: attrs,
      };
    });

    // Variants mapping
    const variants: ProductDetailVariantDTO[] = p.variants.map((v) => {
      const inv = v.inventory;
      const stockStatus = inv
        ? inventoryService.determineStockStatus(
            inv.quantity,
            inv.reservedQuantity,
            inv.lowStockThreshold,
            v.isAvailable
          )
        : {
            inStock: false,
            isLowStock: false,
            availableToSell: 0,
          };

      const options = v.optionValues.map((ov) => ({
        optionName: ov.optionValue.option.name,
        value: ov.optionValue.value,
      }));

      return {
        id: v.id,
        sku: v.sku,
        title: v.title,
        price: Number(v.price),
        compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
        isAvailable: v.isAvailable,
        inStock: stockStatus.inStock,
        isLowStock: stockStatus.isLowStock,
        availableToSell: stockStatus.availableToSell,
        options,
      };
    });

    // Attributes mapping
    const attributes: Record<string, string> = {};
    for (const attr of p.attributes) {
      attributes[attr.name] = attr.value;
    }

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      brand: p.brand,
      countryOfOrigin: p.countryOfOrigin,
      shortDescription: p.shortDescription,
      description: p.description,
      packageContents: p.packageContents ? p.packageContents.split("\n").filter(Boolean) : null,
      applicationGuide: p.applicationGuide ? p.applicationGuide.split("\n").filter(Boolean) : null,
      removalGuide: p.removalGuide ? p.removalGuide.split("\n").filter(Boolean) : null,
      basePrice: Number(p.basePrice),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      isFeatured: p.isFeatured,
      category: {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug,
      },
      images: p.images.map((img) => ({
        id: img.id,
        url: mediaService.getOptimizedImageUrl(img.url),
        altText: img.altText,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      })),
      options: p.options.map((opt) => ({
        id: opt.id,
        name: opt.name,
        values: opt.values.map((val) => ({
          id: val.id,
          value: val.value,
          sortOrder: val.sortOrder,
        })),
      })),
      variants,
      attributes,
      collections: p.collectionItems.map((ci) => ({
        id: ci.collection.id,
        name: ci.collection.name,
        slug: ci.collection.slug,
      })),
      relatedProducts,
    };
  }
}

export const productsService = new ProductsService();

