import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { login, logout } from '../store/authSlice';
import { setCart } from '../store/cartSlice';
import { setWishlist } from '../store/wishlistSlice';
import { setOrders } from '../store/orderSlice';

function AuthWrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const userDocRef = doc(db, "users", user.uid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data() as any;
                if (!userData.id) userData.id = user.uid;
                dispatch(login(userData));
                
                // Fetch Cart and Wishlist
                if (userData.cart) {
                    dispatch(setCart(userData.cart));
                }
                if (userData.wishlist) {
                    dispatch(setWishlist(userData.wishlist));
                }
                if (userData.orders) {
                    dispatch(setOrders(userData.orders));
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
      } else {
        // User is signed out
        dispatch(logout());
        // Optional: clear cart/wishlist on logout if shared device
        dispatch(setCart([]));
        dispatch(setWishlist([]));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="listing/[category]" options={{ headerShown: true, headerBackTitle: 'Back', headerTitle: '' }} />
        <Stack.Screen name="wishlist" options={{ headerShown: true, title: 'Wishlist', headerBackTitle: 'Back' }} />
      </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
           <AuthWrapper />
           <StatusBar style="dark" />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
