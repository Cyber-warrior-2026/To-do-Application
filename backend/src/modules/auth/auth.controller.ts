import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserModel } from './user.model'; 

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


// 1. REGISTER (New User)

  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: "Please provide name, email and password" });
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already registered" });
      }

      const user = await UserModel.create({
        email,
        password,
        displayName: name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random` // Auto-generate avatar
      });


      const token = AuthService.signToken(user._id.toString(), user.role);


      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        user: { id: user._id, name: user.displayName, email: user.email, role: user.role }
      });

    } catch (error) {
      console.error("Register Error:", error);
      return res.status(500).json({ success: false, message: "Registration failed" });
    }
  },


//  2. LOGIN (Existing User)

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
      }


      const user = await UserModel.findOne({ email }).select('+password');

      if (!user || !user.password) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }


      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }


      user.lastLogin = new Date();
      await user.save();


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
        user: { id: user._id, name: user.displayName, email: user.email, role: user.role }
      });

    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({ success: false, message: "Login failed" });
    }
  },


//   3. Logout
  async logout(req: Request, res: Response) {
    res.clearCookie('auth_token');
    return res.status(200).json({ success: true, message: "Logged out" });
  },



// 4. CHANGE PASSWORD

  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      

      const userId = req.user?.id; 

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Please provide current and new password" });
      }


      const user = await UserModel.findById(userId).select('+password');

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }


      if (!user.password) {
        return res.status(400).json({ 
          success: false, 
          message: "You are logged in via Google. You cannot change a password you don't have." 
        });
      }


      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Incorrect current password" });
      }



      user.password = newPassword;
      await user.save();

      return res.status(200).json({ success: true, message: "Password changed successfully" });

    } catch (error) {
      console.error("Change Password Error:", error);
      return res.status(500).json({ success: false, message: "Could not change password" });
    }
  }




};











