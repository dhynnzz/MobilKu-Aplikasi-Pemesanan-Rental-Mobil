import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, LogOut, Settings, Heart, Bell, HelpCircle, User } from 'lucide-react-native';
import { colors } from '../../assets/theme'; // Pastikan colors.blue tersedia

export default function ProfileScreen() {
  const MenuItem = ({ icon: Icon, title, isLogout = false }) => (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconBox, isLogout && { backgroundColor: '#FFF5F5' }]}>
          <Icon color={isLogout ? '#FF5252' : colors.blue} size={20} />
        </View>
        <Text style={[styles.menuTitle, isLogout && { color: '#FF5252' }]}>{title}</Text>
      </View>
      {!isLogout && <ChevronRight color="#D1D1D1" size={18} />}
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={{ uri: "https://i.pravatar.cc/100" }} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.name}>Ejakkk</Text>
          <Text style={styles.email}>Ejakk123@gmail.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akun & Pengaturan</Text>
          <View style={styles.menuGroup}>
            <MenuItem icon={User} title="Ubah Profil" />
            <MenuItem icon={Bell} title="Notifikasi" />
            <MenuItem icon={Settings} title="Pengaturan Aplikasi" />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktivitas</Text>
          <View style={styles.menuGroup}>
            <MenuItem icon={Heart} title="Mobil Favorit" />
          </View>
        </View>

        {/* GRUP MENU 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bantuan</Text>
          <View style={styles.menuGroup}>
            <MenuItem icon={HelpCircle} title="Pusat Bantuan" />
            <MenuItem icon={LogOut} title="Keluar Akun" isLogout={true} />
          </View>
        </View>
        <Text style={styles.version}>MobilKu v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomWidth: 8,
    borderBottomColor: '#F8F9FA', // Pemisah halus antara header dan menu
  },
  avatarWrapper: {
    padding: 4,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: colors.blue, // Aksen biru pada ring foto
    marginBottom: 15,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F0F0F0',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.blue, // Judul section biru sesuai tema
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    opacity: 0.8,
  },
  menuGroup: {
    backgroundColor: '#FFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18, // Padding lebih luas agar nyaman di-tap
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F7FF', // Biru sangat muda untuk background ikon
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 15,
  },
  version: {
    textAlign: 'center',
    color: '#CCC',
    fontSize: 12,
    marginTop: 40,
    marginBottom: 20,
  },
});