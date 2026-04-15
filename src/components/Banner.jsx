import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../../assets/theme";

export default function Banner() {
  return (
    <View style={styles.banner}>
      <View style={styles.bannerLeft}>
        <Text style={styles.bannerTitle}>Drive in Style</Text>
        <Text style={styles.bannerText}>
          Pilih mobil terbaik dengan harga terbaik
        </Text>
      </View>

      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
        }}
        style={styles.bannerCar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 24,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  bannerLeft: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
  },
  bannerText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Poppins-Regular",
    color: colors.grey,
  },
  bannerCar: {
    width: 100,
    height: 60,
    borderRadius: 10,
    opacity: 0.9,
  },
});
