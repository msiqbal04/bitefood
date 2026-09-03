import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Restaurant } from '../models/Restaurant';

const router = Router();

// Get All Restaurants with smart cuisine & dish-level filtering
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { cuisine, vegOnly, search } = req.query;
    const filter: any = { isActive: true };

    // Category / Cuisine Filter
    if (cuisine && cuisine !== 'All') {
      let term = String(cuisine).trim();
      if (term.toLowerCase() === 'drinks') term = 'Beverages';

      const catRegex = new RegExp(term, 'i');
      filter.$or = [
        { cuisine: catRegex },
        { 'menu.category': catRegex },
        { 'menu.name': catRegex }
      ];
    }

    if (vegOnly === 'true') {
      filter['menu.isVeg'] = true;
    }

    // Search query matches restaurant name, cuisine, dish name, or dish category
    if (search) {
      let term = String(search).trim();
      if (term.toLowerCase() === 'drinks') term = 'Beverages';
      const searchRegex = new RegExp(term, 'i');

      filter.$or = [
        { name: searchRegex },
        { cuisine: searchRegex },
        { 'menu.name': searchRegex },
        { 'menu.category': searchRegex }
      ];
    }

    const restaurants = await Restaurant.find(filter);
    return res.json({ success: true, count: restaurants.length, data: restaurants });
  } catch (error: any) {
    console.error('Error fetching restaurants:', error);
    return res.status(500).json({ success: false, message: 'Error fetching restaurants' });
  }
});

// Get Single Restaurant Details (Supports rest_1 and ObjectId)
router.get('/:restaurantId', async (req: Request, res: Response): Promise<any> => {
  try {
    const targetId = req.params.restaurantId;

    const orConditions: any[] = [
      { RestaurantId: targetId },
      { restaurantId: targetId }
    ];

    if (mongoose.Types.ObjectId.isValid(targetId)) {
      orConditions.push({ _id: targetId });
    }

    const restaurant = await Restaurant.findOne({ $or: orConditions });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    return res.json({ success: true, data: restaurant });
  } catch (error: any) {
    console.error('Error retrieving restaurant:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error retrieving restaurant' });
  }
});

export default router;