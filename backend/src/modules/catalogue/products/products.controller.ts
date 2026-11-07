import { Request, Response } from "express";
import { productsService, ProductsService } from "./products.service";
import { productListQuerySchema } from "./products.validator";
import { sendSuccess } from "../../../utils/apiResponse";

export class ProductsController {
  constructor(private service: ProductsService = productsService) {}

  public async list(req: Request, res: Response): Promise<Response> {
    const validatedQuery = productListQuerySchema.parse(req.query);
    const result = await this.service.getProducts(validatedQuery);
    return sendSuccess(res, result.items, 200, result.meta);
  }

  public async getBySlug(req: Request, res: Response): Promise<Response> {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const product = await this.service.getProductBySlug(slug);
    return sendSuccess(res, product);
  }
}

export const productsController = new ProductsController();
