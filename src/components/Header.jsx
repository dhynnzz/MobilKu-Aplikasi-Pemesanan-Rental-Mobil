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
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
