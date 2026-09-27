import React, { useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import i18n from "../i18n";  // ✅ must be default import

export default function LanguageScreen({
  navigation,
  setLanguageSelected,
  setAppLocale,
  currentLocale,
}) {
  const [selectedLanguage, setSelectedLanguageState] = useState(currentLocale);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t("selectLanguage"),
    });
  }, [navigation, currentLocale]);

  const availableLanguages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "hi", label: "Hindi", flag: "🇮🇳" },
    { code: "te", label: "Telugu", flag: "🇮🇳" },
    { code: "ta", label: "Tamil", flag: "🇮🇳" },
    { code: "kn", label: "Kannada", flag: "🇮🇳" },
  ];

  const selectLanguage = (code) => {
    setSelectedLanguageState(code);

    if (typeof setAppLocale === "function") {
      setAppLocale(code);     // update app-level state
    }

    i18n.locale = code;        // ✅ update translation engine
  };

  const handleConfirm = () => {
    if (selectedLanguage) {
      i18n.locale = selectedLanguage; // APPLY LANGUAGE GLOBALLY

      if (typeof setLanguageSelected === "function") {
        setLanguageSelected(true);
      }

      navigation.navigate("Home");   // Go to home screen
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("selectLanguage")}</Text>

      <View style={styles.languageContainer}>
        {availableLanguages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.langButton,
              selectedLanguage === lang.code && styles.activeLangButton,
            ]}
            onPress={() => selectLanguage(lang.code)}
          >
            <Text style={styles.flagText}>{lang.flag}</Text>
            <Text style={styles.langLabelText}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          !selectedLanguage && styles.disabledButton,
        ]}
        onPress={handleConfirm}
        disabled={!selectedLanguage}
      >
        <Text style={styles.confirmButtonText}>{i18n.t("confirm")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#E8F5E9", // light green background
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#2E7D32", // dark green
  },
  languageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 60,
    maxWidth: 350,
  },
  langButton: {
    padding: 15,
    margin: 8,
    borderRadius: 12,
    backgroundColor: "#C8E6C9", // soft green
    alignItems: "center",
    width: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activeLangButton: {
    backgroundColor: "#81C784", // medium green
    borderWidth: 3,
    borderColor: "#2E7D32", // dark green border
  },
  flagText: {
    fontSize: 32,
  },
  langLabelText: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "600",
    color: "#1B5E20", // darker green
  },
  confirmButton: {
    backgroundColor: "#2E7D32", // dark green
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#9e9e9e",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
