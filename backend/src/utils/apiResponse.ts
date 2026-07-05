import { Response } from 'express';

interface ApiResponseOptions<T> {
  res: Response;
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200,
    meta?: Record<string, unknown>
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data: data || null,
      meta: meta || null,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    error?: string
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error || null,
      timestamp: new Date().toISOString(),
    });
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return ApiResponse.success(res, message, data, 201);
  }

  static badRequest(res: Response, message: string, error?: string): Response {
    return ApiResponse.error(res, message, 400, error);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return ApiResponse.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return ApiResponse.error(res, message, 403);
  }

  static notFound(res: Response, message: string = 'Not found'): Response {
    return ApiResponse.error(res, message, 404);
  }

  static tooMany(res: Response, message: string = 'Too many requests'): Response {
    return ApiResponse.error(res, message, 429);
  }
}
