import { View, Text, StyleSheet, FlatList, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { incrementQuantity, decrementQuantity, removeFromCart, CartItem } from '../../store/cartSlice';
import { Image } from 'expo-image';
import { Trash2, Minus, Plus, ChevronLeft, ShoppingBag } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';

export default function Cart() {
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleIncrement = (id: string, size: string) => {
    dispatch(incrementQuantity({ id, size }));
  };

  const handleDecrement = (id: string, size: string) => {
    dispatch(decrementQuantity({ id, size }));
  };

  const handleRemove = (id: string, size: string) => {
    dispatch(removeFromCart({ id, size }));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please log in to place your order.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }
    
    // Proceed with checkout
    router.push('/checkout/address');
  };

  const calculateTotal = () => {
    const totalMRP = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = totalMRP * 0.1; // 10% discount logic
    const afterDiscount = totalMRP - discount;
    const gst = afterDiscount * 0.18; // 18% GST
    const deliveryFee = totalMRP > 5000 ? 0 : 500;
    const finalTotal = afterDiscount + gst + deliveryFee;

    return { totalMRP, discount, gst, deliveryFee, finalTotal };
  };

  // Calculate totals regardless of empty state (will be 0)
  const { totalMRP, discount, gst, deliveryFee, finalTotal } = calculateTotal();

  const renderEmptyCart = () => (
      <View style={styles.center}>
        <MotiView
          from={{ translateY: 0, opacity: 0.5, scale: 0.9 }}
          animate={{ translateY: -10, opacity: 1, scale: 1 }}
          transition={{
            type: 'timing',
            duration: 1500,
            loop: true,
            repeatReverse: true,
          }}
          style={styles.emptyIconContainer}
        >
            <View style={styles.circle}>
                 <ShoppingBag size={60} color={COLORS.primary} />
            </View>
        </MotiView>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptyText}>Looks like you haven't added anything to your cart yet.</Text>
        
        <Pressable style={styles.shopNowBtn} onPress={() => router.push('/(tabs)/')}>
            <Text style={styles.shopNowText}>Start Shopping</Text>
        </Pressable>
      </View>
  );

  const renderCartContent = () => (
      <FlatList
        data={cartItems}
        keyExtractor={(item) => `${item.id}-${item.size}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
            <View style={styles.billContainer}>
                <Text style={styles.billTitle}>Price Details</Text>
                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Total MRP</Text>
                    <Text style={styles.billValue}>₹{totalMRP.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Discount (10%)</Text>
                    <Text style={[styles.billValue, styles.discountText]}>-₹{discount.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>GST (18%)</Text>
                    <Text style={styles.billValue}>₹{gst.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Delivery Fee</Text>
                    <Text style={[styles.billValue, deliveryFee === 0 && styles.freeText]}>
                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </Text>
                </View>
                <View style={styles.divider} />
                <View style={[styles.billRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalValue}>₹{finalTotal.toLocaleString('en-IN')}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <Pressable style={styles.checkoutBtn} onPress={handleCheckout}>
                   <Text style={styles.checkoutText}>Checkout • ₹{finalTotal.toLocaleString('en-IN')}</Text>
                </Pressable>
            </View>
        }
      />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.text} />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <Text style={styles.headerSubtitle}>{cartItems.length} items</Text>
        </View>
      </View>

      {cartItems.length === 0 ? renderEmptyCart() : renderCartContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconContainer: {
      marginBottom: SPACING.l,
      alignItems: 'center',
  },
  circle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#F0FDF4', // Light green tint
      justifyContent: 'center',
      alignItems: 'center',
      ...SHADOWS.light,
  },
  emptyTitle: {
      fontFamily: FONTS.bold,
      fontSize: 24,
      color: COLORS.text,
      marginBottom: SPACING.s,
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    maxWidth: '70%',
  },
  shopNowBtn: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.m,
      borderRadius: 30,
      ...SHADOWS.medium,
  },
  shopNowText: {
      fontFamily: FONTS.bold,
      color: COLORS.white,
      fontSize: 16,
  },
  header: {
    padding: SPACING.m,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: SPACING.m,
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    color: COLORS.textLight,
    marginTop: 4,
  },
  listContent: {
    padding: SPACING.m,
    paddingBottom: 150, // Increased padding to avoid overlap with bottom bar
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.m,
    padding: SPACING.s,
    marginBottom: SPACING.m,
    ...SHADOWS.light,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: SPACING.s,
    backgroundColor: COLORS.surface,
  },
  itemDetails: {
    flex: 1,
    marginLeft: SPACING.m,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: '600',
    color: COLORS.text,
  },
  itemCategory: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.s,
  },
  counterBtn: {
    padding: 8,
  },
  counterText: {
    paddingHorizontal: 8,
    fontWeight: 'bold',
  },
  removeBtn: {
    padding: 8,
  },
  billContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: SPACING.m,
    marginTop: SPACING.m,
    ...SHADOWS.light,
  },
  billTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: SPACING.m,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  billLabel: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  billValue: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    fontWeight: '500',
    color: COLORS.text,
  },
  discountText: {
    color: '#22C55E',
  },
  freeText: {
    color: '#22C55E',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.s,
  },
  totalRow: {
    marginTop: SPACING.xs,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  footer: {
    // Removed absolute footer style
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.m,
  },
  checkoutText: {
    color: COLORS.secondary,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
