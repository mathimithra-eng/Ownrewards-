import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  profileId: string;
  organizationId: string;
  outletId?: string;
  type: 'suggestion' | 'feedback';
  text?: string;
  purchaseId?: string;
  rating?: number;
  comment?: string;
  fileMetadata?: {
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    path: string;
  };
  createdAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    profileId: { type: String, ref: 'Profile', required: true, index: true },
    organizationId: { type: String, required: true },
    outletId: { type: String, default: null },
    type: { type: String, enum: ['suggestion', 'feedback'], required: true },
    text: { type: String },
    purchaseId: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    fileMetadata: {
      filename: { type: String },
      originalname: { type: String },
      mimetype: { type: String },
      size: { type: Number },
      path: { type: String }
    },
    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: false,
  }
);

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema, 'feedbacks');
