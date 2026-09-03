import { Request, Response } from 'express';

export const calculateCartBill = async (req: Request, res: Response): Promise<any> => {
  try {
    const { items, tip = 0, couponCode = '' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    const itemTotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const deliveryFee = itemTotal >= 499 ? 0 : 35;
    const platformFee = 5;
    const tax = Math.round(itemTotal * 0.05);

    let discount = 0;
    if (couponCode.toUpperCase() === 'BITENEW50') {
      discount = Math.min(150, Math.round(itemTotal * 0.5));
    }

    const total = Math.max(0, itemTotal + deliveryFee + platformFee + tax + Number(tip) - discount);

    return res.json({
      success: true,
      breakdown: {
        itemTotal,
        deliveryFee,
        platformFee,
        tax,
        tip: Number(tip),
        discount,
        total,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Cart calculation error', error });
  }
};