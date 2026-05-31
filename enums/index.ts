export enum EAddressType {
  SHIPPING = 'shipping',
  BILLING = 'billing',
}

export enum ERole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum EProductVariantSize {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export enum EOrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum EPaymentMethod {
  STRIPE = 'stripe',
  COD = 'cod',
}

export enum EPaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}
