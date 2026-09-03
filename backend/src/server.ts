import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import restaurantRoutes from './routes/restaurantRoutes';
import orderRoutes from './routes/orderRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS Config
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

export const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
});

// Routes Bindings
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

// Socket.io Live Events
io.on('connection', (socket) => {
  socket.on('join_order', (orderId: string) => socket.join(orderId));
});

// Single Unified Port & Single Unified DB
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bitefood';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected to bitefood on port ' + PORT);
    server.listen(PORT, () => console.log(`🚀 Server live on port ${PORT}`));
  })
  .catch((err) => console.error('❌ DB Error:', err));