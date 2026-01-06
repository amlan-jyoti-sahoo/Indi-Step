import { View, StyleSheet, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { COLORS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - SPACING.m * 1.5;

const SkeletonItem = () => {
  return (
    <MotiView
      from={{ opacity: 0.5 }}
      animate={{ opacity: 0.9 }}
      transition={{ type: 'timing', duration: 1000, loop: true }}
      style={styles.card}
    >
      <View style={styles.imagePlaceholder} />
      <View style={styles.textPlaceholder} />
      <View style={[styles.textPlaceholder, { width: '60%' }]} />
    </MotiView>
  );
};

export default function ProductSkeleton() {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6].map((key) => (
        <SkeletonItem key={key} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: COLUMN_WIDTH,
    marginBottom: SPACING.m,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.s,
    overflow: 'hidden',
    padding: SPACING.s,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#E0E0E0',
    borderRadius: SPACING.s,
    marginBottom: SPACING.s,
  },
  textPlaceholder: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: SPACING.xs,
    width: '90%',
  },
});
