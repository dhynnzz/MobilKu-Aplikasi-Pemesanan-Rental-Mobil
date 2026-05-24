import { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../assets/theme";
import { getSettings } from "../Data/settings";
import { translate } from "../Data/translations";

// Komponen
import Header from "../components/Header";
import BookingWidget from "../components/BookingWidget";
import Banner from "../components/Banner";
import ListCategory from "../components/ListCategory";
import ListBlog from "../components/ListBlog";

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("Semua Mobil");
  const [searchQuery, setSearchQuery] = useState("");
  const [durasi, setDurasi] = useState(2);
  const [dateRange, setDateRange] = useState("25 Mei 2026 - 27 Mei 2026");
  const [settings, setSettings] = useState(getSettings());
  const scrollViewRef = useRef(null);

  // Sinkronkan data pengaturan setiap kali halaman difokuskan
  useFocusEffect(
    useCallback(() => {
      setSettings(getSettings());
    }, [])
  );

  const handleSearchPress = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 380, animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <Header />

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <Banner />
        <BookingWidget 
          navigation={navigation} 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateRange={dateRange}
          setDateRange={setDateRange}
          durasi={durasi}
          setDurasi={setDurasi}
          onSearchPress={handleSearchPress}
          language={settings.language}
        />
        <ListCategory
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {translate("recommendTitle", settings.language)}
          </Text>
        </View>
        <ListBlog
          styles={styles}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          durasi={durasi}
          dateRange={dateRange}
          language={settings.language}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  section: {
    marginTop: 18,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
  },
  listBlog: {
    paddingVertical: 10,
    gap: 10,
  },
});
