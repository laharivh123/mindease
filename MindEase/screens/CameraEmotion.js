import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";

import { auth } from "../firebase";

// ⭐ UPDATED userStats FUNCTIONS
import { saveEmotion, updateUsageAndStreak } from "../utils/userStats";
import { useNavigation } from "@react-navigation/native";

export default function CameraEmotionScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const [emotion, setEmotion] = useState("😐 Neutral");
  const [loading, setLoading] = useState(false);

  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  // 📸 Capture Photo
  const capturePhoto = async () => {
    try {
      if (!cameraRef.current) return;
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });
      setPhotoUri(photo.uri);
      setEmotion("😐 Neutral");
    } catch (e) {
      Alert.alert("Error", "Failed to capture photo");
    }
  };

  // 🔍 Analyze Emotion
  const analyzeEmotion = async () => {
    if (!photoUri) return Alert.alert("Error", "Capture a photo first!");
    try {
      setLoading(true);

      const base64img = await FileSystem.readAsStringAsync(photoUri, {
        encoding: "base64",
      });

      const formData = new FormData();
      formData.append("api_key", "YxAFKxfa1aojKgZp68YFOfnvNy-cT3L9");
      formData.append("api_secret", "wxcHBzIBHke5L50q5yLCTz3JcWiQ8PcJ");
      formData.append("return_attributes", "emotion");
      formData.append("image_base64", base64img);

      const res = await fetch(
        "https://api-us.faceplusplus.com/facepp/v3/detect",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();
      setLoading(false);

      if (result.error_message)
        return Alert.alert("API Error", result.error_message);

      if (!result.faces || result.faces.length === 0)
        return Alert.alert("No Face Detected", "Try again with better lighting.");

      const emotions = result.faces[0].attributes.emotion;
      const top = Object.keys(emotions).reduce((a, b) =>
        emotions[a] > emotions[b] ? a : b
      );

      let emoji = "😐";
      if (top === "happiness") emoji = "😊";
      if (top === "sadness") emoji = "😢";
      if (top === "anger") emoji = "😡";
      if (top === "surprise") emoji = "😲";
      if (top === "fear") emoji = "😨";

      const detectedEmotion = `${emoji} ${top}`;
      setEmotion(detectedEmotion);

      const uid = auth.currentUser?.uid;

      if (uid) {
        await saveEmotion(uid, detectedEmotion);
        await updateUsageAndStreak(uid);
      }

      // ⭐ Instead of default Alert → navigate to NextOptionsScreen
      Alert.alert(
        "Emotion Detected",
        detectedEmotion,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Options"),
          },
        ]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Emotion analysis failed.");
    }
  };

  // 🔒 Permission UI
  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.permissionText}>Camera Access Needed</Text>
        <TouchableOpacity style={styles.captureBtn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          <Text style={styles.emotionText}>{emotion}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.retakeBtn}
              onPress={() => setPhotoUri(null)}
            >
              <Text style={styles.btnText}>↩️ Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.analyzeBtn} onPress={analyzeEmotion}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Analyze</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <CameraView ref={cameraRef} style={styles.camera} facing="front" />

          <View style={styles.bottomBox}>
            <Text style={styles.emotionText}>{emotion}</Text>

            <TouchableOpacity style={styles.captureBtn} onPress={capturePhoto}>
              <Text style={styles.btnText}>📸 Capture</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// 🌿 Green Theme Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  permissionText: { color: "#1B5E20", fontSize: 18, marginBottom: 20 },
  camera: { flex: 1 },
  emotionText: {
    color: "#2E7D32",
    fontSize: 22,
    marginVertical: 12,
    fontWeight: "bold",
  },
  captureBtn: {
    backgroundColor: "#34A853",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  previewContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  photo: { width: "90%", height: "65%", borderRadius: 12, marginBottom: 20 },
  actionRow: { flexDirection: "row", gap: 15 },
  retakeBtn: {
    backgroundColor: "#81C784",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  analyzeBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  bottomBox: { position: "absolute", bottom: 35, width: "100%", alignItems: "center" },
});
