import { Router } from 'express';
import { getRestaurantMenu, getMenuItemById } from '../controllers/menuController';

const router = Router();

// Kisi Restaurant ka specific menu fetch karna
router.get('/Restaurant/:RestaurantId', getRestaurantMenu);

// Single dish details fetch karna
router.get('/item/:dishId', getMenuItemById);

export default router;