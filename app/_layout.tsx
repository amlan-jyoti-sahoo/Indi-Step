import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="product/[id]" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="listing/[category]" options={{ headerShown: true, headerBackTitle: 'Back', headerTitle: '' }} />
            <Stack.Screen name="wishlist" options={{ headerShown: true, title: 'Wishlist', headerBackTitle: 'Back' }} />
          </Stack>
          <StatusBar style="dark" />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
