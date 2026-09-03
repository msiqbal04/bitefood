import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes import
import restaurantRoutes from './routes/restaurantRoutes';
import orderRoutes from './routes/orderRoutes';
// agar authRoutes hai to wo bhi
// import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Routes Bind
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

// Database Connect
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bitefood';
mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ DB Connection Error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
});