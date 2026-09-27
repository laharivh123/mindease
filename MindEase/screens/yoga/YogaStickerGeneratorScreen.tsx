"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const YogaStickerGeneratorScreen = ({ route, navigation }) => {
  const [selectedPose, setSelectedPose] = useState(route?.params?.pose || "Sun Salutation")
  const [generatedSticker, setGeneratedSticker] = useState(null)
  const [loading, setLoading] = useState(false)

  const yogaStickerTemplates = {
    "Sun Salutation": {
      emoji: "☀️",
      color: "#fbbf24",
      text: "Sun Salutation Master",
      affirmation: "I radiate positive energy",
    },
    "Warrior Pose": {
      emoji: "⚔️",
      color: "#ef4444",
      text: "Warrior Strong",
      affirmation: "I am powerful and confident",
    },
    "Tree Pose": {
      emoji: "🌳",
      color: "#34d399",
      text: "Grounded & Balanced",
      affirmation: "I am rooted and stable",
    },
    "Child Pose": {
      emoji: "🙏",
      color: "#60a5fa",
      text: "Inner Peace",
      affirmation: "I find calm within",
    },
    "Legs Up Wall": {
      emoji: "🧘",
      color: "#a78bfa",
      text: "Restored Energy",
      affirmation: "I am renewed and refreshed",
    },
    "Corpse Pose": {
      emoji: "😴",
      color: "#9ca3af",
      text: "Deep Relaxation",
      affirmation: "I release all tension",
    },
    "Breathing Exercise": {
      emoji: "💨",
      color: "#06b6d4",
      text: "Breath Master",
      affirmation: "My breath brings me peace",
    },
    "Cat-Cow Pose": {
      emoji: "🐱",
      color: "#f97316",
      text: "Flexible & Free",
      affirmation: "I flow with ease",
    },
    "Downward Dog": {
      emoji: "🐕",
      color: "#8b5cf6",
      text: "Grounded Strength",
      affirmation: "I am strong and grounded",
    },
    "Lotus Pose": {
      emoji: "🪷",
      color: "#ec4899",
      text: "Meditation Master",
      affirmation: "I am one with my breath",
    },
    "Pigeon Pose": {
      emoji: "🕊️",
      color: "#14b8a6",
      text: "Hip Opening",
      affirmation: "I release what no longer serves me",
    },
    Savasana: {
      emoji: "✨",
      color: "#f59e0b",
      text: "Complete Relaxation",
      affirmation: "I am at peace",
    },
    "Forward Fold": {
      emoji: "🌊",
      color: "#3b82f6",
      text: "Letting Go",
      affirmation: "I release my worries",
    },
    "Shoulder Stand": {
      emoji: "🤸",
      color: "#10b981",
      text: "New Perspective",
      affirmation: "I see things clearly",
    },
    Meditation: {
      emoji: "🧠",
      color: "#6366f1",
      text: "Mindful Moment",
      affirmation: "I am present and aware",
    },
  }

  const generateSticker = async () => {
    setLoading(true)
    try {
      // Simulate sticker generation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const template = yogaStickerTemplates[selectedPose] || yogaStickerTemplates["Sun Salutation"]

      const sticker = {
        id: Date.now(),
        pose: selectedPose,
        emoji: template.emoji,
        color: template.color,
        text: template.text,
        affirmation: template.affirmation,
        timestamp: new Date().toLocaleString(),
      }

      setGeneratedSticker(sticker)

      // Save sticker
      const stickerHistory = await AsyncStorage.getItem("stickerHistory")
      const history = stickerHistory ? JSON.parse(stickerHistory) : []
      history.push(sticker)
      await AsyncStorage.setItem("stickerHistory", JSON.stringify(history))

      Alert.alert("Success", "Sticker generated! 🎉")
    } catch (error) {
      Alert.alert("Error", "Failed to generate sticker")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yoga Sticker Generator</Text>
        <Text style={styles.subtitle}>Create your achievement sticker</Text>
      </View>

      <View style={styles.poseSelector}>
        <Text style={styles.label}>Select Yoga Pose</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.poseList}>
          {Object.keys(yogaStickerTemplates).map((pose) => (
            <TouchableOpacity
              key={pose}
              style={[styles.poseOption, selectedPose === pose && styles.poseOptionActive]}
              onPress={() => setSelectedPose(pose)}
            >
              <Text style={styles.poseOptionText}>{pose}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[styles.generateButton, loading && styles.generateButtonDisabled]}
        onPress={generateSticker}
        disabled={loading}
      >
        <Text style={styles.generateButtonText}>{loading ? "Generating..." : "Generate Sticker"}</Text>
      </TouchableOpacity>

      {generatedSticker && (
        <View style={styles.stickerPreview}>
          <Text style={styles.previewTitle}>Your Sticker</Text>

          <View style={[styles.stickerCard, { backgroundColor: generatedSticker.color }]}>
            <Text style={styles.stickerEmoji}>{generatedSticker.emoji}</Text>
            <Text style={styles.stickerText}>{generatedSticker.text}</Text>
            <Text style={styles.stickerAffirmation}>{generatedSticker.affirmation}</Text>
          </View>

          <View style={styles.stickerInfo}>
            <Text style={styles.infoLabel}>Pose:</Text>
            <Text style={styles.infoValue}>{generatedSticker.pose}</Text>

            <Text style={styles.infoLabel}>Generated:</Text>
            <Text style={styles.infoValue}>{generatedSticker.timestamp}</Text>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={() => Alert.alert("Share", "Sticker shared! 🎉")}>
            <Text style={styles.shareButtonText}>Share Sticker</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.generateAnotherButton} onPress={() => setGeneratedSticker(null)}>
            <Text style={styles.generateAnotherButtonText}>Generate Another</Text>
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
  poseSelector: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  poseList: {
    marginBottom: 16,
  },
  poseOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    marginRight: 8,
  },
  poseOptionActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  poseOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  generateButton: {
    marginHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#10b981",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  stickerPreview: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  stickerCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  stickerEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  stickerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  stickerAffirmation: {
    fontSize: 14,
    color: "#ffffff",
    fontStyle: "italic",
    textAlign: "center",
  },
  stickerInfo: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 8,
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 8,
  },
  shareButton: {
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  shareButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  generateAnotherButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  generateAnotherButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default YogaStickerGeneratorScreen
