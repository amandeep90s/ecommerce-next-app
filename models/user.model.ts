import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import { ERole } from '@/enums';

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: Object.values(ERole),
      default: ERole.USER,
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
    phone: {
      type: String,
      trim: true,
    },
    is_email_verified: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    refresh_token: {
      type: String,
      trim: true,
    },
    deleteAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
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
