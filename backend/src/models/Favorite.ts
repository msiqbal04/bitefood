import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  RestaurantId?: string;
  dishId?: string;
  type: 'Restaurant' | 'DISH';
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    RestaurantId: { type: String },
    dishId: { type: String },
    type: { type: String, enum: ['Restaurant', 'DISH'], required: true },
  },
  { timestamps: true }
);

FavoriteSchema.index({ userId: 1, RestaurantId: 1, dishId: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>('Favorite', FavoriteSchema);