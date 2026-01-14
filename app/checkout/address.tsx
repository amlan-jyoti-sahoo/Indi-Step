import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS } from '../../constants/theme';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react-native';

export default function Address() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');

  const handleNext = () => {
    if (!name || !street || !city || !zip || !phone) {
      Alert.alert('Missing Details', 'Please fill in all address fields.');
      return;
    }

    // Pass address data to next screen via query params, or use a context/store. 
    // For simplicity, passing via params stringified.
    const addressData = JSON.stringify({ name, street, city, zip, phone });
    
    router.push({
        pathname: '/checkout/payment',
        params: { address: addressData }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Shipping Address</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
           <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your full name" 
              placeholderTextColor={COLORS.textLight}
              value={name}
              onChangeText={setName}
              autoCorrect={false}
              spellCheck={false}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter 10-digit number" 
              placeholderTextColor={COLORS.textLight}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street Address</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter street address" 
              placeholderTextColor={COLORS.textLight}
              value={street}
              onChangeText={setStreet}
            />
          </View>

          <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>City</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Enter city" 
                  placeholderTextColor={COLORS.textLight}
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>ZIP Code</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Enter 6-digit PIN" 
                  placeholderTextColor={COLORS.textLight}
                  value={zip}
                  onChangeText={setZip}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
          <Pressable style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Proceed to Payment</Text>
          </Pressable>
      </View>
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
  },
  headerTitle: {
      fontFamily: FONTS.bold,
      fontSize: 18,
      color: COLORS.text,
  },
  content: {
    padding: SPACING.l,
  },
  form: {
    gap: SPACING.l,
  },
  inputGroup: {
    gap: SPACING.xs,
  },
  row: {
      flexDirection: 'row',
      gap: SPACING.m,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.s,
    padding: SPACING.m,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footer: {
      padding: SPACING.m,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      backgroundColor: COLORS.background,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONTS.bold,
    color: COLORS.white,
    fontSize: 16,
  },
});
