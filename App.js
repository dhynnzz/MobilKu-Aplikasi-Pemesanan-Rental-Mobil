import React from "react";
import { View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { colors, fontType } from "./assets/theme";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import BookingsScreen from "./src/screens/BookingsScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import ProfileScreen from "./src/screens/ProfileScreen";


export default function App() {
  const [loaded] = useFonts(fontType);

  if (!loaded) return null;

  return (
    <View style={styles.container}>
      <ProfileScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  }
});
