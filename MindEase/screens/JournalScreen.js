import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n";

export default function JournalScreen() {
  const [entry, setEntry] = useState("");
  const [allEntries, setAllEntries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortNewest, setSortNewest] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await AsyncStorage.getItem("JOURNAL");
      if (data) setAllEntries(JSON.parse(data));
    } catch (err) {
      console.error("Error loading journal:", err);
    }
  };

  const saveEntry = async () => {
    if (!entry.trim()) return;

    const newEntry = {
      id: Date.now(),
      text: entry.trim(),
      date: new Date().toLocaleString(),
      mood: "📝", // default emoji for all entries
    };

    const updated = [newEntry, ...allEntries];
    setAllEntries(updated);

    try {
      await AsyncStorage.setItem("JOURNAL", JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving journal:", err);
    }

    setEntry("");
  };

  const deleteEntry = (id) => {
    Alert.alert(
      i18n.t("deleteConfirmation") || "Delete Entry?",
      i18n.t("deleteMsg") || "Are you sure you want to delete this entry?",
      [
        { text: i18n.t("cancel") || "Cancel", style: "cancel" },
        {
          text: i18n.t("delete") || "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = allEntries.filter((e) => e.id !== id);
            setAllEntries(updated);
            await AsyncStorage.setItem("JOURNAL", JSON.stringify(updated));
          },
        },
      ]
    );
  };

  const editEntry = (id) => {
    const toEdit = allEntries.find((e) => e.id === id);
    if (toEdit) {
      setEntry(toEdit.text);
      deleteEntry(id); // remove old entry while editing
    }
  };

  // Filter and sort entries
  const filteredEntries = allEntries
    .filter((e) => e.text.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => (sortNewest ? b.id - a.id : a.id - b.id));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 {i18n.t("journalTitle") || "Journal"}</Text>

      <TextInput
        style={styles.searchInput}
        placeholder={i18n.t("searchPlaceholder") || "Search entries..."}
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#2E7D32"
      />

      <TextInput
        style={styles.input}
        placeholder={i18n.t("journalPlaceholder") || "Write your thoughts here..."}
        value={entry}
        onChangeText={setEntry}
        multiline
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveBtn} onPress={saveEntry}>
          <Text style={styles.saveText}>💾 {i18n.t("saveButton") || "Save Entry"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: "#2E7D32" }]}
          onPress={() => setSortNewest(!sortNewest)}
        >
          <Text style={styles.saveText}>
  🔄{sortNewest ? i18n.t("newestFirst") : i18n.t("oldestFirst")}
      </Text>

        </TouchableOpacity>
      </View>

      <Text style={styles.entryCount}>
        {i18n.t("totalEntries") || "Total Entries"}: {allEntries.length}
      </Text>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.entryBox}
            onLongPress={() => deleteEntry(item.id)}
            onPress={() => editEntry(item.id)}
          >
            <Text style={styles.entryDate}>{item.mood} 📅 {item.date}</Text>
            <Text style={styles.entryText}>{item.text}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: "center", color: "#1B5E20", marginTop: 20 }}>
            {i18n.t("noEntries") || "No journal entries yet."}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 10, color: "#2E7D32" },
  searchInput: {
    backgroundColor: "#C8E6C9",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    marginBottom: 10,
    color: "#1B5E20",
  },
  input: {
    height: 120,
    backgroundColor: "#C8E6C9",
    padding: 15,
    borderRadius: 10,
    textAlignVertical: "top",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    color: "#1B5E20",
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  saveBtn: {
    backgroundColor: "#34A853",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 0.48,
  },
  saveText: { color: "white", fontSize: 16, fontWeight: "bold" },
  entryBox: {
    backgroundColor: "#C8E6C9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#A5D6A7",
  },
  entryDate: { color: "#2E7D32", marginBottom: 5, fontWeight: "600" },
  entryText: { fontSize: 15, color: "#1B5E20" },
  entryCount: { color: "#1B5E20", marginBottom: 10, fontWeight: "600" },
});
