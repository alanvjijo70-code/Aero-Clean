import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { standardLimiter } from './middleware/rateLimiter.middleware.js';
import { logger } from './utils/logger.js';

export const createApp = () => {
  const app = express();

  // Security Headers
  app.use(helmet());

  // CORS Configuration
  app.use(
    cors({
      origin: (requestOrigin, callback) => {
        // Support local dev, configured CLIENT_URL, and Vercel preview/production domains
        if (
          !requestOrigin ||
          requestOrigin === env.CLIENT_URL ||
          requestOrigin.includes('localhost') ||
          requestOrigin.includes('127.0.0.1') ||
          requestOrigin.endsWith('.vercel.app')
        ) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  // Rate Limiter
  app.use(standardLimiter);

  // Body Parsing Middleware
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // Request Logging
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.url}`);
    next();
  });

  // Root health check for Vercel deployment probes
  app.get('/health', (req, res) => {
    res.json({
      status: 'ONLINE',
      service: 'AeroClean AI Backend Platform',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // Mount API Router under both /api/v1 and /api
  app.use('/api/v1', apiRouter);
  app.use('/api', apiRouter);

  // Fallback Handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
