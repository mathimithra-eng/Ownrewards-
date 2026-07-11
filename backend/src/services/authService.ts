import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { OTP } from '../models/OTP';
import { Account } from '../models/Account';
import { Profile } from '../models/Profile';
import { Session } from '../models/Session';
import { RewardLedger } from '../models/RewardLedger';
import { Transaction } from '../models/Transaction';
import { Offer } from '../models/Offer';
import { SMSService } from './smsService';
import { CONSTANTS } from '../utils/constants';

export class AuthService {
  // ─────────────────────────────────────────
  // Send OTP
  // ─────────────────────────────────────────
  static async sendOTP(phone: string): Promise<{ success: boolean; message: string; status?: number }> {
    const existingAccount = await Account.findOne({ phoneNo: phone });
    
    // Perform Rule 2 check: No transactions and no offers -> 403
    let uniqueOrgs = new Set<string>();
    let hasTransactions = false;
    let hasOffers = false;

    if (existingAccount) {
      const profile = await Profile.findOne({ accountId: existingAccount._id });
      if (profile) {
        const ledgers = await RewardLedger.find({ profileId: profile._id });
        uniqueOrgs = new Set(ledgers.map(l => l.organizationId));
        hasTransactions = !!(await Transaction.exists({ profileId: profile._id }));
      }
    }

    if (uniqueOrgs.size > 0) {
      hasOffers = !!(await Offer.exists({ organizationId: { $in: Array.from(uniqueOrgs) }, isActive: true }));
    }

    if (!hasTransactions && !hasOffers) {
      return { 
        success: false, 
        status: 403, 
        message: 'No active offers or transactions found for this account.' 
      };
    }

    await OTP.deleteMany({ phone });

    const otpCode = SMSService.generateOTP();
    const expiresAt = new Date(Date.now() + CONSTANTS.OTP_EXPIRY_MINUTES * 60 * 1000);

    await OTP.create({
      phone,
      otp: otpCode,
      expiresAt,
      verified: false,
      attempts: 0,
    });

    if (!env.smsEnabled) {
      console.log(`📱 [SMS DISABLED] OTP for ${phone} → ${otpCode}`);
    } else {
      const sent = await SMSService.sendOTP(phone, otpCode);
      if (!sent) {
        return { success: false, message: 'Failed to send OTP. Please try again.' };
      }
    }

    return {
      success: true,
      message: existingAccount
        ? 'OTP sent successfully'
        : 'OTP sent successfully. New account will be created on verification.',
    };
  }

  // ─────────────────────────────────────────
  // Verify OTP
  // ─────────────────────────────────────────
  static async verifyOTP(
    phone: string,
    otpCode: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{
    success: boolean;
    message: string;
    token?: string;
    customer?: any;
  }> {
    const otpRecord = await OTP.findOne({ phone }).sort({ createdAt: -1 });

    if (!otpRecord) return { success: false, message: 'No OTP found. Please request a new one.' };
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }
    if (otpRecord.attempts >= CONSTANTS.OTP_MAX_ATTEMPTS) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return { success: false, message: 'Maximum attempts exceeded. Please request a new OTP.' };
    }
    if (otpRecord.otp !== otpCode) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return {
        success: false,
        message: `Invalid OTP. ${CONSTANTS.OTP_MAX_ATTEMPTS - otpRecord.attempts} attempts remaining.`,
      };
    }

    otpRecord.verified = true;
    await otpRecord.save();

    // ALWAYS USE SEEDED DEMO ACCOUNT FOR DEMO PURPOSES
    let account = await Account.findOne({ _id: 'accountId' });
    let profile = await Profile.findOne({ _id: 'profileId' });
    let points = 0;

    if (!account || !profile) {
      return { success: false, message: 'Seeded account not found. Please run seed script.' };
    }

    const ledger = await RewardLedger.findOne({ profileId: profile._id });
    if (ledger) points = ledger.points;

    const token = this.generateToken(account, profile);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await Session.create({
      customerId: account._id, // Using account._id instead of accountId
      token,
      device: userAgent || 'unknown',
      ipAddress: ipAddress || '',
      expiresAt,
      isActive: true,
    });

    await OTP.deleteMany({ phone });

    return {
      success: true,
      message: 'Login successful',
      token,
      customer: {
        _id: profile._id,
        id: profile._id,
        customerId: profile._id,
        accountId: account._id,
        name: profile.name,
        phone: account.phoneNo,
        membership: profile.tier,
        rewardPoints: points, // Pulled from RewardLedger for existing, or 0 for new
        walletBalance: profile.walletBalance,
        memberSince: profile.createdAt || new Date(),
        isActive: profile.isActive,
      },
    };
  }

  // ─────────────────────────────────────────
  // Generate JWT Token
  // ─────────────────────────────────────────
  static generateToken(account: any, profile: any): string {
    return jwt.sign(
      {
        userId: profile._id,
        profileId: profile._id,
        accountId: account._id,
        phone: account.phoneNo,
        role: 'user'
      },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn as any }
    );
  }

  static async getLatestOTP(phone: string): Promise<{ success: boolean; message: string; otp?: string }> {
    const otpRecord = await OTP.findOne({ phone }).sort({ createdAt: -1 });
    if (!otpRecord) return { success: false, message: 'No OTP found for this number' };
    return { success: true, message: 'OTP retrieved successfully', otp: otpRecord.otp };
  }

  static async logout(accountId: string, token: string): Promise<void> {
    await Session.updateMany(
      { customerId: accountId, token },
      { isActive: false }
    );
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, env.jwtSecret);
    } catch {
      return null;
    }
  }
}
