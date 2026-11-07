import { prisma } from "../../../lib/prisma";

export class CollectionsRepository {
  public async findAllActive() {
    return prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            products: {
              where: {
                product: { isActive: true, isPublished: true },
              },
            },
          },
        },
      },
    });
  }

  public async findBySlug(slug: string) {
    return prisma.collection.findUnique({
      where: { slug },
      include: {
        products: {
          where: {
            product: { isActive: true, isPublished: true },
          },
          orderBy: { sortOrder: "asc" },
          include: {
            product: {
              include: {
                category: true,
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
                variants: {
                  where: { isPublished: true },
                  include: {
                    inventory: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            products: {
              where: {
                product: { isActive: true, isPublished: true },
              },
            },
          },
        },
      },
    });
  }
}

export const collectionsRepository = new CollectionsRepository();

