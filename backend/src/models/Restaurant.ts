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

export interface IMenuItem {
  dishId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  rating?: number;
  isBestseller?: boolean;
  spiceLevel?: 1 | 2 | 3;
  calories?: number;
  inStock?: boolean;
  isAvailable?: boolean;
  customization?: ICustomizationGroup[];
}

export interface IRestaurant extends Document {
  RestaurantId: string;
  restaurantId?: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  priceForTwo: number;
  image: string;
  featured: boolean;
  isExpress: boolean;
  address: string;
  fssaiLicense: string;
  isActive: boolean;
  location: {
    lat: number;
    lng: number;
  };
  menu: IMenuItem[];
}

const MenuItemSchema = new Schema<IMenuItem>({
  dishId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Fast Food', 'Meals', 'Snacks', 'Beverages', 'Burgers', 'Pizzas', 'Biryani', 'Desserts', 'Main Course', 'Starters'],
    default: 'Fast Food',
    required: true,
  },
  image: { type: String, required: true },
  isVeg: { type: Boolean, required: true },
  rating: { type: Number, default: 4.5 },
  isBestseller: { type: Boolean, default: false },
  spiceLevel: { type: Number, default: 1 },
  calories: { type: Number, default: 350 },
  inStock: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  customization: [
    {
      title: String,
      type: { type: String, enum: ['single', 'multiple'] },
      options: [
        {
          name: String,
          price: Number,
        },
      ],
    },
  ],
});

const RestaurantSchema = new Schema<IRestaurant>(
  {
    RestaurantId: { type: String, required: true, unique: true },
    restaurantId: { type: String },
    name: { type: String, required: true, index: true },
    cuisine: { type: String, required: true, index: true },
    rating: { type: Number, default: 4.2 },
    deliveryTime: { type: String, default: '30-35 mins' },
    priceForTwo: { type: Number, required: true },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
    isExpress: { type: Boolean, default: false },
    address: { type: String, required: true },
    fssaiLicense: { type: String, default: '11521045000189' },
    isActive: { type: Boolean, default: true },
    location: {
      lat: { type: Number, default: 19.076 },
      lng: { type: Number, default: 72.8777 },
    },
    menu: [MenuItemSchema],
  },
  { timestamps: true }
);

export const Restaurant = mongoose.models.Restaurant || mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);