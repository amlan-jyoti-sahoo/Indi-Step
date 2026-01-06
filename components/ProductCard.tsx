import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { MotiView } from 'moti';
import { COLORS, SPACING, FONTS, SHADOWS } from '../constants/theme';
import { Product } from '../database';
import { Heart } from 'lucide-react-native';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { toggleWishlist } from '../store/wishlistSlice';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();
  const isLiked = useSelector((state: RootState) => 
    state.wishlist.items.some(item => item.id === product.id)
  );

  const handleLoad = () => {
    setIsReady(true);
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: isReady ? 1 : 0, translateY: isReady ? 0 : 50 }}
      transition={{ type: 'timing', duration: 500, delay: index * 100 }}
      style={styles.container}
    >
      <Link href={`/product/${product.id}`} asChild>
        <Pressable style={styles.card}>
          <Image 
            source={{ uri: product.image }} 
            style={styles.image} 
            contentFit="cover" 
            transition={300}
            onLoad={handleLoad}
          />
          <Pressable style={styles.heart} onPress={handleToggleWishlist}>
             <Heart 
               size={20} 
               color={isLiked ?  COLORS.error : COLORS.primary} 
               fill={isLiked ? COLORS.error : 'transparent'}
             />
          </Pressable>
          <View style={styles.details}>
            <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
            <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
          </View>
        </Pressable>
      </Link>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: SPACING.m,
  },
  card: {
    backgroundColor: COLORS.white, // Ensure white background
    borderRadius: SPACING.m,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.surface,
  },
  heart: {
    position: 'absolute',
    top: SPACING.s,
    right: SPACING.s,
    backgroundColor: COLORS.white, // Ensure white background
    padding: 6,
    borderRadius: 20,
    ...SHADOWS.light,
  },
  details: {
    padding: SPACING.m,
  },
  name: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.text,
  },
  price: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
});
