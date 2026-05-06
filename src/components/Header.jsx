import { View, Text, Image, StyleSheet } from "react-native";
import { Bell } from "lucide-react-native";
import { colors } from "../../assets/theme";

export default function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Halo, Guys 👋</Text>
        <Text style={styles.subGreeting}>Mau jalan kemana hari ini?</Text>
      </View>

      <View style={styles.headerRight}>
        <Bell color={colors.black} size={22} />
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
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
