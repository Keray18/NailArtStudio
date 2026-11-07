import { Router } from "express";
import { searchController } from "./search.controller";

export const searchRouter = Router();

searchRouter.get("/", async (req, res, next) => {
  try {
    await searchController.search(req, res);
  } catch (error) {
    next(error);
  }
});

