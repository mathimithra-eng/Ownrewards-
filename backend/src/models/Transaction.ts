import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document<string> {
  _id: string;
  profileId: string;
  organizationId: string;
  outletId?: string;
  type: string;
  title: string;
  description: string;
  createdAt: Date;
  billAmount: number | null;
  pointsImpact: number;
  metadata: Record<string, any>;
}

const transactionSchema = new Schema<ITransaction>(
  {
    _id: { type: String, required: true },
    profileId: { type: String, ref: 'Profile', required: true, index: true },
    organizationId: { type: String, required: true },
    outletId: { type: String, default: null, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    billAmount: { type: Number, default: null },
    pointsImpact: { type: Number, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: false,
  }
);

transactionSchema.index({ profileId: 1, organizationId: 1, createdAt: -1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema, 'transactions');
