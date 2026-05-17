import mongoose from 'mongoose';

import { EAddressType } from '@/enums';

export interface IAddress {
  id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  type: EAddressType;
  deleteAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddressDocument extends IAddress, mongoose.Document {}
