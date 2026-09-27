"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const DashboardScreen = () => {
  const [stats, setStats] = useState({
    totalEmotions: 0,
    totalYogaSessions: 0,
    totalStickers: 0,
    streak: 0,
    topEmotion: "neutral",
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const emotionHistory = await AsyncStorage.getItem("emotionHistory")
      const yogaHistory = await AsyncStorage.getItem("yogaHistory")
      const stickerHistory = await AsyncStorage.getItem("stickerHistory")
      const streak = await AsyncStorage.getItem("streak")

      const emotions = emotionHistory ? JSON.parse(emotionHistory) : []
      const yoga = yogaHistory ? JSON.parse(yogaHistory) : []
      const stickers = stickerHistory ? JSON.parse(stickerHistory) : []

      // Find top emotion
      const emotionCounts = {}
      emotions.forEach((e) => {
        emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1
      })
      const topEmotion =
        Object.keys(emotionCounts).reduce((a, b) => (emotionCounts[a] > emotionCounts[b] ? a : b)) || "neutral"

      setStats({
        totalEmotions: emotions.length,
        totalYogaSessions: yoga.length,
        totalStickers: stickers.length,
        streak: Number.parseInt(streak || "0"),
        topEmotion,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your wellness journey</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🎭</Text>
          <Text style={styles.statValue}>{stats.totalEmotions}</Text>
          <Text style={styles.statLabel}>Emotions Tracked</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🧘</Text>
          <Text style={styles.statValue}>{stats.totalYogaSessions}</Text>
          <Text style={styles.statLabel}>Yoga Sessions</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>✨</Text>
          <Text style={styles.statValue}>{stats.totalStickers}</Text>
          <Text style={styles.statLabel}>Stickers Earned</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>{stats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Top Emotion</Text>
        <Text style={styles.insightValue}>{stats.topEmotion.toUpperCase()}</Text>
        <Text style={styles.insightText}>
          Your most frequently detected emotion. Keep practicing yoga and journaling to maintain balance!
        </Text>
      </View>

      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Wellness Tips</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>Practice yoga daily for better emotional balance</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>Journal your thoughts to process emotions</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>Celebrate your achievements with stickers</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>Maintain your streak for consistent wellness</Text>
        </View>
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  insightCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  insightValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 8,
  },
  insightText: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 20,
  },
  tipsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  tipBullet: {
    fontSize: 16,
    color: "#10b981",
    marginRight: 8,
  },
  tipText: {
    fontSize: 13,
    color: "#6b7280",
    flex: 1,
    lineHeight: 20,
  },
})

export default DashboardScreen
