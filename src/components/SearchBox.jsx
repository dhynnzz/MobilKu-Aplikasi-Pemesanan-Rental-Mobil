import { View, TextInput, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";
import { colors } from "../../assets/theme";

export default function SearchBox() {
  return (
    <View style={styles.searchBox}>
      <Search size={18} color={colors.grey} />
      <TextInput
        placeholder="Cari mobil favorit kamu..."
        placeholderTextColor={colors.grey}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    marginHorizontal: 24,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: colors.black,
  },
});
