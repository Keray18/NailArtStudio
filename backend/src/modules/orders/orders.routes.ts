import { Router } from "express";
import { createOrder, getOrder, submitUtr } from "./orders.controller";
import { validateRequest } from "../../middleware/validate.middleware";
import { createOrderSchema, getOrderSchema, submitUtrSchema } from "./orders.validator";

export const ordersRouter = Router();

ordersRouter.post("/", validateRequest(createOrderSchema), createOrder);
ordersRouter.get("/:orderNumber", validateRequest(getOrderSchema), getOrder);
ordersRouter.patch("/:orderNumber/utr", validateRequest(submitUtrSchema), submitUtr);
