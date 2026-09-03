import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Restaurant } from '../models/Restaurant';
import { User } from '../models/User';

export const getAdminMetrics = async (req: Request, res: Response): Promise<any> => {
  try {
    const [orders, RestaurantsCount, usersCount] = await Promise.all([
      Order.find().sort({ createdAt: -1 }),
      Restaurant.countDocuments(),
      User.countDocuments(),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const activeOrders = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;

    return res.json({
      success: true,
      metrics: {
        totalRevenue,
        totalOrders: orders.length,
        activeOrders,
        RestaurantsCount,
        usersCount,
      },
      recentOrders: orders.slice(0, 10),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching admin stats', error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating order status', error });
  }
};