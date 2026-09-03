import { Response } from 'express';
import { User, IAddress } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user?.id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();
    return res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating profile', error });
  }
};

export const addAddress = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { type, flatNo, landmark, area, city, pincode, isDefault } = req.body;
    const user = await User.findById(req.user?.id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (isDefault) {
      user.addresses.forEach((a: IAddress) => {
        a.isDefault = false;
      });
    }

    user.addresses.push({
      type: type || 'Home',
      flatNo,
      landmark: landmark || '',
      area,
      city,
      pincode,
      isDefault: !!isDefault,
    });

    await user.save();
    return res.status(201).json({ success: true, addresses: user.addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error adding address', error });
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user?.id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.addresses = user.addresses.filter((a: any) => a._id.toString() !== addressId) as any;
    await user.save();

    return res.json({ success: true, message: 'Address removed', addresses: user.addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting address', error });
  }
};