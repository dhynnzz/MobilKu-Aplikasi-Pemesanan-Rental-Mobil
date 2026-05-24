import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, Dimensions } from 'react-native';
import { Calendar, Clock, Car, ChevronRight } from 'lucide-react-native';
import { colors } from '../../assets/theme';
import { translate } from '../Data/translations';

const { width } = Dimensions.get('window');

export default function BookingWidget({ navigation, searchQuery, setSearchQuery, dateRange, setDateRange, durasi, setDurasi, onSearchPress, language = 'id' }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedStartDay, setSelectedStartDay] = useState(25);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const monthLabel = language === 'id' ? 'Mei 2026' : 'May 2026';

  const handleDayPress = (day) => {
    setSelectedStartDay(day);
    const start = `${day} ${monthLabel}`;
    const numDurasi = parseInt(durasi, 10) || 0;
    const endDay = day + numDurasi;
    const end = `${endDay} ${monthLabel}`;
    setDateRange(`${start} - ${end}`);
    setShowCalendar(false);
  };

  const handleDurationChange = (text) => {
    if (text === '') {
      setDurasi('');
      setDateRange(`${selectedStartDay} ${monthLabel} - ${selectedStartDay} ${monthLabel}`);
      return;
    }

    const cleanNum = text.replace(/[^0-9]/g, '');
    if (cleanNum === '') {
      setDurasi('');
      setDateRange(`${selectedStartDay} ${monthLabel} - ${selectedStartDay} ${monthLabel}`);
      return;
    }

    const d = parseInt(cleanNum, 10);
    setDurasi(d);

    const start = `${selectedStartDay} ${monthLabel}`;
    const endDay = selectedStartDay + d;
    const end = `${endDay} ${monthLabel}`;
    setDateRange(`${start} - ${end}`);
  };

  const weekdays = language === 'id' 
    ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'] 
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.widgetContainer}>
      {/* Row 1: Date */}
      <TouchableOpacity style={styles.row} onPress={() => setShowCalendar(true)} activeOpacity={0.7}>
        <View style={styles.leftContent}>
          <Calendar size={20} color={colors.blue || "#0066FF"} />
          <Text style={styles.rowText}>{dateRange}</Text>
        </View>
        <ChevronRight size={20} color={colors.grey || "#A0A0A0"} />
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Row 2: Duration (Manual Input) */}
      <View style={styles.row}>
        <View style={styles.leftContent}>
          <Clock size={20} color={colors.blue || "#0066FF"} />
          <Text style={styles.rowLabelText}>{translate("durationLabel", language)}</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            value={durasi.toString()}
            onChangeText={handleDurationChange}
            placeholder={translate("enterDuration", language)}
            placeholderTextColor="#AAB"
          />
        </View>
      </View>

      <View style={styles.divider} />

      {/* Row 3: Car Search Input */}
      <View style={styles.row}>
        <View style={styles.leftContent}>
          <Car size={20} color={colors.blue || "#0066FF"} />
          <TextInput
            style={styles.textInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={translate("searchPlaceholder", language)}
            placeholderTextColor="#AAB"
            clearButtonMode="while-editing"
          />
        </View>
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")} style={{ paddingHorizontal: 6 }}>
            <Text style={{ fontSize: 16, color: '#A0A0A0', fontFamily: 'Poppins-Bold' }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.searchButton}
        activeOpacity={0.8}
        onPress={onSearchPress}
      >
        <Text style={styles.searchButtonText}>{translate("searchCarBtn", language)}</Text>
      </TouchableOpacity>

      {/* Modal Kalender Custom */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowCalendar(false)}
        >
          <View style={styles.calendarCard}>
            <Text style={styles.calendarMonthTitle}>{monthLabel}</Text>
            
            <View style={styles.daysHeaderRow}>
              {weekdays.map((w, idx) => (
                <Text key={idx} style={styles.weekdayText}>{w}</Text>
              ))}
            </View>
            
            <View style={styles.daysGrid}>
              {/* Offset untuk 1 Mei 2026 (Jumat = offset 5 kolom kosong) */}
              {Array.from({ length: 5 }).map((_, idx) => (
                <View key={`empty-${idx}`} style={styles.dayButtonEmpty} />
              ))}
              
              {daysInMonth.map((day) => {
                const isSelected = day === selectedStartDay;
                return (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayButton, isSelected && styles.selectedDayButton]}
                    onPress={() => handleDayPress(day)}
                  >
                    <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            <TouchableOpacity 
              style={styles.closeCalendarBtn} 
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.closeCalendarBtnText}>{translate("closeBtn", language)}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  },
  rowLabelText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: '#707075',
  },
  textInput: {
    flex: 1,
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: colors.black,
    padding: 0,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarCard: {
    width: width - 48,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  calendarMonthTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 15,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  weekdayText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: '#A0A0A5',
    width: 36,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  dayButtonEmpty: {
    width: '14.28%',
    height: 40,
  },
  dayText: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: colors.black,
  },
  selectedDayButton: {
    backgroundColor: colors.blue || "#0066FF",
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#FFF',
    fontFamily: "Poppins-Bold",
  },
  closeCalendarBtn: {
    marginTop: 15,
    backgroundColor: '#F5F5FA',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeCalendarBtnText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: colors.black,
  },
});
