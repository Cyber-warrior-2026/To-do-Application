import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

/**
 * Custom JWT payload structure
 */
interface JwtPayload extends DefaultJwtPayload {
  id: string;
  role: string;
}

/**
 * Extend Express Request to include user
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1️⃣ Get token from cookies OR Authorization header
    let token: string | undefined = req.cookies?.auth_token;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // 2️⃣ If no token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: Token missing",
      });
    }

    // 3️⃣ JWT Secret
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not defined");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // 5️⃣ Attach user to request
    req.user = decoded;

    // 6️⃣ Continue
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
