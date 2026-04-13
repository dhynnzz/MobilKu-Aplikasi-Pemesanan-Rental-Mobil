import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Search } from 'lucide-react-native';
import { colors, fontType } from './assets/theme';
import ListBlog from './src/components/ListBlog';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [loaded] = useFonts(fontType);

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, Guys 👋</Text>
          <Text style={styles.subGreeting}>
            Mau jalan kemana hari ini?
          </Text>
        </View>

        <View style={styles.headerRight}>
          <Bell color={colors.black} size={22} />
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Search size={18} color={colors.grey} />
        <TextInput
          placeholder="Cari mobil favorit kamu..."
          placeholderTextColor={colors.grey}
          style={styles.input}
        />
      </View>


     <View style={styles.banner}>
  <View style={styles.bannerLeft}>
    <Text style={styles.bannerTitle}>Drive in Style</Text>
    <Text style={styles.bannerText}>
      Pilih mobil terbaik dengan harga terbaik
    </Text>
  </View>

  <Image
    source={{
      uri: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7',
    }}
    style={styles.bannerCar}
  />
</View>

      {/* CATEGORY */}
     <View style={styles.listCategory}>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>

    <View style={[category.item, { marginLeft: 24 }]}>
      <View style={category.circle}>
        <Image
          source={{ uri: 'https://i.pinimg.com/1200x/33/6f/73/336f73e03ea0c94ccc5e618706b10f1f.jpg' }}
          style={category.image}
        />
      </View>
      <Text style={category.label}>Semua Mobil</Text>
    </View>

    <View style={category.item}>
      <View style={category.circle}>
        <Image
          source={{ uri: 'https://i.pinimg.com/736x/82/21/98/82219876656cca3c03e3c6b15c8475c7.jpg' }}
          style={category.image}
        />
      </View>
      <Text style={category.label}>SUV</Text>
    </View>

    <View style={category.item}>
      <View style={category.circle}>
        <Image
          source={{ uri: 'https://i.pinimg.com/736x/8a/41/b2/8a41b26d152b6893bbe16860ea8dade3.jpg' }}
          style={category.image}
        />
      </View>
      <Text style={category.label}>Minibus</Text>
    </View>

    <View style={category.item}>
      <View style={category.circle}>
        <Image
          source={{ uri: 'https://i.pinimg.com/1200x/5c/f1/1e/5cf11ebdbca209760b39b30df0858096.jpg' }}
          style={category.image}
        />
      </View>
      <Text style={category.label}>Premium</Text>
    </View>

    <View style={[category.item, { marginRight: 24 }]}>
      <View style={category.circle}>
        <Image
          source={{ uri: 'https://i.pinimg.com/1200x/d4/40/28/d440281d63269f2040ce30db757130bf.jpg' }}
          style={category.image}
        />
      </View>
      <Text style={category.label}>Sedan</Text>
    </View>

  </ScrollView>
</View>

      {/* TITLE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rekomendasi untuk kamu</Text>
      </View>

      {/* LIST */}
      <ListBlog styles={styles} />
    </SafeAreaView>
  );
}

/* ===================== */
/* STYLE */
/* ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    paddingHorizontal: 20,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: colors.black,
  },

  subGreeting: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.grey,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 50,
  },

  searchBox: {
    marginHorizontal: 24,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    gap: 8,
  },

  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.black,
  },

  smallInfo: {
    marginHorizontal: 24,
    marginTop: 10,
  },

  smallText: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: 'Poppins-Medium',
  },

 

  banner: {
  marginHorizontal: 24,
  marginTop: 12,
  borderRadius: 16,
  backgroundColor: '#ffffff',
  flexDirection: 'row',
  alignItems: 'center',
  padding: 16,

  // subtle shadow
  shadowColor: '#000',
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
  fontFamily: 'Poppins-SemiBold',
  color: colors.black,
},

bannerText: {
  fontSize: 12,
  marginTop: 4,
  fontFamily: 'Poppins-Regular',
  color: colors.grey,
},

bannerCar: {
  width: 100,
  height: 60,
  borderRadius: 10,
  opacity: 0.9,
},


  listCategory: {
    marginTop: 15,
  },

  section: {
    marginTop: 18,
    paddingHorizontal: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: colors.black,
  },

  listBlog: {
    paddingVertical: 10,
    gap: 10,
  },
});

/* ===================== */
/* CATEGORY */
/* ===================== */

const category = StyleSheet.create({
  item: {
    alignItems: 'center',
    marginHorizontal: 12,
  },

  circle: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#f2f4f7',
    justifyContent: 'center',
    alignItems: 'center',

    // soft shadow (biar floating)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 5,
  },

 image: {
  width: '80%',
  height: '80%',
  borderRadius: 100,

},

  label: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#2c2c2c',
  },

});