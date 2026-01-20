import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  googleId?: string;
  email: string;
  displayName: string;
  avatar?: string;
  password?: string;
  role: 'user' | 'admin';
  lastLogin: Date;
  comparePassword(candidatePassword: string): Promise<boolean>; 
}

const UserSchema = new Schema<IUser>(
  {
    googleId: { 
      type: String, 
      unique: true, 
      sparse: true
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      select: false
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



UserSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password || '');
};

export const UserModel = mongoose.model<IUser>('User', UserSchema);