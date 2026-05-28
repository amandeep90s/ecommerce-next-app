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
  deletedAt: Date | null;
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

// ─── Customer Types (Admin) ──────────────────────────────────────────────────

export interface ICustomerItem {
  id: string;
  name: string;
  email: string;
  avatar?: IUserAvatar;
  phone?: string;
  is_email_verified: boolean;
  is_active: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICustomerDetail extends ICustomerItem {
  addresses: ICustomerAddress[];
}

export interface ICustomerAddress {
  id: string;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  type: string;
}

export interface ICustomerPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetCustomersResponse {
  success: boolean;
  message: string;
  data: {
    items: ICustomerItem[];
    meta: ICustomerPaginationMeta;
  } | null;
}

export interface IGetCustomerByIdResponse {
  success: boolean;
  message: string;
  data: ICustomerDetail | null;
}

export interface IToggleCustomerStatusResponse {
  success: boolean;
  message: string;
  data: ICustomerItem | null;
}

// ─── Profile Types ───────────────────────────────────────────────────────────

export interface IUpdateProfilePayload {
  name: string;
  phone?: string;
}

export interface IUpdateProfileResponse {
  success: boolean;
  message: string;
  data: IAuthUser | null;
}

export interface IUpdateAvatarPayload {
  url: string;
  public_id: string;
}

export interface IUpdateAvatarResponse {
  success: boolean;
  message: string;
  data: IAuthUser | null;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IChangePasswordResponse {
  success: boolean;
  message: string;
  data: null;
}
