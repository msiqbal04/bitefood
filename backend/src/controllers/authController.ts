import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'bitetown_jwt_super_secure_vault_key_2026';

const signToken = (id: string, role: string = 'CUSTOMER'): string => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User already exists with this email or phone.' });
      return;
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    const token = signToken(user._id.toString(), user.role || 'CUSTOMER');

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phone, password } = req.body;
    const query = email ? { email } : { phone };

    // Select +password in case password field is hidden by default in schema
    const user = await User.findOne(query).select('+password');
    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    if (password && user.password) {
      let isMatch = false;
      if (typeof user.comparePassword === 'function') {
        isMatch = await user.comparePassword(password);
      } else {
        isMatch = await bcrypt.compare(password, user.password);
      }

      if (!isMatch) {
        res.status(400).json({ success: false, message: 'Invalid credentials.' });
        return;
      }
    }

    const token = signToken(user._id.toString(), user.role || 'CUSTOMER');

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    res.status(200).json({ success: true, user: user || req.user });
  } catch {
    res.status(200).json({ success: true, user: req.user });
  }
};