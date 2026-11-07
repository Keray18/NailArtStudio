import { Router } from "express";
import { collectionsController } from "./collections.controller";

export const collectionsRouter = Router();

collectionsRouter.get("/", async (req, res, next) => {
  try {
    await collectionsController.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

collectionsRouter.get("/:slug", async (req, res, next) => {
  try {
    await collectionsController.getBySlug(req, res);
  } catch (error) {
    next(error);
  }
});

