import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS, SHADOWS } from '../../constants/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { ChevronLeft, MapPin, CreditCard } from 'lucide-react-native';
import { Image } from 'expo-image';

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const orders = useSelector((state: RootState) => state.orders.orders);
  
  const order = orders.find(o => o.id === id);

  if (!order) {
      return (
          <SafeAreaView style={styles.center}>
              <Text>Order not found</Text>
          </SafeAreaView>
      );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Status Section */}
        <View style={styles.section}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>#{order.id.split('-')[1]}</Text>
            <View style={styles.row}>
                <Text style={styles.date}>{new Date(order.date).toLocaleString()}</Text>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{order.status}</Text>
                </View>
            </View>
        </View>

        {/* Shipping Section */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Shipping Address</Text>
            <View style={styles.infoRow}>
                <MapPin size={20} color={COLORS.textLight} />
                <View style={{flex: 1}}>
                    <Text style={styles.infoName}>{order.address.name}</Text>
                    <Text style={styles.infoText}>{order.address.street}</Text>
                    <Text style={styles.infoText}>{order.address.city}, {order.address.zip}</Text>
                    <Text style={styles.infoText}>Phone: {order.address.phone}</Text>
                </View>
            </View>
        </View>

        {/* Payment Section */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Payment Info</Text>
             <View style={styles.infoRow}>
                <CreditCard size={20} color={COLORS.textLight} />
                <Text style={styles.infoText}>Method: {order.paymentMethod}</Text>
            </View>
        </View>

        {/* Items Section */}
        <Text style={styles.itemsTitle}>Items ({order.items.length})</Text>
        {order.items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
                <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" />
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemSub}>{item.category} • Size: {item.size}</Text>
                    <View style={styles.itemRow}>
                        <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
                        <Text style={styles.itemQty}>x{item.quantity}</Text>
                    </View>
                </View>
            </View>
        ))}
        
        {/* Total Badge */}
        <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Order Value</Text>
            <Text style={styles.totalValue}>₹{order.total.toLocaleString('en-IN')}</Text>
        </View>

      </ScrollView>
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
    padding: SPACING.m,
    paddingBottom: SPACING.xl,
  },
  section: {
      marginBottom: SPACING.l,
  },
  label: {
      fontSize: 12,
      color: COLORS.textLight,
      textTransform: 'uppercase',
      letterSpacing: 1,
  },
  value: {
      fontSize: 20,
      fontFamily: FONTS.bold,
      color: COLORS.text,
      marginBottom: SPACING.xs,
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  date: {
      fontSize: 14,
      color: COLORS.textLight,
  },
  statusBadge: {
      backgroundColor: '#E6FFFA',
      paddingHorizontal: SPACING.s,
      paddingVertical: 4,
      borderRadius: 4,
  },
  statusText: {
      color: '#0D9488', // Teal
      fontWeight: 'bold',
      fontSize: 12,
  },
  card: {
      backgroundColor: COLORS.surface,
      borderRadius: SPACING.m,
      padding: SPACING.m,
      marginBottom: SPACING.m,
      ...SHADOWS.light,
  },
  cardTitle: {
      fontFamily: FONTS.bold,
      fontSize: 16,
      color: COLORS.text,
      marginBottom: SPACING.m,
  },
  infoRow: {
      flexDirection: 'row',
      gap: SPACING.s,
  },
  infoName: {
      fontFamily: FONTS.bold,
      fontSize: 14,
      color: COLORS.text,
      marginBottom: 2,
  },
  infoText: {
      fontFamily: FONTS.regular,
      fontSize: 14,
      color: COLORS.textLight,
      marginBottom: 2,
  },
  itemsTitle: {
      fontFamily: FONTS.bold,
      fontSize: 18,
      marginBottom: SPACING.m,
      marginTop: SPACING.s,
  },
  itemCard: {
      flexDirection: 'row',
      backgroundColor: COLORS.white,
      borderRadius: SPACING.s,
      padding: SPACING.s,
      marginBottom: SPACING.s,
      alignItems: 'center',
  },
  itemImage: {
      width: 60,
      height: 60,
      borderRadius: SPACING.s,
      backgroundColor: COLORS.surface,
  },
  itemDetails: {
      flex: 1,
      marginLeft: SPACING.m,
  },
  itemName: {
      fontFamily: FONTS.medium,
      fontSize: 14,
      color: COLORS.text,
  },
  itemSub: {
      fontSize: 12,
      color: COLORS.textLight,
      marginTop: 2,
  },
  itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
  },
  itemPrice: {
      fontFamily: FONTS.bold,
      color: COLORS.text,
  },
  itemQty: {
      color: COLORS.textLight,
  },
  totalContainer: {
      marginTop: SPACING.l,
      backgroundColor: COLORS.surface,
      padding: SPACING.m,
      borderRadius: SPACING.m,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1, // Highlight total
      borderColor: COLORS.primary,
  },
  totalLabel: {
      fontFamily: FONTS.bold,
      fontSize: 18,
      color: COLORS.text,
  },
  totalValue: {
      fontFamily: FONTS.bold,
      fontSize: 22,
      color: COLORS.primary,
  },
});
