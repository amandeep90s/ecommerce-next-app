import mongoose from 'mongoose';

import { EAddressType } from '@/enums';

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address_line1: {
      type: String,
      required: true,
      trim: true,
    },
    address_line2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postal_code: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    is_default: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      trim: true,
      enum: Object.values(EAddressType),
      default: EAddressType.SHIPPING,
    },
    deleteAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema, 'addresses');

export default Address;
