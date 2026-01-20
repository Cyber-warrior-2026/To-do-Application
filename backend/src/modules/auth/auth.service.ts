import { UserModel, IUser } from './user.model';
import jwt from 'jsonwebtoken';


interface GoogleUserPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export const AuthService = {

  async findOrCreateUser(payload: GoogleUserPayload): Promise<IUser> {
    let user = await UserModel.findOne({ googleId: payload.sub });

    if (!user) {
      user = await UserModel.create({
        googleId: payload.sub,
        email: payload.email,
        displayName: payload.name,
        avatar: payload.picture,
      });
    } else {

      user.lastLogin = new Date();
      await user.save();
    }

    return user;
  },





  signToken(userId: string, role: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("❌ FATAL: JWT_SECRET is not defined in .env");
    }

    return jwt.sign({ id: userId, role }, secret, {
      expiresIn: '7d',
    });
  }
};