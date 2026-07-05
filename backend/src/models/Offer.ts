import mongoose, { Schema, Document } from 'mongoose';
import { OfferCategory } from '../utils/constants';

export interface IOffer extends Document {
  title: string;
  description: string;
  discount: number;
  discountType: string;
  bannerImage: string;
  featured: boolean;
  expiryDate: Date;
  terms: string[];
  category: OfferCategory;
  brand: string;
  isActive: boolean;
  organizationId?: string;
  outletId?: string;
  createdAt: Date;
}

const offerSchema = new Schema<IOffer>(
  {
    organizationId: { type: String, default: null, index: true },
    outletId: { type: String, default: null, index: true },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      default: 'percentage',
    },
    bannerImage: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    terms: [{
      type: String,
    }],
    category: {
      type: String,
      enum: ['electronics', 'fashion', 'food', 'travel', 'shopping', 'entertainment', 'health', 'lifestyle'],
      default: 'shopping',
    },
    brand: {
      type: String,
      default: '',
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

export const Offer = mongoose.model<IOffer>('Offer', offerSchema);
