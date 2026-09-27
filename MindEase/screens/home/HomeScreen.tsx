"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("")
  const [currentMood, setCurrentMood] = useState("neutral")
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem("userName")
      const savedStreak = await AsyncStorage.getItem("streak")
      setUserName(name || "User")
      setStreak(Number.parseInt(savedStreak || "0"))
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.removeItem("userToken")
          await AsyncStorage.removeItem("userName")
          await AsyncStorage.removeItem("userEmail")
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back, {userName}!</Text>
        <Text style={styles.subtitle}>How are you feeling today?</Text>
      </View>

      <View style={styles.streakCard}>
        <Text style={styles.streakLabel}>Current Streak</Text>
        <Text style={styles.streakNumber}>{streak}</Text>
        <Text style={styles.streakDays}>days</Text>
      </View>

      <View style={styles.moodSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Emotion")}>
          <Text style={styles.actionIcon}>🎭</Text>
          <Text style={styles.actionTitle}>Detect Emotion</Text>
          <Text style={styles.actionDesc}>Analyze your mood via text or voice</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Yoga")}>
          <Text style={styles.actionIcon}>🧘</Text>
          <Text style={styles.actionTitle}>Yoga Poses</Text>
          <Text style={styles.actionDesc}>Get personalized yoga recommendations</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Journal")}>
          <Text style={styles.actionIcon}>📔</Text>
          <Text style={styles.actionTitle}>Journal</Text>
          <Text style={styles.actionDesc}>Write and track your daily thoughts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Dashboard")}>
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionTitle}>Progress</Text>
          <Text style={styles.actionDesc}>View your wellness journey</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  streakCard: {
    margin: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  streakLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#10b981",
  },
  streakDays: {
    fontSize: 14,
    color: "#6b7280",
  },
  moodSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  actionDesc: {
    fontSize: 12,
    color: "#9ca3af",
  },
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default HomeScreen
