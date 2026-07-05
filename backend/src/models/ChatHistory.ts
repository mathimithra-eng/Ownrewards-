import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

export interface IChatHistory extends Document {
  customerId: string;
  sessionId: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    data: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  { _id: false }
);

const chatHistorySchema = new Schema<IChatHistory>(
  {
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    messages: [chatMessageSchema],
  },
  {
    timestamps: true,
  }
);

export const ChatHistory = mongoose.model<IChatHistory>('ChatHistory', chatHistorySchema);
