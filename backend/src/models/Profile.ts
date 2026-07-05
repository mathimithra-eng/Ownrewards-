import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document<string> {
  _id: string; // custom string id
  accountId: string; // reference to Account _id
  name: string;
  tier: string;
  walletBalance: number;
  // Extra fields kept for application logic
  metrics: {
    totalOrders: number;
    totalSpend: number;
    averageOrderValue: number;
    recencyDays: number;
    lastVisit: Date;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    _id: { type: String, required: true },
    accountId: { type: String, ref: 'Account', required: true, index: true },
    name: { type: String, required: true },
    tier: { type: String, default: 'Bronze' },
    walletBalance: { type: Number, default: 0 },
    metrics: {
      totalOrders: { type: Number, default: 0 },
      totalSpend: { type: Number, default: 0 },
      averageOrderValue: { type: Number, default: 0 },
      recencyDays: { type: Number, default: 0 },
      lastVisit: { type: Date, default: Date.now },
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Profile = mongoose.model<IProfile>('Profile', profileSchema, 'profiles');
