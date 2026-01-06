import { View, Text, FlatList, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager, Modal, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { PRODUCTS_COLLECTION, Product } from '../../database';
import { COLORS, SPACING, FONTS } from '../../constants/theme';
import ProductCard from '../../components/ProductCard';
import ProductSkeleton from '../../components/ProductSkeleton';
import { ChevronLeft, Filter, X } from 'lucide-react-native';
import { useState, useEffect, useMemo } from 'react';
import Slider from '@react-native-community/slider';

const { height } = Dimensions.get('window');

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function Listing() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Filter States
  const [showFilter, setShowFilter] = useState(false);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [priceRange, setPriceRange] = useState(10000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Filter products. Note: category param might be lowercase 'shoes', data has 'Shoes'.
  const categoryName = typeof category === 'string' ? category : '';

  // Calculate stats for filters
  const { allBrands, maxProductPrice } = useMemo(() => {
    const categoryProducts = PRODUCTS_COLLECTION.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    );
    
    const brands = Array.from(new Set(categoryProducts.map(p => p.name.split(' ')[0])));
    const maxP = Math.max(...categoryProducts.map(p => p.price), 10000);
    
    return { allBrands: brands, maxProductPrice: maxP };
  }, [categoryName]);

  useEffect(() => {
     // Initial Load
     const loadData = async () => {
       setLoading(true);
       // Simulate network delay
       await new Promise(resolve => setTimeout(resolve, 1500));
       
       const categoryProducts = PRODUCTS_COLLECTION.filter(
         (p) => p.category.toLowerCase() === categoryName.toLowerCase()
       );
       setProducts(categoryProducts);
       setFilteredProducts(categoryProducts);
       setMaxPrice(Math.max(...categoryProducts.map(p => p.price), 10000));
       setPriceRange(Math.max(...categoryProducts.map(p => p.price), 10000));
       setLoading(false);
     };
     loadData();
  }, [categoryName]);

  // Apply Filters
  const applyFilters = () => {
    let result = products;

    // Price Filter
    result = result.filter(p => p.price <= priceRange);

    // Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.name.split(' ')[0]));
    }
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilteredProducts(result);
    setShowFilter(false);
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(prev => prev.filter(b => b !== brand));
    } else {
      setSelectedBrands(prev => [...prev, brand]);
    }
  };

  // handleRemoveProduct removed as we now show all products
  
  // Capitalize category name for header
  const headerTitle = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();

  return (
    <View style={styles.container}>
      <Stack.Screen 
         options={{ 
            title: headerTitle,
            headerTitleStyle: { fontFamily: FONTS.bold, fontSize: 16 },
            headerLeft: () => (
               <Pressable onPress={() => router.back()} style={{ marginLeft: 0 }}>
                  <ChevronLeft color={COLORS.primary} size={24} />
               </Pressable>
            ),
            headerRight: () => (
              <Pressable onPress={() => setShowFilter(true)} style={{ marginRight: 0 }}>
                 <Filter color={COLORS.primary} size={24} />
              </Pressable>
           ),
            headerTintColor: COLORS.primary,
            headerShadowVisible: false,
         }} 
      />
      
      {loading ? (
        <View style={styles.content}>
          <ProductSkeleton />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <ProductCard product={item} index={index} />}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.content}
          ListEmptyComponent={<View style={styles.center}><Text>No products found.</Text></View>}
        />
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilter(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <Pressable onPress={() => setShowFilter(false)}>
                <X color={COLORS.text} size={24} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Price Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Max Price: ₹{priceRange}</Text>
                <Slider
                  style={{width: '100%', height: 40}}
                  minimumValue={0}
                  maximumValue={maxProductPrice}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor="#000000"
                  thumbTintColor={COLORS.primary}
                  step={100}
                />
                <View style={styles.priceLabels}>
                  <Text style={styles.priceText}>₹0</Text>
                  <Text style={styles.priceText}>₹{maxProductPrice}</Text>
                </View>
              </View>

              {/* Brand Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Brands</Text>
                <View style={styles.brandContainer}>
                  {allBrands.map(brand => (
                    <TouchableOpacity
                      key={brand}
                      style={[
                        styles.brandChip,
                        selectedBrands.includes(brand) && styles.brandChipSelected
                      ]}
                      onPress={() => toggleBrand(brand)}
                    >
                      <Text style={[
                        styles.brandText,
                        selectedBrands.includes(brand) && styles.brandTextSelected
                      ]}>{brand}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setPriceRange(maxProductPrice);
                  setSelectedBrands([]);
                }}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SPACING.l,
    borderTopRightRadius: SPACING.l,
    height: height * 0.7,
    padding: SPACING.m,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
  },
  modalBody: {
    flex: 1,
  },
  filterSection: {
    marginBottom: SPACING.xl,
  },
  filterLabel: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceText: {
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  brandContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
  },
  brandChip: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
  },
  brandChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  brandText: {
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  brandTextSelected: {
    color: COLORS.white,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: SPACING.m,
    paddingTop: SPACING.m,
  },
  resetButton: {
    flex: 1,
    padding: SPACING.m,
    borderRadius: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  resetButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  applyButton: {
    flex: 1,
    padding: SPACING.m,
    borderRadius: SPACING.s,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
});
