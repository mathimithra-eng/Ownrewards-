import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../middlewares/errorHandler';
import { AuthRequest } from '../middlewares/authMiddleware';

export class AuthController {
  // ─────────────────────────────────────────
  // POST /api/auth/send-otp
  // ─────────────────────────────────────────
  static sendOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { phone } = req.body;

    const result = await AuthService.sendOTP(phone);

    if (!result.success) {
      ApiResponse.badRequest(res, result.message);
      return;
    }

    ApiResponse.success(res, result.message, { phone });
  });

  // ─────────────────────────────────────────
  // GET /api/auth/test-otp/:phone
  // ─────────────────────────────────────────
  static getOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { phone } = req.params;
    
    const phoneStr = phone as string;
    // decodeURIComponent turns %2B → +; if still no +, prepend it
    const decoded = decodeURIComponent(phoneStr);
    const formattedPhone = decoded.startsWith('+') ? decoded : '+' + decoded;

    const result = await AuthService.getLatestOTP(formattedPhone);

    if (!result.success) {
      ApiResponse.badRequest(res, result.message);
      return;
    }

    ApiResponse.success(res, result.message, { otp: result.otp });
  });

  // ─────────────────────────────────────────
  // POST /api/auth/verify-otp
  // ─────────────────────────────────────────
  static verifyOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { phone, otp } = req.body;
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.socket.remoteAddress;

    const result = await AuthService.verifyOTP(phone, otp, userAgent, ipAddress);

    if (!result.success) {
      ApiResponse.badRequest(res, result.message);
      return;
    }

    ApiResponse.success(res, result.message, {
      token: result.token,
      customer: result.customer,
    });
  });

  // ─────────────────────────────────────────
  // POST /api/auth/logout
  // ─────────────────────────────────────────
  static logout = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1] || '';
    const accountId = req.customer?.accountId || '';

    await AuthService.logout(accountId, token);

    ApiResponse.success(res, 'Logged out successfully');
  });
}
