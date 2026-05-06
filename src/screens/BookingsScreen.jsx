import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, StatusBar, Platform, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
export default function BookingFormScreen() {
  const [days, setDays] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ktp, setKtp] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const car = {
    title: "Toyota Alphard",
    category: "Premium",
    image: "https://i.pinimg.com/1200x/58/b6/7f/58b67f5462f233e50be13ff1fb371a72.jpg",
    fuel: "Bensin",
    seat: "7 Seat",
    transmission: "Automatic",
    rating: 5.0,
    isAvailable: true,
    pricePerDay: 1500000,
  };

  const total = car.pricePerDay * days;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{car.category}</Text>
            </View>
            <View style={styles.ratingBox}>
              <Feather name="star" size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{car.rating}</Text>
            </View>
          </View>
          <Text style={styles.carNameText}>{car.title}</Text>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: car.image }}
              style={styles.imageInside}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="gas-station" size={18} color="#4facfe" />
            <Text style={styles.infoText}>{car.fuel}</Text>
          </View>
          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="car-seat" size={18} color="#4facfe" />
            <Text style={styles.infoText}>{car.seat}</Text>
          </View>
          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="cog" size={18} color="#4facfe" />
            <Text style={styles.infoText}>Matic</Text>
          </View>
        </View>

        {/* INPUT FORM */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Data Penyewa</Text>

          <Text style={styles.label}>Nama Pengemudi</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama sesuai identitas"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#AAB"
          />

          <Text style={styles.label}>Nomor Telepon</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: 081234567890"
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor="#AAB"
            keyboardType="phone-pad"
            maxLength={13}
          />

          <Text style={styles.label}>No. KTP / Identitas</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan 16 digit nomor KTP"
            value={ktp}
            onChangeText={setKtp}
            placeholderTextColor="#AAB"
            keyboardType="numeric"
            maxLength={16}
          />

          <Text style={styles.label}>Alamat Penjemputan</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan alamat lengkap penjemputan"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#AAB"
          />

          <Text style={styles.label}>Catatan Tambahan</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tulis catatan khusus untuk sopir (opsional)"
            value={notes}
            onChangeText={setNotes}
            placeholderTextColor="#AAB"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={[styles.label, { marginTop: 10 }]}>Durasi Sewa</Text>
          <View style={styles.counterRow}>
            <View>
              <Text style={styles.daysText}>{days} Hari</Text>
              <Text style={styles.priceSubText}>Rp {car.pricePerDay.toLocaleString()} / hari</Text>
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
          <Text style={styles.totalLabel}>Total Bayar</Text>
          <Text style={styles.totalPrice}>Rp {total.toLocaleString()}</Text>
        </View>

        <TouchableOpacity activeOpacity={0.8}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bookButton}
          >
            <Text style={styles.bookButtonText}>Booking</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { paddingBottom: 150 },

  header: {
    marginTop: 10,
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
    fontSize: 12,
    color: '#666',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '700',
    color: '#333',
  },
  carNameText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  imageWrapper: {
    width: width - 50,
    height: 220,
    backgroundColor: '#F5F8FB',
    borderRadius: 35,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  imageInside: {
    width: '100%',
    height: '100%',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingHorizontal: 25,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 18,
    flex: 0.3,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  infoText: {
    marginLeft: 6,
    fontSize: 11,
    color: '#444',
    fontWeight: '700',
  },

  formSection: {
    marginTop: 35,
    paddingHorizontal: 25,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },

  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 25,
  },
  daysText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
  },
  priceSubText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  counterAction: {
    flexDirection: 'row',
  },
  btnRound: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  btnDisabled: {
    backgroundColor: '#F0F0F0',
    elevation: 0,
  },
  noteBox: {
    backgroundColor: '#F9FBF9',
    padding: 18,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#555',
  },

  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 25,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  totalLabel: {
    fontSize: 12,
    color: '#999',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000',
  },
  bookButton: {
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 22,
  },
  bookButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },
});