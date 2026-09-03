import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedAddons?: string[];
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  RestaurantId: string;
  items: ICartItem[];
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    RestaurantId: { type: String, required: true },
    items: [
      {
        dishId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
        selectedAddons: [String],
      },
    ],
    subtotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema);