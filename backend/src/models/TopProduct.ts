import mongoose, { Schema, Document } from 'mongoose';

export interface ITopProduct extends Document<string> {
  _id: string;
  profileId: string;
  productName: string;
  category: string;
  orderCount: number;
}

const topProductSchema = new Schema<ITopProduct>(
  {
    _id: { type: String, required: true },
    profileId: { type: String, ref: 'Profile', required: true, index: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    orderCount: { type: Number, default: 0 },
  },
  {
    timestamps: false,
  }
);

export const TopProduct = mongoose.model<ITopProduct>('TopProduct', topProductSchema, 'topProducts');
