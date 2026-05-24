import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Calendar, MapPin, Phone, User, Trash2, Edit3, Car, Clock } from 'lucide-react-native';
import { colors } from '../../assets/theme';
import { getSettings } from '../Data/settings';
import { translate } from '../Data/translations';
import { supabase } from '../libs/supabase';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [settings, setSettings] = useState(getSettings());

  const getBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error(error);
      const lang = settings.language;
      Alert.alert(
        lang === 'id' ? "Gagal Memuat Data" : "Failed to Load Data", 
        lang === 'id' ? "Gagal mengambil data riwayat sewa dari server." : "Failed to fetch rental history data from server."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setSettings(getSettings());
      getBookings();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getBookings();
  }, []);

  const handleDelete = (id) => {
    const lang = settings.language;
    Alert.alert(
      translate("cancelOrderTitle", lang),
      translate("cancelOrderConfirm", lang),
      [
        { text: translate("noBtn", lang), style: "cancel" },
        {
          text: translate("yesCancelBtn", lang),
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', id);

              if (error) throw error;

              Alert.alert(
                lang === 'id' ? "Sukses" : "Success", 
                translate("cancelSuccess", lang)
              );
              getBookings();
            } catch (error) {
              console.error(error);
              Alert.alert(
                lang === 'id' ? "Gagal" : "Failed", 
                translate("cancelFailed", lang)
              );
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = settings.language === 'id'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{translate("historyTitle", settings.language)}</Text>
        <Text style={styles.headerSubtitle}>{translate("historySubtitle", settings.language)}</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue} />
          <Text style={styles.loadingText}>{translate("loadingHistory", settings.language)}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.blue]} />
          }
        >
          {bookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.iconCircle}>
                <Car size={36} color={colors.grey} />
              </View>
              <Text style={styles.emptyTitle}>{translate("emptyHistoryTitle", settings.language)}</Text>
              <Text style={styles.emptySubtitle}>
                {translate("emptyHistorySubtitle", settings.language)}
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Home")}
              >
                <Text style={styles.exploreButtonText}>{translate("rentCarNowBtn", settings.language)}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            bookings.map((item) => (
              <View key={item.id} style={styles.card}>
                {/* Bagian Atas: Info Mobil */}
                <View style={styles.cardHeader}>
                  <Image source={{ uri: item.carImage }} style={styles.carImage} />
                  <View style={styles.carInfo}>
                    <View style={styles.badgeRow}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.carCategory}</Text>
                      </View>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{translate("activeStatus", settings.language)}</Text>
                      </View>
                    </View>
                    <Text style={styles.carTitle}>{item.carTitle}</Text>
                    <Text style={styles.bookingDate}>{translate("orderedOn", settings.language)} {formatDate(item.createdAt)}</Text>
                  </View>
                </View>

                {/* Pemisah */}
                <View style={styles.divider} />

                {/* Bagian Tengah: Detail Pemesan */}
                <View style={styles.detailContainer}>
                  <View style={styles.detailRow}>
                    <User size={14} color={colors.grey} />
                    <Text style={styles.detailLabel}>{settings.language === 'id' ? "Penyewa:" : "Renter:"}</Text>
                    <Text style={styles.detailValue}>{item.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Phone size={14} color={colors.grey} />
                    <Text style={styles.detailLabel}>{settings.language === 'id' ? "No. Telp:" : "Phone:"}</Text>
                    <Text style={styles.detailValue}>{item.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MapPin size={14} color={colors.grey} />
                    <Text style={styles.detailLabel}>{settings.language === 'id' ? "Alamat Penjemputan:" : "Pickup Address:"}</Text>
                    <Text style={styles.detailValue} numberOfLines={1}>{item.address}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Calendar size={14} color={colors.grey} />
                    <Text style={styles.detailLabel}>{translate("rentalDateLabel", settings.language)}:</Text>
                    <Text style={styles.detailValue}>{item.rentDate || "25 Mei 2026"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Clock size={14} color={colors.grey} />
                    <Text style={styles.detailLabel}>{translate("rentalDurationLabel", settings.language)}:</Text>
                    <Text style={styles.detailValue}>{item.days} {translate("daysLabel", settings.language)}</Text>
                  </View>
                </View>

                {/* Pemisah */}
                <View style={styles.divider} />

                {/* Bagian Bawah: Total & Aksi */}
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.priceLabel}>{settings.language === 'id' ? "Total Biaya" : "Total Cost"}</Text>
                    <Text style={styles.priceValue}>Rp {parseInt(item.totalPrice || 0, 10).toLocaleString()}</Text>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editButton]}
                      activeOpacity={0.7}
                      onPress={() => navigation.navigate("EditBooking", { booking: item })}
                    >
                      <Edit3 size={14} color={colors.blue} />
                      <Text style={styles.editText}>{translate("editBtn", settings.language)}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      activeOpacity={0.7}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Trash2 size={14} color="#FF5252" />
                      <Text style={styles.deleteText}>{settings.language === 'id' ? "Batal" : "Cancel"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    fontWeight: '800',
    color: colors.black,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: colors.grey,
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.grey,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  exploreButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    elevation: 4,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  exploreButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECECEF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  carImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F5FA',
  },
  carInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: '#F0F5FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 9,
    color: colors.blue,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusBadge: {
    backgroundColor: '#EAFBEA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 9,
    color: '#2E7D32',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  carTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.black,
  },
  bookingDate: {
    fontSize: 11,
    color: '#A0A0A5',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F5',
    marginVertical: 12,
  },
  detailContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#707075',
    marginLeft: 8,
    width: 130,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.black,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 10,
    color: '#909095',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.black,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  editButton: {
    borderColor: '#E0EEFF',
    backgroundColor: '#F5FAFF',
  },
  editText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.blue,
    marginLeft: 6,
  },
  deleteButton: {
    borderColor: '#FFEBEB',
    backgroundColor: '#FFF5F5',
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5252',
    marginLeft: 6,
  },
});
