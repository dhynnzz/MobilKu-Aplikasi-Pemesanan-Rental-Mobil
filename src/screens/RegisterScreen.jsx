import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, User, Phone, Mail, Lock } from 'lucide-react-native';
import { supabase } from '../libs/supabase';
import { colors } from '../../assets/theme';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !phone || !email || !password) {
      Alert.alert("Input Kosong", "Semua kolom wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      // Menandai bahwa kita sedang dalam proses registrasi agar Router.jsx tidak memindahkan layar ke Beranda
      await AsyncStorage.setItem('isRegistering', 'true');

      // 1. Mendaftarkan akun di Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (authError) throw authError;

      // 2. Menyimpan data profil tambahan ke tabel public.users
      if (authData?.user) {
        const { error: dbError } = await supabase.from('users').insert([{
          id: authData.user.id,
          name: name,
          email: email.trim(),
          phone: phone,
          avatar: 'https://i.pravatar.cc/100' // Default avatar
        }]);

        if (dbError) throw dbError;
      }

      // 3. Memaksa keluar (Sign Out) agar tidak otomatis masuk ke Beranda
      await supabase.auth.signOut();

      Alert.alert("Registrasi Berhasil", "Akun Anda telah berhasil dibuat! Silakan masuk kembali dengan email Anda.", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);
    } catch (error) {
      Alert.alert("Registrasi Gagal", error.message);
    } finally {
      await AsyncStorage.removeItem('isRegistering');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#0A1931', '#15305B', '#007BFF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              
              {/* Header Branding */}
              <View style={styles.brandContainer}>
                <Text style={styles.brandText}>
                  Mobil<Text style={styles.brandHighlightText}>Ku</Text>
                </Text>
                <Text style={styles.taglineText}>Buat akun baru Anda</Text>
              </View>

              {/* Form Card */}
              <View style={styles.formCard}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nama Lengkap</Text>
                  <View style={styles.inputContainer}>
                    <User color="#9CA3AF" size={20} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Masukkan nama Anda"
                      placeholderTextColor="#9CA3AF"
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nomor Telepon</Text>
                  <View style={styles.inputContainer}>
                    <Phone color="#9CA3AF" size={20} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Contoh: 081234567890"
                      placeholderTextColor="#9CA3AF"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Mail color="#9CA3AF" size={20} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Masukkan email"
                      placeholderTextColor="#9CA3AF"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputContainer}>
                    <Lock color="#9CA3AF" size={20} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Buat password (min. 6 karakter)"
                      placeholderTextColor="#9CA3AF"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                      {showPassword ? <Eye color="#9CA3AF" size={20} /> : <EyeOff color="#9CA3AF" size={20} />}
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.registerBtn} 
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.registerBtnText}>Daftar Sekarang</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Sudah punya akun? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Masuk di sini</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
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
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 54,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#111827',
  },
  eyeIcon: {
    padding: 8,
    marginRight: -8,
  },
  registerBtn: {
    backgroundColor: '#007BFF',
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  registerBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#6B7280',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  loginLink: {
    color: '#007BFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
});
