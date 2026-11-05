import rateLimit from 'express-rate-limit';
import { ApiResponseError } from '../utils/apiResponse';

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => req.path === '/health' || req.originalUrl === '/api/health',
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  } satisfies ApiResponseError,
});
