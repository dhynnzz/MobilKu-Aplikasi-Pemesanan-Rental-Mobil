import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock, Car, ChevronRight } from 'lucide-react-native';
import { colors } from '../../assets/theme';

export default function BookingWidget() {
  return (
    <View style={styles.widgetContainer}>
      {/* Row 1: Date */}
      <TouchableOpacity style={styles.row}>
        <View style={styles.leftContent}>
          <Calendar size={20} color={colors.blue || "#0066FF"} />
          <Text style={styles.rowText}>25 Apr 2026 - 26 Apr 2026</Text>
        </View>
        <ChevronRight size={20} color={colors.grey || "#A0A0A0"} />
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Row 2: Duration */}
      <TouchableOpacity style={styles.row}>
        <View style={styles.leftContent}>
          <Clock size={20} color={colors.blue || "#0066FF"} />
          <Text style={styles.rowText}>2 Hari</Text>
        </View>
        <ChevronRight size={20} color={colors.grey || "#A0A0A0"} />
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Row 3: Car Type */}
      <TouchableOpacity style={styles.row}>
        <View style={styles.leftContent}>
          <Car size={20} color={colors.blue || "#0066FF"} />
          <Text style={styles.rowText}>Pilih Jenis Mobil</Text>
        </View>
        <ChevronRight size={20} color={colors.grey || "#A0A0A0"} />
      </TouchableOpacity>

      {/* Button */}
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Cari Mobil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  widgetContainer: {
    marginHorizontal: 24,
    marginTop: 10,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  searchButton: {
    backgroundColor: colors.blue || "#0066FF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  searchButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: colors.white,
  }
});
