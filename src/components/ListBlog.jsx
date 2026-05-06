import { useRef, useEffect } from "react";
import {
  ScrollView, View, StyleSheet, Text, ImageBackground, Image, Animated,
} from "react-native";
import { colors } from "../../assets/theme";
import { Car, Fuel, Users, Settings, Star } from "lucide-react-native";
import { BlogList } from "../Data/blogs";

// Komponen wrapper untuk animasi fade-in + slide-up per card
function AnimatedCard({ children, index }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(60)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const delay = index * 200;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }, { scale }] }}>
      {children}
    </Animated.View>
  );
}

export default function ListBlog({ styles, selectedCategory }) {
  const filteredData =
    selectedCategory === "Semua Mobil"
      ? BlogList
      : BlogList.filter((item) => item.category === selectedCategory);

  return (
    <ScrollView>
      <View style={styles.listBlog}>
        <View style={itemVertical.listCard}>
          {filteredData.map((item, index) => (
            <AnimatedCard key={item.id} index={index}>
              <View style={itemVertical.cardItem}>
                <Image
                  style={itemVertical.cardImage}
                  source={{
                    uri: item.image,
                  }}
                />

                <View style={itemVertical.cardContent}>
                  <View style={itemVertical.topContent}>
                    <View style={{ gap: 5 }}>
                      <Text style={itemVertical.cardCategory}>
                        {item.category.toUpperCase()}
                      </Text>
                      <Text style={itemVertical.cardTitle}>{item.title}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                        <Star size={12} color="#FFD700" fill="#FFD700" />
                        <Text style={{ fontSize: 10, color: colors.grey, fontFamily: "Pjs-Medium" }}>{item.rating}/5.0</Text>
                      </View>
                    </View>

                    <Car size={20} color={colors.blue} />
                  </View>

                  <View style={itemVertical.cardInfo}>
                    <Fuel size={12} color={colors.grey} />
                    <Text style={itemVertical.cardText}>{item.fuel}</Text>

                    <Users size={12} color={colors.grey} />
                    <Text style={itemVertical.cardText}>{item.seat}</Text>

                    <Settings size={12} color={colors.grey} />
                    <Text style={itemVertical.cardText}>{item.transmission === "Automatic" ? "Auto" : "MT"}</Text>
                  </View>

                  <View style={itemVertical.bottomContent}>
                    <Text style={itemVertical.price}>{item.price}</Text>

                    <Text style={[
                      itemVertical.button,
                      { backgroundColor: item.isAvailable ? colors.blue : "#d9d9d9", color: item.isAvailable ? colors.white : "#7a7a7a" }
                    ]}>
                      {item.isAvailable ? "Sewa" : "Habis"}
                    </Text>
                  </View>
                </View>
              </View>
            </AnimatedCard>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const itemVertical = StyleSheet.create({
  listCard: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    gap: 15,
  },

  cardItem: {
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    borderRadius: 10,
  },

  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },

  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },

  topContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardCategory: {
    color: colors.blue,
    fontSize: 10,
    fontFamily: "Pjs-SemiBold",
  },

  cardTitle: {
    fontSize: 14,
    fontFamily: "Pjs-Bold",
    color: colors.black,
  },

  cardInfo: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },

  cardText: {
    fontSize: 10,
    color: colors.grey,
  },

  bottomContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 12,
    fontFamily: "Pjs-Bold",
    color: colors.black,
  },

  button: {
    backgroundColor: colors.blue,
    color: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 10,
  },
});

const itemHorizontal = StyleSheet.create({
  cardItem: {
    width: 280,
  },

  cardImage: {
    width: "100%",
    height: 200,
  },

  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },

  cardInfo: {
    justifyContent: "flex-end",
    gap: 10,
    maxWidth: "60%",
  },

  cardTitle: {
    fontFamily: "Pjs-Bold",
    fontSize: 14,
    color: colors.white,
  },

  cardText: {
    fontSize: 10,
    color: colors.white,
  },

  cardIcon: {
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 5,
    borderRadius: 5,
  },
});

