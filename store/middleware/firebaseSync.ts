import { Middleware } from '@reduxjs/toolkit';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

export const firebaseSyncMiddleware: Middleware = store => next => async action => {
  const result = next(action);
  const state = store.getState();
  const user = auth.currentUser;
  
  if (!user) return result;

  const type = (action as any).type;

  // Sync Cart
  if (type.startsWith('cart/') && !type.includes('setCart') && !type.includes('clearCart')) {
      const cartItems = state.cart.items;
      try {
          await updateDoc(doc(db, "users", user.uid), {
             cart: cartItems
          });
      } catch (e) {
         console.error("Sync Cart Error", e);
      }
  }

  // Sync Wishlist
  if (type.startsWith('wishlist/') && !type.includes('setWishlist')) {
      const wishlistItems = state.wishlist.items;
      try {
          await updateDoc(doc(db, "users", user.uid), {
             wishlist: wishlistItems
          });
      } catch (e) {
         console.error("Sync Wishlist Error", e);
      }
  }

  // Sync Orders
  if (type === 'orders/createOrder') {
    // For orders, we use arrayUnion to append, rather than overwriting the whole list
    // This is safer for concurrency although overwriting is what we do for cart/wishlist
    const order = (action as any).payload;
    try {
        await updateDoc(doc(db, "users", user.uid), {
            orders: arrayUnion(order)
        });
    } catch (e) {
        console.error("Sync Order Error", e);
    }
  }

  return result;
};
