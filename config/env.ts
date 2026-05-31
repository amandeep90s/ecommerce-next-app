// App configuration
export const NODE_ENV = process.env.NODE_ENV as string;
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME as string;
export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL as string;
export const MONGO_URI = process.env.MONGO_URI as string;
export const DB_NAME = process.env.DB_NAME as string;
export const SECRET_KEY = process.env.SECRET_KEY as string;

// Email configuration
export const EMAIL_SERVICE = (process.env.EMAIL_SERVICE || 'gmail') as string;
export const EMAIL_USER = process.env.EMAIL_USER as string;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD as string;
export const EMAIL_FROM = process.env.EMAIL_FROM as string;
export const EMAIL_HOST = process.env.EMAIL_HOST as string;
export const EMAIL_PORT = Number(process.env.EMAIL_PORT) || 587;

// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Stripe configuration
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;
