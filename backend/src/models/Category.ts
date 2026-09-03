import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  image: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String, required: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);