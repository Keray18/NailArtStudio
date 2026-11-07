import { Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { SearchQueryValidated } from "./search.validator";

export class SearchRepository {
  public async search(filters: SearchQueryValidated) {
    const page = filters.page;
    const limit = filters.limit;
    const skip = (page - 1) * limit;
    const query = filters.q;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      isPublished: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { shortDescription: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { sku: { contains: query, mode: "insensitive" } },
        {
          attributes: {
            some: {
              value: { contains: query, mode: "insensitive" },
            },
          },
        },
      ],
    };

    const [totalProducts, products, matchedCategories] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }, { id: "asc" }],
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
      prisma.category.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),
    ]);

    return {
      query,
      totalProducts,
      products,
      matchedCategories,
      page,
      limit,
      totalPages: Math.ceil(totalProducts / limit) || 1,
    };
  }
}

export const searchRepository = new SearchRepository();

