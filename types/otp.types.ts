import mongoose from 'mongoose';

export interface IOTP {
  id: mongoose.Types.ObjectId;
  email: string;
  otp: string;
  expires_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOTPDocument extends IOTP, mongoose.Document {}
