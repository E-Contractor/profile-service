import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const serviceAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const serviceAuthHeader = req.headers['x-service-auth'];

  if (serviceAuthHeader !== process.env.SERVICE_AUTH_SECRET) {
    res.status(403).json({
      success: false,
      message: 'Service authentication failed',
      errors: ['Unauthorized service access'],
    });
    return;
  }

  next();
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies.Authorization ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        errors: ['Authentication token is required'],
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      errors: ['Invalid or expired authentication token'],
    });
  }
};
