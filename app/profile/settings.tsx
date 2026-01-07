import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS } from '../../constants/theme';
import { ChevronLeft, Moon, Bell, Shield, Info } from 'lucide-react-native';
import { useState } from 'react';

export default function Settings() {
  const router = useRouter();
  
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const SettingItem = ({ icon: Icon, title, type = 'arrow', value, onValueChange }: any) => (
      <View style={styles.item}>
          <View style={styles.itemLeft}>
              <Icon size={22} color={COLORS.text} />
              <Text style={styles.itemTitle}>{title}</Text>
          </View>
          {type === 'switch' ? (
              <Switch 
                  value={value} 
                  onValueChange={onValueChange} 
                  trackColor={{false: COLORS.border, true: COLORS.primary}}
              />
          ) : (
              <ChevronLeft size={16} color={COLORS.textLight} style={{transform: [{rotate: '180deg'}]}} />
          )}
      </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.content}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <SettingItem 
              icon={Bell} 
              title="Push Notifications" 
              type="switch" 
              value={notifications} 
              onValueChange={setNotifications} 
          />
          <SettingItem 
              icon={Moon} 
              title="Dark Mode" 
              type="switch" 
              value={darkMode} 
              onValueChange={setDarkMode} 
          />
          
          <Text style={styles.sectionTitle}>PRIVACY & SECURITY</Text>
          <SettingItem icon={Shield} title="Privacy Policy" />
          <SettingItem icon={Info} title="Terms of Service" />
          
          <Text style={styles.version}>Version 1.0.0</Text>
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
  sectionTitle: {
      fontFamily: FONTS.bold,
      fontSize: 14,
      color: COLORS.textLight,
      marginTop: SPACING.l,
      marginBottom: SPACING.m,
  },
  item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SPACING.m,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
  },
  itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.m,
  },
  itemTitle: {
      fontFamily: FONTS.medium,
      fontSize: 16,
      color: COLORS.text,
  },
  version: {
      textAlign: 'center',
      marginTop: SPACING.xl,
      color: COLORS.textLight,
  },
});
