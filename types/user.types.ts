import mongoose from 'mongoose';

import { ERole } from '@/enums';

export interface IUserAvatar {
  url?: string;
  public_id?: string;
}

export interface IUser {
  id: mongoose.Types.ObjectId;
  role: ERole;
  name: string;
  email: string;
  password?: string;
  avatar?: IUserAvatar;
  phone?: string;
  is_email_verified: boolean;
  is_active: boolean;
  refresh_token?: string;
  deleteAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, mongoose.Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Serializable, non-sensitive snapshot of the authenticated user.
// Never store password, refresh_token, or raw ObjectIds here.
export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: ERole;
  avatar?: {
    url?: string;
    public_id?: string;
  };
  phone?: string;
}
