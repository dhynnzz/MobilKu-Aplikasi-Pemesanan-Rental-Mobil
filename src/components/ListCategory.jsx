import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../assets/theme";
import { CategoryList } from "../data/categories";

const ItemCategory = ({ item, onPress, color }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <View
          style={[
            styles.circle,
            {
              borderWidth: color === colors.blue ? 2 : 0,
              borderColor: colors.blue,
            },
          ]}
        >
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>
        <Text style={{ ...styles.title, color, marginTop: 8 }}>{item.categoryName}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function ListCategory({ selectedCategory, setSelectedCategory }) {
  return (
    <View style={styles.listCategory}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {CategoryList.map((item) => {
          const isActive = selectedCategory === item.categoryName;
          return (
            <ItemCategory
              key={item.id}
              item={item}
              onPress={() => setSelectedCategory(item.categoryName)}
              color={isActive ? colors.blue : "#2c2c2c"}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  listCategory: {
    marginTop: 15,
  },
  item: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  circle: {
    width: 55,
    height: 55,
    borderRadius: 35,
    backgroundColor: "#f2f4f7",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "85%",
    height: "85%",
    borderRadius: 90,
  },
  title: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
});
