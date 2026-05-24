import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getFavorites, removeFavorite } from '../Data/favorites';
import { getSettings, updateSettings } from '../Data/settings';
import { translate } from '../Data/translations';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, Modal, TextInput, Switch,Alert, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, LogOut, Settings, Heart, Bell, HelpCircle, User, X, Phone, Mail, Check, Star,ShieldCheck,Globe,Moon,Camera
} from 'lucide-react-native';
import { colors } from '../../assets/theme';
import { supabase } from '../libs/supabase';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  // STATE DATA PROFIL (Dapat diedit dinamis)
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', avatar: '' });

  // Form input sementara saat mengedit profil
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // STATE NOTIFIKASI
  const [promoNotif, setPromoNotif] = useState(true);
  const [statusNotif, setStatusNotif] = useState(true);
  const [updateNotif, setUpdateNotif] = useState(false);

  // STATE PENGATURAN APLIKASI
  const [settings, setSettings] = useState(getSettings());
  const [language, setLanguage] = useState(settings.language); // 'id' atau 'en'
  const [darkMode, setDarkMode] = useState(settings.darkMode);

  // STATE MOBIL FAVORIT (ID Mobil favorit)
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);

  const fetchCars = async () => {
    try {
      setLoadingCars(true);
      const { data, error } = await supabase.from('cars').select('*');
      if (error) throw error;
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoadingCars(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', 1).single();
      if (error) throw error;
      if (data) {
        setProfile(data);
        setEditName(data.name);
        setEditEmail(data.email);
        setEditPhone(data.phone);
        setEditAvatar(data.avatar);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Sinkronkan data profil terupdate & pengaturan terupdate dari global setiap kali halaman difokuskan
  useFocusEffect(
    useCallback(() => {
      fetchProfile();

      const appSettings = getSettings();
      setSettings(appSettings);
      setLanguage(appSettings.language);
      setDarkMode(appSettings.darkMode);

      setFavoriteIds(getFavorites());
      fetchCars();
    }, [])
  );

  // STATE MODAL VISIBILITY
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalNotifVisible, setModalNotifVisible] = useState(false);
  const [modalSettingsVisible, setModalSettingsVisible] = useState(false);
  const [modalFavoriteVisible, setModalFavoriteVisible] = useState(false);
  const [modalHelpVisible, setModalHelpVisible] = useState(false);

  // STATE FAQ ACCORDION (Menyimpan index pertanyaan yang dibuka)
  const [activeFaq, setActiveFaq] = useState(null);

  const isDark = false;

  // DATA PERTANYAAN PUSAT BANTUAN (FAQ)
  const faqData = settings.language === 'id' ? [
    {
      q: "Bagaimana cara melakukan penyewaan mobil?",
      a: "Sangat mudah! Pilih tanggal rental & durasi di Halaman Utama, lalu cari mobil favorit Anda. Ketuk tombol 'Sewa', isi formulir data lengkap penyewa, dan ketuk tombol 'Booking'. Pesanan Anda akan disimpan langsung di tab Riwayat."
    },
    {
      q: "Bagaimana cara membatalkan pemesanan rental?",
      a: "Buka menu 'Riwayat' pada navigasi bawah, cari transaksi yang ingin dibatalkan, ketuk tombol 'Batal' berwarna merah, lalu ketuk 'Ya, Batalkan' pada konfirmasi dialog. Status pesanan akan otomatis terhapus."
    },
    {
      q: "Metode pembayaran apa saja yang didukung?",
      a: "Kami mendukung transfer bank manual, e-wallet populer (OVO, GoPay, DANA), serta pembayaran tunai langsung di kantor Mobilku saat penyerahan kunci kendaraan."
    },
    {
      q: "Apakah penyewaan sudah termasuk sopir?",
      a: "Secara bawaan sewa adalah lepas kunci (tanpa sopir). Namun, jika Anda memerlukan jasa pengemudi profesional, silakan tambahkan permintaan khusus di kolom 'Catatan Tambahan' pada formulir booking."
    }
  ] : [
    {
      q: "How do I rent a car?",
      a: "It's easy! Select the rental date & duration on the Home Screen, then find your favorite car. Tap the 'Rent' button, fill in the renter details, and tap the 'Booking' button. Your order will be saved directly in the History tab."
    },
    {
      q: "How do I cancel a rental booking?",
      a: "Open the 'History' menu on the bottom navigation, find the transaction you want to cancel, tap the red 'Cancel' button, and then tap 'Yes, Cancel' in the confirmation dialog. The order status will be automatically deleted."
    },
    {
      q: "What payment methods are supported?",
      a: "We support manual bank transfers, popular e-wallets (OVO, GoPay, DANA), as well as cash payments directly at the Mobilku office upon vehicle key handover."
    },
    {
      q: "Is the rental inclusive of a driver?",
      a: "By default, the rental is self-drive (without a driver). However, if you need a professional driver, please add a special request in the 'Additional Notes' column on the booking form."
    }
  ];

  // Aksi memilih foto profil dari galeri lokal ponsel
  const handleSelectLocalImage = async () => {
    const isIndo = settings.language === 'id';
    // Meminta izin akses galeri
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert(
        isIndo ? "Izin Ditolak" : "Permission Denied", 
        isIndo 
          ? "Izin untuk mengakses galeri ponsel Anda diperlukan untuk mengganti foto profil." 
          : "Permission to access your phone gallery is required to change your profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setEditAvatar(result.assets[0].uri);
    }
  };

  // Aksi simpan perubahan profil
  const handleSaveProfile = async () => {
    const isIndo = settings.language === 'id';
    if (!editName.trim() || !editEmail.trim() || !editPhone.trim()) {
      Alert.alert(
        isIndo ? "Input Gagal" : "Input Failed", 
        isIndo ? "Nama, email, dan nomor telepon tidak boleh kosong." : "Name, email, and phone number cannot be empty."
      );
      return;
    }

    setIsUploading(true);
    let finalAvatarUrl = editAvatar;

    try {
      if (editAvatar && editAvatar.startsWith('file://')) {
        const filename = editAvatar.substring(editAvatar.lastIndexOf('/') + 1);
        const extension = filename.split('.').pop() || 'jpg';
        const name = filename.split('.').slice(0, -1).join('.');
        const finalFilename = `${name}_${Date.now()}.${extension}`;
        
        const fileImage = await fetch(editAvatar);
        const arrayBuffer = await fileImage.arrayBuffer();

        const { error: uploadError } = await supabase.storage
          .from('mobilku')
          .upload(finalFilename, arrayBuffer, {
            contentType: `image/${extension === 'jpg' ? 'jpeg' : extension}`,
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('mobilku')
          .getPublicUrl(finalFilename);

        finalAvatarUrl = publicUrlData.publicUrl;
      }

      const updatedData = {
        name: editName,
        email: editEmail,
        phone: editPhone,
        avatar: finalAvatarUrl
      };
      
      const { error: updateError } = await supabase
        .from('users')
        .update(updatedData)
        .eq('id', 1);

      if (updateError) throw updateError;
      setProfile(updatedData);
      setEditAvatar(finalAvatarUrl);
      setModalEditVisible(false);
      Alert.alert(
        isIndo ? "Sukses" : "Success", 
        isIndo ? "Data profil Anda berhasil diperbarui!" : "Your profile has been successfully updated!"
      );
    } catch (error) {
      console.error("Gagal mengunggah:", error);
      Alert.alert(
        isIndo ? "Gagal" : "Failed",
        isIndo ? "Gagal memperbarui profil/foto. Pastikan izin Storage telah diberikan." : "Failed to update profile/photo. Check Storage permissions."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Aksi toggle mobil favorit
  const handleRemoveFavorite = (id, carName) => {
    const isIndo = settings.language === 'id';
    Alert.alert(
      isIndo ? "Hapus Favorit" : "Remove Favorite",
      isIndo 
        ? `Apakah Anda yakin ingin menghapus ${carName} dari daftar mobil favorit Anda?` 
        : `Are you sure you want to remove ${carName} from your favorite cars?`,
      [
        { text: isIndo ? "Batal" : "Cancel", style: "cancel" },
        {
          text: isIndo ? "Hapus" : "Remove",
          style: "destructive",
          onPress: () => {
            removeFavorite(id); // Hapus dari state global
            setFavoriteIds(getFavorites()); // Refresh state lokal
          }
        }
      ]
    );
  };

  // Aksi keluar akun
  const handleLogout = () => {
    const isIndo = settings.language === 'id';
    Alert.alert(
      isIndo ? "Keluar Akun" : "Log Out",
      isIndo 
        ? "Apakah Anda yakin ingin keluar dari akun Anda saat ini?" 
        : "Are you sure you want to log out of your current account?",
      [
        { text: isIndo ? "Batal" : "Cancel", style: "cancel" },
        { 
          text: isIndo ? "Keluar" : "Log Out", 
          style: "destructive", 
          onPress: () => {
            Alert.alert(
              isIndo ? "Keluar Sukses" : "Log Out Successful", 
              isIndo ? "Anda telah berhasil keluar dari akun." : "You have successfully logged out.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    navigation.replace("Splash");
                  }
                }
              ]
            );
          } 
        }
      ]
    );
  };

  // Komponen Menu Item Profil Interaktif
  const MenuItem = ({ icon: Icon, title, onPress, isLogout = false }) => (
    <TouchableOpacity 
      style={[styles.menuItem, isDark && { borderBottomColor: '#2C2C2C' }]} 
      activeOpacity={0.6} 
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[
          styles.iconBox, 
          isLogout 
            ? (isDark ? { backgroundColor: '#3A1E1E' } : { backgroundColor: '#FFF5F5' })
            : (isDark ? { backgroundColor: '#252B36' } : { backgroundColor: '#F0F7FF' })
        ]}>
          <Icon color={isLogout ? '#FF5252' : (isDark ? '#3B9EFE' : colors.blue)} size={20} />
        </View>
        <Text style={[
          styles.menuTitle, 
          isLogout 
            ? { color: '#FF5252' } 
            : (isDark ? { color: '#FFFFFF' } : { color: '#333' })
        ]}>{title}</Text>
      </View>
      {!isLogout && <ChevronRight color={isDark ? '#666' : '#D1D1D1'} size={18} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? '#121212' : '#FFF'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HEADER PROFIL DINAMIS */}
        <View style={[styles.profileHeader, isDark && { borderBottomColor: '#1A1A1A' }]}>
          <View style={[styles.avatarWrapper, isDark && { borderColor: '#3B9EFE' }]}>
            <Image 
              source={{ uri: profile.avatar || "https://i.pravatar.cc/100" }} 
              style={styles.avatar} 
            />
          </View>
          <Text style={[styles.name, isDark && { color: '#FFFFFF' }]}>{profile.name}</Text>
          <Text style={[styles.email, isDark && { color: '#A0A0A5' }]}>{profile.email}</Text>
        </View>

        {/* SECTION 1: AKUN & PENGATURAN */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: '#3B9EFE' }]}>
            {settings.language === 'id' ? 'Akun & Pengaturan' : 'Account & Settings'}
          </Text>
          <View style={[styles.menuGroup, isDark && { backgroundColor: '#121212' }]}>
            <MenuItem 
              icon={User} 
              title={translate("editProfile", settings.language)} 
              onPress={() => {
                setEditName(profile.name);
                setEditEmail(profile.email);
                setEditPhone(profile.phone);
                setEditAvatar(profile.avatar);
                setModalEditVisible(true);
              }} 
            />
            <MenuItem 
              icon={Bell} 
              title={translate("notifications", settings.language)} 
              onPress={() => setModalNotifVisible(true)} 
            />
            <MenuItem 
              icon={Settings} 
              title={translate("appSettings", settings.language)} 
              onPress={() => setModalSettingsVisible(true)} 
            />
          </View>
        </View>

        {/* SECTION 2: AKTIVITAS */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: '#3B9EFE' }]}>
            {settings.language === 'id' ? 'Aktivitas' : 'Activity'}
          </Text>
          <View style={[styles.menuGroup, isDark && { backgroundColor: '#121212' }]}>
            <MenuItem 
              icon={Heart} 
              title={translate("favoriteCars", settings.language)} 
              onPress={() => setModalFavoriteVisible(true)} 
            />
          </View>
        </View>

        {/* SECTION 3: BANTUAN */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: '#3B9EFE' }]}>
            {settings.language === 'id' ? 'Bantuan' : 'Support'}
          </Text>
          <View style={[styles.menuGroup, isDark && { backgroundColor: '#121212' }]}>
            <MenuItem 
              icon={HelpCircle} 
              title={translate("helpCenter", settings.language)} 
              onPress={() => {
                setActiveFaq(null);
                setModalHelpVisible(true);
              }} 
            />
            <MenuItem 
              icon={LogOut} 
              title={translate("logOut", settings.language)} 
              isLogout={true} 
              onPress={handleLogout}
            />
          </View>
        </View>
        <Text style={[styles.version, isDark && { color: '#55555A' }]}>
          {translate("version", settings.language)}
        </Text>
      </ScrollView>

      {/* ================= MODAL 1: UBAH PROFIL ================= */}
      <Modal
        visible={modalEditVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalEditVisible(false)}
      >
        <View style={[styles.modalOverlay, isDark && { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalContent, isDark && { backgroundColor: '#1E1E1E' }]}>
            <View style={[styles.modalHeader, isDark && { borderBottomColor: '#2C2C2C' }]}>
              <Text style={[styles.modalTitle, isDark && { color: '#FFFFFF' }]}>
                {translate("editProfile", settings.language)}
              </Text>
              <TouchableOpacity onPress={() => setModalEditVisible(false)} style={styles.closeBtn}>
                <X color={isDark ? '#FFFFFF' : '#333'} size={22} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
              
              {/* Klik Foto untuk Mengambil dari Galeri Lokal */}
              <View style={styles.modalAvatarContainer}>
                <TouchableOpacity 
                  style={[styles.modalAvatarWrapper, isDark && { borderColor: '#3B9EFE' }]} 
                  activeOpacity={0.7} 
                  onPress={handleSelectLocalImage}
                >
                  <Image source={{ uri: editAvatar || "https://i.pravatar.cc/100" }} style={styles.modalAvatar} />
                  <View style={[styles.cameraIconBadge, isDark && { borderColor: '#1E1E1E', backgroundColor: '#3B9EFE' }]}>
                    <Camera color="#FFF" size={14} />
                  </View>
                </TouchableOpacity>
                <Text style={[styles.modalAvatarHelpText, isDark && { color: '#A0A0A5' }]}>
                  {translate("avatarHelp", settings.language)}
                </Text>
              </View>

              <Text style={[styles.inputLabel, isDark && { color: '#FFFFFF' }]}>
                {translate("nameLabel", settings.language)}
              </Text>
              <TextInput
                style={[
                  styles.textInput, 
                  isDark && { backgroundColor: '#2C2C2C', borderColor: '#3C3C3C', color: '#FFFFFF' }
                ]}
                value={editName}
                onChangeText={setEditName}
                placeholder={translate("nameInput", settings.language)}
                placeholderTextColor={isDark ? '#666' : '#AAB'}
              />

              <Text style={[styles.inputLabel, isDark && { color: '#FFFFFF' }]}>
                {translate("emailLabel", settings.language)}
              </Text>
              <TextInput
                style={[
                  styles.textInput, 
                  isDark && { backgroundColor: '#2C2C2C', borderColor: '#3C3C3C', color: '#FFFFFF' }
                ]}
                value={editEmail}
                onChangeText={setEditEmail}
                keyboardType="email-address"
                placeholder={translate("emailInput", settings.language)}
                placeholderTextColor={isDark ? '#666' : '#AAB'}
              />

              <Text style={[styles.inputLabel, isDark && { color: '#FFFFFF' }]}>
                {translate("phoneLabel", settings.language)}
              </Text>
              <TextInput
                style={[
                  styles.textInput, 
                  isDark && { backgroundColor: '#2C2C2C', borderColor: '#3C3C3C', color: '#FFFFFF' }
                ]}
                value={editPhone}
                onChangeText={setEditPhone}
                keyboardType="phone-pad"
                placeholder={translate("phoneInput", settings.language)}
                placeholderTextColor={isDark ? '#666' : '#AAB'}
              />

              <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={handleSaveProfile} disabled={isUploading}>
                <Text style={styles.primaryButtonText}>
                  {isUploading ? (settings.language === 'id' ? "Mengunggah..." : "Uploading...") : translate("saveChanges", settings.language)}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL 2: NOTIFIKASI ================= */}
      <Modal
        visible={modalNotifVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalNotifVisible(false)}
      >
        <View style={[styles.modalOverlay, isDark && { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalContent, isDark && { backgroundColor: '#1E1E1E' }]}>
            <View style={[styles.modalHeader, isDark && { borderBottomColor: '#2C2C2C' }]}>
              <Text style={[styles.modalTitle, isDark && { color: '#FFFFFF' }]}>
                {settings.language === 'id' ? 'Pengaturan Notifikasi' : 'Notification Settings'}
              </Text>
              <TouchableOpacity onPress={() => setModalNotifVisible(false)} style={styles.closeBtn}>
                <X color={isDark ? '#FFFFFF' : '#333'} size={22} />
              </TouchableOpacity>
            </View>

            <View style={[styles.switchRow, isDark && { borderBottomColor: '#2C2C2C' }]}>
              <View style={styles.switchTextContainer}>
                <Text style={[styles.switchTitle, isDark && { color: '#FFFFFF' }]}>
                  {translate("notifPromoTitle", settings.language)}
                </Text>
                <Text style={[styles.switchSubTitle, isDark && { color: '#A0A0A5' }]}>
                  {translate("notifPromoSub", settings.language)}
                </Text>
              </View>
              <Switch
                value={promoNotif}
                onValueChange={setPromoNotif}
                trackColor={{ false: isDark ? "#3C3C3C" : "#D1D1D1", true: "#007BFF" }}
                thumbColor="#FFF"
              />
            </View>

            <View style={[styles.switchRow, isDark && { borderBottomColor: '#2C2C2C' }]}>
              <View style={styles.switchTextContainer}>
                <Text style={[styles.switchTitle, isDark && { color: '#FFFFFF' }]}>
                  {translate("notifStatusTitle", settings.language)}
                </Text>
                <Text style={[styles.switchSubTitle, isDark && { color: '#A0A0A5' }]}>
                  {translate("notifStatusSub", settings.language)}
                </Text>
              </View>
              <Switch
                value={statusNotif}
                onValueChange={setStatusNotif}
                trackColor={{ false: isDark ? "#3C3C3C" : "#D1D1D1", true: "#007BFF" }}
                thumbColor="#FFF"
              />
            </View>

            <View style={[styles.switchRow, isDark && { borderBottomColor: '#2C2C2C' }]}>
              <View style={styles.switchTextContainer}>
                <Text style={[styles.switchTitle, isDark && { color: '#FFFFFF' }]}>
                  {translate("notifUpdateTitle", settings.language)}
                </Text>
                <Text style={[styles.switchSubTitle, isDark && { color: '#A0A0A5' }]}>
                  {translate("notifUpdateSub", settings.language)}
                </Text>
              </View>
              <Switch
                value={updateNotif}
                onValueChange={setUpdateNotif}
                trackColor={{ false: isDark ? "#3C3C3C" : "#D1D1D1", true: "#007BFF" }}
                thumbColor="#FFF"
              />
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, { marginTop: 30 }]} 
              activeOpacity={0.8} 
              onPress={() => {
                setModalNotifVisible(false);
                Alert.alert(
                  translate("notifAlertTitle", settings.language), 
                  translate("notifAlertSub", settings.language)
                );
              }}
            >
              <Text style={styles.primaryButtonText}>
                {translate("done", settings.language)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL 3: PENGATURAN APLIKASI ================= */}
      <Modal
        visible={modalSettingsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalSettingsVisible(false)}
      >
        <View style={[styles.modalOverlay, isDark && { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalContent, isDark && { backgroundColor: '#1E1E1E' }]}>
            <View style={[styles.modalHeader, isDark && { borderBottomColor: '#2C2C2C' }]}>
              <Text style={[styles.modalTitle, isDark && { color: '#FFFFFF' }]}>
                {translate("appSettings", settings.language)}
              </Text>
              <TouchableOpacity onPress={() => setModalSettingsVisible(false)} style={styles.closeBtn}>
                <X color={isDark ? '#FFFFFF' : '#333'} size={22} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.settingLabelText, isDark && { color: '#FFFFFF' }]}>
              {translate("langLabel", settings.language)}
            </Text>
            <View style={styles.optionContainer}>
              <TouchableOpacity 
                style={[
                  styles.optionCard, 
                  isDark && { backgroundColor: '#2C2C2C', borderColor: '#3C3C3C' },
                  language === 'id' && (isDark ? { borderColor: '#3B9EFE', backgroundColor: '#1F2E3D' } : styles.optionCardActive)
                ]} 
                onPress={() => setLanguage('id')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Globe size={18} color={language === 'id' ? (isDark ? '#3B9EFE' : colors.blue) : (isDark ? '#A0A0A5' : '#555')} />
                  <Text style={[
                    styles.optionText, 
                    isDark && { color: '#E0E0E0' },
                    language === 'id' && (isDark ? { color: '#3B9EFE', fontWeight: '700' } : styles.optionTextActive)
                  ]}>Bahasa Indonesia</Text>
                </View>
                {language === 'id' && <Check size={18} color={isDark ? '#3B9EFE' : colors.blue} />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.optionCard, 
                  isDark && { backgroundColor: '#2C2C2C', borderColor: '#3C3C3C' },
                  language === 'en' && (isDark ? { borderColor: '#3B9EFE', backgroundColor: '#1F2E3D' } : styles.optionCardActive)
                ]} 
                onPress={() => setLanguage('en')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Globe size={18} color={language === 'en' ? (isDark ? '#3B9EFE' : colors.blue) : (isDark ? '#A0A0A5' : '#555')} />
                  <Text style={[
                    styles.optionText, 
                    isDark && { color: '#E0E0E0' },
                    language === 'en' && (isDark ? { color: '#3B9EFE', fontWeight: '700' } : styles.optionTextActive)
                  ]}>English (US)</Text>
                </View>
                {language === 'en' && <Check size={18} color={isDark ? '#3B9EFE' : colors.blue} />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, { marginTop: 30 }]} 
              activeOpacity={0.8} 
              onPress={() => {
                updateSettings({ language, darkMode: false });
                setSettings({ language, darkMode: false }); // Trigger immediate re-render!
                setModalSettingsVisible(false);
                const isIndo = language === 'id';
                Alert.alert(
                  isIndo ? "Disimpan" : "Saved", 
                  isIndo 
                    ? `Bahasa disetel ke Bahasa Indonesia.` 
                    : `Language set to English.`
                );
              }}
            >
              <Text style={styles.primaryButtonText}>
                {translate("done", settings.language)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL 4: MOBIL FAVORIT ================= */}
      <Modal
        visible={modalFavoriteVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalFavoriteVisible(false)}
      >
        <View style={[styles.modalOverlay, isDark && { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalContentLarge, isDark && { backgroundColor: '#1E1E1E' }]}>
            <View style={[styles.modalHeader, isDark && { borderBottomColor: '#2C2C2C' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Heart size={22} color="#FF5252" fill="#FF5252" />
                <Text style={[styles.modalTitle, isDark && { color: '#FFFFFF' }]}>
                  {translate("favoriteCars", settings.language)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalFavoriteVisible(false)} style={styles.closeBtn}>
                <X color={isDark ? '#FFFFFF' : '#333'} size={22} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {favoriteIds.length === 0 ? (
                <View style={styles.emptyFavContainer}>
                  <Heart size={44} color={isDark ? '#3C3C3C' : '#D1D1D1'} />
                  <Text style={[styles.emptyFavText, isDark && { color: '#FFFFFF' }]}>
                    {settings.language === 'id' ? 'Belum Ada Mobil Favorit' : 'No Favorite Cars Yet'}
                  </Text>
                  <Text style={[styles.emptyFavSubText, isDark && { color: '#A0A0A5' }]}>
                    {settings.language === 'id' 
                      ? 'Semua mobil sewa yang Anda beri tanda suka akan disimpan di sini.' 
                      : 'All rental cars that you like will be saved here.'}
                  </Text>
                </View>
              ) : loadingCars ? (
                <Text style={[{ textAlign: 'center', marginTop: 20 }, isDark ? { color: '#FFF' } : { color: '#888' }]}>Loading...</Text>
              ) : (
                cars
                  .filter(car => favoriteIds.includes(car.id))
                  .map(car => (
                    <View key={car.id} style={[styles.favCard, isDark && { backgroundColor: '#2C2C2C', borderColor: '#3C3C3C' }]}>
                      <Image source={{ uri: car.image }} style={styles.favImage} />
                      <View style={styles.favInfo}>
                        <Text style={[styles.favCategory, isDark && { color: '#3B9EFE' }]}>
                          {car.category.toUpperCase()}
                        </Text>
                        <Text style={[styles.favTitle, isDark && { color: '#FFFFFF' }]}>{car.title}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 }}>
                          <Star size={12} color="#FFD700" fill="#FFD700" />
                          <Text style={[styles.favRating, isDark && { color: '#A0A0A5' }]}>{car.rating} / 5.0</Text>
                        </View>
                        <Text style={[styles.favPrice, isDark && { color: '#FFFFFF' }]}>{car.price}</Text>
                      </View>
                      <TouchableOpacity 
                        style={[styles.unfavBtn, isDark && { backgroundColor: '#1E1E1E' }]} 
                        onPress={() => handleRemoveFavorite(car.id, car.title)}
                      >
                        <Heart size={20} color="#FF5252" fill="#FF5252" />
                      </TouchableOpacity>
                    </View>
                  ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL 5: PUSAT BANTUAN ================= */}
      <Modal
        visible={modalHelpVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalHelpVisible(false)}
      >
        <View style={[styles.modalOverlay, isDark && { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalContentLarge, isDark && { backgroundColor: '#1E1E1E' }]}>
            <View style={[styles.modalHeader, isDark && { borderBottomColor: '#2C2C2C' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <HelpCircle size={22} color={isDark ? '#3B9EFE' : colors.blue} />
                <Text style={[styles.modalTitle, isDark && { color: '#FFFFFF' }]}>
                  {translate("helpCenter", settings.language)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalHelpVisible(false)} style={styles.closeBtn}>
                <X color={isDark ? '#FFFFFF' : '#333'} size={22} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.helpWelcomeText, isDark && { color: '#A0A0A5' }]}>
                {translate("helpWelcome", settings.language)}
              </Text>
              <View style={styles.faqGroup}>
                {faqData.map((faq, index) => {
                  const isOpen = activeFaq === index;
                  return (
                    <View 
                      key={index} 
                      style={[
                        styles.faqCard, 
                        isDark && { backgroundColor: '#2C2C2C', borderColor: '#3C3C3C' },
                        isOpen && (isDark ? { borderColor: '#3B9EFE', backgroundColor: '#1E1E1E' } : styles.faqCardOpen)
                      ]}
                    >
                      <TouchableOpacity 
                        style={styles.faqQuestionRow} 
                        activeOpacity={0.7}
                        onPress={() => setActiveFaq(isOpen ? null : index)}
                      >
                        <Text style={[
                          styles.faqQuestionText, 
                          isDark && { color: '#FFFFFF' },
                          isOpen && (isDark ? { color: '#3B9EFE', fontWeight: '700' } : styles.faqQuestionTextOpen)
                        ]}>{faq.q}</Text>
                        <ChevronRight 
                          size={18} 
                          color={isOpen ? (isDark ? '#3B9EFE' : colors.blue) : (isDark ? '#666' : '#A0A0A5')} 
                          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }} 
                        />
                      </TouchableOpacity>
                      {isOpen && (
                        <View style={[styles.faqAnswerContainer, isDark && { borderTopColor: '#3C3C3C' }]}>
                          <Text style={[styles.faqAnswerText, isDark && { color: '#D0D0D5' }]}>{faq.a}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Box Info Darurat */}
              <View style={[
                styles.emergencyBox, 
                isDark && { backgroundColor: '#1B3E24', borderColor: '#2E7D32' }
              ]}>
                <ShieldCheck size={26} color={isDark ? '#81C784' : '#2E7D32'} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.emergencyTitle, isDark && { color: '#FFFFFF' }]}>
                    {translate("helpAlertTitle", settings.language)}
                  </Text>
                  <Text style={[styles.emergencyText, isDark && { color: '#C8E6C9' }]}>
                    {translate("helpAlertSub", settings.language)}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    borderBottomColor: '#F8F9FA',
  },
  avatarWrapper: {
    padding: 4,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: colors.blue,
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
    color: colors.blue,
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
    paddingVertical: 18,
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
    backgroundColor: '#F0F7FF',
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

  // STYLES MODAL PREMIUM
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: height * 0.8,
  },
  modalContentLarge: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    height: height * 0.85,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  closeBtn: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  primaryButton: {
    backgroundColor: colors.blue,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },

  // STYLES SAKLAR (SWITCH)
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F5',
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: 20,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  switchSubTitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    lineHeight: 18,
  },

  // STYLES PILIHAN BAHASA
  settingLabelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  optionContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#ECECEC',
  },
  optionCardActive: {
    borderColor: colors.blue,
    backgroundColor: '#F4F9FF',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  optionTextActive: {
    color: colors.blue,
    fontWeight: '700',
  },

  // STYLES MOBIL FAVORIT CARD
  emptyFavContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyFavText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 10,
  },
  emptyFavSubText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 20,
  },
  favCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#ECECEC',
    alignItems: 'center',
  },
  favImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: '#FFF',
  },
  favInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  favCategory: {
    fontSize: 9,
    color: colors.blue,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  favTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 2,
  },
  favRating: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  },
  favPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
  },
  unfavBtn: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  // STYLES PUSAT BANTUAN (FAQ)
  helpWelcomeText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  faqGroup: {
    gap: 12,
  },
  faqCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#ECECEC',
    overflow: 'hidden',
  },
  faqCardOpen: {
    borderColor: colors.blue,
    backgroundColor: '#FFF',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 0.95,
  },
  faqQuestionTextOpen: {
    color: colors.blue,
    fontWeight: '700',
  },
  faqAnswerContainer: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
    paddingTop: 14,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  emergencyBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: 18,
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 40,
    gap: 14,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  emergencyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2E7D32',
  },
  emergencyText: {
    fontSize: 12,
    color: '#388E3C',
    marginTop: 4,
    lineHeight: 18,
  },
  modalAvatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
    gap: 8,
  },
  modalAvatarWrapper: {
    position: 'relative',
    padding: 3,
    borderRadius: 45,
    borderWidth: 2.5,
    borderColor: colors.blue,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.blue,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  modalAvatarHelpText: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
});