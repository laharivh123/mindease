import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

import axios from "axios";

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();

  // -----------------------------------------------------------
  // GROQ REQUEST
  // -----------------------------------------------------------
  const callAI = async (userMessage) => {
    try {
      setLoading(true);

      const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

      const body = {
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "You are MindEase, an emotional support assistant. Respond with empathy and kindness.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      };

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        body,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      return reply;
    } catch (e) {
      console.log("GROQ ERROR:", e.response?.data || e);
      return "😔 I'm having trouble responding right now.";
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------
  // SEND MESSAGE
  // -----------------------------------------------------------
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    const userText = input;
    setInput("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    const aiReply = await callAI(userText);

    const aiMsg = {
      id: (Date.now() + 1).toString(),
      sender: "ai",
      text: aiReply,
    };

    setMessages((prev) => [...prev, aiMsg]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // -----------------------------------------------------------
  // UI
  // -----------------------------------------------------------
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "android" ? 35 : 80}
      >
        <Text style={styles.header}>💬 MindEase Chatbot</Text>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.message,
                item.sender === "user" ? styles.userMsg : styles.aiMsg,
              ]}
            >
              <Text style={styles.msgText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={{ color: "#2E7D32", marginTop: 5 }}>Thinking…</Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Share your feelings…"
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendText}>➡️</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// -----------------------------------------------------------
// STYLES
// -----------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F8E9",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 10,
  },

  message: {
    padding: 12,
    borderRadius: 15,
    marginVertical: 5,
    maxWidth: "80%",
  },

  userMsg: {
    backgroundColor: "#A5D6A7",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },

  aiMsg: {
    backgroundColor: "#C8E6C9",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },

  msgText: {
    color: "#1B5E20",
    fontSize: 15,
  },

  inputRow: {
    flexDirection: "row",
    marginBottom: 25,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#81C784",
    maxHeight: 100,
    color: "#1B5E20",
  },

  sendBtn: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginLeft: 8,
  },

  sendText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  loadingBox: {
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});