import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../database';

interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    setWishlist: (state, action: PayloadAction<Product[]>) => {
        state.items = action.payload || [];
    },
  },
});

export const { toggleWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
