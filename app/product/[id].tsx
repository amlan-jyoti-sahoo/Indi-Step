import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { PRODUCTS_COLLECTION } from '../../database';
import { COLORS, SPACING, FONTS, SHADOWS } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView, MotiText } from 'moti';
import { useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withRepeat, withSequence } from 'react-native-reanimated';
import { ChevronLeft, Heart, Share2, Minus, Plus } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, incrementQuantity, decrementQuantity } from '../../store/cartSlice';
import { toggleWishlist } from '../../store/wishlistSlice';
import { RootState } from '../../store/store';

const { width } = Dimensions.get('window');

const SIZES = ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'];

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const product = PRODUCTS_COLLECTION.find((p) => p.id === id);
  const dispatch = useDispatch();
  
  const [selectedSize, setSelectedSize] = useState('US 9');
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  
  // Animation for button pulse
  const buttonScale = useSharedValue(1);

  // Check if item is already in cart
  const cartItem = useSelector((state: RootState) => 
    state.cart.items.find((item) => item.id === id && item.size === selectedSize)
  );
  const isInCart = !!cartItem;

  // Check if item is in wishlist
  const isInWishlist = useSelector((state: RootState) => 
    state.wishlist.items.some((item) => item.id === id)
  );

  const handleToggleWishlist = () => {
    if (product) {
        dispatch(toggleWishlist(product));
    }
  };

  const handleAddToCart = () => {
    buttonScale.value = withSequence(
      withSpring(0.9),
      withSpring(1.1),
      withSpring(1)
    );
    if (product && !isInCart) {
        dispatch(addToCart({ product, size: selectedSize }));
    }
  };

  const handleIncrement = () => {
    if (product) dispatch(incrementQuantity({ id: product.id, size: selectedSize }));
  };

  const handleDecrement = () => {
    if (product) dispatch(decrementQuantity({ id: product.id, size: selectedSize }));
  };

  const handleGoToCart = () => {
      router.push('/(tabs)/cart');
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  if (!product) return <View style={styles.center}><Text>Product not found</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header Actions */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <ChevronLeft color={COLORS.primary} size={24} />
          </Pressable>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconButton}>
              <Share2 color={COLORS.primary} size={24} />
            </Pressable>
            <Pressable style={[styles.iconButton, { marginLeft: SPACING.s }]} onPress={handleToggleWishlist}>
              <Heart 
                color={isInWishlist ? COLORS.error : COLORS.primary} 
                fill={isInWishlist ? COLORS.error : 'transparent'}
                size={24} 
              />
            </Pressable>
          </View>
        </View>

        {/* Image Carousel (Single Image for now as per data) */}
        <MotiView 
          from={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
          style={styles.imageContainer}
        >
          <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
        </MotiView>

        {/* Info */}
        <View style={styles.infoContainer}>
          <MotiText 
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={styles.category}
          >{product.category}</MotiText>
          
          <MotiText 
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 100 }}
            style={styles.name}
          >{product.name}</MotiText>
          
          <MotiText 
             from={{ opacity: 0, translateY: 20 }}
             animate={{ opacity: 1, translateY: 0 }}
             transition={{ delay: 200 }}
             style={styles.price}
          >₹{product.price.toLocaleString('en-IN')}</MotiText>

          {/* Size Selector */}
          <MotiView 
            from={{ opacity: 0, translateY: 20 }}
             animate={{ opacity: 1, translateY: 0 }}
             transition={{ delay: 300 }}
             style={styles.section}
          >
            <Text style={styles.sectionTitle}>Select Size</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {SIZES.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <Pressable 
                    key={size} 
                    onPress={() => setSelectedSize(size)}
                    style={[
                      styles.sizeCircle, 
                      isSelected && styles.selectedSize
                    ]}
                  >
                    <Text style={[styles.sizeText, isSelected && styles.selectedSizeText]}>{size}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </MotiView>

          {/* Description */}
          <MotiView 
              from={{ opacity: 0, translateY: 20 }}
             animate={{ opacity: 1, translateY: 0 }}
             transition={{ delay: 400 }}
             style={styles.descriptionSection}
          >
             <Pressable onPress={() => setDescriptionExpanded(!descriptionExpanded)} style={styles.row}>
                <Text style={styles.sectionTitle}>Description</Text>
                <MotiView animate={{ rotate: descriptionExpanded ? '90deg' : '0deg' }}>
                  <ChevronLeft size={20} color={COLORS.primary} style={{ transform: [{ rotate: '180deg' }]}} />
                </MotiView>
             </Pressable>
             <MotiView animate={{ height: descriptionExpanded ? 'auto' : 60, overflow: 'hidden' }}>
               <Text style={styles.descriptionText}>{product.description}</Text>
             </MotiView>
             {!descriptionExpanded && <Text style={styles.readMore}>Tap to read more</Text>}
          </MotiView>

        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <Animated.View style={[styles.addToCartContainer, buttonStyle]}>
           {isInCart ? (
               <View style={styles.actionRow}>
                   <Pressable style={styles.goToCartButton} onPress={handleGoToCart}>
                       <Text style={styles.goToCartText}>Go to Cart</Text>
                   </Pressable>
                   
                   <View style={styles.quantityControl}>
                       <Pressable onPress={handleDecrement} style={styles.qtyBtn}>
                           <Minus size={20} color={COLORS.text} />
                       </Pressable>
                       <Text style={styles.qtyText}>{cartItem.quantity}</Text>
                       <Pressable onPress={handleIncrement} style={styles.qtyBtn}>
                           <Plus size={20} color={COLORS.text} />
                       </Pressable>
                   </View>
               </View>
           ) : (
               <Pressable style={styles.addToCartButton} onPress={handleAddToCart}>
                 <Text style={styles.addToCartText}>Add to Cart - ₹{product.price.toLocaleString('en-IN')}</Text>
               </Pressable>
           )}
        </Animated.View>
      </SafeAreaView>
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingTop: 60, // approximate for transparent header
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  imageContainer: {
    width: width,
    height: 400,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: SPACING.l,
  },
  category: {
    color: COLORS.textLight,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: '900',
    marginBottom: SPACING.s,
    color: COLORS.text,
  },
  price: {
    fontSize: 24,
    fontFamily: FONTS.regular,
    marginBottom: SPACING.l,
    color: COLORS.text,
  },
  section: {
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.m,
  },
  sizeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
    backgroundColor: COLORS.background,
  },
  selectedSize: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedSizeText: {
    color: COLORS.secondary,
  },
  descriptionSection: {
    marginBottom: SPACING.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  readMore: {
    color: COLORS.primary,
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.l,
  },
  addToCartContainer: {
    width: '100%',
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.m,
  },
  goToCartButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 6,
    borderRadius: 30,
    height: 60,
  },
  qtyBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: SPACING.m,
    minWidth: 20,
    textAlign: 'center',
  },
  addToCartText: {
    color: COLORS.secondary,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  goToCartText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
