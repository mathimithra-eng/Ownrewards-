import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  customerId: string;
  token: string;
  device: string;
  ipAddress: string;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
    },
    device: {
      type: String,
      default: 'unknown',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model<ISession>('Session', sessionSchema);
