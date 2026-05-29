import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  selling_price: number;
  discount: number;
  quantity: number;
  stock: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) {
      const { quantity: requestedQty = 1, ...item } = action.payload;
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        // Clamp to available stock
        existing.quantity = Math.min(existing.quantity + requestedQty, existing.stock);
      } else {
        state.items.push({ ...item, quantity: Math.min(requestedQty, item.stock) });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((i) => i.productId === action.payload.productId);
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

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.selling_price * item.quantity, 0);
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartItemById = (productId: string) => (state: { cart: CartState }) =>
  state.cart.items.find((i) => i.productId === productId);
