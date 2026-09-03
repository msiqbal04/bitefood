import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  orderId: string;
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  method: 'UPI' | 'CARD' | 'COD' | 'WALLET';
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  receiptNumber: string;
  paymentDetails?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    method: { type: String, enum: ['UPI', 'CARD', 'COD', 'WALLET'], default: 'UPI' },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    receiptNumber: { type: String, required: true },
    paymentDetails: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);