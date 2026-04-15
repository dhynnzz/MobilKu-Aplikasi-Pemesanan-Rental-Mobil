import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { colors, fontType } from "./assets/theme";

// Komponen
import Header from "./src/components/Header";
import SearchBox from "./src/components/SearchBox";
import Banner from "./src/components/Banner";
import ListCategory from "./src/components/ListCategory";
import ListBlog from "./src/components/ListBlog";

export default function App() {
  const [loaded] = useFonts(fontType);

  // STATE (menyimpan kategori yang sedang dipilih)
  const [selectedCategory, setSelectedCategory] = useState("Semua Mobil");

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <Header />
      <SearchBox />
      <Banner />
      <ListCategory 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />

      {/* TITLE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rekomendasi untuk kamu</Text>
      </View>

      {/* LIST ITEM (PROPS) */}
      <ListBlog 
        styles={styles} 
        selectedCategory={selectedCategory} 
      />
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