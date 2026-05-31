import mongoose from 'mongoose';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'stripe' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// ─── Embedded sub-shapes ──────────────────────────────────────────────────────

export interface IOrderProduct {
  productId: string; // ObjectId string after lean()
  // Snapshot fields recorded at checkout time
  name: string;
  price: number;
  selling_price: number;
  image?: string;
  quantity: number;
  // Variant snapshot — null when no variant was selected
  variantId?: string | null;
  color?: string | null;
  size?: string | null;
  sku?: string | null;
}

export interface IOrderShippingAddress {
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface IOrderCustomerSnapshot {
  name: string;
  email: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface IOrder {
  id: string;
  userId: string;
  customerSnapshot?: IOrderCustomerSnapshot;
  couponCode?: string;
  products: IOrderProduct[];
  shippingAddress?: IOrderShippingAddress;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  orderedAt: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API response wrappers ────────────────────────────────────────────────────

export interface IOrderPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetAdminOrdersResponse {
  success: boolean;
  message: string;
  data: {
    items: IOrder[];
    meta: IOrderPaginationMeta;
  } | null;
}

export interface IGetOrderByIdResponse {
  success: boolean;
  message: string;
  data: IOrder | null;
}

// ─── Checkout request ─────────────────────────────────────────────────────────

export interface ICheckoutProduct {
  productId: string;
  name: string;
  price: number;
  selling_price: number;
  image?: string;
  quantity: number;
  variantId?: string | null;
  color?: string | null;
  size?: string | null;
  sku?: string | null;
}

export interface ICheckoutRequest {
  products: ICheckoutProduct[];
  shippingAddress: IOrderShippingAddress;
  customerSnapshot: IOrderCustomerSnapshot;
  couponCode?: string;
  note?: string;
}

export interface ICreateCheckoutSessionResponse {
  success: boolean;
  message: string;
  data: {
    sessionId: string;
    url: string;
  } | null;
}

export interface IOrderDocument extends IOrder, mongoose.Document {}
