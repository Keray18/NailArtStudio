import { Response } from "express";
import { ErrorDetail } from "./appError";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: true;
  statusCode: number;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
  timestamp: string;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: PaginationMeta
): Response {
  const payload: ApiResponse<T> = {
    success: true,
    statusCode,
    data,
    ...(meta ? { meta } : {}),
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: ErrorDetail[]
): Response {
  const payload: ApiErrorResponse = {
    success: false,
    statusCode,
    error: {
      code,
      message,
      ...(details && details.length > 0 ? { details } : {}),
    },
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
}

