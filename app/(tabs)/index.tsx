import { LayoutAnimation, Platform, UIManager, View, Text, ScrollView, StyleSheet, Pressable, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { COLORS, SPACING, FONTS, SIZES } from '../../constants/theme';
import { Database } from '../../database/service';
import ProductCard from '../../components/ProductCard';
import { MotiView, MotiText } from 'moti';
import { useEffect, useState } from 'react';
import { Product, Category } from '../../database';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Heart, ShoppingBag, Search } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing
} from 'react-native-reanimated';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const KenBurnsImage = ({ uri, isVisible }: { uri: string, isVisible: boolean }) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      scale.value = 1.2; 
      translateX.value = 0;
      translateY.value = 0;
      opacity.value = 0;

      const duration = Math.floor(Math.random() * 5000) + 5000;
      const endScale = 1.4 + Math.random() * 0.3;
      const moveX = (Math.random() - 0.5) * 50;
      const moveY = (Math.random() - 0.5) * 50;

      opacity.value = withTiming(1, { duration: 1000 });
      scale.value = withTiming(endScale, { duration, easing: Easing.linear });
      translateX.value = withTiming(moveX, { duration, easing: Easing.linear });
      translateY.value = withTiming(moveY, { duration, easing: Easing.linear });
    } else {
      opacity.value = withTiming(0, { duration: 1000 });
    }
  }, [isVisible, uri]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value }
    ]
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
       <Image source={{ uri }} style={styles.heroImage} contentFit="cover" transition={1000} />
    </Animated.View>
  );
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (products.length < 2) return;
    const intervalId = setInterval(() => {
       const nextIndex = Math.floor(Math.random() * products.length);
       setCurrentImageIndex(nextIndex);
    }, 6000);
    return () => clearInterval(intervalId);
  }, [products]);
  
  const cartCount = useSelector((state: RootState) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useSelector((state: RootState) => state.wishlist.items.length);

  useEffect(() => {
    // Simulate fetching
    Promise.all([Database.getProducts(), Database.getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
    });
  }, []);

  const handleRemoveProduct = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <MotiText 
            from={{ opacity: 0, translateY: -10 }} 
            animate={{ opacity: 1, translateY: 0 }} 
            key="logo"
            style={styles.logo}
          >
            INDI-STEP.
          </MotiText>
          
          <View style={styles.headerIcons}>
             <Link href="/listing/all" asChild>
               <Pressable style={styles.iconButton}>
                 <Search size={24} color={COLORS.text} />
               </Pressable>
             </Link>
             <Link href="/wishlist" asChild>
               <Pressable style={styles.iconButton}>
                 <Heart size={24} color={COLORS.text} />
                 {wishlistCount > 0 && (
                   <View style={styles.badge}>
                     <Text style={styles.badgeText}>{wishlistCount}</Text>
                   </View>
                 )}
               </Pressable>
             </Link>
             <Link href="/cart" asChild>
               <Pressable style={styles.iconButton}>
                 <ShoppingBag size={24} color={COLORS.text} />
                 {cartCount > 0 && (
                   <View style={styles.badge}>
                     <Text style={styles.badgeText}>{cartCount}</Text>
                   </View>
                 )}
               </Pressable>
             </Link>
          </View>
        </View>




  
        {/* Hero Section */}
        <View style={styles.hero}>
           {products.length > 0 ? (
             <>

               {products.map((p, index) => (
                 <KenBurnsImage 
                    key={p.id} 
                    uri={p.image} 
                    isVisible={index === currentImageIndex} 
                 />
               ))}
             </>
           ) : (
             <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }} 
                style={styles.heroImage} 
                contentFit="cover"
              />
           )}

          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>NEW SEASON</Text>
            <Link href="/listing/all" asChild>
                <Pressable style={styles.heroButton}>
                <Text style={styles.heroButtonText}>Shop Now</Text>
                </Pressable>
            </Link>
          </View>
        </View>



        {/* Categories (Grid) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat, index) => (
              <Link key={cat.id} href={`/listing/${cat.id}`} asChild>
                <Pressable style={styles.categoryGridItem}>
                  <MotiView 
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 100 }}
                    style={styles.categoryCard}
                  >
                    <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                    <View style={styles.categoryOverlay}>
                       <Text style={styles.categoryName}>{cat.name}</Text>
                    </View>
                  </MotiView>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        {/* Spacer for Floating Tab Bar */}
        <View style={{ height: 100 }} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.primary,
    borderRadius: 10, // Use explicit number for perfect circle fallback
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  logo: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: '900',
    letterSpacing: 1,
  },
  hero: {
    height: 400,
    marginHorizontal: SPACING.m,
    borderRadius: SPACING.l,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
    padding: SPACING.l,
  },
  heroTitle: {
    color: COLORS.secondary,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: SPACING.m,
  },
  heroButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: SPACING.m,
    marginBottom: SPACING.m,
  },
  horizontalScroll: {
    paddingLeft: SPACING.m,
  },
  horizontalProductCard: {
    width: 260,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.m,
    justifyContent: 'space-between',
  },
  categoryGridItem: {
    width: '48%', // Grid column width
    marginBottom: SPACING.m,
  },
  categoryCard: {
    width: '100%',
    height: 180,
    borderRadius: SPACING.m,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    color: COLORS.secondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
