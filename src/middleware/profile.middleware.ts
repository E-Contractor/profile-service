import { Request, Response, NextFunction } from 'express';
import jwt, { decode } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { error } from 'console';

// dotenv.config();

// interface JwtPayload {
//   sub: string;
//   exp: number;
//   iat: number;
// }

// export const authMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (process.env.NODE_ENV == 'dev')
//       console.log('Authorization Header:', authHeader);

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       res.status(401).json({ message: 'No token provided' });
//       return;
//     }

//     const token = authHeader.split(' ')[1];
//     const secret = process.env.JWT_SECRET;

//     if (!secret) throw new Error('JWT_SECRET is not set');

//     try {
//       const decoded = jwt.verify(token, secret as string) as JwtPayload;
//       req.userId = decoded.sub;
//       next();
//     } catch (err) {
//       res.status(401).json({ message: 'Invalid or expired token' });
//       return;
//     }
//   } catch (err) {
//     console.error('JWT Verification Error:', error);
//     return res.sendStatus(401);
//   }
// };

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
