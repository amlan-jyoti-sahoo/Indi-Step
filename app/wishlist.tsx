import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import ProductCard from '../components/ProductCard';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { Stack } from 'expo-router';

export default function Wishlist() {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerStyle: { backgroundColor: COLORS.background }, headerShadowVisible: false }} />
      {wishlistItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your wishlist is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <ProductCard product={item} index={index} />}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.m,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.textLight,
  },
});
