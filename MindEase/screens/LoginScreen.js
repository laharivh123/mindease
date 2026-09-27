import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import i18n from "../i18n";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert(i18n.t("error"), i18n.t("fillAllFields"));
      return;
    }

    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess(userCredential.user);
        } else {
          navigation.navigate("Language");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.code === "auth/user-not-found") {
          Alert.alert(
            i18n.t("accountNotFound"),
            i18n.t("redirectingToSignup"),
            [
              {
                text: i18n.t("ok"),
                onPress: () => navigation.navigate("Signup", { email }),
              },
            ]
          );
        } else {
          Alert.alert(i18n.t("loginFailed"), err.message);
        }
      });
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert(i18n.t("error"), i18n.t("enterEmailForReset"));
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          i18n.t("passwordResetSent"),
          i18n.t("checkYourEmailForResetLink")
        );
      })
      .catch((err) => {
        Alert.alert(i18n.t("error"), err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/mindease-logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>MindEase</Text>

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
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder={i18n.t("password")}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color="#1B5E20"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotText}>{i18n.t("forgotPassword")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{i18n.t("login")}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signupText}>{i18n.t("signupHere")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#E8F5E9",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 40,
    color: "#2E7D32",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#1B5E20",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A5D6A7",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  eyeButton: {
    padding: 10,
  },
  forgotText: {
    color: "#2E7D32",
    textAlign: "right",
    marginBottom: 20,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#388E3C",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  signupText: {
    textAlign: "center",
    marginTop: 15,
    color: "#2E7D32",
    fontSize: 16,
  },
});
