import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../assets/theme';

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Riwayat Pesanan</Text>
        <Text style={styles.subtitle}>Riwayat perjalanan kamu akan muncul di sini.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: colors.black,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: colors.grey,
    textAlign: 'center',
  },
});
