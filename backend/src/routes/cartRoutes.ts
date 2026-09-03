import { Router } from 'express';
import { calculateCartBill } from '../controllers/cartController';

const router = Router();

// Bill breakdown calculate endpoint (Subtotal, 5% GST, Platform fee, Coupon validation)
router.post('/calculate', calculateCartBill);

export default router;