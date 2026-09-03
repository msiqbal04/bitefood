import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bitetown_jwt_super_secure_vault_key_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): any => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Failed:', error);
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): any => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};