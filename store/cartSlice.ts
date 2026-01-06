import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../database';

export interface CartItem extends Product {
  quantity: number;
  size: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; size: string }>) => {
      const { product, size } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id && item.size === size);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1, size });
      }
    },
    removeFromCart: (state, action: PayloadAction<{ id: string; size: string }>) => {
      state.items = state.items.filter(
        item => !(item.id === action.payload.id && item.size === action.payload.size)
      );
    },
    incrementQuantity: (state, action: PayloadAction<{ id: string; size: string }>) => {
      const item = state.items.find(
        item => item.id === action.payload.id && item.size === action.payload.size
      );
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<{ id: string; size: string }>) => {
      const item = state.items.find(
        item => item.id === action.payload.id && item.size === action.payload.size
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(
            i => !(i.id === action.payload.id && i.size === action.payload.size)
          );
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
