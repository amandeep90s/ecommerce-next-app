// Side-effect imports — register all Mongoose schemas so .populate() always
// resolves correctly regardless of which module is the API entry point.
// These MUST stay; do not remove as "unused imports".
import '@/models/address.model';
import '@/models/category.model';
import '@/models/coupon.model';
import '@/models/media.model';
import '@/models/otp.model';
import '@/models/product-variant.model';
import '@/models/product.model';
import '@/models/review.model';
import '@/models/user.model';

import mongoose, { Mongoose } from 'mongoose';

import { DB_NAME, MONGO_URI } from '@/config/env';

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        dbName: DB_NAME,
        bufferCommands: false,
      })
      .then((mongoose) => {
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
