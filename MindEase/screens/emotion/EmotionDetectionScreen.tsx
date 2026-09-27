"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const EmotionDetectionScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState("")
  const [detectedEmotion, setDetectedEmotion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState("en")

  const emotionKeywords = {
    happy: ["happy", "joy", "excited", "great", "wonderful", "amazing", "love"],
    sad: ["sad", "depressed", "unhappy", "miserable", "down", "blue", "lonely"],
    anxious: ["anxious", "worried", "nervous", "stressed", "tense", "afraid", "scared"],
    calm: ["calm", "peaceful", "relaxed", "serene", "tranquil", "content"],
    angry: ["angry", "furious", "mad", "irritated", "frustrated", "annoyed"],
  }

  const detectEmotion = async () => {
    if (!inputText.trim()) {
      Alert.alert("Error", "Please enter some text")
      return
    }

    setLoading(true)
    try {
      const lowerText = inputText.toLowerCase()
      let emotion = "neutral"
      let confidence = 0

      for (const [emo, keywords] of Object.entries(emotionKeywords)) {
        const matches = keywords.filter((keyword) => lowerText.includes(keyword)).length
        if (matches > confidence) {
          emotion = emo
          confidence = matches
        }
      }

      setDetectedEmotion({
        emotion,
        confidence: Math.min(100, (confidence / 3) * 100),
        timestamp: new Date().toLocaleString(),
      })

      // Save emotion history
      const history = await AsyncStorage.getItem("emotionHistory")
      const emotionHistory = history ? JSON.parse(history) : []
      emotionHistory.push({
        emotion,
        confidence,
        text: inputText,
        timestamp: new Date().toISOString(),
      })
      await AsyncStorage.setItem("emotionHistory", JSON.stringify(emotionHistory))

      // Update streak
      const streak = await AsyncStorage.getItem("streak")
      const newStreak = (Number.parseInt(streak || "0") + 1).toString()
      await AsyncStorage.setItem("streak", newStreak)
    } catch (error) {
      Alert.alert("Error", "Failed to detect emotion")
    } finally {
      setLoading(false)
    }
  }

  const emotionColors = {
    happy: "#fbbf24",
    sad: "#60a5fa",
    anxious: "#f87171",
    calm: "#34d399",
    angry: "#ef4444",
    neutral: "#9ca3af",
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emotion Detection</Text>
        <Text style={styles.subtitle}>Tell us how you're feeling</Text>
      </View>

      <View style={styles.languageSelector}>
        <TouchableOpacity
          style={[styles.langButton, language === "en" && styles.langButtonActive]}
          onPress={() => setLanguage("en")}
        >
          <Text style={language === "en" ? styles.langButtonTextActive : styles.langButtonText}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langButton, language === "hi" && styles.langButtonActive]}
          onPress={() => setLanguage("hi")}
        >
          <Text style={language === "hi" ? styles.langButtonTextActive : styles.langButtonText}>Hindi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langButton, language === "kn" && styles.langButtonActive]}
          onPress={() => setLanguage("kn")}
        >
          <Text style={language === "kn" ? styles.langButtonTextActive : styles.langButtonText}>Kannada</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputSection}>
        <TextInput
          style={styles.textInput}
          placeholder="Describe how you're feeling..."
          placeholderTextColor="#9ca3af"
          value={inputText}
          onChangeText={setInputText}
          multiline
          numberOfLines={4}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.detectButton, loading && styles.detectButtonDisabled]}
          onPress={detectEmotion}
          disabled={loading}
        >
          <Text style={styles.detectButtonText}>{loading ? "Analyzing..." : "Detect Emotion"}</Text>
        </TouchableOpacity>
      </View>

      {detectedEmotion && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Detected Emotion</Text>
          <View style={[styles.emotionBadge, { backgroundColor: emotionColors[detectedEmotion.emotion] }]}>
            <Text style={styles.emotionText}>{detectedEmotion.emotion.toUpperCase()}</Text>
          </View>
          <Text style={styles.confidenceText}>Confidence: {Math.round(detectedEmotion.confidence)}%</Text>
          <Text style={styles.timestampText}>{detectedEmotion.timestamp}</Text>

          <TouchableOpacity style={styles.recommendButton} onPress={() => navigation.navigate("Yoga")}>
            <Text style={styles.recommendButtonText}>Get Yoga Recommendations</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  header: {
    padding: 20,
    backgroundColor: "#dcfce7",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  languageSelector: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  langButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
  },
  langButtonActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  langButtonText: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  langButtonTextActive: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  textInput: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
    textAlignVertical: "top",
  },
  detectButton: {
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  detectButtonDisabled: {
    opacity: 0.6,
  },
  detectButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  emotionBadge: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  emotionText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  confidenceText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  timestampText: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 16,
  },
  recommendButton: {
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  recommendButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default EmotionDetectionScreen
