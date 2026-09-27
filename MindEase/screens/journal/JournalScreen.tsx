"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const JournalScreen = () => {
  const [journalEntry, setJournalEntry] = useState("")
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [copingStrategies, setCopingStrategies] = useState([])
  const [showStrategies, setShowStrategies] = useState(false)

  const copingStrategiesDB = {
    happy: [
      { title: "Share Your Joy", description: "Tell someone about what made you happy today" },
      { title: "Gratitude Practice", description: "Write down 3 things you're grateful for" },
      { title: "Celebrate", description: "Do something fun to amplify your positive mood" },
    ],
    sad: [
      { title: "Reach Out", description: "Connect with a friend or family member" },
      { title: "Self-Care", description: "Take a warm bath or do something comforting" },
      { title: "Movement", description: "Go for a walk or do gentle stretching" },
      { title: "Creative Expression", description: "Draw, paint, or listen to music" },
    ],
    anxious: [
      { title: "Breathing Exercise", description: "Try 4-7-8 breathing: inhale 4, hold 7, exhale 8" },
      { title: "Grounding Technique", description: "Name 5 things you see, 4 you hear, 3 you feel" },
      { title: "Progressive Relaxation", description: "Tense and release each muscle group" },
      { title: "Limit Caffeine", description: "Reduce caffeine intake to calm your nervous system" },
    ],
    angry: [
      { title: "Physical Activity", description: "Exercise or go for a run to release tension" },
      { title: "Cool Down", description: "Take a cold shower or splash cold water on your face" },
      { title: "Write It Out", description: "Journal your feelings without filtering" },
      { title: "Meditation", description: "Practice mindfulness to regain control" },
    ],
    calm: [
      { title: "Maintain Balance", description: "Continue your current wellness routine" },
      { title: "Meditation", description: "Deepen your practice with guided meditation" },
      { title: "Journaling", description: "Reflect on what's keeping you calm" },
    ],
  }

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const saved = await AsyncStorage.getItem("journalEntries")
      if (saved) {
        setEntries(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Error loading entries:", error)
    }
  }

  const detectEmotionAndSuggestStrategies = async () => {
    if (!journalEntry.trim()) {
      Alert.alert("Error", "Please write something")
      return
    }

    setLoading(true)
    try {
      // Simple emotion detection based on keywords
      const text = journalEntry.toLowerCase()
      let detectedEmotion = "calm"

      const emotionKeywords = {
        happy: ["happy", "joy", "excited", "great", "wonderful", "amazing", "love", "blessed"],
        sad: ["sad", "depressed", "unhappy", "miserable", "down", "blue", "lonely", "hurt"],
        anxious: ["anxious", "worried", "nervous", "stressed", "tense", "afraid", "scared", "panic"],
        angry: ["angry", "furious", "mad", "irritated", "frustrated", "annoyed", "rage"],
      }

      for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
        if (keywords.some((keyword) => text.includes(keyword))) {
          detectedEmotion = emotion
          break
        }
      }

      // Get coping strategies for detected emotion
      const strategies = copingStrategiesDB[detectedEmotion] || copingStrategiesDB.calm
      setCopingStrategies(strategies)
      setShowStrategies(true)

      // Save entry
      const newEntry = {
        id: Date.now(),
        text: journalEntry,
        emotion: detectedEmotion,
        timestamp: new Date().toLocaleString(),
        date: new Date().toLocaleDateString(),
      }

      const updated = [newEntry, ...entries]
      await AsyncStorage.setItem("journalEntries", JSON.stringify(updated))
      setEntries(updated)
      setJournalEntry("")
      Alert.alert("Success", `Entry saved! Detected emotion: ${detectedEmotion}`)
    } catch (error) {
      Alert.alert("Error", "Failed to save entry")
    } finally {
      setLoading(false)
    }
  }

  const deleteEntry = async (id) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: async () => {
          const updated = entries.filter((e) => e.id !== id)
          await AsyncStorage.setItem("journalEntries", JSON.stringify(updated))
          setEntries(updated)
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Journal</Text>
        <Text style={styles.subtitle}>Express your thoughts and feelings</Text>
      </View>

      <View style={styles.inputSection}>
        <TextInput
          style={styles.textInput}
          placeholder="Write your thoughts here..."
          placeholderTextColor="#9ca3af"
          value={journalEntry}
          onChangeText={setJournalEntry}
          multiline
          numberOfLines={6}
          editable={!loading}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={detectEmotionAndSuggestStrategies}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save & Get Strategies"}</Text>
        </TouchableOpacity>
      </View>

      {showStrategies && copingStrategies.length > 0 && (
        <View style={styles.strategiesSection}>
          <Text style={styles.strategiesTitle}>Coping Strategies for You</Text>
          {copingStrategies.map((strategy, index) => (
            <View key={index} style={styles.strategyCard}>
              <Text style={styles.strategyTitle}>{strategy.title}</Text>
              <Text style={styles.strategyDescription}>{strategy.description}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.dismissButton} onPress={() => setShowStrategies(false)}>
            <Text style={styles.dismissButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.entriesSection}>
        <Text style={styles.entriesTitle}>Previous Entries</Text>
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No entries yet. Start journaling!</Text>
          </View>
        ) : (
          entries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View>
                  <Text style={styles.entryDate}>{entry.date}</Text>
                  {entry.emotion && <Text style={styles.entryEmotion}>{entry.emotion.toUpperCase()}</Text>}
                </View>
                <TouchableOpacity onPress={() => deleteEntry(entry.id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.entryText}>{entry.text}</Text>
              <Text style={styles.entryTime}>{entry.timestamp}</Text>
            </View>
          ))
        )}
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
  inputSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  saveButton: {
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  strategiesSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#0284c7",
  },
  strategiesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0c4a6e",
    marginBottom: 12,
  },
  strategyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  strategyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
    marginBottom: 4,
  },
  strategyDescription: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 18,
  },
  dismissButton: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  dismissButtonText: {
    fontSize: 12,
    color: "#0284c7",
    fontWeight: "600",
  },
  entriesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  entriesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  entryCard: {
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
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  entryEmotion: {
    fontSize: 11,
    color: "#0284c7",
    fontWeight: "600",
    marginTop: 2,
  },
  deleteButton: {
    fontSize: 12,
    color: "#ef4444",
    fontWeight: "600",
  },
  entryText: {
    fontSize: 14,
    color: "#111827",
    lineHeight: 22,
    marginBottom: 8,
  },
  entryTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
})

export default JournalScreen
