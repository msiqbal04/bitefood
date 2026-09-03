import { Router } from 'express';
import { createRazorpayOrder, verifyPaymentSignature } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// 1. Create Razorpay Order (Protected - Authenticated user required)
// POST /api/payments/create-order
router.post('/create-order', authenticateToken as any, createRazorpayOrder);

// 2. Verify Razorpay HMAC SHA256 Signature
// POST /api/payments/verify
router.post('/verify', authenticateToken as any, verifyPaymentSignature);

export default router;