import { Tabs } from 'expo-router';
import { ShoppingBag, Home, User } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import TabBar from '../../components/TabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.textLight,
        // Hide standard style as we use custom
        tabBarStyle: {
            display: 'none', 
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => <Home size={size || 24} color={color} strokeWidth={focused ? 3 : 2} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color, size, focused }) => <ShoppingBag size={size || 24} color={color} strokeWidth={focused ? 3 : 2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => <User size={size || 24} color={color} strokeWidth={focused ? 3 : 2} />,
        }}
      />
    </Tabs>
  );
}
