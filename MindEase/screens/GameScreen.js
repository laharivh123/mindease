import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import i18n from "../i18n"; // ✅ correct import

const emotionGames = {
  Happy: "https://www.coolmathgames.com/0-puzzle-blocks",
  Sad: "https://www.calm.com/",
  Angry: "https://www.crazygames.com/t/strategy",
  Loved: "https://www.justcolor.net/",
  Scared: "https://www.spielesammlung.com/fun/scary-games",
  Tired: "https://www.crazygames.com/game/cookie-clicker",
  Neutral: "https://www.wordplays.com/",
};

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😍", label: "Loved" },
  { emoji: "😨", label: "Scared" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😐", label: "Neutral" },
];

export default function GameScreen() {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleTap = (mood) => {
    setSelectedMood(mood);

    const gameURL = emotionGames[mood.label];
    if (gameURL) {
      Alert.alert(
        i18n.t("moodDetected", { defaultValue: "Mood detected!" }),
        i18n.t("redirectToGame", { defaultValue: "Redirecting to a game..." }),
        [
          {
            text: i18n.t("playNow", { defaultValue: "Play Now" }),
            onPress: () => Linking.openURL(gameURL),
          },
          {
            text: i18n.t("cancel", { defaultValue: "Cancel" }),
            style: "cancel",
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 {i18n.t("gameTitle", { defaultValue: "Games" })}</Text>
      <Text style={styles.subtitle}>
        {i18n.t("tapToPlay", { defaultValue: "Tap a mood to play" })}
      </Text>

      <View style={styles.moodRow}>
        {moods.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.moodBox,
              selectedMood?.label === item.label && styles.selectedMood,
            ]}
            onPress={() => handleTap(item)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>
              {i18n.t(item.label, { defaultValue: item.label })}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9", // light green background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    marginBottom: 5, 
    color: "#2E7D32", // dark green
  },
  subtitle: { 
    fontSize: 16, 
    marginBottom: 20, 
    color: "#1B5E20", // darker green
  },
  moodRow: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "center" 
  },
  moodBox: {
    width: 100,
    height: 100,
    backgroundColor: "#C8E6C9", // soft green
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  selectedMood: { 
    borderWidth: 3, 
    borderColor: "#34A853", // vibrant green
  },
  emoji: { fontSize: 36 },
  label: { 
    marginTop: 5, 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#1B5E20", // dark green text
  },
});
