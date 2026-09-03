import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://admin:password123@localhost:27017/bitetown_db?authSource=admin';
    const conn = await mongoose.connect(connStr);
    console.log(`✅ [MongoDB]: Connected Successfully -> Host: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ [MongoDB Connection Error]:', error);
    process.exit(1);
  }
};