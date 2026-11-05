import { Response } from 'express';

export interface ApiResponseSuccess<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiResponseError {
  success: false;
  message: string;
  error?: unknown;
}

export type ApiResponse<T = unknown> = ApiResponseSuccess<T> | ApiResponseError;

/**
 * Sends a standardized success JSON response.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response {
  const payload: ApiResponseSuccess<T> = {
    success: true,
    ...(message ? { message } : {}),
    data,
  };
  return res.status(statusCode).json(payload);
}

/**
 * Sends a standardized error JSON response.
 */
export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  error?: unknown
): Response {
  const payload: ApiResponseError = {
    success: false,
    message,
    ...(error !== undefined ? { error } : {}),
  };
  return res.status(statusCode).json(payload);
}

