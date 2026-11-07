import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";
import { sendError } from "../utils/apiResponse";
import { logger } from "../utils/logger";

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const reqId = req.id;

  // 1. Handled AppError instances
  if (err instanceof AppError) {
    logger.warn(`Operational error: ${err.message}`, {
      code: err.code,
      statusCode: err.statusCode,
      details: err.details,
      path: req.originalUrl,
      method: req.method,
    }, reqId);

    sendError(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  // 2. Direct Zod validation errors (e.g. if thrown outside validation middleware)
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    logger.warn("Validation error encountered", { details, path: req.originalUrl }, reqId);
    sendError(res, 400, "VALIDATION_FAILED", "Input validation failed.", details);
    return;
  }

  // 3. Express body-parser SyntaxError (e.g. malformed JSON)
  if (err instanceof SyntaxError && "status" in err && err.status === 400 && "body" in err) {
    logger.warn("Malformed JSON payload received", { path: req.originalUrl }, reqId);
    sendError(res, 400, "MALFORMED_JSON", "Invalid JSON syntax in request body.");
    return;
  }

  // 4. Prisma known errors (duck typed to avoid hard runtime dependency if client not generated yet)
  const isPrismaError = typeof err === "object" && err !== null && "code" in err;
  if (isPrismaError) {
    const code = (err as { code: string }).code;
    if (code === "P2002") {
      logger.warn("Database unique constraint violation", { code, path: req.originalUrl }, reqId);
      sendError(res, 409, "UNIQUE_CONSTRAINT_VIOLATION", "A record with this unique identifier already exists.");
      return;
    }
    if (code === "P2025") {
      logger.warn("Database record not found", { code, path: req.originalUrl }, reqId);
      sendError(res, 404, "RECORD_NOT_FOUND", "The requested database record was not found.");
      return;
    }
  }

  // 5. Unhandled unexpected errors
  const errorObj = err instanceof Error ? err : new Error(String(err));
  logger.error(`Unhandled internal error: ${errorObj.message}`, {
    stack: errorObj.stack,
    path: req.originalUrl,
    method: req.method,
  }, reqId);

  const isProduction = process.env.NODE_ENV === "production";
  const message = isProduction
    ? "An unexpected internal server error occurred."
    : errorObj.message;

  sendError(res, 500, "INTERNAL_SERVER_ERROR", message);
}
