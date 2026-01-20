import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export const AuthController = {

  async googleLogin(req: Request, res: Response) {
    try {

      const { sub, email, name, picture } = req.body;

      if (!sub || !email) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required user data (sub, email)" 
        });
      }

      const user = await AuthService.findOrCreateUser({ sub, email, name, picture });


      const token = AuthService.signToken(user._id.toString(), user.role);

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.displayName,
          email: user.email,
          avatar: user.avatar,
          role: user.role
        }
      });

    } catch (error) {
      console.error("Auth Controller Error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal Server Error" 
      });
    }
  },

  async logout(req: Request, res: Response) {
    res.clearCookie('auth_token');
    return res.status(200).json({ success: true, message: "Logged out" });
  }
};