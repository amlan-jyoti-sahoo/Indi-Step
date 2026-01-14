import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS } from '../../constants/theme';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import { ChevronLeft } from 'lucide-react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const params = useLocalSearchParams();
  const redirect = params.redirect as string;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data() as any;
            if (!userData.id) userData.id = uid; 
            
            dispatch(login(userData));
            
            if (redirect) {
                router.replace(redirect as any);
            } else {
                router.replace('/(tabs)/profile');
            }
        } else {
            // User exists in Auth but not in Firestore (e.g. manually created or legacy)
            // Create default profile
            const newUser = {
                id: uid,
                name: 'User', // Default name
                email: email,
                memberLevel: 'Silver',
                joinedDate: new Date().toISOString(),
                addresses: [],
                savedCards: []
            };
            
            await setDoc(doc(db, "users", uid), newUser);
            dispatch(login(newUser));
            
            if (redirect) {
                router.replace(redirect as any);
            } else {
                router.replace('/(tabs)/profile');
            }
        }
    } catch (error: any) {
        Alert.alert('Login Failed', error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color={COLORS.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to access your account and orders.</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your email" 
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your password" 
              placeholderTextColor={COLORS.textLight}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Pressable 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push('/auth/signup')}>
              <Text style={styles.link}>Sign Up</Text>
            </Pressable>
          </View>
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
  },
  content: {
    padding: SPACING.l,
    paddingTop: SPACING.xl,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
  form: {
    gap: SPACING.l,
  },
  inputGroup: {
    gap: SPACING.xs,
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
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: SPACING.s,
    alignItems: 'center',
    marginTop: SPACING.m,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: FONTS.bold,
    color: COLORS.white,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.m,
  },
  footerText: {
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  link: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});
