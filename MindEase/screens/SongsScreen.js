import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
  FlatList,
  Animated,
} from "react-native";
import i18n from "../i18n";

// SONGS DATA
const songsByMood = {
  Happy: [
    {
      title: "Happy Hits!",
      artist: "Spotify Playlist",
      url: "https://open.spotify.com/playlist/5V1jeM647W67eMlShAsMrA?si=3jn3sJ0aQDqzcNInLDMr5w",
      thumbnail: "https://i.scdn.co/image/ab67706f000000020f51ad8a93ce2c32f908db16",
    },
    {
      title: "Happy Vibes 😊",
      artist: "Various",
      url: "https://www.youtube.com/watch?v=ZbZSe6N_BXs",
      thumbnail: "https://img.youtube.com/vi/ZbZSe6N_BXs/0.jpg",
    },
  ],
  Sad: [
    {
      title: "Sad Songs",
      artist: "Spotify Playlist",
      url: "https://open.spotify.com/playlist/5V1jeM647W67eMlShAsMrA?si=3jn3sJ0aQDqzcNInLDMr5w",
      thumbnail: "https://i.scdn.co/image/ab67706f00000002b3fa0337a9913065e3c6fba2",
    },
    {
      title: "Healing Sadness",
      artist: "Andra Day",
      url: "https://www.youtube.com/watch?v=lwgr_IMeEgA",
      thumbnail: "https://img.youtube.com/vi/lwgr_IMeEgA/0.jpg",
    },
  ],
  Angry: [
    {
      title: "Angry Playlist 🔥",
      artist: "Spotify Playlist",
      url: "https://open.spotify.com/playlist/5V1jeM647W67eMlShAsMrA?si=3jn3sJ0aQDqzcNInLDMr5w",
      thumbnail: "https://i.scdn.co/image/ab67706f0000000230b78f504e8f8221ccdfc699",
    },
  ],
  Stress: [
    {
      title: "Stress Relief",
      artist: "Spotify Playlist",
      url: "https://open.spotify.com/playlist/37i9dQZF1DWXe9gFZP0gtP",
      thumbnail: "https://i.scdn.co/image/ab67706f00000002b83c8e52bb6babc38ac6890f",
    },
    {
      title: "Calming Music",
      artist: "Relax",
      url: "https://www.youtube.com/watch?v=1ZYbU82GVz4",
      thumbnail: "https://img.youtube.com/vi/1ZYbU82GVz4/0.jpg",
    },
  ],
  Nervous: [
    {
      title: "Deep Focus",
      artist: "Spotify Playlist",
      url: "https://open.spotify.com/playlist/37i9dQZF1DX3PFzdbtx1Us",
      thumbnail: "https://i.scdn.co/image/ab67706f000000023738e7c6355caca2348c91ef",
    },
    {
      title: "Deep Breathing",
      artist: "Calm Music",
      url: "https://www.youtube.com/watch?v=inpok4MKVLM",
      thumbnail: "https://img.youtube.com/vi/inpok4MKVLM/0.jpg",
    },
  ],
  Lonely: [
    {
      title: "Comfort Songs",
      artist: "Spotify Playlist",
      url: "https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634",
      thumbnail: "https://i.scdn.co/image/ab67706f000000024832e71a4f0a3f82b1f34570",
    },
    {
      title: "Feel-Good Song",
      artist: "Linkin Park",
      url: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
      thumbnail: "https://img.youtube.com/vi/kXYiU_JCYtU/0.jpg",
    },
  ],
};

export default function SongsScreen({ route }) {
  const defaultMood = route?.params?.mood || "Happy";
  const [selectedMood, setSelectedMood] = useState(defaultMood);

  const openSong = (url) => Linking.openURL(url);

  const moodImages = {
    Happy: require("../assets/emotions/happy.png"),
    Sad: require("../assets/emotions/sad.png"),
    Stress: require("../assets/emotions/relief.png"),
    Lonely: require("../assets/emotions/alone.png"),
    Nervous: require("../assets/emotions/worried.png"),
    Angry: require("../assets/emotions/smile.png"),
  };

  const renderSong = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
        <TouchableOpacity style={styles.playBtn} onPress={() => openSong(item.url)}>
          <Text style={styles.playText}>▶ {i18n.t("play") || "Play"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        {i18n.t("songsIntro")} {i18n.t(selectedMood)}
      </Text>

      <Image source={moodImages[selectedMood]} style={styles.moodImage} />

      {/* MOOD SELECTION BUTTONS */}
      <View style={styles.moodContainer}>
        {Object.keys(songsByMood).map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[
              styles.moodButton,
              selectedMood === mood && styles.moodButtonActive,
            ]}
            onPress={() => setSelectedMood(mood)}
          >
            <Text
              style={[
                styles.moodButtonText,
                selectedMood === mood && styles.moodButtonTextActive,
              ]}
            >
              {i18n.t(mood)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SONGS LIST */}
      {songsByMood[selectedMood]?.length > 0 ? (
        <FlatList
          data={songsByMood[selectedMood]}
          renderItem={renderSong}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
        />
      ) : (
        <Text style={{ textAlign: "center", fontSize: 16, color: "#1B5E20" }}>
          {i18n.t("noSongs")} {/* fallback text */}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9" },
  content: { padding: 20 },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2E7D32",
    textAlign: "center",
  },

  moodImage: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 15,
    resizeMode: "contain",
  },

  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },

  moodButton: {
    backgroundColor: "#C8E6C9",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
    elevation: 2,
  },

  moodButtonActive: {
    backgroundColor: "#2E7D32",
    transform: [{ scale: 1.05 }],
    elevation: 5,
  },

  moodButtonText: {
    color: "#1B5E20",
    fontSize: 14,
    fontWeight: "bold",
  },

  moodButtonTextActive: {
    color: "white",
  },

  card: {
    backgroundColor: "#F1F8E9",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    flexDirection: "row",
  },

  thumbnail: { width: 120, height: 120 },

  info: { padding: 15, flex: 1 },

  songTitle: { fontSize: 16, fontWeight: "600", color: "#2E7D32" },

  artist: { fontSize: 14, color: "#388E3C", marginBottom: 10 },

  playBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  playText: { color: "white", fontSize: 14, fontWeight: "bold" },
});
