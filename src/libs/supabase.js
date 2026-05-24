import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// =========================================================================
// KONFIGURASI KREDENSIAL CLOUD SUPABASE
// =========================================================================
// Silakan salin URL dan Anon Key dari dasbor proyek Supabase Anda:
// Project Settings -> API -> Project URL & Project API keys (anon public)
// =========================================================================
const supabaseUrl = 'https://umbsemyayhnlmymukryg.supabase.co';
const supabaseAnonKey = 'sb_publishable_DdT5yLyq87rTpqLqCe7_og_kbIHprMB';

// Hybrid Storage Adapter: Mencegah crash jika module native AsyncStorage null/error di Expo Go
const inMemoryStorage = {};
const safeStorage = {
  getItem: async (key) => {
    try {
      const val = await AsyncStorage.getItem(key);
      return val;
    } catch (e) {
      console.warn("AsyncStorage.getItem failed, using fallback:", e);
      return inMemoryStorage[key] || null;
    }
  },
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn("AsyncStorage.setItem failed, using fallback:", e);
      inMemoryStorage[key] = value;
    }
  },
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn("AsyncStorage.removeItem failed, using fallback:", e);
      delete inMemoryStorage[key];
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: safeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
