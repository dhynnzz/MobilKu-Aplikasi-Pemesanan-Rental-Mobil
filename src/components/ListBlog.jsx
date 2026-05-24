import { useState, useEffect, useRef, useCallback } from "react";
import {
  ScrollView, View, StyleSheet, Text, ImageBackground, Image, Animated, TouchableOpacity, Modal, Dimensions, Platform
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { colors } from "../../assets/theme";
import { Car, Fuel, Users, Settings, Star, Heart, X } from "lucide-react-native";
import { BlogList } from "../Data/blogs";
import { getFavorites, addFavorite, removeFavorite } from "../Data/favorites";
import { translate } from "../Data/translations";

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

export default function ListBlog({ styles, selectedCategory, searchQuery, durasi, dateRange, language = "id" }) {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openCarModal = (car) => {
    setSelectedCar(car);
    setModalVisible(true);
  };

  const closeCarModal = () => {
    setModalVisible(false);
    setSelectedCar(null);
  };

  // Sinkronkan daftar favorit terupdate setiap kali halaman utama difokuskan
  useFocusEffect(
    useCallback(() => {
      setFavorites(getFavorites());
    }, [])
  );

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      removeFavorite(id);
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      addFavorite(id);
      setFavorites([...favorites, id]);
    }
  };

  const filteredData = BlogList
    .filter((item) => selectedCategory === "Semua Mobil" || item.category === selectedCategory)
    .filter((item) => item.title.toLowerCase().includes((searchQuery || "").toLowerCase()));

  return (
    <ScrollView>
      <View style={styles.listBlog}>
        <View style={itemVertical.listCard}>
          {filteredData.map((item, index) => (
            <AnimatedCard key={item.id} index={index}>
              <View style={itemVertical.cardItem}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => openCarModal(item)}>
                  <Image
                    style={itemVertical.cardImage}
                    source={{
                      uri: item.image,
                    }}
                  />
                </TouchableOpacity>

                <View style={itemVertical.cardContent}>
                  <View style={itemVertical.topContent}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => openCarModal(item)}
                      style={{ gap: 2, flex: 1, paddingRight: 8 }}
                    >
                      <Text style={itemVertical.cardCategory}>
                        {item.category.toUpperCase()}
                      </Text>
                      <Text style={itemVertical.cardTitle}>{item.title}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                        <Star size={10} color="#FFD700" fill="#FFD700" />
                        <Text style={{ fontSize: 9, color: colors.grey, fontFamily: "Pjs-Medium" }}>{item.rating}/5.0</Text>
                      </View>
                      <Text style={itemVertical.cardDescription} numberOfLines={1}>
                        {typeof item.description === "object" ? item.description[language] : item.description}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => toggleFavorite(item.id)}
                      style={itemVertical.heartButton}
                      activeOpacity={0.6}
                    >
                      <Heart
                        size={16}
                        color={favorites.includes(item.id) ? "#FF5252" : "#B0B0B0"}
                        fill={favorites.includes(item.id) ? "#FF5252" : "transparent"}
                      />
                    </TouchableOpacity>
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

                    <TouchableOpacity
                      onPress={() => item.isAvailable && navigation.navigate("Booking", { car: item, days: durasi, dateRange: dateRange })}
                      disabled={!item.isAvailable}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        itemVertical.button,
                        { backgroundColor: item.isAvailable ? colors.blue : "#d9d9d9", color: item.isAvailable ? colors.white : "#7a7a7a" }
                      ]}>
                        {item.isAvailable ? "Sewa" : "Habis"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </AnimatedCard>
          ))}
        </View>
      </View>

      {/* Premium Car Detail Modal */}
      {selectedCar && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          statusBarTranslucent={true}
          onRequestClose={closeCarModal}
        >
          <View style={modalStyles.modalOverlay}>
            <TouchableOpacity 
              style={modalStyles.modalDismissArea} 
              activeOpacity={1} 
              onPress={closeCarModal} 
            />
            <View style={modalStyles.modalContainer}>
              {/* Drag Handle Indicator */}
              <View style={modalStyles.dragHandle} />

              {/* Header */}
              <View style={modalStyles.modalHeader}>
                <Text style={modalStyles.modalHeaderTitle}>
                  {translate("carDetails", language)}
                </Text>
                <TouchableOpacity 
                  onPress={closeCarModal} 
                  style={modalStyles.closeIconButton}
                  activeOpacity={0.7}
                >
                  <X size={20} color={colors.black} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={modalStyles.modalScrollContent}>
                {/* Car Image */}
                <Image
                  source={{ uri: selectedCar.image }}
                  style={modalStyles.modalImage}
                  resizeMode="cover"
                />

                {/* Title & Info Block */}
                <View style={modalStyles.carMetaContainer}>
                  <View style={modalStyles.metaRow}>
                    <View style={modalStyles.categoryBadge}>
                      <Text style={modalStyles.categoryBadgeText}>
                        {selectedCar.category.toUpperCase()}
                      </Text>
                    </View>
                    <View style={modalStyles.ratingBadge}>
                      <Star size={12} color="#FFD700" fill="#FFD700" />
                      <Text style={modalStyles.ratingText}>
                        {selectedCar.rating} / 5.0
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={modalStyles.modalCarTitle}>{selectedCar.title}</Text>
                </View>

                {/* Specs Section */}
                <Text style={modalStyles.sectionLabel}>
                  {translate("specifications", language)}
                </Text>
                <View style={modalStyles.specsGrid}>
                  <View style={modalStyles.specItem}>
                    <View style={modalStyles.specIconWrapper}>
                      <Fuel size={20} color={colors.blue} />
                    </View>
                    <Text style={modalStyles.specName}>Bahan Bakar</Text>
                    <Text style={modalStyles.specValue}>{selectedCar.fuel}</Text>
                  </View>

                  <View style={modalStyles.specItem}>
                    <View style={modalStyles.specIconWrapper}>
                      <Users size={20} color={colors.blue} />
                    </View>
                    <Text style={modalStyles.specName}>Kapasitas</Text>
                    <Text style={modalStyles.specValue}>{selectedCar.seat}</Text>
                  </View>

                  <View style={modalStyles.specItem}>
                    <View style={modalStyles.specIconWrapper}>
                      <Settings size={20} color={colors.blue} />
                    </View>
                    <Text style={modalStyles.specName}>Transmisi</Text>
                    <Text style={modalStyles.specValue}>
                      {selectedCar.transmission}
                    </Text>
                  </View>
                </View>

                {/* Description Section */}
                <Text style={modalStyles.sectionLabel}>
                  {translate("descriptionLabel", language)}
                </Text>
                <View style={modalStyles.descriptionContainer}>
                  <Text style={modalStyles.descriptionText}>
                    {typeof selectedCar.description === "object"
                      ? selectedCar.description[language]
                      : selectedCar.description}
                  </Text>
                </View>
              </ScrollView>

              {/* Sticky Footer Info & Actions */}
              <View style={modalStyles.modalFooter}>
                <View style={modalStyles.priceWrapper}>
                  <Text style={modalStyles.footerPriceVal}>{selectedCar.price.split(" /")[0]}</Text>
                  <Text style={modalStyles.footerPriceUnit}>
                    {translate("pricePerDay", language)}
                  </Text>
                </View>

                <View style={modalStyles.footerActions}>
                  <TouchableOpacity
                    onPress={closeCarModal}
                    style={modalStyles.secondaryButton}
                    activeOpacity={0.7}
                  >
                    <Text style={modalStyles.secondaryButtonText}>
                      {translate("closeBtn", language)}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      if (selectedCar.isAvailable) {
                        closeCarModal();
                        navigation.navigate("Booking", {
                          car: selectedCar,
                          days: durasi,
                          dateRange: dateRange,
                        });
                      }
                    }}
                    disabled={!selectedCar.isAvailable}
                    style={[
                      modalStyles.primaryButton,
                      !selectedCar.isAvailable && { backgroundColor: "#d9d9d9" },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      modalStyles.primaryButtonText,
                      !selectedCar.isAvailable && { color: "#7a7a7a" }
                    ]}>
                      {selectedCar.isAvailable
                        ? translate("rentNowBtn", language)
                        : translate("notAvailableStatus", language)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const itemVertical = StyleSheet.create({
  listCard: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    gap: 15,
  },
  heartButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#F5F5FA',
    alignItems: 'center',
    justifyContent: 'center',
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
  cardDescription: {
    fontSize: 9,
    color: '#8A8A8E',
    fontFamily: 'Pjs-Regular',
    marginTop: 1,
    lineHeight: 12,
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

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalDismissArea: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E6',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontFamily: 'Pjs-Bold',
    color: colors.black,
  },
  closeIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollContent: {
    paddingBottom: 24,
  },
  modalImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
  },
  carMetaContainer: {
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: colors.blue,
    fontSize: 10,
    fontFamily: 'Pjs-Bold',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 10,
    color: '#FFA800',
    fontFamily: 'Pjs-Bold',
  },
  modalCarTitle: {
    fontSize: 22,
    fontFamily: 'Pjs-Bold',
    color: colors.black,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'Pjs-SemiBold',
    color: colors.grey,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  specsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  specItem: {
    flex: 1,
    backgroundColor: '#F8F9FD',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEFF6',
  },
  specIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  specName: {
    fontSize: 9,
    color: colors.grey,
    fontFamily: 'Pjs-Medium',
    marginBottom: 2,
  },
  specValue: {
    fontSize: 10,
    fontFamily: 'Pjs-Bold',
    color: colors.black,
  },
  descriptionContainer: {
    backgroundColor: '#F8F9FD',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECEFF6',
  },
  descriptionText: {
    fontSize: 13,
    color: '#4E4E54',
    fontFamily: 'Pjs-Regular',
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ECECEF',
    backgroundColor: colors.white,
  },
  priceWrapper: {
    flexDirection: 'column',
  },
  footerPriceVal: {
    fontSize: 18,
    fontFamily: 'Pjs-Bold',
    color: colors.blue,
  },
  footerPriceUnit: {
    fontSize: 10,
    color: colors.grey,
    fontFamily: 'Pjs-Regular',
    marginTop: -2,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 16,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 13,
    fontFamily: 'Pjs-SemiBold',
    color: colors.black,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 160,
  },
  primaryButtonText: {
    fontSize: 13,
    fontFamily: 'Pjs-Bold',
    color: colors.white,
  },
});

