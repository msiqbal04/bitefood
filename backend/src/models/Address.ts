import mongoose, { Document, Schema } from 'mongoose';

export interface IAddressDocument extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'Home' | 'Work' | 'Other';
  flatNo: string;
  landmark?: string;
  area: string;
  city: string;
  pincode: string;
  isDefault: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddressDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    flatNo: { type: String, required: true },
    landmark: { type: String, default: '' },
    area: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    coordinates: {
      lat: { type: Number, default: 19.076 },
      lng: { type: Number, default: 72.8777 },
    },
  },
  { timestamps: true }
);

export const Address = mongoose.model<IAddressDocument>('Address', AddressSchema);