import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useCart } from '../../context/CartContext';

export default function Cart() {
  const { count } = useCart();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cart ({count})</Text>
      <Text style={styles.subText}>This is a dummy cart screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  subText: {
    marginTop: 10,
    color: COLORS.textLight,
  },
});
