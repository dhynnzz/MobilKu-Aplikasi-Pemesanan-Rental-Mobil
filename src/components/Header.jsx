import { useState, useCallback } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Bell } from "lucide-react-native";
import { colors } from "../../assets/theme";
import { getProfile } from "../Data/profile";
import { getSettings } from "../Data/settings";
import { translate } from "../Data/translations";

export default function Header() {
  const [profile, setProfile] = useState(getProfile());
  const [settings, setSettings] = useState(getSettings());

  // Sinkronkan data profil & pengaturan terupdate setiap kali halaman utama difokuskan
  useFocusEffect(
    useCallback(() => {
      setProfile(getProfile());
      setSettings(getSettings());
    }, [])
  );

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>
          {translate("greeting", settings.language)}, {profile.name} 👋
        </Text>
        <Text style={styles.subGreeting}>
          {translate("subGreeting", settings.language)}
        </Text>
      </View>

      <View style={styles.headerRight}>
        <Bell color={colors.black} size={22} />
        <Image
          source={{ uri: profile.avatar || "https://i.pravatar.cc" }}
          style={styles.avatar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    zIndex: 10,
    // Menambahkan bayangan halus saat konten di-scroll ke bawah
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  greeting: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
  },

  subGreeting: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: colors.grey,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 50,
  },
});
