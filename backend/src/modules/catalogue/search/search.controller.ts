import { Request, Response } from "express";
import { searchService, SearchService } from "./search.service";
import { searchQuerySchema } from "./search.validator";
import { sendSuccess } from "../../../utils/apiResponse";

export class SearchController {
  constructor(private service: SearchService = searchService) {}

  public async search(req: Request, res: Response): Promise<Response> {
    const validatedQuery = searchQuerySchema.parse(req.query);
    const result = await this.service.search(validatedQuery);
    return sendSuccess(res, result.data, 200, result.meta);
  }
}

export const searchController = new SearchController();

