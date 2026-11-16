import { Router } from "express";
import { getDeliveryQuote } from "./delivery.controller";
import { validateRequest } from "../../middleware/validate.middleware";
import { deliveryQuoteSchema } from "./delivery.validator";

export const deliveryRouter = Router();

deliveryRouter.post("/quote", validateRequest(deliveryQuoteSchema), getDeliveryQuote);
