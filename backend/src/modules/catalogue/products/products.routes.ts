import { Router } from "express";
import { productsController } from "./products.controller";

export const productsRouter = Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    await productsController.list(req, res);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:slug", async (req, res, next) => {
  try {
    await productsController.getBySlug(req, res);
  } catch (error) {
    next(error);
  }
});

