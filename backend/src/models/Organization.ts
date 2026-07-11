import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document<string> {
  _id: string; // custom string ID (e.g. 'simmati', 'maharaja')
  name: string;
  logoUrl?: string;
  industry?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    logoUrl: { type: String },
    industry: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Organization = mongoose.model<IOrganization>('Organization', organizationSchema, 'organizations');
