import { Request, Response, NextFunction } from "express";
import { deliveryService } from "./delivery.service";
import { sendSuccess } from "../../utils/apiResponse";

export async function getDeliveryQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { items, destinationPincode, destinationState } = req.body;
    const quote = await deliveryService.calculateDeliveryQuote({
      items,
      destinationPincode,
      destinationState,
    });
    sendSuccess(res, quote, 200);
  } catch (err) {
    next(err);
  }
}

