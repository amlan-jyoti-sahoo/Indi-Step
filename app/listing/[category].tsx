import { View, Text, FlatList, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { PRODUCTS_COLLECTION, Product } from '../../database';
import { COLORS, SPACING, FONTS } from '../../constants/theme';
import ProductCard from '../../components/ProductCard';
import { ChevronLeft } from 'lucide-react-native';
import { useState, useEffect } from 'react';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function Listing() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  
  // Filter products. Note: category param might be lowercase 'shoes', data has 'Shoes'.
  const categoryName = typeof category === 'string' ? category : '';

  useEffect(() => {
     const filtered = PRODUCTS_COLLECTION.filter(
       (p) => p.category.toLowerCase() === categoryName.toLowerCase()
     );
     setProducts(filtered);
  }, [categoryName]);

  const handleRemoveProduct = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
         options={{ 
            title: categoryName.toUpperCase(),
            headerTitleStyle: { fontFamily: FONTS.bold, fontSize: 16 },
            headerLeft: () => (
               <Pressable onPress={() => router.back()} style={{ marginLeft: 0 }}>
                  <ChevronLeft color={COLORS.primary} size={24} />
               </Pressable>
            ),
            headerTintColor: COLORS.primary,
            headerShadowVisible: false,
         }} 
      />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <ProductCard product={item} index={index} onRemove={handleRemoveProduct} />}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.content}
        ListEmptyComponent={<View style={styles.center}><Text>No products found in this category.</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.m,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  center: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
});
