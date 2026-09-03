import { Request, Response } from 'express';
import { Restaurant } from '../models/Restaurant';

// Get restaurant menu
export const getRestaurantMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurantId = req.params.restaurantId || req.params.RestaurantId;
    const restaurant = await Restaurant.findOne({
      $or: [{ restaurantId }, { _id: restaurantId }],
    });

    if (!restaurant) {
      res.status(404).json({ success: false, message: 'Restaurant not found' });
      return;
    }

    res.status(200).json({
      success: true,
      menu: restaurant.menu || [],
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// Backward compatibility alias
export const getMenuByRestaurant = getRestaurantMenu;

// Get single dish by dishId
export const getMenuItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dishId } = req.params;
    const restaurant = await Restaurant.findOne({ 'menu._id': dishId });

    if (!restaurant) {
      res.status(404).json({ success: false, message: 'Dish not found' });
      return;
    }

    const item = (restaurant.menu as any[]).find(
      (m: any) => m._id?.toString() === dishId || m.id === dishId
    );

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// Add a new dish to restaurant menu
export const addMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const { name, description, price, category, image, isVeg } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      res.status(404).json({ success: false, message: 'Restaurant not found' });
      return;
    }

    const newItem: any = {
      name,
      description,
      price: Number(price),
      category: category || 'Main Course',
      image: image || '',
      isVeg: Boolean(isVeg),
      isAvailable: true,
      inStock: true,
    };

    (restaurant.menu as any).push(newItem);
    await restaurant.save();

    res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      menu: restaurant.menu,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// Toggle dish availability (In Stock / Out of Stock)
export const toggleMenuItemAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId, itemId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      res.status(404).json({ success: false, message: 'Restaurant not found' });
      return;
    }

    const item = (restaurant.menu as any[]).find(
      (m: any) => m._id?.toString() === itemId || m.id === itemId
    );

    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    // Toggle both keys safely so whatever schema uses works seamlessly
    const currentStatus = item.isAvailable !== undefined ? item.isAvailable : item.inStock ?? true;
    item.isAvailable = !currentStatus;
    item.inStock = !currentStatus;

    // Inform mongoose array modification
    restaurant.markModified('menu');
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: 'Item status updated',
      item,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// Delete a menu item
export const deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId, itemId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      res.status(404).json({ success: false, message: 'Restaurant not found' });
      return;
    }

    restaurant.menu = (restaurant.menu as any[]).filter(
      (m: any) => m._id?.toString() !== itemId && m.id !== itemId
    );

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from menu',
      menu: restaurant.menu,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};