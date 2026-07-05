import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document<string> {
  _id: string; // custom string id
  phoneNo: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    _id: { type: String, required: true },
    phoneNo: { type: String, required: true, unique: true, index: true },
    email: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Account = mongoose.model<IAccount>('Account', accountSchema, 'accounts');
