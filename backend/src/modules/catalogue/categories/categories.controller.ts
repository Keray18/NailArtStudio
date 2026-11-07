import { Request, Response } from "express";
import { categoriesService, CategoriesService } from "./categories.service";
import { sendSuccess } from "../../../utils/apiResponse";

export class CategoriesController {
  constructor(private service: CategoriesService = categoriesService) {}

  public async getAll(_req: Request, res: Response): Promise<Response> {
    const categories = await this.service.getAllCategories();
    return sendSuccess(res, categories);
  }

  public async getBySlug(req: Request, res: Response): Promise<Response> {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const category = await this.service.getCategoryBySlug(slug);
    return sendSuccess(res, category);
  }
}

export const categoriesController = new CategoriesController();
