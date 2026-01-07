import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS, SHADOWS } from '../../constants/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { ChevronRight, Package, Calendar } from 'lucide-react-native';

export default function Orders() {
  const router = useRouter();
  const orders = useSelector((state: RootState) => state.orders.orders);

  const renderItem = ({ item }: { item: any }) => (
      <Pressable style={styles.card} onPress={() => router.push(`/orders/${item.id}`)}>
          <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                  <Package size={20} color={COLORS.primary} />
              </View>
              <View style={styles.headerInfo}>
                  <Text style={styles.orderId}>Order #{item.id.split('-')[1].slice(-6)}</Text>
                  <Text style={styles.status}>{item.status}</Text>
              </View>
              <ChevronRight size={20} color={COLORS.textLight} />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.cardBody}>
              <View style={styles.row}>
                  <Calendar size={14} color={COLORS.textLight} />
                  <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
              </View>
              <Text style={styles.total}>₹{item.total.toLocaleString('en-IN')}</Text>
          </View>
          
          <Text style={styles.itemsText}>{item.items.length} Items</Text>
      </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
           <ChevronRight size={24} color={COLORS.text} style={{ transform: [{rotate: '180deg'}] }} /> 
           {/* Using rotated chevron right as back button if needed, or normal Back. Using text for now. */}
           <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
              <Package size={60} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No orders found.</Text>
          </View>
      ) : (
          <FlatList 
            data={orders}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
      marginRight: SPACING.m,
      padding: SPACING.s,
  },
  backText: {
      fontFamily: FONTS.medium,
      fontSize: 16,
      color: COLORS.text,
  },
  headerTitle: {
      fontFamily: FONTS.bold,
      fontSize: 20,
      color: COLORS.text,
      flex: 1,
      textAlign: 'center',
      marginRight: 40, // center align compensation
  },
  list: {
      padding: SPACING.m,
  },
  card: {
      backgroundColor: COLORS.surface,
      borderRadius: SPACING.m,
      padding: SPACING.m,
      marginBottom: SPACING.m,
      ...SHADOWS.light,
  },
  cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.m,
  },
  iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: COLORS.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: COLORS.border,
  },
  headerInfo: {
      flex: 1,
  },
  orderId: {
      fontFamily: FONTS.bold,
      fontSize: 14,
      color: COLORS.text,
  },
  status: {
      fontFamily: FONTS.medium,
      fontSize: 12,
      color: COLORS.primary, // Could change color based on status
      marginTop: 2,
  },
  divider: {
      height: 1,
      backgroundColor: COLORS.border,
      marginVertical: SPACING.s,
  },
  cardBody: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.s,
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  date: {
      fontFamily: FONTS.regular,
      fontSize: 12,
      color: COLORS.textLight,
  },
  total: {
      fontFamily: FONTS.bold,
      fontSize: 16,
      color: COLORS.text,
  },
  itemsText: {
      fontFamily: FONTS.regular,
      fontSize: 12,
      color: COLORS.textLight,
  },
  emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  emptyText: {
      marginTop: SPACING.m,
      fontFamily: FONTS.medium,
      color: COLORS.textLight,
  },
});
