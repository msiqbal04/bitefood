import { Router } from 'express';
import { updateUserProfile, addAddress, deleteAddress } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// User profile & address book protected routes
router.use(authenticateToken as any);

// Update user details (name, phone, avatar)
router.put('/profile', updateUserProfile);

// Address book management
router.post('/address', addAddress);
router.delete('/address/:addressId', deleteAddress);

export default router;