import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userAvatar?: string;
  RestaurantId: string;
  orderId?: string;
  rating: number;
  foodRating?: number;
  deliveryRating?: number;
  comment?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    RestaurantId: { type: String, required: true, index: true },
    orderId: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    foodRating: { type: Number, min: 1, max: 5 },
    deliveryRating: { type: Number, min: 1, max: 5 },
    comment: { type: String, trim: true },
    tags: [String],
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>('Review', ReviewSchema);