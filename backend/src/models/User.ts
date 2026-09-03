import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
  _id?: mongoose.Types.ObjectId;
  type: 'Home' | 'Work' | 'Other';
  flatNo: string;
  landmark: string;
  area: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

// 1. Interface me method declare karein
export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password?: string;
  avatar?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'RIDER';
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>({
  type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  flatNo: { type: String, required: true },
  landmark: { type: String, default: '' },
  area: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    role: { type: String, enum: ['CUSTOMER', 'ADMIN', 'RIDER'], default: 'CUSTOMER' },
    addresses: [AddressSchema],
  },
  { timestamps: true }
);

// 2. Schema method implementation
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);