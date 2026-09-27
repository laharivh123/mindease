import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebase";
import i18n from "../i18n";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const genderOptions = ["Male", "Female", "Others"];

  const validatePassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(pass);
  };

  const handleSignup = () => {
    if (!name || !gender || !age || !email || !password) {
      Alert.alert(i18n.t("error"), i18n.t("fillAllFields"));
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        i18n.t("error"),
        i18n.t( "Password must be at least 8 characters with 1 uppercase and 1 lowercase letter"),
      );
      return;
    }

    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const uid = userCredential.user.uid;
        // Save user basic info to Realtime DB
        set(ref(db, "users/" + uid), {
          name,
          gender,
          age,
          email,
          createdAt: new Date().toISOString(),
        });
        setLoading(false);
        Alert.alert(i18n.t("success"), i18n.t("accountCreated"));
        navigation.replace("Language"); // redirect to Language selection
      })
      .catch((err) => {
        setLoading(false);
        Alert.alert(i18n.t("signupFailed"), err.message);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{i18n.t("signup")}</Text>

      <Text style={styles.label}>{i18n.t("name")}</Text>
      <TextInput
        style={styles.input}
        placeholder={i18n.t("name")}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>{i18n.t("gender")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.genderButton,
              gender === option && styles.genderButtonActive,
            ]}
            onPress={() => setGender(option)}
          >
            <Text
              style={[
                styles.genderText,
                gender === option && styles.genderTextActive,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>{i18n.t("age")}</Text>
      <TextInput
        style={styles.input}
        placeholder={i18n.t("age")}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.label}>{i18n.t("email")}</Text>
      <TextInput
        style={styles.input}
        placeholder={i18n.t("email")}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>{i18n.t("password")}</Text>
      <TextInput
        style={styles.input}
        placeholder={i18n.t("password")}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{i18n.t("signup")}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.loginText}>{i18n.t("login")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles with green theme
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#E8F5E9",
  },
  title: {
    fontSize: 36,
    color: "#2E7D32",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 35,
  },
  label: {
    fontSize: 16,
    color: "#1B5E20",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#66BB6A",
  },
  button: {
    backgroundColor: "#388E3C",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  loginText: {
    textAlign: "center",
    marginTop: 15,
    color: "#1B5E20",
    fontSize: 16,
  },
  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: "#C8E6C9",
  },
  genderButtonActive: {
    backgroundColor: "#2E7D32",
  },
  genderText: {
    color: "#1B5E20",
    fontWeight: "600",
  },
  genderTextActive: {
    color: "#fff",
  },
});
