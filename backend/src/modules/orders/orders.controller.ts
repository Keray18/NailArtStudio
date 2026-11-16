import { Request, Response, NextFunction } from "express";
import { ordersService } from "./orders.service";
import { sendSuccess } from "../../utils/apiResponse";

export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await ordersService.createGuestOrder(req.body);
    sendSuccess(res, order, 201);
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orderNumber = Array.isArray(req.params.orderNumber) ? req.params.orderNumber[0] : req.params.orderNumber;
    const token = req.query.token as string;

    const order = await ordersService.getOrderByNumberAndToken(orderNumber, token);
    sendSuccess(res, order, 200);
  } catch (err) {
    next(err);
  }
}

export async function submitUtr(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orderNumber = Array.isArray(req.params.orderNumber) ? req.params.orderNumber[0] : req.params.orderNumber;
    const token = req.query.token as string;
    const { utr } = req.body;

    const order = await ordersService.submitCustomerUtr(orderNumber, token, utr);
    sendSuccess(res, order, 200);
  } catch (err) {
    next(err);
  }
}

