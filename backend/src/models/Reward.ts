import mongoose, { Schema, Document } from 'mongoose';

export interface IReward extends Document<string> {
  _id: string;
  profileId: string;
  organizationId?: string;
  outletId?: string;
  rewardName: string;
  issuedAt: Date;
  expiresAt: Date;
  status: string; // 'active', 'redeemed', 'expired'
}

const rewardSchema = new Schema<IReward>(
  {
    _id: { type: String, required: true },
    profileId: { type: String, ref: 'Profile', required: true, index: true },
    organizationId: { type: String, default: null, index: true },
    outletId: { type: String, default: null, index: true },
    rewardName: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: ['active', 'redeemed', 'expired'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

export const Reward = mongoose.model<IReward>('Reward', rewardSchema, 'rewardsCollection');
