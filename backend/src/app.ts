import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { requestIdMiddleware } from "./middleware/requestId.middleware";
import { globalRateLimiter } from "./middleware/rateLimit.middleware";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { healthRouter } from "./modules/health/health.routes";
import { categoriesRouter } from "./modules/catalogue/categories/categories.routes";
import { collectionsRouter } from "./modules/catalogue/collections/collections.routes";
import { productsRouter } from "./modules/catalogue/products/products.routes";
import { searchRouter } from "./modules/catalogue/search/search.routes";
import { logger } from "./utils/logger";

export function createApp(): Application {
  const app = express();

  // 1. Trust proxy for reverse proxies / load balancers
  app.set("trust proxy", 1);

  // 2. Security Headers
  app.use(helmet());

  // 3. CORS Policy
  const allowedOrigins = [
    env.FRONTEND_ORIGIN,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`CORS error: Origin ${origin} not allowed by Access-Control-Allow-Origin`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    })
  );

  // 4. Request Correlation ID
  app.use(requestIdMiddleware);

  // 5. Body Parsing with bounded size limits
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // 6. Request Logging Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    res.on("finish", () => {
      const durationMs = Date.now() - startTime;
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs}ms`, {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
      }, req.id);
    });
    next();
  });

  // 7. Global Rate Limiter
  app.use(globalRateLimiter);

  // 8. API Router (/api/v1)
  const apiV1Router = express.Router();
  apiV1Router.use("/", healthRouter);
  apiV1Router.use("/categories", categoriesRouter);
  apiV1Router.use("/collections", collectionsRouter);
  apiV1Router.use("/products", productsRouter);
  apiV1Router.use("/search", searchRouter);

  app.use("/api/v1", apiV1Router);

  // Root health probe convenience alias
  app.get("/health", (_req, res) => {
    res.redirect("/api/v1/health");
  });

  // 9. Centralized 404 Handler
  app.use(notFoundMiddleware);

  // 10. Centralized Error Handler
  app.use(errorMiddleware);

  return app;
}

export const app = createApp();

