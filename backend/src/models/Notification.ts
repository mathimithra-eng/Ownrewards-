import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType } from '../utils/constants';

export interface INotification extends Document {
  customerId: string;
  organizationId?: string;
  outletId?: string;
  type: NotificationType;
  title: string;
  message: string;
  icon: string;
  read: boolean;
  actionUrl: string;
  metadata?: Record<string, any>;
  date: Date;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    organizationId: { type: String, default: null, index: true },
    outletId: { type: String, default: null, index: true },
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['reward', 'coupon', 'offer', 'purchase', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
    },
    actionUrl: {
      type: String,
      default: '',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ customerId: 1, date: -1 });
notificationSchema.index({ customerId: 1, read: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
