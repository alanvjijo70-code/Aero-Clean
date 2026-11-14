import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response.js';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }));
        return sendError(res, 'Validation error in request body', 'VALIDATION_ERROR', 400, issues);
      }
      return sendError(res, 'Invalid request payload', 'INVALID_PAYLOAD', 400);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return sendError(res, 'Invalid route parameter', 'INVALID_PARAMS', 400, error.issues);
      }
      return sendError(res, 'Invalid route parameter', 'INVALID_PARAMS', 400);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return sendError(res, 'Invalid query parameter', 'INVALID_QUERY', 400, error.issues);
      }
      return sendError(res, 'Invalid query parameter', 'INVALID_QUERY', 400);
    }
  };
};
