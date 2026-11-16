import { Request, Response, NextFunction } from "express";
import { ownerService } from "./owner.service";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/appError";
import { env } from "../../config/env";

export function requireOwnerAuth(req: Request, _res: Response, next: NextFunction): void {
  const secret = req.headers["x-owner-secret"];
  if (!secret || secret !== env.OWNER_SECRET_KEY) {
    throw new AppError("Invalid or missing merchant owner secret.", 401, "UNAUTHORIZED");
  }
  next();
}

export async function getOwnerOrders(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orders = await ownerService.listOrders();
    sendSuccess(res, orders, 200);
  } catch (err) {
    next(err);
  }
}

export async function updateOwnerOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status, paymentStatus, trackingNumber, courierPartner, notes } = req.body;

    const updated = await ownerService.updateOrderStatus(orderId, {
      status,
      paymentStatus,
      trackingNumber,
      courierPartner,
      notes,
    });
    sendSuccess(res, updated, 200);
  } catch (err) {
    next(err);
  }
}
