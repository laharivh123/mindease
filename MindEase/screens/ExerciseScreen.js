import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import i18n from "../i18n";

export default function ExerciseScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [sound, setSound] = useState(null);

  // 🎵 AUDIO MAP
  const audioMap = {
    sad: require("../assets/audio/meditation.mp3"),
    stress: require("../assets/audio/breathing.mp3"),
    angry: require("../assets/audio/stressfree.mp3"),
    lonely: require("../assets/audio/calm.mp3"),
    happy: require("../assets/audio/meditation.mp3"),
    neutral: require("../assets/audio/calm.mp3"),
    tired: require("../assets/audio/stressfree.mp3"),
    overthinking: require("../assets/audio/breathing.mp3"),
    anxiety: require("../assets/audio/meditation.mp3"),
  };

  // ▶️ PLAY SOUND IMMEDIATELY (FIXED)
  const playSound = async (moodId) => {
    try {
      // stop existing audio first
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        audioMap[moodId],
        { shouldPlay: true } // play IMMEDIATELY
      );

      setSound(newSound);
    } catch (error) {
      console.log("Audio error:", error);
    }
  };

  // ❌ STOP SOUND + CLOSE MODAL (IMMEDIATE)
  const closeModal = async () => {
    try {
      if (sound) {
        await sound.stopAsync(); // stop instantly
        await sound.unloadAsync(); // unload to free memory
      }
    } catch (error) {
      console.log("Stop error:", error);
    }

    setSound(null);
    setSelectedMood(null);
  };

  // 🧹 CLEANUP WHEN SCREEN UNMOUNTS
  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  // ❤️ MOODS LIST
  const MOODS = [
    {
      id: "sad",
      label: "😢 " + i18n.t("Sad"),
      animation: require("../assets/animations/meditation.json"),
      suggestion: i18n.t("sadSug"),
    },
    {
      id: "stress",
      label: "😓 " + i18n.t("Stressed"),
      animation: require("../assets/animations/breathing.json"),
      suggestion: i18n.t("stressSug"),
    },
    {
      id: "angry",
      label: "😡 " + i18n.t("Angry"),
      animation: require("../assets/animations/breathing.json"),
      suggestion: i18n.t("angrySug"),
    },
    {
      id: "lonely",
      label: "😔 " + i18n.t("Lonely"),
      animation: require("../assets/animations/stretching.json"),
      suggestion: i18n.t("lonelySug"),
    },
    {
      id: "happy",
      label: "😄 " + i18n.t("Happy"),
      animation: require("../assets/animations/yoga.json"),
      suggestion: i18n.t("happySug"),
    },
    {
      id: "neutral",
      label: "😐 " + i18n.t("Neutral"),
      animation: require("../assets/animations/meditation.json"),
      suggestion: i18n.t("neutralSug"),
    },
    {
      id: "tired",
      label: "😴 " + i18n.t("Tired"),
      animation: require("../assets/animations/stretching.json"),
      suggestion: i18n.t("tiredSug"),
    },
    {
      id: "overthinking",
      label: "🤯 " + i18n.t("Overthinking"),
      animation: require("../assets/animations/breathing.json"),
      suggestion: i18n.t("overthinkingSug"),
    },
    {
      id: "anxiety",
      label: "😰 " + i18n.t("Anxiety"),
      animation: require("../assets/animations/meditation.json"),
      suggestion: i18n.t("anxietySug"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧘 {i18n.t("howFeeling")}</Text>

      {/* GRID */}
      <View style={styles.grid}>
        {MOODS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => {
              setSelectedMood(item);
              playSound(item.id); // immediate play
            }}
          >
            <Text style={styles.cardText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MODAL */}
      <Modal visible={!!selectedMood} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selectedMood && (
              <>
                <LottieView
                  source={selectedMood.animation}
                  autoPlay
                  loop
                  style={{ width: 200, height: 200 }}
                />

                <Text style={styles.modalTitle}>{selectedMood.label}</Text>

                <Text style={styles.suggestion}>{selectedMood.suggestion}</Text>

                <Text style={styles.subHeader}>✨ {i18n.t("recommended")}</Text>

                <View style={{ alignSelf: "flex-start", marginLeft: 20 }}>
                  <Text style={styles.bullet}>• {i18n.t("breathing")}</Text>
                  <Text style={styles.bullet}>• {i18n.t("meditation")}</Text>
                  <Text style={styles.bullet}>• {i18n.t("stretching")}</Text>
                  <Text style={styles.bullet}>• {i18n.t("yoga")}</Text>
                </View>

                <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                  <Text style={styles.closeText}>❌ {i18n.t("close")}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#2E7D32",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  card: {
    width: "42%",
    backgroundColor: "#C8E6C9",
    marginVertical: 10,
    paddingVertical: 25,
    borderRadius: 15,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B5E20",
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#F1F8E9",
    width: "90%",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
    color: "#2E7D32",
    textAlign: "center",
  },
  suggestion: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
    color: "#1B5E20",
    lineHeight: 22,
  },
  subHeader: {
    fontSize: 18,
    marginTop: 15,
    fontWeight: "600",
    color: "#2E7D32",
  },
  bullet: {
    fontSize: 16,
    marginVertical: 3,
    color: "#1B5E20",
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: "#34A853",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 12,
    elevation: 5,
  },
  closeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
