import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document<string> {
  _id: string;
  accountId: string;
  organizationId?: string;
  outletId?: string;
  couponName: string;
  couponCode: string;
  issuedAt: Date;
  expiresAt: Date;
  status: string; // 'active', 'used', 'expired'
}

const couponSchema = new Schema<ICoupon>(
  {
    _id: { type: String, required: true },
    accountId: { type: String, ref: 'Account', required: true, index: true },
    organizationId: { type: String, default: null, index: true },
    outletId: { type: String, default: null, index: true },
    couponName: { type: String, required: true },
    couponCode: { type: String, required: true, unique: true, index: true },
    issuedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: ['active', 'used', 'expired'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema, 'coupons');
