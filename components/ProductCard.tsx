import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { MotiView } from 'moti';
import { COLORS, SPACING, FONTS, SHADOWS } from '../constants/theme';
import { Product } from '../database';
import { Heart } from 'lucide-react-native';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index: number;
  onRemove?: (id: string) => void;
}

export default function ProductCard({ product, index, onRemove }: ProductCardProps) {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If error occurred, return null (or keep hidden until removed by parent)
  if (hasError) return null;

  const handleLoad = () => {
    setIsReady(true);
  };

  const handleError = () => {
    setHasError(true);
    if (onRemove) {
      onRemove(product.id);
    }
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
            onError={handleError} 
          />
          <Pressable style={styles.heart}>
             <Heart size={20} color={COLORS.primary} />
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
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.background,
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
  },
  price: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
});
