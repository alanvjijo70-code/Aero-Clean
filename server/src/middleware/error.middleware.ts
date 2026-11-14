import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Unhandled error on ${req.method} ${req.url}:`, {
    message: err?.message,
    stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error occurred';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  return sendError(res, message, code, statusCode);
};

export const notFoundHandler = (req: Request, res: Response) => {
  return sendError(
    res,
    `Resource not found: ${req.method} ${req.originalUrl}`,
    'NOT_FOUND',
    404
  );
};
