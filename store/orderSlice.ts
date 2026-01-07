import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../database';

export interface OrderItem extends Product {
  size: string;
  quantity: number;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  zip: string;
  phone: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  address: Address;
  paymentMethod: string; // 'UPI' | 'Card' | 'NetBlocking'
  status: 'Processing' | 'Shipped' | 'Delivered';
}

interface OrderState {
  orders: Order[];
}

const initialState: OrderState = {
  orders: [],
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload); // Add new orders to the top
    },
  },
});

export const { createOrder } = orderSlice.actions;
export default orderSlice.reducer;
