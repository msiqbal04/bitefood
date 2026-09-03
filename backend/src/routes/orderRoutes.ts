import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

// Order Schema Definition directly or via Model
const OrderSchema = new mongoose.Schema({
  orderId: { type: String, default: () => `ORD_${Date.now()}` },
  restaurantId: { type: String, required: true },
  restaurantName: { type: String, default: 'BiteFood Outlet' },
  customerName: { type: String, default: 'Customer' },
  customerPhone: { type: String, default: '9876543210' },
  deliveryAddress: { type: String, required: true },
  items: [
    {
      dishId: String,
      name: String,
      price: Number,
      quantity: Number,
      isVeg: Boolean
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, default: 'Pending' },
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// 1. Create New Order (Customer Checkout)
router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { restaurantId, restaurantName, items, totalAmount, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    const newOrder = new Order({
      restaurantId: restaurantId || 'rest_1',
      restaurantName: restaurantName || 'BiteFood Kitchen',
      items,
      totalAmount,
      deliveryAddress: deliveryAddress || 'Bandra West, Mumbai',
      paymentMethod: paymentMethod || 'COD',
      status: 'Pending',
      paymentStatus: paymentMethod === 'Online' ? 'Paid' : 'Pending'
    });

    const savedOrder = await newOrder.save();
    return res.status(201).json({ success: true, data: savedOrder });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to place order' });
  }
});

// 2. Get All Orders (Customer Tracking & Admin)
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// 3. Update Order Status (For Restaurant Desk / KDS)
router.patch('/:id/status', async (req: Request, res: Response): Promise<any> => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

export default router;