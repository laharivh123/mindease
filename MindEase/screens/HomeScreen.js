import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import i18n from '../i18n';

// Tile Component
const NavTile = ({ title, icon, screenName, navigation }) => (
  <TouchableOpacity
    style={styles.tile}
    onPress={() => navigation.navigate(screenName)}
  >
    <Text style={styles.tileIcon}>{icon}</Text>
    <Text style={styles.tileText}>{title}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>👋 {i18n.t("welcome")}</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={styles.profileButton}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Feature Grid */}
      <View style={styles.grid}>

        <NavTile title={i18n.t("dailyMoodLog")} icon="📘" screenName="MoodTracker" navigation={navigation} />
        <NavTile title={i18n.t("cameraEmotion")} icon="📸" screenName="CameraEmotion" navigation={navigation} />
        <NavTile title={i18n.t("voiceEmotion")} icon="🎤" screenName="VoiceEmotion" navigation={navigation} />
        <NavTile title={i18n.t("chatbot")} icon="🤖" screenName="Chatbot" navigation={navigation} />
        <NavTile title={i18n.t("games")} icon="🎮" screenName="Game" navigation={navigation} />
        <NavTile title={i18n.t("journal")} icon="📓" screenName="Journal" navigation={navigation} />
        <NavTile title={i18n.t("songs")} icon="🎵" screenName="Songs" navigation={navigation} />
        <NavTile title={i18n.t("exercise")} icon="💪" screenName="Exercise" navigation={navigation} />
        <NavTile title={i18n.t("habitTracker")} icon="📅" screenName="HabitTracker" navigation={navigation} />

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: '#E8F5E9' },
  container: { padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  welcomeText: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32' },
  profileButton: { backgroundColor: '#A5D6A7', borderRadius: 20, padding: 8 },
  profileIcon: { fontSize: 20 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#C8E6C9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    padding: 10,
  },
  tileIcon: { fontSize: 45, marginBottom: 10 },
  tileText: { fontSize: 16, fontWeight: '600', textAlign: 'center', color: '#1B5E20' },
});
