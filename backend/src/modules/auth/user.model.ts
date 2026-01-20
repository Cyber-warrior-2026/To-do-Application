import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: 'user' | 'admin';
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}


const UserSchema = new Schema<IUser>(
  {
    googleId: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    displayName: { type: String, required: true },
    avatar:      { type: String },
    role:        { type: String, enum: ['user', 'admin'], default: 'user' },
    lastLogin:   { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false 
  }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);