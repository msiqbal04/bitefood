import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Restaurant } from '../models/Restaurant';

// Sabhi restaurants fetch karne ke liye
export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find();
    return res.status(200).json(restaurants);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching restaurants', error });
  }
};

// Single restaurant fetch karne ke liye (ObjectId ya custom string id dono support karta hai)
export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let restaurantData: any = null;

    // 1. Agar MongoDB ObjectId format me hai
    if (mongoose.Types.ObjectId.isValid(id)) {
      restaurantData = await Restaurant.findById(id).populate('menuItems');
    }

    // 2. Agar custom id hai (jaise 'rest_1')
    if (!restaurantData) {
      restaurantData = await Restaurant.findOne({
        $or: [{ id: id }, { customId: id }, { slug: id }]
      }).populate('menuItems');
    }

    if (!restaurantData) {
      return res.status(404).json({ message: 'Restaurant details nahi mili.' });
    }

    return res.status(200).json(restaurantData);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};