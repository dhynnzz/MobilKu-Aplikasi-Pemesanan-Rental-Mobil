import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, CalendarCheck, Clock, User } from 'lucide-react-native';
import { colors } from '../../assets/theme';
import { getSettings } from '../Data/settings';
import { translate } from '../Data/translations';

import HomeScreen from '../screens/HomeScreen';
import BookingsScreen from '../screens/BookingsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditBookingScreen from '../screens/EditBookingScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { supabase } from '../libs/supabase';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const settings = getSettings();
        const activeLang = settings.language;
        let label = 'Home';
        if (route.name === 'Home') label = translate('homeTab', activeLang);
        else if (route.name === 'Booking') label = translate('bookingTab', activeLang);
        else if (route.name === 'Riwayat') label = translate('historyTab', activeLang);
        else if (route.name === 'Profil') label = translate('profileTab', activeLang);

        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarHideOnKeyboard: true,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: colors.blue,
          tabBarInactiveTintColor: '#B0B0B0',
          tabBarLabel: label,
          tabBarIcon: ({ focused, color, size }) => {
            const iconSize = 22;

            // Wrapper untuk dot indicator
            const IconWrapper = ({ children }) => (
              <View style={styles.iconWrapper}>
                {children}
                {focused && <View style={styles.activeDot} />}
              </View>
            );

            if (route.name === 'Home') {
              return (
                <IconWrapper>
                  <Home size={iconSize} color={color} strokeWidth={focused ? 2.5 : 1.8} />
                </IconWrapper>
              );
            }
            if (route.name === 'Booking') {
              return (
                <IconWrapper>
                  <CalendarCheck size={iconSize} color={color} strokeWidth={focused ? 2.5 : 1.8} />
                </IconWrapper>
              );
            }
            if (route.name === 'Riwayat') {
              return (
                <IconWrapper>
                  <Clock size={iconSize} color={color} strokeWidth={focused ? 2.5 : 1.8} />
                </IconWrapper>
              );
            }
            if (route.name === 'Profil') {
              return (
                <IconWrapper>
                  <User size={iconSize} color={color} strokeWidth={focused ? 2.5 : 1.8} />
                </IconWrapper>
              );
            }
          },
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Booking" component={BookingsScreen} />
      <Tab.Screen name="Riwayat" component={HistoryScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function Router() {
  const [session, setSession] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Jalankan pengecekan session dan timer 2.5 detik secara paralel
    Promise.all([
      supabase.auth.getSession(),
      new Promise(resolve => setTimeout(resolve, 2500))
    ]).then(([ { data: { session } } ]) => {
      setSession(session);
      setIsLoading(false);
    });

    let authTimeout;
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // Cek apakah sedang dalam proses registrasi
      const isRegistering = await AsyncStorage.getItem('isRegistering');
      if (isRegistering === 'true') {
        return; // Abaikan perubahan navigasi saat proses daftar agar tidak kelap-kelip
      }
      
      clearTimeout(authTimeout);
      authTimeout = setTimeout(() => {
        setSession(session);
      }, 100);
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
      clearTimeout(authTimeout);
    };
  }, []);

  if (isLoading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session && session.user ? (
        <>
          <Stack.Screen name="MainTab" component={MainTab} />
          <Stack.Screen name="EditBooking" component={EditBookingScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 68,
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
    paddingTop: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,

    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.blue,
    marginTop: 4,
  },
});
