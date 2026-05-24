import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../assets/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Jalankan animasi secara paralel (Fade In + Scale Up + Slide Up)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 30,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigasi otomatis ke MainTab
    const timer = setTimeout(() => {
      navigation.replace("MainTab");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Gradient Mewah */}
      <LinearGradient
        colors={['#0A1931', '#15305B', '#007BFF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Dekorasi Cahaya Latar Belakang (Subtle Glowing Orbs) */}
        <View style={styles.glowOrbLeft} />
        <View style={styles.glowOrbRight} />

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ]
            }
          ]}
        >
          {/* Nama Brand & Subtitle */}
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>
              Mobil<Text style={styles.brandHighlightText}>Ku</Text>
            </Text>
            <Text style={styles.taglineText}>Sewa Mobil Mudah, Aman, & Cepat</Text>
          </View>

          {/* Indikator Memuat Dinamis */}
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#FFFFFF" style={{ marginBottom: 10 }} />
            <Text style={styles.loaderText}>Menyiapkan kendaraan terbaik...</Text>
          </View>
        </Animated.View>

        {/* Footer Hak Cipta */}
        <Text style={styles.footerText}>Premium Car Rental App</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOrbLeft: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0, 123, 255, 0.15)',
    top: height * 0.1,
    left: -80,
    blurRadius: 50,
  },
  glowOrbRight: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 198, 255, 0.12)',
    bottom: height * 0.15,
    right: -100,
  },
  logoImage: {
    width: 250,
    height: 170,
    marginBottom: 10,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  brandText: {
    fontSize: 40,
    fontFamily: 'Poppins-Bold',
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 123, 255, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  brandHighlightText: {
    color: '#00C6FF',
  },
  taglineText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  loaderContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.5,
  },
  footerText: {
    position: 'absolute',
    bottom: 30,
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 1,
  },
});
