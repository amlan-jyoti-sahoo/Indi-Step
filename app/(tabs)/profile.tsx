import { View, Text, StyleSheet, ScrollView, Pressable, Image as RNImage } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { COLORS, SPACING, FONTS, SIZES, SHADOWS } from '../../constants/theme';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/authSlice';
import { useRouter, Link } from 'expo-router';
import { Settings, CreditCard, ShoppingBag, Heart, MapPin, HelpCircle, ChevronRight, LogOut, Package, User as UserIcon } from 'lucide-react-native';

export default function Profile() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(tabs)/profile');
  };

  const MenuItem = ({ icon: Icon, title, subtitle, onPress, href }: { icon: any, title: string, subtitle?: string, onPress?: () => void, href?: string }) => {
    const content = (
        <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
                <Icon size={24} color={COLORS.text} />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{title}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            <ChevronRight size={20} color={COLORS.textLight} />
        </View>
    );

    if (href) {
        return (
            <Link href={href} asChild>
                <Pressable>{content}</Pressable>
            </Link>
        );
    }
    return <Pressable onPress={onPress}>{content}</Pressable>;
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
           {/* Guest Header */}
           <View style={styles.guestHeader}>
               <Text style={styles.guestTitle}>JOIN THE CLUB</Text>
               <Text style={styles.guestSubtitle}>Get free delivery, exclusive deals, and more.</Text>
               
               <View style={styles.guestButtons}>
                   <Link href="/auth/signup" asChild>
                       <Pressable style={styles.primaryButton}>
                           <Text style={styles.primaryButtonText}>SIGN UP FOR FREE</Text>
                           <ChevronRight size={20} color={COLORS.white} />
                       </Pressable>
                   </Link>
                   <Link href="/auth/login" asChild>
                       <Pressable style={styles.secondaryButton}>
                           <Text style={styles.secondaryButtonText}>LOG IN</Text>
                       </Pressable>
                   </Link>
               </View>
           </View>

           {/* Guest Benefits */}
           <View style={styles.benefitsSection}>
               <View style={styles.benefitItem}>
                   <ShoppingBag size={24} color={COLORS.primary} />
                   <Text style={styles.benefitText}>Exclusive Products</Text>
               </View>
               <View style={styles.benefitItem}>
                   <Package size={24} color={COLORS.primary} />
                   <Text style={styles.benefitText}>Express Delivery</Text>
               </View>
               <View style={styles.benefitItem}>
                   <Heart size={24} color={COLORS.primary} />
                   <Text style={styles.benefitText}>Wishlist Access</Text>
               </View>
           </View>
           
           {/* Settings for Guest */}
           <View style={styles.section}>
             <Text style={styles.sectionTitle}>SETTINGS</Text>
             <MenuItem icon={Settings} title="App Settings" href="/profile/settings" />
             <MenuItem icon={HelpCircle} title="Help & Support" href="/profile/support" />
           </View>

        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Header */}
        <View style={styles.userHeader}>
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
            </View>
            <View>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userLevel}>{user?.memberLevel} Member</Text>
            </View>
        </View>

        {/* Dashboard Grid */}
        <View style={styles.dashboardGrid}>
            <Link href="/wishlist" asChild>
                <Pressable style={styles.gridItem}>
                    <Heart size={24} color={COLORS.primary} />
                    <Text style={styles.gridText}>Wishlist</Text>
                </Pressable>
            </Link>
            <Link href="/orders" asChild>
                <Pressable style={styles.gridItem}>
                    <Package size={24} color={COLORS.primary} />
                    <Text style={styles.gridText}>Orders</Text>
                </Pressable>
            </Link>
            <Link href="/profile/payments" asChild>
                <Pressable style={styles.gridItem}>
                    <CreditCard size={24} color={COLORS.primary} />
                    <Text style={styles.gridText}>Payment</Text>
                </Pressable>
            </Link>
            <Link href="/profile/addresses" asChild>
                <Pressable style={styles.gridItem}>
                    <MapPin size={24} color={COLORS.primary} />
                    <Text style={styles.gridText}>Address</Text>
                </Pressable>
            </Link>

        </View>

        {/* Account Menu */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>MY ACCOUNT</Text>
            <MenuItem icon={Package} title="Order History" subtitle="View all past orders" href="/orders" />
            <MenuItem icon={UserIcon} title="Personal Details" href="/profile/details" />
            <MenuItem icon={MapPin} title="Address Book" href="/profile/addresses" />
            <MenuItem icon={CreditCard} title="Payment Methods" href="/profile/payments" />
        </View>

        {/* Support Menu */}
        <View style={styles.section}>
             <Text style={styles.sectionTitle}>SUPPORT</Text>
             <MenuItem icon={HelpCircle} title="Customer Service" href="/profile/support" />
             <MenuItem icon={Settings} title="Settings" href="/profile/settings" />
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.m,
    paddingBottom: 100, // Space for tab bar
  },
  // Guest Styles
  guestHeader: {
      paddingVertical: SPACING.xl,
      gap: SPACING.m,
  },
  guestTitle: {
      fontFamily: FONTS.bold,
      fontSize: 32,
      color: COLORS.text,
      textTransform: 'uppercase',
      lineHeight: 36,
  },
  guestSubtitle: {
      fontFamily: FONTS.regular,
      fontSize: 16,
      color: COLORS.textLight,
      marginBottom: SPACING.m,
  },
  guestButtons: {
      gap: SPACING.m,
  },
  primaryButton: {
      backgroundColor: COLORS.text,
      padding: SPACING.m,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: SPACING.s,
  },
  primaryButtonText: {
      fontFamily: FONTS.bold,
      color: COLORS.white,
      fontSize: 16,
      letterSpacing: 1,
  },
  secondaryButton: {
      borderWidth: 1,
      borderColor: COLORS.text,
      padding: SPACING.m,
      alignItems: 'center',
      borderRadius: SPACING.s,
  },
  secondaryButtonText: {
      fontFamily: FONTS.bold,
      color: COLORS.text,
      fontSize: 16,
      letterSpacing: 1,
  },
  benefitsSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: SPACING.xl,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      marginBottom: SPACING.xl,
  },
  benefitItem: {
      alignItems: 'center',
      gap: SPACING.xs,
  },
  benefitText: {
      fontFamily: FONTS.medium,
      fontSize: 12,
      color: COLORS.text,
  },
  
  // User Styles
  userHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.m,
      marginBottom: SPACING.xl,
  },
  avatarContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
  },
  avatarText: {
      fontFamily: FONTS.bold,
      fontSize: 24,
      color: COLORS.white,
  },
  userName: {
      fontFamily: FONTS.bold,
      fontSize: 20,
      color: COLORS.text,
  },
  userLevel: {
      fontFamily: FONTS.medium,
      fontSize: 14,
      color: COLORS.textLight,
  },
  dashboardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.m,
      marginBottom: SPACING.xl,
  },
  gridItem: {
      width: '47%',
      backgroundColor: COLORS.surface,
      padding: SPACING.m,
      borderRadius: SPACING.m,
      alignItems: 'center',
      gap: SPACING.s,
      ...SHADOWS.light,
  },
  gridText: {
      fontFamily: FONTS.medium,
      color: COLORS.text,
  },
  
  // Menu Styles
  section: {
      marginBottom: SPACING.xl,
  },
  sectionTitle: {
      fontFamily: FONTS.bold,
      fontSize: 14,
      color: COLORS.textLight,
      marginBottom: SPACING.m,
      letterSpacing: 1,
  },
  menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.m,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
  },
  menuIconContainer: {
      width: 40,
      alignItems: 'flex-start',
  },
  menuTextContainer: {
      flex: 1,
  },
  menuTitle: {
      fontFamily: FONTS.medium,
      fontSize: 16,
      color: COLORS.text,
  },
  menuSubtitle: {
      fontFamily: FONTS.regular,
      fontSize: 12,
      color: COLORS.textLight,
  },
  logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPACING.l,
      gap: SPACING.s,
      marginTop: SPACING.m,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: SPACING.s,
  },
  logoutText: {
      fontFamily: FONTS.bold,
      color: COLORS.text,
      fontSize: 16,
  },
  versionText: {
      textAlign: 'center',
      marginTop: SPACING.l,
      color: COLORS.textLight,
      fontSize: 12,
      fontFamily: FONTS.regular,
  },
});
