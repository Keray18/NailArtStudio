import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { apiRateLimiter } from './middleware/rateLimiter.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import { errorHandler } from './middleware/error.middleware';
import { apiRouter } from './routes';

const app: Application = express();

// Security HTTP headers
app.use(helmet());

// Normalized CORS origin resolution
const configuredOrigin = config.FRONTEND_URL.replace(/\/+$/, '');
const allowedOrigins = [configuredOrigin];

if (config.NODE_ENV === 'development') {
  if (configuredOrigin.includes('localhost')) {
    allowedOrigins.push(configuredOrigin.replace('localhost', '127.0.0.1'));
  } else if (configuredOrigin.includes('127.0.0.1')) {
    allowedOrigins.push(configuredOrigin.replace('127.0.0.1', 'localhost'));
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }
      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global API rate limiting
app.use('/api', apiRateLimiter);

// Central API route registration
app.use('/api', apiRouter);

// Catch-all 404 handler for undefined routes
app.use(notFoundHandler);

// Centralized error handling middleware
app.use(errorHandler);

export { app };
