import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS } from '../../constants/theme';
import { useState } from 'react';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { createOrder } from '../../store/orderSlice';
import { clearCart } from '../../store/cartSlice';
import RazorpayCheckout from 'react-native-razorpay';

export default function Payment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const address = params.address ? JSON.parse(params.address as string) : {};
  
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  // Calculate total again
  const totalMRP = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = totalMRP * 0.1;
  const afterDiscount = totalMRP - discount;
  const gst = afterDiscount * 0.18;
  const deliveryFee = totalMRP > 5000 ? 0 : 500;
  const finalTotal = afterDiscount + gst + deliveryFee;

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = () => {
    setLoading(true);

    const options = {
      description: 'Payment for your order',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_TLizkUXChD8GM3', // Updated Test Key
      amount: Math.round(finalTotal * 100), // Amount in paise
      name: 'Indi-Step',
      prefill: {
        email: 'amlan@example.com',
        contact: '9999999999',
        name: 'Amlan Jyoti Sahoo'
      },
      theme: { color: COLORS.primary }
    };

    console.log("Opening Razorpay with options:", JSON.stringify(options));

    RazorpayCheckout.open(options)
      .then((data: any) => {
        // handle success
        console.log(`Success Callback: ${JSON.stringify(data)}`);
        
        try {
            // Create Order Object
            const newOrder = {
                id: 'ORD-' + Date.now(),
                date: new Date().toISOString(),
                items: cartItems,
                total: finalTotal,
                address: address,
                paymentMethod: 'Prepaid (Razorpay)',
                paymentId: data.razorpay_payment_id,
                status: 'Processing' as const
            };
            
            // Dispatch Actions
            console.log("Dispatching actions...");
            dispatch(createOrder(newOrder));
            dispatch(clearCart());
            console.log("Actions dispatched.");
            
            setLoading(false);
            
            // Navigate to Success
            console.log("Navigating to success...");
            // Use setTimeout to ensure modal is closed properly before navigating
            setTimeout(() => {
                router.replace('/checkout/success');
            }, 500);
        } catch (err) {
            console.error("Error in success handler:", err);
            Alert.alert("Error", "Payment succeeded but order creation failed.");
        }
      })
      .catch((error: any) => {
        // handle failure
        console.log(`Error: ${error.code} | ${error.description}`);
        setLoading(false);
        Alert.alert('Payment Failed', error.description || 'Something went wrong');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Total Amount: ₹{finalTotal.toLocaleString('en-IN')}</Text>
        
        <View style={styles.infoContainer}>
            <ShieldCheck size={64} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Secure Payment</Text>
            <Text style={styles.infoText}>
                You will be redirected to Razorpay's secure gateway to complete your payment.
                All major cards, UPI, and Netbanking are supported.
            </Text>
        </View>

      </ScrollView>
      
      <View style={styles.footer}>
          <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={handlePlaceOrder} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Pay Now</Text>}
          </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.m,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  headerTitle: {
      fontFamily: FONTS.bold,
      fontSize: 18,
      color: COLORS.text,
  },
  content: {
    padding: SPACING.l,
    alignItems: 'center',
  },
  sectionTitle: {
      fontFamily: FONTS.bold,
      fontSize: 24,
      color: COLORS.primary,
      marginBottom: SPACING.xl,
      textAlign: 'center',
  },
  infoContainer: {
      alignItems: 'center',
      padding: SPACING.xl,
      backgroundColor: COLORS.surface,
      borderRadius: SPACING.l,
      width: '100%',
      gap: SPACING.m,
  },
  infoTitle: {
      fontFamily: FONTS.bold,
      fontSize: 18,
      color: COLORS.text,
  },
  infoText: {
      fontFamily: FONTS.regular,
      fontSize: 14,
      color: COLORS.textLight,
      textAlign: 'center',
      lineHeight: 20,
  },
  footer: {
      padding: SPACING.m,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      backgroundColor: COLORS.background,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: 30,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
  buttonDisabled: {
      opacity: 0.7,
  },
  buttonText: {
    fontFamily: FONTS.bold,
    color: COLORS.white,
    fontSize: 16,
  },
});
