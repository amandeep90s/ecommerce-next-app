import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import { Role } from '@/types/auth';

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: Object.values(Role),
      default: Role.USER,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    avatar: {
      url: {
        type: String,
        trim: true,
      },
      public_id: {
        type: String,
        trim: true,
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    deleteAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function () {
  try {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
  } catch {
    throw new Error('Error hashing password');
  }
});

userSchema.methods = {
  comparePassword: async function (candidatePassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch {
      throw new Error('Error comparing passwords');
    }
  },
};

const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

export default User;
