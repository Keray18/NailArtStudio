import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/appError';
import { sendError } from '../utils/apiResponse';
import { config } from '../config/env';

export function errorHandler(
  err: Error | AppError | ZodError | unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const isProduction = config.NODE_ENV === 'production';

  // Handle known operational AppError
  if (err instanceof AppError) {
    sendError(
      res,
      err.message,
      err.statusCode,
      err.details ?? (isProduction ? undefined : { stack: err.stack })
    );
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));
    sendError(res, 'Validation error', 400, { issues: formattedErrors });
    return;
  }

  // Handle JSON syntax errors from body-parser
  if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400) {
    sendError(res, 'Invalid JSON payload received', 400);
    return;
  }

  // Generic or unexpected error: Log internally, never leak to client in production
  console.error('[Unhandled Internal Error]:', err);

  const fallbackMessage = isProduction ? 'Internal server error' : (err as Error)?.message || 'Internal server error';
  const errorDetails = isProduction ? undefined : { stack: (err as Error)?.stack };

  sendError(res, fallbackMessage, 500, errorDetails);
}

