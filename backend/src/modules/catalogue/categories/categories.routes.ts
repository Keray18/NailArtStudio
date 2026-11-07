import { Router } from "express";
import { categoriesController } from "./categories.controller";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (req, res, next) => {
  try {
    await categoriesController.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

categoriesRouter.get("/:slug", async (req, res, next) => {
  try {
    await categoriesController.getBySlug(req, res);
  } catch (error) {
    next(error);
  }
});

