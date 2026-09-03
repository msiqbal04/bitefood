import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedAddons?: string[];
}

export interface IOrder extends Document {
  orderId: string;
  userId: mongoose.Types.ObjectId;
  RestaurantId: string;
  RestaurantName: string;
  items: IOrderItem[];
  itemTotal: number;
  deliveryFee: number;
  platformFee: number;
  tax: number;
  tip: number;
  discount: number;
  total: number;
  status: 'PLACED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  deliveryAddress: {
    type: string;
    flatNo: string;
    landmark?: string;
    area: string;
    city: string;
    pincode: string;
  };
  cookingNotes: string[];
  deliveryNotes: string[];
  paymentMethod: 'UPI' | 'CARD' | 'COD';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  riderLocation: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    RestaurantId: { type: String, required: true },
    RestaurantName: { type: String, required: true },
    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        selectedAddons: [String],
      },
    ],
    itemTotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    platformFee: { type: Number, default: 5 },
    tax: { type: Number, required: true },
    tip: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
      default: 'PLACED',
    },
    deliveryAddress: {
      type: { type: String, default: 'Home' },
      flatNo: String,
      landmark: String,
      area: String,
      city: String,
      pincode: String,
    },
    cookingNotes: [String],
    deliveryNotes: [String],
    paymentMethod: { type: String, enum: ['UPI', 'CARD', 'COD'], default: 'UPI' },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    riderLocation: {
      lat: { type: Number, default: 19.076 },
      lng: { type: Number, default: 72.8777 },
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);