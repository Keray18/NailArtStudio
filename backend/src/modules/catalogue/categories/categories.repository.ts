import { prisma } from "../../../lib/prisma";

export class CategoriesRepository {
  public async findAllActive() {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true, isPublished: true },
            },
          },
        },
      },
    });
  }

  public async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: {
            products: {
              where: { isActive: true, isPublished: true },
            },
          },
        },
      },
    });
  }
}

export const categoriesRepository = new CategoriesRepository();

