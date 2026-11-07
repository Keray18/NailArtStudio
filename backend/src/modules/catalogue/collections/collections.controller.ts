import { Request, Response } from "express";
import { collectionsService, CollectionsService } from "./collections.service";
import { sendSuccess } from "../../../utils/apiResponse";

export class CollectionsController {
  constructor(private service: CollectionsService = collectionsService) {}

  public async getAll(_req: Request, res: Response): Promise<Response> {
    const collections = await this.service.getAllCollections();
    return sendSuccess(res, collections);
  }

  public async getBySlug(req: Request, res: Response): Promise<Response> {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const collection = await this.service.getCollectionBySlug(slug);
    return sendSuccess(res, collection);
  }
}

export const collectionsController = new CollectionsController();
