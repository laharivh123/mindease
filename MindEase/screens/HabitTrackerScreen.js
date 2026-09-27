// HabitTrackerScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import i18n from "../i18n";

export default function HabitTrackerScreen() {
  const [userInfo, setUserInfo] = useState({
    weight: "",
    age: "",
    activityLevel: "medium", // low, medium, high
    morning: "",
    afternoon: "",
    evening: "",
  });

  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState("");

  // Add custom habit
  const addHabit = () => {
    if (!newHabitName.trim()) {
      Alert.alert(i18n.t("enterHabitName"));
      return;
    }
    const newHabit = { id: habits.length + 1, name: newHabitName, progress: 0 };
    setHabits([...habits, newHabit]);
    setNewHabitName("");
  };

  // Update habit progress
  const updateProgress = (id, amount) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? { ...habit, progress: Math.min(100, Math.max(0, habit.progress + amount)) }
          : habit
      )
    );
  };

  // 🔥 Suggestion logic based on weight + age + activity
  const createSlotSuggestion = (time, meditationBase, walkKm, weight) => {
    if (time <= 0) return null;

    // Weight effect on walking
    const weightFactor = weight < 55 ? 0.8 : weight < 70 ? 1 : 1.2;
    const finalWalk = (walkKm * weightFactor).toFixed(1);

    if (time >= 25) {
      return `• ${meditationBase} min meditation\n• ${finalWalk} km brisk walk`;
    } else if (time >= 15) {
      return `• ${Math.min(meditationBase, 15)} min meditation\n• ${(finalWalk / 2).toFixed(1)} km walk`;
    } else if (time >= 8) {
      return `• 5–8 min deep breathing\n• Light stretching`;
    } else {
      return `• ${time} min relaxation breathing`;
    }
  };

  // Routine generation
  const generateRecommendations = () => {
    const weight = parseFloat(userInfo.weight) || 60;
    const age = parseInt(userInfo.age) || 25;
    const activity = userInfo.activityLevel;

    const morningTime = parseInt(userInfo.morning) || 0;
    const afternoonTime = parseInt(userInfo.afternoon) || 0;
    const eveningTime = parseInt(userInfo.evening) || 0;

    // 💧 Water intake by weight
    const waterIntake = (weight * 35 / 1000).toFixed(1); // liters

    // 🚶 Walking based on activity level
    let walkKm = activity === "low" ? 3 : activity === "medium" ? 5 : 7;

    // 🧘 Meditation based on age
    let meditationMin = age < 25 ? 20 : age < 45 ? 15 : 10;

    // 🧘 Yoga (dynamic)
    let yogaMin = weight > 80 ? 20 : activity === "low" ? 15 : 10;

    // 🔥 Dynamic Routines
    const routine = [];

    const morningRoutine = createSlotSuggestion(
      morningTime,
      meditationMin,
      walkKm,
      weight
    );
    if (morningRoutine) routine.push(`🌅 Morning:\n${morningRoutine}`);

    const afternoonRoutine = createSlotSuggestion(
      afternoonTime,
      meditationMin - 5,
      walkKm,
      weight
    );
    if (afternoonRoutine) routine.push(`🌞 Afternoon:\n${afternoonRoutine}`);

    const eveningRoutine = createSlotSuggestion(
      eveningTime,
      meditationMin - 5,
      walkKm * 0.8,
      weight
    );
    if (eveningRoutine) routine.push(`🌙 Evening:\n${eveningRoutine}`);

    // Smart habits
    const smartHabits = [
      { id: 1, name: i18n.t("drinkWater"), target: `${waterIntake}L`, progress: 0 },
      { id: 2, name: i18n.t("walk"), target: `${walkKm}km`, progress: 0 },
      { id: 3, name: i18n.t("meditation"), target: `${meditationMin}min`, progress: 0 },
      { id: 4, name: i18n.t("yoga"), target: `${yogaMin}min`, progress: 0 },
    ];

    setHabits(smartHabits);

    Alert.alert(i18n.t("personalizedRoutine"), routine.join("\n\n"));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{i18n.t("title")}</Text>
      <Text style={styles.subtitle}>{i18n.t("subtitle")}</Text>

      {/* User Inputs */}
      <TextInput
        style={styles.input}
        placeholder={i18n.t("weight")}
        keyboardType="numeric"
        value={userInfo.weight}
        onChangeText={(text) => setUserInfo({ ...userInfo, weight: text })}
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.t("age")}
        keyboardType="numeric"
        value={userInfo.age}
        onChangeText={(text) => setUserInfo({ ...userInfo, age: text })}
      />

      <TextInput
        style={styles.input}
        placeholder={i18n.t("morning")}
        keyboardType="numeric"
        value={userInfo.morning}
        onChangeText={(text) => setUserInfo({ ...userInfo, morning: text })}
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.t("afternoon")}
        keyboardType="numeric"
        value={userInfo.afternoon}
        onChangeText={(text) => setUserInfo({ ...userInfo, afternoon: text })}
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.t("evening")}
        keyboardType="numeric"
        value={userInfo.evening}
        onChangeText={(text) => setUserInfo({ ...userInfo, evening: text })}
      />

      <TouchableOpacity style={styles.routineBtn} onPress={generateRecommendations}>
        <Text style={styles.routineBtnText}>{i18n.t("generateRoutine")}</Text>
      </TouchableOpacity>

      {/* Add Custom Habit */}
      <View style={styles.addHabitContainer}>
        <TextInput
          style={styles.input}
          placeholder={i18n.t("addHabit")}
          value={newHabitName}
          onChangeText={setNewHabitName}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addHabit}>
          <Text style={styles.addBtnText}>{i18n.t("addBtn")}</Text>
        </TouchableOpacity>
      </View>

      {/* Habit Tracking */}
      <View style={styles.habitsContainer}>
        {habits.map((habit) => (
          <View key={habit.id} style={styles.habitBox}>
            <AnimatedCircularProgress
              size={120}
              width={12}
              fill={habit.progress}
              tintColor="#34A853"
              backgroundColor="#C8E6C9"
            >
              {() => <Text style={styles.progressText}>{`${habit.progress}%`}</Text>}
            </AnimatedCircularProgress>

            <Text style={styles.habitName}>
              {habit.name} {habit.target ? `(${habit.target})` : ""}
            </Text>

            <View style={styles.progressButtons}>
              <TouchableOpacity
                style={styles.progressBtn}
                onPress={() => updateProgress(habit.id, 10)}
              >
                <Text style={styles.progressBtnText}>+10</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.progressBtn}
                onPress={() => updateProgress(habit.id, -10)}
              >
                <Text style={styles.progressBtnText}>-10</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#2E7D32", marginBottom: 20 },
  subtitle: { fontSize: 16, fontWeight: "600", color: "#1B5E20", marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#F1F8E9",
  },
  addHabitContainer: { flexDirection: "row", marginBottom: 15 },
  addBtn: {
    backgroundColor: "#34A853",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    marginLeft: 10,
  },
  addBtnText: { color: "#fff", fontWeight: "bold" },
  routineBtn: {
    backgroundColor: "#1B5E20",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  routineBtnText: { color: "#fff", fontWeight: "bold" },
  habitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  habitBox: { alignItems: "center", marginBottom: 20 },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#1B5E20",
    textAlign: "center",
  },
  progressText: { fontSize: 16, fontWeight: "bold", color: "#1B5E20" },
  progressButtons: { flexDirection: "row", marginTop: 10 },
  progressBtn: {
    backgroundColor: "#A5D6A7",
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  progressBtnText: { fontWeight: "bold", color: "#1B5E20" },
});
