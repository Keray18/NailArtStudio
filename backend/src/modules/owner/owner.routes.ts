import { Router } from "express";
import { requireOwnerAuth, getOwnerOrders, updateOwnerOrderStatus } from "./owner.controller";

export const ownerRouter = Router();

// All owner routes strictly require the x-owner-secret header
ownerRouter.use(requireOwnerAuth);

ownerRouter.get("/orders", getOwnerOrders);
ownerRouter.patch("/orders/:id/status", updateOwnerOrderStatus);

