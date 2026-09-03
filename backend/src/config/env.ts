import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bitetown_production',
  JWT_SECRET: process.env.JWT_SECRET || 'bitetown_jwt_super_secure_vault_key_2026',
  JWT_EXPIRES_IN: '30d',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_Sample123456789',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'SampleSecretKey123456789',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
};