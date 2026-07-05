import { env } from '../config/env';

// ──────────────────────────────────────────────
// SMS Provider Interface
// ──────────────────────────────────────────────
interface SMSProvider {
  sendOTP(phone: string, otp: string): Promise<boolean>;
}

// ──────────────────────────────────────────────
// Dummy Provider (Development)
// ──────────────────────────────────────────────
class DummyProvider implements SMSProvider {
  async sendOTP(phone: string, otp: string): Promise<boolean> {
    console.log(`📱 [DUMMY SMS] OTP ${otp} sent to ${phone}`);
    return true;
  }
}

// ──────────────────────────────────────────────
// Twilio Provider
// ──────────────────────────────────────────────
class TwilioProvider implements SMSProvider {
  async sendOTP(phone: string, otp: string): Promise<boolean> {
    try {
      // Twilio integration point
      // const client = require('twilio')(env.twilio.accountSid, env.twilio.authToken);
      // await client.messages.create({
      //   body: `Your OwnRewards verification code is: ${otp}. Valid for 5 minutes.`,
      //   from: env.twilio.phoneNumber,
      //   to: phone,
      // });
      console.log(`📱 [TWILIO] OTP ${otp} would be sent to ${phone}`);
      console.log('⚠️  Twilio SDK not installed. Install with: npm install twilio');
      return true;
    } catch (error) {
      console.error('❌ Twilio SMS failed:', error);
      return false;
    }
  }
}

// ──────────────────────────────────────────────
// MSG91 Provider
// ──────────────────────────────────────────────
class MSG91Provider implements SMSProvider {
  async sendOTP(phone: string, otp: string): Promise<boolean> {
    try {
      // MSG91 integration point
      // const response = await fetch('https://api.msg91.com/api/v5/otp', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'authkey': env.msg91.authKey,
      //   },
      //   body: JSON.stringify({
      //     template_id: env.msg91.templateId,
      //     mobile: phone,
      //     otp: otp,
      //   }),
      // });
      console.log(`📱 [MSG91] OTP ${otp} would be sent to ${phone}`);
      return true;
    } catch (error) {
      console.error('❌ MSG91 SMS failed:', error);
      return false;
    }
  }
}

// ──────────────────────────────────────────────
// Fast2SMS Provider
// ──────────────────────────────────────────────
class Fast2SMSProvider implements SMSProvider {
  async sendOTP(phone: string, otp: string): Promise<boolean> {
    try {
      const apiKey = env.fast2sms.apiKey;
      if (!apiKey) {
        console.warn('⚠️  FAST2SMS_API_KEY not configured in .env');
        return false;
      }

      // Strip country code — Fast2SMS accepts 10-digit Indian numbers
      const mobile = phone.replace(/^\+91/, '').replace(/\D/g, '');

      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': apiKey,
        },
        body: JSON.stringify({
          variables_values: otp,
          route: 'otp',
          numbers: mobile,
        }),
      });

      const data = await response.json() as { return: boolean; message?: string[] };
      if (data.return) {
        console.log(`📱 [FAST2SMS] OTP ${otp} sent to ${phone}`);
        return true;
      } else {
        console.error('❌ Fast2SMS error:', data.message?.join(', '));
        return false;
      }
    } catch (error) {
      console.error('❌ Fast2SMS failed:', error);
      return false;
    }
  }
}

// ──────────────────────────────────────────────
// Factory — select provider from env
// ──────────────────────────────────────────────
class SMSServiceFactory {
  private static providers: Record<string, SMSProvider> = {
    dummy: new DummyProvider(),
    twilio: new TwilioProvider(),
    msg91: new MSG91Provider(),
    fast2sms: new Fast2SMSProvider(),
  };

  static getProvider(): SMSProvider {
    const provider = this.providers[env.smsProvider];
    if (!provider) {
      console.warn(`⚠️  Unknown SMS provider: ${env.smsProvider}. Falling back to dummy.`);
      return this.providers.dummy;
    }
    return provider;
  }
}

// ──────────────────────────────────────────────
// SMS Service (public API)
// ──────────────────────────────────────────────
export class SMSService {
  static async sendOTP(phone: string, otp: string): Promise<boolean> {
    if (!env.smsEnabled) {
      console.log(`📱 [SMS DISABLED] OTP for ${phone} → ${otp}  (fetch via GET /api/auth/test-otp/${encodeURIComponent(phone)})`);
      return true;
    }

    const provider = SMSServiceFactory.getProvider();
    return provider.sendOTP(phone, otp);
  }

  static generateOTP(): string {
    // Generate a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
