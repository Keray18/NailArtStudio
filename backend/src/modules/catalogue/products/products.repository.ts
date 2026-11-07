import { Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { ProductListQueryValidated } from "./products.validator";

export class ProductsRepository {
  public async findProducts(filters: ProductListQueryValidated) {
    const page = filters.page;
    const limit = filters.limit;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      isPublished: true,
    };

    // Category filter
    if (filters.category) {
      where.category = {
        slug: filters.category.toLowerCase(),
        isActive: true,
      };
    }

    // Collection filter
    if (filters.collection) {
      where.collectionItems = {
        some: {
          collection: {
            slug: filters.collection.toLowerCase(),
            isActive: true,
          },
        },
      };
    }

    // Price range filters
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.basePrice = {};
      if (filters.minPrice !== undefined) {
        where.basePrice.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.basePrice.lte = filters.maxPrice;
      }
    }

    // Faceted attribute filters
    const attributeConditions: Prisma.ProductAttributeWhereInput[] = [];

    if (filters.shape) {
      attributeConditions.push({
        name: { equals: "shape", mode: "insensitive" },
        value: { equals: filters.shape, mode: "insensitive" },
      });
    }

    if (filters.length) {
      attributeConditions.push({
        name: { equals: "length", mode: "insensitive" },
        value: { equals: filters.length, mode: "insensitive" },
      });
    }

    if (filters.finish) {
      attributeConditions.push({
        name: { equals: "finish", mode: "insensitive" },
        value: { equals: filters.finish, mode: "insensitive" },
      });
    }

    if (attributeConditions.length > 0) {
      where.attributes = {
        some: {
          OR: attributeConditions,
        },
      };
    }

    // Keyword search
    if (filters.q) {
      const query = filters.q.trim();
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { shortDescription: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { sku: { contains: query, mode: "insensitive" } },
      ];
    }

    // Stock availability filter
    if (filters.inStockOnly) {
      where.variants = {
        some: {
          isAvailable: true,
          isPublished: true,
          inventory: {
            quantity: { gt: 0 },
          },
        },
      };
    }

    // Sorting with deterministic secondary sort
    let orderBy: Prisma.ProductOrderByWithRelationInput[];
    switch (filters.sort) {
      case "price-asc":
        orderBy = [{ basePrice: "asc" }, { id: "asc" }];
        break;
      case "price-desc":
        orderBy = [{ basePrice: "desc" }, { id: "asc" }];
        break;
      case "newest":
        orderBy = [{ createdAt: "desc" }, { id: "asc" }];
        break;
      case "featured":
      default:
        orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }, { id: "asc" }];
        break;
    }

    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
          images: {
            orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
            take: 1,
          },
          attributes: true,
          variants: {
            where: { isPublished: true },
            include: {
              inventory: true,
            },
          },
        },
      }),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
        },
        attributes: true,
        options: {
          orderBy: { sortOrder: "asc" },
          include: {
            values: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
        variants: {
          where: { isPublished: true },
          orderBy: { sortOrder: "asc" },
          include: {
            inventory: true,
            optionValues: {
              include: {
                optionValue: {
                  include: {
                    option: true,
                  },
                },
              },
            },
          },
        },
        collectionItems: {
          include: {
            collection: true,
          },
        },
      },
    });
  }

  public async findRelated(categoryId: string, excludeProductId: string, take = 4) {
    return prisma.product.findMany({
      where: {
        categoryId,
        id: { not: excludeProductId },
        isActive: true,
        isPublished: true,
      },
      take,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }, { id: "asc" }],
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        attributes: true,
        variants: {
          where: { isPublished: true },
          include: {
            inventory: true,
          },
        },
      },
    });
  }
}

export const productsRepository = new ProductsRepository();

