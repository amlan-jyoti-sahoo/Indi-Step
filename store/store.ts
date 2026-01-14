import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import authReducer from './authSlice';
import orderReducer from './orderSlice';
import { firebaseSyncMiddleware } from './middleware/firebaseSync';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({ serializableCheck: false }).concat(firebaseSyncMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
