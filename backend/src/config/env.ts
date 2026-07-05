import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  SMS_ENABLED: z.string().default('false'),
  SMS_PROVIDER: z.enum(['dummy', 'twilio', 'msg91', 'fast2sms']).default('dummy'),
  DUMMY_OTP: z.string().default('123456'),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  MSG91_AUTH_KEY: z.string().optional(),
  MSG91_SENDER_ID: z.string().optional(),
  MSG91_TEMPLATE_ID: z.string().optional(),
  FAST2SMS_API_KEY: z.string().optional(),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  RATE_LIMIT_WINDOW_MS: z.string().default('600000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
  OTP_RATE_LIMIT_MAX: z.string().default('5'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  port: parseInt(parsed.data.PORT, 10),
  nodeEnv: parsed.data.NODE_ENV,
  mongodbUri: parsed.data.MONGODB_URI,
  jwtSecret: parsed.data.JWT_SECRET,
  jwtExpiresIn: parsed.data.JWT_EXPIRES_IN,
  smsEnabled: parsed.data.SMS_ENABLED === 'true',
  smsProvider: parsed.data.SMS_PROVIDER,
  dummyOtp: parsed.data.DUMMY_OTP,
  twilio: {
    accountSid: parsed.data.TWILIO_ACCOUNT_SID || '',
    authToken: parsed.data.TWILIO_AUTH_TOKEN || '',
    phoneNumber: parsed.data.TWILIO_PHONE_NUMBER || '',
  },
  msg91: {
    authKey: parsed.data.MSG91_AUTH_KEY || '',
    senderId: parsed.data.MSG91_SENDER_ID || '',
    templateId: parsed.data.MSG91_TEMPLATE_ID || '',
  },
  fast2sms: {
    apiKey: parsed.data.FAST2SMS_API_KEY || '',
  },
  frontendUrl: parsed.data.FRONTEND_URL,
  rateLimit: {
    windowMs: parseInt(parsed.data.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(parsed.data.RATE_LIMIT_MAX_REQUESTS, 10),
  },
  otpRateLimitMax: parseInt(parsed.data.OTP_RATE_LIMIT_MAX, 10),
};
