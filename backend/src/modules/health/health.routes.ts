import { Router } from "express";
import { healthController } from "./health.controller";

export const healthRouter = Router();

healthRouter.get("/health", (req, res) => {
  healthController.getLiveness(req, res);
});

healthRouter.get("/ready", async (req, res, next) => {
  try {
    await healthController.getReadiness(req, res);
  } catch (error) {
    next(error);
  }
});

