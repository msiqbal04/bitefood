import { Router } from 'express';
import authRoutes from './authRoutes';
import restaurantRoutes from './restaurantRoutes';
import orderRoutes from './orderRoutes';
import paymentRoutes from './paymentRoutes';
import cartRoutes from './cartRoutes';
import userRoutes from './userRoutes';
import adminRoutes from './adminRoutes';
import menuRoutes from './menuRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/cart', cartRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

export default router;