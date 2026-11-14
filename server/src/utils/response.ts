import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
  details?: any;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Request completed successfully',
  statusCode = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message = 'Unable to complete request',
  code = 'REQUEST_ERROR',
  statusCode = 400,
  details?: any
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    code,
    ...(details ? { details } : {})
  };
  return res.status(statusCode).json(response);
};
