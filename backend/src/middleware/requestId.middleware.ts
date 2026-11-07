import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

// Extend express Request to include id
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

// Safe alphanumeric pattern for incoming correlation IDs (max 64 chars)
const SAFE_REQUEST_ID_REGEX = /^[a-zA-Z0-9_\-]{1,64}$/;

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const rawId = req.header("x-request-id");
  const isValid = rawId && SAFE_REQUEST_ID_REGEX.test(rawId.trim());
  const requestId = isValid ? rawId.trim() : uuidv4();
  
  req.id = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
}

