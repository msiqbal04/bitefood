import { Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { ENV } from '../config/env';
import { AuthRequest } from '../middleware/authMiddleware';

const razorpay = new Razorpay({
  key_id: ENV.RAZORPAY_KEY_ID,
  key_secret: ENV.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Razorpay order creation failed', error });
  }
};

export const verifyPaymentSignature = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    return res.json({ success: isValid, verified: isValid });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Payment verification failed', error });
  }
};