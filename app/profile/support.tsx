import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS } from '../../constants/theme';
import { ChevronLeft, Mail, Phone, MessageCircle } from 'lucide-react-native';

export default function Support() {
  const router = useRouter();

  const ContactItem = ({ icon: Icon, title, subtitle, onPress }: any) => (
      <Pressable style={styles.contactCard} onPress={onPress}>
          <View style={styles.iconContainer}>
              <Icon size={24} color={COLORS.primary} />
          </View>
          <View>
              <Text style={styles.contactTitle}>{title}</Text>
              <Text style={styles.contactSubtitle}>{subtitle}</Text>
          </View>
      </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Customer Service</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
         <Text style={styles.intro}>How can we help you today?</Text>

         <ContactItem 
            icon={Phone} 
            title="Call Us" 
            subtitle="+91 1800-123-4567" 
            onPress={() => Linking.openURL('tel:+9118001234567')}
         />
         <ContactItem 
            icon={Mail} 
            title="Email Support" 
            subtitle="support@indistep.com" 
            onPress={() => Linking.openURL('mailto:support@indistep.com')}
         />
         <ContactItem 
            icon={MessageCircle} 
            title="Live Chat" 
            subtitle="Chat with our experts" 
            onPress={() => {}}
         />

         <Text style={styles.faqHeader}>Frequently Asked Questions</Text>
         
         <View style={styles.faqItem}>
             <Text style={styles.question}>How do I track my order?</Text>
             <Text style={styles.answer}>Go to Profile {'>'} My Orders to see real-time status updates.</Text>
         </View>
         <View style={styles.faqItem}>
             <Text style={styles.question}>What is the return policy?</Text>
             <Text style={styles.answer}>We offer a 30-day return policy for all unworn shoes in original packaging.</Text>
         </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.m,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
      fontFamily: FONTS.bold,
      fontSize: 18,
      color: COLORS.text,
  },
  content: {
    padding: SPACING.m,
  },
  intro: {
      fontFamily: FONTS.bold,
      fontSize: 22,
      color: COLORS.text,
      marginBottom: SPACING.l,
  },
  contactCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      padding: SPACING.m,
      borderRadius: SPACING.m,
      marginBottom: SPACING.m,
      gap: SPACING.m,
  },
  iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#E6FFFA', // Light Teal
      alignItems: 'center',
      justifyContent: 'center',
  },
  contactTitle: {
      fontFamily: FONTS.bold,
      fontSize: 16,
      color: COLORS.text,
  },
  contactSubtitle: {
      fontFamily: FONTS.regular,
      color: COLORS.textLight,
  },
  faqHeader: {
      fontFamily: FONTS.bold,
      fontSize: 18,
      marginTop: SPACING.l,
      marginBottom: SPACING.m,
  },
  faqItem: {
      marginBottom: SPACING.m,
  },
  question: {
      fontFamily: FONTS.bold,
      fontSize: 16,
      marginBottom: 4,
  },
  answer: {
      fontFamily: FONTS.regular,
      color: COLORS.textLight,
      lineHeight: 20,
  },
});
