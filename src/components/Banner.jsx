import React, { useRef, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from "react-native";
import { colors } from "../../assets/theme";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.85;
const GAP = 16;
const SNAP_INTERVAL = ITEM_WIDTH + GAP;

export default function Banner() {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const promoData = [
    {
      id: 1,
      title: "Diskon 20% Akhir Pekan",
      desc: "Sewa mobil SUV khusus hari Sabtu & Minggu",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200",
      bgColor: "#E3F2FD" // Biru muda
    },
    {
      id: 2,
      title: "Gratis Jemput Bandara",
      desc: "Untuk sewa lebih dari 3 hari bulan ini",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=200",
      bgColor: "#FFF3E0" // Orange muda
    },
    {
      id: 3,
      title: "Drive in Style",
      desc: "Pilih mobil mewah terbaik dengan harga spesial",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=200",
      bgColor: "#F3E5F5" // Ungu muda
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= promoData.length) {
        nextIndex = 0; // Kembali ke awal
      }
      
      setCurrentIndex(nextIndex);
      
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextIndex * SNAP_INTERVAL,
          animated: true,
        });
      }
    }, 5000); // Geser setiap 3 detik

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Promo Spesial</Text>
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
      >
        {promoData.map((promo) => (
          <View key={promo.id} style={[styles.banner, { backgroundColor: promo.bgColor }]}>
            <View style={styles.bannerLeft}>
              <Text style={styles.bannerTitle}>{promo.title}</Text>
              <Text style={styles.bannerText}>{promo.desc}</Text>
            </View>
            <Image
              source={{ uri: promo.image }}
              style={styles.bannerCar}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.black,
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  banner: {
    width: width * 0.85,
    borderRadius: 16,
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
    paddingRight: 10,
  },
  bannerTitle: {
    fontSize: 15,
    fontFamily: "Poppins-Bold",
    color: colors.black,
  },
  bannerText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Poppins-Medium",
    color: colors.grey,
    lineHeight: 18,
  },
  bannerCar: {
    width: 90,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
});
