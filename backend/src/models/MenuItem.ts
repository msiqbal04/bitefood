import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomizationOption {
  name: string;
  price: number;
}

export interface ICustomizationGroup {
  title: string;
  type: 'single' | 'multiple';
  options: ICustomizationOption[];
}

export interface IMenuItemDocument extends Document {
  dishId: string;
  RestaurantId: string;
  name: string;
  description: string;
  price: number;
  category: 'Fast Food' | 'Meals' | 'Snacks' | 'Beverages';
  image: string;
  isVeg: boolean;
  rating: number;
  isBestseller: boolean;
  spiceLevel?: 1 | 2 | 3;
  calories?: number;
  customization?: ICustomizationGroup[];
  isAvailable: boolean;
}

const MenuItemSchema = new Schema<IMenuItemDocument>(
  {
    dishId: { type: String, required: true, unique: true, index: true },
    RestaurantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ['Fast Food', 'Meals', 'Snacks', 'Beverages'],
      required: true,
    },
    image: { type: String, required: true },
    isVeg: { type: Boolean, required: true },
    rating: { type: Number, default: 4.5 },
    isBestseller: { type: Boolean, default: false },
    spiceLevel: { type: Number, default: 1 },
    calories: { type: Number, default: 350 },
    customization: [
      {
        title: String,
        type: { type: String, enum: ['single', 'multiple'], default: 'single' },
        options: [
          {
            name: String,
            price: Number,
          },
        ],
      },
    ],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model<IMenuItemDocument>('MenuItem', MenuItemSchema);