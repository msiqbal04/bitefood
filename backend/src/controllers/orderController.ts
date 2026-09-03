import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { AuthRequest } from '../middleware/authMiddleware';

export const createOrder = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const {
      RestaurantId,
      RestaurantName,
      items,
      itemTotal,
      deliveryFee,
      tax,
      tip,
      discount,
      total,
      deliveryAddress,
      cookingNotes,
      deliveryNotes,
      paymentMethod,
      paymentStatus = 'PENDING',
      razorpayOrderId,
      razorpayPaymentId,
    } = req.body;

    const orderNumber = `ORD${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = await Order.create({
      orderId: orderNumber,
      userId: req.user?.id,
      RestaurantId: RestaurantId || 'rest_1',
      RestaurantName: RestaurantName || 'BiteTown Kitchen',
      items,
      itemTotal,
      deliveryFee: deliveryFee ?? 0,
      platformFee: 5,
      tax,
      tip: tip || 0,
      discount: discount || 0,
      total,
      deliveryAddress,
      cookingNotes: cookingNotes || [],
      deliveryNotes: deliveryNotes || [],
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : paymentStatus,
      razorpayOrderId,
      razorpayPaymentId,
      status: 'PREPARING',
      riderLocation: { lat: 19.0596, lng: 72.8295 },
    });

    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create order', error });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const orders = await Order.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch orders', error });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve order', error });
  }
};