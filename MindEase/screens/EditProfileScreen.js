import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n";   // ✅ added

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const savedName = await AsyncStorage.getItem("userName");
    const savedAge = await AsyncStorage.getItem("userAge");
    const savedPhone = await AsyncStorage.getItem("userPhone");

    if (savedName) setName(savedName);
    if (savedAge) setAge(savedAge);
    if (savedPhone) setPhone(savedPhone);
  };

  const saveProfile = async () => {
    if (!name || !age || !phone) {
      Alert.alert(i18n.t("error"), i18n.t("allFieldsRequired"));
      return;
    }

    await AsyncStorage.setItem("userName", name);
    await AsyncStorage.setItem("userAge", age);
    await AsyncStorage.setItem("userPhone", phone);

    Alert.alert(i18n.t("success"), i18n.t("profileUpdated"));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{i18n.t("editProfile")}</Text>

      <TextInput
        placeholder={i18n.t("enterName")}
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor="#2E7D32"
      />

      <TextInput
        placeholder={i18n.t("enterAge")}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#2E7D32"
      />

      <TextInput
        placeholder={i18n.t("enterPhone")}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
        placeholderTextColor="#2E7D32"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
        <Text style={styles.saveText}>{i18n.t("saveChanges")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#E8F5E9" }, // light green
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#2E7D32" },
  input: {
    borderWidth: 1,
    borderColor: "#81C784", // medium green border
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#1B5E20",
  },
  saveBtn: {
    backgroundColor: "#34A853", // dark green
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
