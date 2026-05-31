import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  productId: string;
  variantId?: string | null;
  name: string;
  slug: string;
  image: string;
  price: number;
  selling_price: number;
  discount: number;
  quantity: number;
  stock: number;
  color?: string | null;
  size?: string | null;
  sku?: string | null;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

/** Unique key for a cart line item (product + variant combination) */
function cartItemKey(item: { productId: string; variantId?: string | null }): string {
  return item.variantId ? `${item.productId}_${item.variantId}` : item.productId;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) {
      const { quantity: requestedQty = 1, ...item } = action.payload;
      const key = cartItemKey(item);
      const existing = state.items.find((i) => cartItemKey(i) === key);
      if (existing) {
        // Clamp to available stock
        existing.quantity = Math.min(existing.quantity + requestedQty, existing.stock);
      } else {
        state.items.push({ ...item, quantity: Math.min(requestedQty, item.stock) });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => cartItemKey(i) !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ key: string; quantity: number }>) {
      const item = state.items.find((i) => cartItemKey(i) === action.payload.key);
      if (item) {
        const clamped = Math.max(1, Math.min(action.payload.quantity, item.stock));
        item.quantity = clamped;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

// Helpers
export { cartItemKey };

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.selling_price * item.quantity, 0);
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartItemById = (productId: string) => (state: { cart: CartState }) =>
  state.cart.items.find((i) => i.productId === productId);
