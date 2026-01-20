import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  role: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {

    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access Denied: No Token Provided" 
      });
    }


    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const decoded = jwt.verify(token, secret) as JwtPayload;


    req.user = decoded;

    next();

  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: "Invalid or Expired Token" 
    });
  }
};