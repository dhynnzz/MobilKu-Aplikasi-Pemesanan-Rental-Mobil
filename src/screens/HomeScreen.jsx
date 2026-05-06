import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../assets/theme";

// Komponen
import Header from "../components/Header";
import BookingWidget from "../components/BookingWidget";
import Banner from "../components/Banner";
import ListCategory from "../components/ListCategory";
import ListBlog from "../components/ListBlog";

export default function HomeScreen({ onNavigate }) {
  // STATE (menyimpan kategori yang sedang dipilih)
  const [selectedCategory, setSelectedCategory] = useState("Semua Mobil");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header dibuat FIXED di luar ScrollView */}
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Banner />
        <BookingWidget onNavigate={onNavigate} />
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
