import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  getAuth,
  signOut,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { ref, remove, onValue } from "firebase/database";
import { db } from "../firebase";
import i18n from "../i18n";

export default function ProfileScreen({ navigation, setAppLocale, currentLocale }) {
  const auth = getAuth();
  const user = auth.currentUser;

  const [profileData, setProfileData] = useState({});
  const [latestEmotion, setLatestEmotion] = useState(null);
  const [emotionHistoryCount, setEmotionHistoryCount] = useState(0);
  const [streak, setStreak] = useState({ count: 0, lastOpened: "" });
  const [usageCount, setUsageCount] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [reauthEmail, setReauthEmail] = useState(user?.email || "");
  const [reauthPassword, setReauthPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const userRef = ref(db, `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val() || {};
      setProfileData(data);

      // Latest Emotion
      if (data.lastEmotion) {
        setLatestEmotion(data.lastEmotion);
      } else if (data.emotions && Object.keys(data.emotions).length > 0) {
        const sorted = Object.values(data.emotions).sort(
          (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
        );
        setLatestEmotion(sorted[0].emotion);
      } else {
        setLatestEmotion(null);
      }

      setEmotionHistoryCount(data.emotions ? Object.keys(data.emotions).length : 0);

      // Streak
      setStreak(data.streak || { count: 0, lastOpened: "" });

      // Usage Count
      setUsageCount(data.usageCount || 0);
    });

    return () => unsubscribe();
  }, [user]);

  const availableLanguages = [
    { code: "en", flag: "🇺🇸" },
    { code: "hi", flag: "🇮🇳" },
    { code: "te", flag: "🇮🇳" },
    { code: "ta", flag: "🇮🇳" },
    { code: "kn", flag: "🇮🇳" },
  ];

  const changeLanguage = (lang) => setAppLocale(lang);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => navigation.replace("Login"))
      .catch((error) => console.error("Sign Out Error:", error.message));
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      i18n.t("deleteConfirmTitle"),
      i18n.t("deleteConfirmMessage"),
      [
        { text: i18n.t("cancel"), style: "cancel" },
        {
          text: i18n.t("delete"),
          onPress: async () => {
            try {
              await remove(ref(db, `users/${user.uid}`));
              await deleteUser(user);

              Alert.alert(i18n.t("accountDeletedTitle"), i18n.t("accountDeletedMessage"));
              navigation.replace("Login");
            } catch (error) {
              if (error.code === "auth/requires-recent-login") {
                setModalVisible(true);
              } else {
                Alert.alert(i18n.t("error"), error.message);
              }
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleReauthAndDelete = async () => {
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(reauthEmail, reauthPassword);
      await reauthenticateWithCredential(user, credential);

      await remove(ref(db, `users/${user.uid}`));
      await deleteUser(user);

      setModalVisible(false);
      Alert.alert(i18n.t("accountDeletedTitle"), i18n.t("accountDeletedMessage"));
      navigation.replace("Login");
    } catch (error) {
      Alert.alert(i18n.t("error"), error.message);
    } finally {
      setLoading(false);
    }
  };

  const emotionEmoji = {
    happy: "😊",
    sadness: "😢",
    sad: "😢",
    angry: "😡",
    anger: "😡",
    fear: "😨",
    disgust: "😒",
    surprise: "😲",
    neutral: "😐",
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        {/* Removed Profile Photo */}

        <Text style={styles.name}>
          {profileData.name || user?.displayName || "User"}
        </Text>

        <Text style={styles.bio}>“{i18n.t("profileBio")}”</Text>

        {/* Info Cards */}
        <View style={styles.infoCard}>
          <Text style={styles.label}>{i18n.t("email")}</Text>
          <Text style={styles.value}>{profileData.email || user?.email}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>{i18n.t("gender")}</Text>
          <Text style={styles.value}>{profileData.gender || i18n.t("notAvailable")}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>{i18n.t("age")}</Text>
          <Text style={styles.value}>{profileData.age || i18n.t("notAvailable")}</Text>
        </View>

        {/* Latest Emotion */}
        <Text style={styles.sectionTitle}>😊 {i18n.t("latestEmotion")}</Text>
        <View style={styles.emotionCard}>
          <Text style={styles.emotionEmoji}>
            {emotionEmoji[(latestEmotion || "").toLowerCase()] || "🙂"}
          </Text>
          <View>
            <Text style={styles.emotionText}>
              {latestEmotion || i18n.t("notAvailable")}
            </Text>
            <Text style={styles.historyCount}>
              {i18n.t("emotionHistory")}: {emotionHistoryCount}
            </Text>
          </View>
        </View>

        {/* Streak */}
        <Text style={styles.sectionTitle}>🔥 {i18n.t("dailyStreak")}</Text>
        <View style={styles.streakCard}>
          <Text style={styles.streakNumber}>{streak.count}</Text>
          <Text style={styles.streakLabel}>{i18n.t("daysInARow")}</Text>
        </View>

        {/* Removed Achievements & Badges */}

        {/* Usage Count */}
        <Text style={styles.sectionTitle}>📱 {i18n.t("appUsage")}</Text>
        <View style={styles.usageCard}>
          <Text style={styles.usageNumber}>{usageCount}</Text>
          <Text style={styles.usageLabel}>{i18n.t("timesUsed")}</Text>
        </View>

        {/* Language Selector */}
        <Text style={styles.langHeader}>{i18n.t("selectLanguage")}</Text>
        <View style={styles.languageContainer}>
          {availableLanguages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.langButton,
                currentLocale === lang.code && styles.activeLangButton,
              ]}
              onPress={() => changeLanguage(lang.code)}
            >
              <Text
                style={[
                  styles.flagText,
                  currentLocale === lang.code && { color: "#FFF" },
                ]}
              >
                {lang.flag}
              </Text>
              <Text
                style={[
                  styles.langCodeText,
                  currentLocale === lang.code && { color: "#FFF" },
                ]}
              >
                {lang.code.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutText}>{i18n.t("logout")}</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>{i18n.t("deleteAccount")}</Text>
        </TouchableOpacity>
      </View>

      {/* Re-auth Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{i18n.t("reauthTitle")}</Text>
            <Text>{i18n.t("reauthMessage")}</Text>

            <TextInput
              style={styles.input}
              placeholder={i18n.t("email")}
              value={reauthEmail}
              onChangeText={setReauthEmail}
            />

            <TextInput
              style={styles.input}
              placeholder={i18n.t("password")}
              value={reauthPassword}
              onChangeText={setReauthPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleReauthAndDelete}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmText}>{i18n.t("deleteAccount")}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>{i18n.t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingBottom: 40, backgroundColor: "#E8F5E9" },
  container: { flex: 1, paddingHorizontal: 20, alignItems: "center", paddingTop: 40 },
  name: { fontSize: 24, fontWeight: "bold", color: "#2E7D32" },
  bio: { fontSize: 14, color: "#4CAF50", marginBottom: 20, fontStyle: "italic" },
  infoCard: { width: "100%", padding: 15, backgroundColor: "#F1F8E9", borderRadius: 10, marginBottom: 10, elevation: 3 },
  label: { fontSize: 14, color: "#388E3C" },
  value: { fontSize: 18, fontWeight: "600", color: "#2E7D32" },
  sectionTitle: { width: "100%", fontSize: 18, fontWeight: "700", marginTop: 20, color: "#2E7D32" },
  emotionCard: { width: "100%", flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#F1F8E9", borderRadius: 10, marginBottom: 10, elevation: 3 },
  emotionEmoji: { fontSize: 32, marginRight: 12 },
  emotionText: { fontSize: 18, fontWeight: "700", color: "#2E7D32" },
  historyCount: { marginTop: 5, color: "#388E3C" },
  streakCard: { width: "100%", padding: 15, backgroundColor: "#F1F8E9", borderRadius: 10, marginBottom: 10, elevation: 3, alignItems: "center" },
  streakNumber: { fontSize: 24, fontWeight: "700", color: "#2E7D32" },
  streakLabel: { fontSize: 14, color: "#388E3C" },
  usageCard: { width: "100%", padding: 15, backgroundColor: "#F1F8E9", borderRadius: 10, marginBottom: 10, elevation: 3, alignItems: "center" },
  usageNumber: { fontSize: 24, fontWeight: "700", color: "#2E7D32" },
  usageLabel: { fontSize: 14, color: "#388E3C" },
  langHeader: { width: "100%", fontSize: 18, fontWeight: "700", marginTop: 20, marginBottom: 10, color: "#2E7D32" },
  languageContainer: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
  langButton: { width: 60, padding: 8, borderRadius: 10, backgroundColor: "#C8E6C9", alignItems: "center" },
  activeLangButton: { backgroundColor: "#2E7D32" },
  flagText: { fontSize: 20 },
  langCodeText: { marginTop: 3, fontWeight: "600", color: "#388E3C" },
  logoutButton: { marginTop: 30, backgroundColor: "#D32F2F", padding: 12, borderRadius: 10, width: "100%", alignItems: "center" },
  logoutText: { color: "white", fontSize: 16, fontWeight: "700" },
  deleteButton: { marginTop: 15, backgroundColor: "#B71C1C", padding: 12, borderRadius: 10, width: "100%", alignItems: "center" },
  deleteText: { color: "white", fontSize: 16, fontWeight: "700" },
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { margin: 20, padding: 20, backgroundColor: "#fff", borderRadius: 12, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#B71C1C" },
  input: { backgroundColor: "#F1F8E9", padding: 10, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: "#C8E6C9" },
  confirmButton: { backgroundColor: "#D32F2F", padding: 12, borderRadius: 10, marginTop: 15, alignItems: "center" },
  confirmText: { color: "white", fontSize: 16, fontWeight: "700" },
  cancelButton: { backgroundColor: "#E0E0E0", padding: 12, borderRadius: 10, marginTop: 10, alignItems: "center" },
  cancelText: { color: "#424242", fontSize: 16, fontWeight: "700" },
});
