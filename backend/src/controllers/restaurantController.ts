import { Request, Response } from 'express';
import { Restaurant } from '../models/Restaurant';

// Get all Restaurants with search & filters
export const getAllRestaurants = async (req: Request, res: Response): Promise<any> => {
  try {
    const { search, cuisine, vegOnly } = req.query;
    const filter: any = { isActive: true };

    if (cuisine && cuisine !== 'All') {
      filter.cuisine = new RegExp(String(cuisine), 'i');
    }

    if (vegOnly === 'true') {
      filter['menu.isVeg'] = true;
    }

    if (search) {
      const term = new RegExp(String(search), 'i');
      filter.$or = [{ name: term }, { cuisine: term }, { 'menu.name': term }];
    }

    const restaurants = await Restaurant.find(filter);
    return res.json({ success: true, count: restaurants.length, data: restaurants });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching Restaurants', error });
  }
};

// Get single Restaurant by restaurantId or _id
export const getRestaurantById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({
      $or: [{ restaurantId: id }, { _id: id }],
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    return res.json({ success: true, data: restaurant });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving Restaurant', error });
  }
};