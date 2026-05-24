import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../assets/theme';
import axios from 'axios';
import { getSettings } from '../Data/settings';
import { translate } from '../Data/translations';

const { width } = Dimensions.get('window');
const MOCKAPI_URL = "https://6a126eb278d0434e0d5d3393.mockapi.io/bookings";

export default function EditBookingScreen({ route, navigation }) {
  const { booking } = route.params;
  const [settings] = useState(getSettings());
  const lang = settings.language;
  const monthLabel = lang === 'id' ? 'Mei 2026' : 'May 2026';

  const [days, setDays] = useState(booking.days || 1);
  const [rentDate, setRentDate] = useState(booking.rentDate || `25 ${monthLabel} - 27 ${monthLabel}`);
  const [name, setName] = useState(booking.name || '');
  const [phone, setPhone] = useState(booking.phone || '');
  const [ktp, setKtp] = useState(booking.ktp || '');
  const [address, setAddress] = useState(booking.address || '');
  const [notes, setNotes] = useState(booking.notes || '');
  const [loading, setLoading] = useState(false);

  const getStartDay = (dateStr) => {
    if (!dateStr) return 25;
    const match = dateStr.match(/^([0-9]+)/);
    return match ? parseInt(match[1], 10) : 25;
  };

  React.useEffect(() => {
    const startDay = getStartDay(booking.rentDate);
    const start = `${startDay} ${monthLabel}`;
    const endDay = startDay + days;
    const end = `${endDay} ${monthLabel}`;
    setRentDate(`${start} - ${end}`);
  }, [days]);

  // Hitung harga per hari secara dinamis berdasarkan data pemesanan sebelumnya
  const pricePerDay = (booking.totalPrice && booking.days) ? (booking.totalPrice / booking.days) : 0;
  const total = pricePerDay * days;

  const handleUpdate = async () => {
    if (!name.trim() || !phone.trim() || !ktp.trim() || !address.trim()) {
      Alert.alert(
        translate("incompleteDataTitle", lang), 
        translate("incompleteDataMsg", lang)
      );
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        name,
        phone,
        ktp,
        address,
        notes,
        days,
        rentDate,
        totalPrice: total,
      };

      await axios.put(`${MOCKAPI_URL}/${booking.id}`, updatedData);

      Alert.alert(
        lang === 'id' ? "Pembaruan Berhasil" : "Update Successful",
        lang === 'id' ? "Pesanan rental mobil Anda berhasil diperbarui!" : "Your car rental order has been successfully updated!",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        lang === 'id' ? "Gagal Memperbarui" : "Update Failed",
        lang === 'id' ? "Terjadi kesalahan koneksi ke server. Silakan coba lagi." : "Server connection error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* HEADER NAVIGASI */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{lang === 'id' ? "Ubah Pemesanan" : "Edit Booking"}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* DETAIL MOBIL YANG DI-RENTAL */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{booking.carCategory}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{translate("activeStatus", settings.language)}</Text>
            </View>
          </View>
          <Text style={styles.carNameText}>{booking.carTitle}</Text>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: booking.carImage }}
              style={styles.imageInside}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* INPUT FORM EDIT */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>{lang === 'id' ? "Data Penyewa Baru" : "New Renter Information"}</Text>

          <Text style={styles.label}>{translate("rentalDateLabel", settings.language)}</Text>
          <View style={styles.dateDisplayBox}>
            <MaterialCommunityIcons name="calendar-range" size={20} color="#4facfe" />
            <Text style={styles.dateDisplayText}>{rentDate}</Text>
          </View>

          <Text style={styles.label}>{translate("driverNameLabel", settings.language)}</Text>
          <TextInput
            style={styles.input}
            placeholder={translate("driverNamePlaceholder", settings.language)}
            value={name}
            onChangeText={setName}
            placeholderTextColor="#AAB"
          />

          <Text style={styles.label}>{translate("phoneLabel", settings.language)}</Text>
          <TextInput
            style={styles.input}
            placeholder={translate("phonePlaceholder", settings.language)}
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor="#AAB"
            keyboardType="phone-pad"
            maxLength={13}
          />

          <Text style={styles.label}>{translate("ktpLabel", settings.language)}</Text>
          <TextInput
            style={styles.input}
            placeholder={translate("ktpPlaceholder", settings.language)}
            value={ktp}
            onChangeText={setKtp}
            placeholderTextColor="#AAB"
            keyboardType="numeric"
            maxLength={16}
          />

          <Text style={styles.label}>{translate("pickupAddressLabel", settings.language)}</Text>
          <TextInput
            style={styles.input}
            placeholder={translate("pickupAddressPlaceholder", settings.language)}
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#AAB"
          />

          <Text style={styles.label}>{translate("notesLabel", settings.language)}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={translate("notesPlaceholder", settings.language)}
            value={notes}
            onChangeText={setNotes}
            placeholderTextColor="#AAB"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={[styles.label, { marginTop: 10 }]}>{translate("rentalDurationLabel", settings.language)}</Text>
          <View style={styles.counterRow}>
            <View>
              <Text style={styles.daysText}>{days} {translate("daysLabel", settings.language)}</Text>
              <Text style={styles.priceSubText}>Rp {pricePerDay.toLocaleString()} {translate("pricePerDay", settings.language)}</Text>
            </View>
            <View style={styles.counterAction}>
              <TouchableOpacity
                onPress={() => days > 1 && setDays(days - 1)}
                style={[styles.btnRound, days <= 1 && styles.btnDisabled]}
              >
                <Feather name="minus" size={18} color={days <= 1 ? "#AAA" : "#333"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDays(days + 1)}
                style={[styles.btnRound, { marginLeft: 12, backgroundColor: '#000' }]}
              >
                <Feather name="plus" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>{translate("totalPaymentLabel", settings.language)}</Text>
          <Text style={styles.totalPrice}>Rp {total.toLocaleString()}</Text>
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={handleUpdate}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bookButton}
          >
            <Text style={styles.bookButtonText}>{translate("saveChanges", settings.language)}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4facfe" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { paddingBottom: 150 },
  
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
    backgroundColor: '#FFF',
  },
  backButton: {
    padding: 8,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.black,
  },

  header: {
    marginTop: 20,
    paddingHorizontal: 25,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusBadge: {
    backgroundColor: '#EAFBEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  carNameText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  imageWrapper: {
    width: width - 50,
    height: 180,
    backgroundColor: '#F5F8FB',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  imageInside: {
    width: '100%',
    height: '100%',
  },

  formSection: {
    marginTop: 25,
    paddingHorizontal: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  dateDisplayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECECEC',
    gap: 12,
  },
  dateDisplayText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: '#333',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 14,
    borderRadius: 20,
  },
  daysText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
  },
  priceSubText: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  counterAction: {
    flexDirection: 'row',
  },
  btnRound: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  btnDisabled: {
    backgroundColor: '#F0F0F0',
    elevation: 0,
    shadowOpacity: 0,
  },

  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  totalLabel: {
    fontSize: 11,
    color: '#999',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
  bookButton: {
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 18,
  },
  bookButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});
