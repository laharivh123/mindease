import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import i18n from "../i18n";
import { getAuth } from "firebase/auth";

// ⭐ IMPORT UPDATED SAVE + STREAK SYSTEM
import { saveEmotion, updateUsageAndStreak } from "../utils/userStats";

export default function VoiceEmotionScreen() {
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const API_KEY = "b507068f3dd54dc89814cf25f3cf20ea";

  // ⭐ Multilingual Emotion Detector
  const detectEmotion = (text) => {
    const low = text.toLowerCase();

    const keywords = {
      sad: ["sad", "असंतोष", "दुखी", "ಅನಿಷ್ಟ", "வருத்தம்", "విషాదం"],
      angry: ["angry", "कुंठित", "कोप", "ಕೊಪ", "கோபம்", "కోపం"],
      happy: ["happy", "खुश", "सुखी", "ಸಂತೋಷ", "மகிழ்ச்சி", "సంతోషం"],
      tired: ["tired", "थका", "दणिद", "ದಣಿದ", "சோர்வு", "అలసట"],
    };

    if (keywords.sad.some((w) => low.includes(w))) return "Sad";
    if (keywords.angry.some((w) => low.includes(w))) return "Angry";
    if (keywords.happy.some((w) => low.includes(w))) return "Happy";
    if (keywords.tired.some((w) => low.includes(w))) return "Tired";

    return "Neutral";
  };

  const getAdviceKey = (emotion) => {
    switch (emotion) {
      case "Sad":
        return "suggestSad";
      case "Angry":
        return "suggestAngry";
      case "Happy":
        return "suggestHappy";
      case "Tired":
        return "suggestTired";
      default:
        return "suggestNeutral";
    }
  };

  // 🎤 START RECORDING
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert("Permission denied", "Enable microphone access.");
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();

      setRecording(rec);
      setTranscription("");
      setAnalysis("");
    } catch (err) {
      console.log("Recording error:", err);
    }
  };

  // 🎤 STOP RECORDING AND ANALYZE
  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      setRecording(null);
      setLoading(true);

      const audioFile = await fetch(uri);
      const blob = await audioFile.blob();

      // Upload to AssemblyAI
      const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
        method: "POST",
        headers: { authorization: API_KEY },
        body: blob,
      });

      const uploadData = await uploadRes.json();
      const uploadUrl = uploadData.upload_url;

      // Request transcription
      const transRes = await fetch("https://api.assemblyai.com/v2/transcript", {
        method: "POST",
        headers: {
          authorization: API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({ audio_url: uploadUrl }),
      });

      const transData = await transRes.json();
      const jobId = transData.id;
      let text = "";

      // Poll until completed
      while (!text) {
        await new Promise((r) => setTimeout(r, 4000));

        const checkRes = await fetch(
          `https://api.assemblyai.com/v2/transcript/${jobId}`,
          { headers: { authorization: API_KEY } }
        );

        const checkData = await checkRes.json();

        if (checkData.status === "completed") {
          text = checkData.text;
        } else if (checkData.status === "error") {
          throw new Error(checkData.error);
        }
      }

      setTranscription(text);

      // ⭐ Detect Emotion
      const emotion = detectEmotion(text);

      if (user) {
        // ⭐ Save in Realtime DB (lastEmotion + emotions history)
        await saveEmotion(user.uid, emotion);

        // ⭐ Update streak + usage count
        await updateUsageAndStreak(user.uid);
      }

      // ⭐ Prepare Advice Text
      const adviceKey = getAdviceKey(emotion);
      const adviceText = i18n.t(adviceKey);

      setAnalysis(`${i18n.t("emotionDetected")}: ${emotion}\n${adviceText}`);

      // Speak the result
      Speech.speak(adviceText, { language: i18n.locale });
    } catch (err) {
      console.log("Stop recording error:", err);
      Alert.alert("Error", "Failed to analyse voice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("voiceEmotionTitle")}</Text>

      <View style={styles.box}>
        <Text>{transcription || i18n.t("speakPrompt")}</Text>

        <Text style={{ marginTop: 10, fontWeight: "600" }}>{analysis}</Text>

        {loading && <ActivityIndicator size="large" color="#2E7D32" />}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          recording ? styles.stopButton : styles.startButton,
        ]}
        onPress={!recording ? startRecording : stopRecording}
      >
        <Text style={styles.btnText}>
          {recording ? i18n.t("recordStop") : i18n.t("recordStart")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ------------------------
// STYLES
// ------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#2E7D32",
  },
  box: {
    backgroundColor: "#F1F8E9",
    padding: 25,
    borderRadius: 12,
    minHeight: 160,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    marginTop: 30,
    width: "70%",
    alignItems: "center",
  },
  startButton: { backgroundColor: "#2E7D32" },
  stopButton: { backgroundColor: "#A5D6A7" },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
