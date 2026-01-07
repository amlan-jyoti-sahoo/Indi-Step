import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS } from '../../constants/theme';
import { CheckCircle2, ShoppingBag } from 'lucide-react-native';

export default function Success() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CheckCircle2 size={100} color={COLORS.primary} />
        
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>Thank you for your purchase. We have received your order and it is being processed.</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.info}>You can track your order status in your profile.</Text>

        <Pressable style={styles.primaryButton} onPress={() => router.replace('/orders')}>
            <Text style={styles.primaryButtonText}>View My Orders</Text>
        </Pressable>
        
        <Pressable style={styles.secondaryButton} onPress={() => router.replace('/(tabs)/')}>
            <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
      width: '85%',
      backgroundColor: COLORS.surface,
      padding: SPACING.xl,
      borderRadius: SPACING.l,
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
  },
  title: {
      fontFamily: FONTS.bold,
      fontSize: 24,
      color: COLORS.text,
      marginTop: SPACING.l,
      marginBottom: SPACING.s,
  },
  subtitle: {
      fontFamily: FONTS.regular,
      fontSize: 14,
      color: COLORS.textLight,
      textAlign: 'center',
      marginBottom: SPACING.l,
      lineHeight: 20,
  },
  divider: {
      width: '100%',
      height: 1,
      backgroundColor: COLORS.border,
      marginVertical: SPACING.m,
  },
  info: {
      fontFamily: FONTS.medium,
      fontSize: 14,
      color: COLORS.text,
      textAlign: 'center',
      marginBottom: SPACING.xl,
  },
  primaryButton: {
      backgroundColor: COLORS.primary,
      width: '100%',
      padding: SPACING.m,
      borderRadius: SPACING.s,
      alignItems: 'center',
      marginBottom: SPACING.m,
  },
  primaryButtonText: {
      fontFamily: FONTS.bold,
      color: COLORS.white,
      fontSize: 16,
  },
  secondaryButton: {
      padding: SPACING.s,
  },
  secondaryButtonText: {
      fontFamily: FONTS.bold,
      color: COLORS.textLight,
      fontSize: 16,
  },
});
