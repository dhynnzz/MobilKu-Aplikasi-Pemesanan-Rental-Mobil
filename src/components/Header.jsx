import { useState, useCallback } from "react";
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, ScrollView } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Bell, X, Info } from "lucide-react-native";
import { colors } from "../../assets/theme";
import { supabase } from '../libs/supabase';
import { getSettings } from "../Data/settings";
import { translate } from "../Data/translations";

export default function Header() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({ name: 'User', avatar: '' });
  const [settings, setSettings] = useState(getSettings());
  
  // Notification States
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase.from('users').select('*').eq('id', session.user.id).single();
      if (!error && data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile in Header:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id, is_read) => {
    if (is_read) return; // Already read
    
    // Update local state optimistically
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Update DB
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };

  // Sinkronkan data profil & pengaturan terupdate setiap kali halaman utama difokuskan
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      fetchNotifications();
      setSettings(getSettings());
    }, [])
  );

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>
          {translate("greeting", settings.language)}, {profile.name} 👋
        </Text>
        <Text style={styles.subGreeting}>
          {translate("subGreeting", settings.language)}
        </Text>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ position: 'relative' }}>
          <Bell color={colors.black} size={22} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("Profil")}>
          <Image
            source={{ uri: profile.avatar || "https://i.pravatar.cc" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Notifications Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifikasi</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#333" size={22} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {notifications.length === 0 ? (
                <Text style={styles.emptyText}>Tidak ada notifikasi saat ini.</Text>
              ) : (
                notifications.map((notif) => (
                  <TouchableOpacity 
                    key={notif.id} 
                    style={[styles.notifCard, !notif.is_read && styles.notifCardUnread]}
                    onPress={() => markAsRead(notif.id, notif.is_read)}
                  >
                    <View style={styles.notifIcon}>
                      <Info color={notif.is_read ? colors.grey : colors.blue} size={20} />
                    </View>
                    <View style={styles.notifTextContainer}>
                      <Text style={[styles.notifTitle, !notif.is_read && styles.notifTitleUnread]}>{notif.title}</Text>
                      <Text style={styles.notifMessage}>{notif.message}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 2,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: 'Poppins-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontFamily: 'Poppins-Regular',
    marginTop: 50,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  notifCardUnread: {
    backgroundColor: '#EBF5FF',
    borderColor: '#CCE0FF',
  },
  notifIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  notifTextContainer: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#555',
    marginBottom: 4,
  },
  notifTitleUnread: {
    color: '#0055FF',
  },
  notifMessage: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#777',
    lineHeight: 18,
  },
});
