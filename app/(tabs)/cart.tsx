import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { incrementQuantity, decrementQuantity, removeFromCart, CartItem } from '../../store/cartSlice';
import { Image } from 'expo-image';
import { Trash2, Minus, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Cart() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
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

  const calculateTotal = () => {
    const totalMRP = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = totalMRP * 0.1; // 10% discount logic
    const afterDiscount = totalMRP - discount;
    const gst = afterDiscount * 0.18; // 18% GST
    const deliveryFee = totalMRP > 5000 ? 0 : 500;
    const finalTotal = afterDiscount + gst + deliveryFee;

    return { totalMRP, discount, gst, deliveryFee, finalTotal };
  };

  const { totalMRP, discount, gst, deliveryFee, finalTotal } = calculateTotal();

  if (cartItems.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category} • Size: {item.size}</Text>
        <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
        
        <View style={styles.quantityContainer}>
            <View style={styles.counter}>
                <Pressable onPress={() => handleDecrement(item.id, item.size)} style={styles.counterBtn}>
                    <Minus size={16} color={COLORS.text} />
                </Pressable>
                <Text style={styles.counterText}>{item.quantity}</Text>
                <Pressable onPress={() => handleIncrement(item.id, item.size)} style={styles.counterBtn}>
                    <Plus size={16} color={COLORS.text} />
                </Pressable>
            </View>
            <Pressable onPress={() => handleRemove(item.id, item.size)} style={styles.removeBtn}>
                <Trash2 size={20} color={COLORS.error} />
            </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.headerSubtitle}>{cartItems.length} items</Text>
      </View>

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
                
                <Pressable style={styles.checkoutBtn}>
                   <Text style={styles.checkoutText}>Checkout • ₹{finalTotal.toLocaleString('en-IN')}</Text>
                </Pressable>
            </View>
        }
      />
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
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.textLight,
  },
  header: {
    padding: SPACING.m,
    backgroundColor: COLORS.background,
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
