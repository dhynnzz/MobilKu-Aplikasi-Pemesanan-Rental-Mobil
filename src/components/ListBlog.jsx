import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
} from "react-native";
import { colors } from "../../assets/theme";
import { Car, Fuel, Users, Bookmark } from "lucide-react-native";

export default function ListBlog({ styles }) {
  return (
    <ScrollView>
      <View style={styles.listBlog}>


        {/* ===================== */}
        {/* LIST MOBIL (VERTICAL) */}
        {/* ===================== */}
        <View style={itemVertical.listCard}>

          {/* MOBIL 1 */}
          <View style={itemVertical.cardItem}>
            <Image
              style={itemVertical.cardImage}
              source={{
                uri: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2",
              }}
            />

            <View style={itemVertical.cardContent}>
              <View style={itemVertical.topContent}>
                <View style={{ gap: 5 }}>
                  <Text style={itemVertical.cardCategory}>MPV</Text>
                  <Text style={itemVertical.cardTitle}>
                    Toyota Avanza
                  </Text>
                </View>

                <Car size={20} color={colors.blue} />
              </View>

              

              {/* Info mobil */}
              <View style={itemVertical.cardInfo}>
                <Fuel size={12} color={colors.grey} />
                <Text style={itemVertical.cardText}>Bensin</Text>

                <Users size={12} color={colors.grey} />
                <Text style={itemVertical.cardText}>7 Seat</Text>
              </View>

              {/* Harga + Tombol */}
              <View style={itemVertical.bottomContent}>
                <Text style={itemVertical.price}>
                  Rp 350.000 / hari
                </Text>

                <Text style={itemVertical.button}>
                  Sewa
                </Text>
              </View>
            </View>
          </View>

          

          {/* MOBIL 2 */}
          <View style={itemVertical.cardItem}>
            <Image
              style={itemVertical.cardImage}
              source={{
                uri: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a",
              }}
            />

            

            <View style={itemVertical.cardContent}>
              <View style={itemVertical.topContent}>
                <View style={{ gap: 5 }}>
                  <Text style={itemVertical.cardCategory}>SUV</Text>
                  <Text style={itemVertical.cardTitle}>
                    Mitsubishi 
                  </Text>
                </View>

                <Car size={20} color={colors.blue} />
              </View>

              <View style={itemVertical.cardInfo}>
                <Fuel size={12} color={colors.grey} />
                <Text style={itemVertical.cardText}>Diesel</Text>

                <Users size={12} color={colors.grey} />
                <Text style={itemVertical.cardText}>7 Seat</Text>
              </View>

              <View style={itemVertical.bottomContent}>
                <Text style={itemVertical.price}>
                  Rp 500.000 / hari
                </Text>

                <Text style={itemVertical.button}>
                  Sewa
                </Text>
              </View>
            </View>
          </View>

          {/* MOBIL 2 */}
          <View style={itemVertical.cardItem}>
            <Image
              style={itemVertical.cardImage}
              source={{
                uri: "https://images.unsplash.com/photo-1537984822441-cff330075342?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
            />

            

            <View style={itemVertical.cardContent}>
              <View style={itemVertical.topContent}>
                <View style={{ gap: 5 }}>
                  <Text style={itemVertical.cardCategory}>PREMIUM</Text>
                  <Text style={itemVertical.cardTitle}>
                    BMW 2 Series Coupe
                  </Text>
                </View>

                <Car size={20} color={colors.blue} />
              </View>

              <View style={itemVertical.cardInfo}>
                <Fuel size={12} color={colors.grey} />
                <Text style={itemVertical.cardText}>Bensin</Text>

                <Users size={12} color={colors.grey} />
                <Text style={itemVertical.cardText}>2 Tempat duduk</Text>
              </View>

              <View style={itemVertical.bottomContent}>
                <Text style={itemVertical.price}>
                  Rp 800.000 / hari
                </Text>

                <Text style={itemVertical.button}>
                  Sewa
                </Text>
              </View>
            </View>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}

/* ===================== */
/* STYLE VERTICAL (LIST) */
/* ===================== */
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

/* ===================== */
/* STYLE HORIZONTAL */
/* ===================== */
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