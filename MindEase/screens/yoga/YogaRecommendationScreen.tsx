"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const YogaRecommendationScreen = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState("calm")
  const [recommendations, setRecommendations] = useState([])

  const yogaPoses = {
    happy: [
      { name: "Sun Salutation", duration: "10 min", benefits: "Energize and uplift" },
      { name: "Warrior Pose", duration: "5 min", benefits: "Build confidence" },
      { name: "Tree Pose", duration: "3 min", benefits: "Balance and focus" },
    ],
    sad: [
      { name: "Child Pose", duration: "5 min", benefits: "Calming and grounding" },
      { name: "Legs Up Wall", duration: "10 min", benefits: "Restore energy" },
      { name: "Corpse Pose", duration: "5 min", benefits: "Deep relaxation" },
    ],
    anxious: [
      { name: "Breathing Exercise", duration: "5 min", benefits: "Calm the mind" },
      { name: "Cat-Cow Pose", duration: "5 min", benefits: "Release tension" },
      { name: "Downward Dog", duration: "3 min", benefits: "Ground yourself" },
    ],
    calm: [
      { name: "Lotus Pose", duration: "10 min", benefits: "Deep meditation" },
      { name: "Pigeon Pose", duration: "5 min", benefits: "Hip opening" },
      { name: "Savasana", duration: "10 min", benefits: "Complete relaxation" },
    ],
    angry: [
      { name: "Forward Fold", duration: "5 min", benefits: "Release anger" },
      { name: "Shoulder Stand", duration: "3 min", benefits: "Perspective shift" },
      { name: "Meditation", duration: "10 min", benefits: "Inner peace" },
    ],
  }

  useEffect(() => {
    loadRecommendations()
  }, [selectedMood])

  const loadRecommendations = async () => {
    const poses = yogaPoses[selectedMood] || yogaPoses.calm
    setRecommendations(poses)
  }

  const handleSelectPose = async (pose) => {
    Alert.alert("Start Practice", `Ready to practice ${pose.name}?`, [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Start",
        onPress: async () => {
          // Save practice history
          const history = await AsyncStorage.getItem("yogaHistory")
          const yogaHistory = history ? JSON.parse(history) : []
          yogaHistory.push({
            pose: pose.name,
            duration: pose.duration,
            timestamp: new Date().toISOString(),
          })
          await AsyncStorage.setItem("yogaHistory", JSON.stringify(yogaHistory))

          Alert.alert("Great!", `You completed ${pose.name}! 🎉`)

          // Navigate to sticker generator
          navigation.navigate("Yoga", {
            screen: "StickerGenerator",
            params: { pose: pose.name },
          })
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yoga Recommendations</Text>
        <Text style={styles.subtitle}>Choose your mood for personalized poses</Text>
      </View>

      <View style={styles.moodSelector}>
        {Object.keys(yogaPoses).map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[styles.moodButton, selectedMood === mood && styles.moodButtonActive]}
            onPress={() => setSelectedMood(mood)}
          >
            <Text style={[styles.moodButtonText, selectedMood === mood && styles.moodButtonTextActive]}>
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.posesSection}>
        {recommendations.map((pose, index) => (
          <TouchableOpacity key={index} style={styles.poseCard} onPress={() => handleSelectPose(pose)}>
            <View style={styles.poseHeader}>
              <Text style={styles.poseName}>{pose.name}</Text>
              <Text style={styles.poseDuration}>{pose.duration}</Text>
            </View>
            <Text style={styles.poseBenefits}>{pose.benefits}</Text>
            <View style={styles.poseFooter}>
              <Text style={styles.startText}>Tap to start</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
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
  moodSelector: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
    flexWrap: "wrap",
  },
  moodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
  },
  moodButtonActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  moodButtonText: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "600",
  },
  moodButtonTextActive: {
    color: "#ffffff",
  },
  posesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  poseCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  poseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  poseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
  },
  poseDuration: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  poseBenefits: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 12,
  },
  poseFooter: {
    alignItems: "flex-end",
  },
  startText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
  },
})

export default YogaRecommendationScreen
