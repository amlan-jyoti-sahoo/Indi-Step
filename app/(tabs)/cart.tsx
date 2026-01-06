import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export default function Cart() {
  const count = useSelector((state: RootState) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
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
