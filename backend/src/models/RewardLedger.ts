import mongoose, { Schema, Document } from 'mongoose';

export interface IRewardLedger extends Document<string> {
  _id: string;
  profileId: string;
  organizationId: string;
  outletId?: string;
  points: number;
  walletBalance?: number;
}

const rewardLedgerSchema = new Schema<IRewardLedger>(
  {
    _id: { type: String, required: true },
    profileId: { type: String, ref: 'Profile', required: true, index: true },
    organizationId: { type: String, required: true },
    outletId: { type: String, default: null, index: true },
    points: { type: Number, required: true },
    walletBalance: { type: Number, default: 0 },
  }
);

export const RewardLedger = mongoose.model<IRewardLedger>('RewardLedger', rewardLedgerSchema, 'rewards');
