import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): any => {
  try {
    // Check if user object exists from preceding authMiddleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    // Role verification
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.',
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed',
      error,
    });
  }
};

export default adminMiddleware;