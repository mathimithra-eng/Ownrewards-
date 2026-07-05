import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { otpRateLimiter, authRateLimiter } from '../middlewares/rateLimiter';
import { validateSendOTP, validateVerifyOTP, handleValidationErrors } from '../middlewares/validators';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// POST /api/auth/send-otp
router.post(
  '/send-otp',
  otpRateLimiter,
  validateSendOTP,
  handleValidationErrors,
  AuthController.sendOTP
);

// GET /api/auth/test-otp/:phone
router.get(
  '/test-otp/:phone',
  AuthController.getOTP
);

// POST /api/auth/verify-otp
router.post(
  '/verify-otp',
  authRateLimiter,
  validateVerifyOTP,
  handleValidationErrors,
  AuthController.verifyOTP
);

// POST /api/auth/logout
router.post(
  '/logout',
  authMiddleware,
  AuthController.logout
);

export default router;
