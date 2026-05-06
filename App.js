import React from "react";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { fontType } from "./assets/theme";

// Navigation
import Router from "./src/navigation/Router";

export default function App() {
  const [loaded] = useFonts(fontType);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
