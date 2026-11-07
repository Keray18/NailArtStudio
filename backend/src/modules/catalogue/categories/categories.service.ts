import { categoriesRepository, CategoriesRepository } from "./categories.repository";
import { CategorySummaryDTO, CategoryDetailDTO } from "./categories.types";
import { NotFoundError } from "../../../utils/appError";

export class CategoriesService {
  constructor(private repo: CategoriesRepository = categoriesRepository) {}

  public async getAllCategories(): Promise<CategorySummaryDTO[]> {
    const records = await this.repo.findAllActive();
    return records.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.imageUrl,
      sortOrder: c.sortOrder,
      productCount: c._count.products,
    }));
  }

  public async getCategoryBySlug(slug: string): Promise<CategoryDetailDTO> {
    const cleanSlug = slug.trim().toLowerCase();
    const record = await this.repo.findBySlug(cleanSlug);

    if (!record || !record.isActive) {
      throw new NotFoundError("Category", cleanSlug);
    }

    return {
      id: record.id,
      name: record.name,
      slug: record.slug,
      description: record.description,
      imageUrl: record.imageUrl,
      parentId: record.parentId,
      sortOrder: record.sortOrder,
      productCount: record._count.products,
      children: record.children.map((ch) => ({
        id: ch.id,
        name: ch.name,
        slug: ch.slug,
        description: ch.description,
        imageUrl: ch.imageUrl,
      })),
    };
  }
}

export const categoriesService = new CategoriesService();

