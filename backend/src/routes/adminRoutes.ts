import { Router } from 'express';
import { getAdminMetrics, updateOrderStatus } from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();

// Sabhi admin routes protected hain (Token + Admin Role)
router.use(authenticateToken as any);
router.use(adminMiddleware as any);

// Analytics & Dashboard Metrics
router.get('/metrics', getAdminMetrics);

// Order status update (Preparing -> Out for Delivery -> Delivered)
router.patch('/orders/:orderId/status', updateOrderStatus);

export default router;