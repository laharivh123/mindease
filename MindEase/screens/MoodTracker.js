import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebase";
import { ref, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import i18n from "../i18n";
import { LineChart } from "react-native-chart-kit";


const moods = [
  { emoji: "😀", label: "Happy" },
  { emoji: "🙂", label: "Calm" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😟", label: "Anxious" },
];

const moodScore = {
  Happy: 5,
  Calm: 4,
  Neutral: 3,
  Sad: 2,
  Angry: 1,
  Anxious: 0,
};

const quotes = {
  Sad: "It's okay to feel this way. You are stronger than you think.",
  Angry: "Take a deep breath. Peace begins with you.",
  Anxious: "You are safe. Focus on the present moment.",
  Happy: "Keep spreading positivity!",
  Calm: "Peace of mind is priceless.",
  Neutral: "Balance brings clarity.",
};

export default function MoodTrackerScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);
  const [analysisMsg, setAnalysisMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) {
      setLoading(false);
      Alert.alert(i18n.t("error"), i18n.t("pleaseLoginFirst"));
      return;
    }

    const historyRef = ref(db, `moodTracker/${user.uid}`);
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        setHistory([]);
        setLoading(false);
        return;
      }

      const list = Object.entries(val)
        .map(([key, item]) => ({ key, ...item }))
        .sort((a, b) => new Date(b.time) - new Date(a.time));

      setHistory(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveMood = async () => {
    if (!selectedMood) {
      Alert.alert(i18n.t("pleaseSelectMood"));
      return;
    }

    const user = getAuth().currentUser;
    if (!user) {
      Alert.alert(i18n.t("error"), i18n.t("pleaseLoginFirst"));
      return;
    }

    try {
      setSaving(true);

      const now = new Date();
      const today = now.toISOString().split("T")[0];

      await push(ref(db, `moodTracker/${user.uid}`), {
        date: today,
        mood: selectedMood.label,
        emoji: selectedMood.emoji,
        note,
        time: now.toLocaleString(),
      });

      setAnalysisMsg(
        `${i18n.t("analysisMessage")} "${i18n.t(selectedMood.label)}". ${
          quotes[selectedMood.label]
        }`
      );

      setSelectedMood(null);
      setNote("");
    } catch (err) {
      Alert.alert(i18n.t("error"), i18n.t("failedToSaveMood"));
    } finally {
      setSaving(false);
    }
  };

  // Chart data
  const chartData = useMemo(() => {
    const last7 = [...history].slice(0, 7).reverse();
    return {
      labels: last7.map((h) => h.date?.substring(5) || ""),
      datasets: [
        {
          data: last7.map((h) => moodScore[h.mood] ?? 3),
          color: (opacity = 1) => `rgba(75,0,130,${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  }, [history]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F6FF" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>{i18n.t("howAreYouFeeling")}</Text>

        <View style={styles.moodRow}>
          {moods.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.moodBox,
                selectedMood?.label === item.label && styles.selectedMood,
              ]}
              onPress={() => setSelectedMood(item)}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.label}>{i18n.t(item.label)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.noteInput}
          placeholder={i18n.t("whyDoYouFeelThisWay")}
          value={note}
          onChangeText={setNote}
          multiline
        />

        <TouchableOpacity style={styles.saveBtn} onPress={saveMood} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>{i18n.t("saveMood")}</Text>}
        </TouchableOpacity>

        {analysisMsg ? (
          <View style={styles.analysisBox}>
            <Text style={styles.analysisText}>{analysisMsg}</Text>
          </View>
        ) : null}

        <Text style={styles.historyTitle}>{i18n.t("moodHistory")}</Text>

        {loading ? (
          <ActivityIndicator color="#4E8EF7" style={{ marginTop: 10 }} />
        ) : history.length === 0 ? (
          <Text style={styles.emptyText}>{i18n.t("noHistoryYet")}</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.key}
            scrollEnabled={false} // IMPORTANT for ScrollView inside
            renderItem={({ item }) => (
              <View style={styles.historyCard}>
                <Text style={styles.historyEmoji}>{item.emoji}</Text>
                <View>
                  <Text style={styles.historyMood}>{i18n.t(item.mood)}</Text>
                  <Text style={styles.historyTime}>{item.time}</Text>
                  {item.note ? <Text style={styles.historyNote}>📝 {item.note}</Text> : null}
                </View>
              </View>
            )}
          />
        )}

        {history.length > 0 && (
          <>
            <Text style={styles.chartTitle}>{i18n.t("weeklyMoodChart")}</Text>

            <LineChart
              data={chartData}
              width={Dimensions.get("window").width - 40}
              height={220}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(75,0,130,${opacity})`,
                labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              }}
              bezier
              style={{ borderRadius: 12, marginTop: 10 }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 20, color: "#2E7D32" },
  moodRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  moodBox: {
    width: "28%",
    backgroundColor: "#C8E6C9", // soft green background
    margin: 8,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    elevation: 3,
  },
  selectedMood: { backgroundColor: "#A5D6A7", borderWidth: 2, borderColor: "#2E7D32" },
  emoji: { fontSize: 32 },
  label: { marginTop: 5, fontSize: 14, fontWeight: "600", color: "#1B5E20" },
  noteInput: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    color: "#1B5E20",
  },
  saveBtn: {
    backgroundColor: "#34A853", // vibrant green
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  analysisBox: {
    backgroundColor: "#C8E6C9",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  analysisText: { fontSize: 16, color: "#1B5E20" },
  historyTitle: { marginTop: 20, fontSize: 22, fontWeight: "700", color: "#2E7D32" },
  historyCard: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#A5D6A7",
  },
  historyEmoji: { fontSize: 35, marginRight: 15 },
  historyMood: { fontSize: 18, fontWeight: "700", color: "#1B5E20" },
  historyTime: { fontSize: 14, color: "#2E7D32" },
  historyNote: { marginTop: 5, color: "#1B5E20" },
  emptyText: { marginTop: 10, textAlign: "center", color: "#2E7D32" },
  chartTitle: { fontSize: 20, fontWeight: "700", textAlign: "center", marginTop: 25, color: "#2E7D32" },
});

