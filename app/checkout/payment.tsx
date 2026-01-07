import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS, SHADOWS } from '../../constants/theme';
import { useState } from 'react';
import { ChevronLeft, CreditCard, Landmark, Smartphone, CheckCircle2 } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { createOrder } from '../../store/orderSlice';
import { clearCart } from '../../store/cartSlice';

export default function Payment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const address = params.address ? JSON.parse(params.address as string) : {};
  
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  // Calculate total again (should ideally pass from cart)
  const totalMRP = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = totalMRP * 0.1;
  const afterDiscount = totalMRP - discount;
  const gst = afterDiscount * 0.18;
  const deliveryFee = totalMRP > 5000 ? 0 : 500;
  const finalTotal = afterDiscount + gst + deliveryFee;

  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'Card' | 'NetBanking' | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock Input States
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePlaceOrder = () => {
    if (!selectedMethod) {
        Alert.alert('Payment Method', 'Please select a payment method.');
        return;
    }
    
    // Basic validation
    if (selectedMethod === 'UPI' && !upiId) {
        Alert.alert('Invalid UPI', 'Please enter your UPI ID.');
        return;
    }
    if (selectedMethod === 'Card' && (!cardNumber || !cardExpiry || !cvv)) {
        Alert.alert('Invalid Card', 'Please enter complete card details.');
        return;
    }

    setLoading(true);
    
    // Simulate Payment Processing
    setTimeout(() => {
        setLoading(false);
        
        // Create Order Object
        const newOrder = {
            id: 'ORD-' + Date.now(),
            date: new Date().toISOString(),
            items: cartItems,
            total: finalTotal,
            address: address,
            paymentMethod: selectedMethod,
            status: 'Processing' as const
        };
        
        // Dispatch Actions
        dispatch(createOrder(newOrder));
        dispatch(clearCart());
        
        // Navigate to Success
        router.replace('/checkout/success');
    }, 2000);
  };

  const PaymentOption = ({ id, icon: Icon, title, subtitle }: { id: string, icon: any, title: string, subtitle: string }) => (
      <Pressable 
        style={[styles.paymentOption, selectedMethod === id && styles.selectedOption]} 
        onPress={() => setSelectedMethod(id as any)}
      >
          <View style={styles.optionHeader}>
              <View style={styles.optionIcon}>
                  <Icon size={24} color={selectedMethod === id ? COLORS.primary : COLORS.textLight} />
              </View>
              <View>
                  <Text style={[styles.optionTitle, selectedMethod === id && styles.selectedText]}>{title}</Text>
                  <Text style={styles.optionSubtitle}>{subtitle}</Text>
              </View>
          </View>
          <View style={styles.radioOuter}>
              {selectedMethod === id && <View style={styles.radioInner} />}
          </View>
      </Pressable>
  );

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
        
        <View style={styles.methodsContainer}>
            <PaymentOption id="UPI" icon={Smartphone} title="UPI" subtitle="GPay, PhonePe, Paytm" />
            {selectedMethod === 'UPI' && (
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Enter UPI ID (e.g., user@upi)"
                        value={upiId}
                        onChangeText={setUpiId}
                        autoCapitalize="none"
                    />
                </View>
            )}

            <PaymentOption id="Card" icon={CreditCard} title="Credit / Debit Card" subtitle="Visa, Mastercard, RuPay" />
            {selectedMethod === 'Card' && (
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Card Number"
                        value={cardNumber}
                        onChangeText={setCardNumber}
                        keyboardType="numeric"
                        maxLength={16}
                    />
                    <View style={styles.row}>
                        <TextInput 
                            style={[styles.input, { flex: 1 }]} 
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChangeText={setCardExpiry}
                            maxLength={5}
                        />
                        <TextInput 
                            style={[styles.input, { flex: 1 }]} 
                            placeholder="CVV"
                            value={cvv}
                            onChangeText={setCvv}
                            keyboardType="numeric"
                            maxLength={3}
                            secureTextEntry
                        />
                    </View>
                </View>
            )}

            <PaymentOption id="NetBanking" icon={Landmark} title="Net Banking" subtitle="All Indian banks supported" />
        </View>

      </ScrollView>
      
      <View style={styles.footer}>
          <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={handlePlaceOrder} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Pay & Place Order</Text>}
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
  },
  sectionTitle: {
      fontFamily: FONTS.bold,
      fontSize: 20,
      color: COLORS.primary,
      marginBottom: SPACING.l,
      textAlign: 'center',
  },
  methodsContainer: {
      gap: SPACING.m,
  },
  paymentOption: {
      backgroundColor: COLORS.surface,
      padding: SPACING.m,
      borderRadius: SPACING.m,
      borderWidth: 1,
      borderColor: COLORS.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  selectedOption: {
      borderColor: COLORS.primary,
      backgroundColor: '#F0FDF4', // Light green tint if primary is green-ish, or just generic light bg
  },
  optionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.m,
  },
  optionIcon: {
      width: 40,
      alignItems: 'center',
  },
  optionTitle: {
      fontFamily: FONTS.bold,
      fontSize: 16,
      color: COLORS.text,
  },
  selectedText: {
      color: COLORS.primary,
  },
  optionSubtitle: {
      fontFamily: FONTS.regular,
      fontSize: 12,
      color: COLORS.textLight,
  },
  radioOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: COLORS.textLight,
      alignItems: 'center',
      justifyContent: 'center',
  },
  radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: COLORS.primary,
  },
  inputContainer: {
      marginTop: -SPACING.s,
      marginLeft: SPACING.m,
      marginRight: SPACING.m,
      padding: SPACING.m,
      backgroundColor: COLORS.surface,
      borderBottomLeftRadius: SPACING.m,
      borderBottomRightRadius: SPACING.m,
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: COLORS.border,
      gap: SPACING.m,
  },
  input: {
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: SPACING.s,
      padding: SPACING.s,
      fontFamily: FONTS.medium,
  },
  row: {
      flexDirection: 'row',
      gap: SPACING.m,
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
