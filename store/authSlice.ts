import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  phone: string;
  isDefault?: boolean;
}

export interface Card {
  id: string;
  number: string; // Last 4 digits for display
  expiry: string;
  holderName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  memberLevel: 'Silver' | 'Gold' | 'Platinum';
  joinedDate: string;
  addresses: Address[];
  savedCards: Card[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    signup: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
        if (state.user) {
            state.user = { ...state.user, ...action.payload };
        }
    },
    addAddress: (state, action: PayloadAction<Address>) => {
        if (state.user) {
            state.user.addresses = state.user.addresses || [];
            if (action.payload.isDefault) {
                state.user.addresses.forEach(a => a.isDefault = false);
            }
            state.user.addresses.unshift(action.payload);
        }
    },
    removeAddress: (state, action: PayloadAction<string>) => {
        if (state.user && state.user.addresses) {
            state.user.addresses = state.user.addresses.filter(a => a.id !== action.payload);
        }
    },
    addCard: (state, action: PayloadAction<Card>) => {
        if (state.user) {
            state.user.savedCards = state.user.savedCards || [];
            state.user.savedCards.push(action.payload);
        }
    },
    removeCard: (state, action: PayloadAction<string>) => {
        if (state.user && state.user.savedCards) {
            state.user.savedCards = state.user.savedCards.filter(c => c.id !== action.payload);
        }
    }
  },
});

export const { login, logout, signup, updateProfile, addAddress, removeAddress, addCard, removeCard } = authSlice.actions;
export default authSlice.reducer;
