import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../i18n";

export default function OptionsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{i18n.t("chooseOption")}</Text>

      {/* ✅ Correct navigation names */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Exercise")}
      >
        <Text style={styles.btnText}>{i18n.t("exerciseOption")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Songs")}
      >
        <Text style={styles.btnText}>{i18n.t("songsOption")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Chatbot")}
      >
        <Text style={styles.btnText}>{i18n.t("chatbotOption")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Game")}
      >
        <Text style={styles.btnText}>{i18n.t("gamesOption")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9", paddingTop: 40 },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#34A853",
    padding: 18,
    borderRadius: 15,
    marginVertical: 12,
    marginHorizontal: 30,
  },
  btnText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
});
