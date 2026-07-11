import mongoose, { Schema, Document } from 'mongoose';

export interface IOutlet extends Document<string> {
  _id: string; // custom string ID (e.g. 'thiruvarur', 'nagapattinam')
  organizationId: string; // reference to Organization
  name: string;
  location?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const outletSchema = new Schema<IOutlet>(
  {
    _id: { type: String, required: true },
    organizationId: { type: String, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true },
    location: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Outlet = mongoose.model<IOutlet>('Outlet', outletSchema, 'outlets');
