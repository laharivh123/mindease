import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import SignupScreen from "./screens/SignUpScreen";
import LoginScreen from "./screens/LoginScreen";
import MoodTrackerScreen from "./screens/MoodTracker";
import ChatbotScreen from "./screens/ChatBotScreen";
import SongsScreen from "./screens/SongsScreen";
import ExerciseScreen from "./screens/ExerciseScreen";
import CameraEmotionScreen from "./screens/CameraEmotion";
import VoiceEmotionScreen from "./screens/VoiceEmotion";
import GameScreen from "./screens/GameScreen";
import JournalScreen from "./screens/JournalScreen";
import LanguageScreen from "./screens/LanguageScreen";
import HabitTrackerScreen from "./screens/HabitTrackerScreen";

// ⭐ Replace wrong file with your actual screen
import OptionsScreen from "./screens/OptionsScreen";

// i18n
import i18n from "./i18n";

const Stack = createStackNavigator();

export default function App() {
  const [locale, setLocale] = useState(i18n.locale);

  const setAppLocale = (newLocale) => {
    i18n.locale = newLocale;
    setLocale(newLocale);
  };

  useEffect(() => {
    i18n.locale = locale;
  }, [locale]);

  return (
    <NavigationContainer>
      <Stack.Navigator key={locale} initialRouteName="Login">

        {/* Auth Screens */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />

        {/* ⭐ Added Options Screen */}
        <Stack.Screen
          name="Options"
          component={OptionsScreen}
          options={{ headerShown: false }}
        />

        {/* Main Screens */}
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) => <HomeScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen name="Profile" options={{ title: i18n.t("profile") }}>
          {(props) => (
            <ProfileScreen
              {...props}
              setAppLocale={setAppLocale}
              currentLocale={locale}
              i18n={i18n}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ title: i18n.t("editProfile") }}
        />

        <Stack.Screen
          name="MoodTracker"
          component={MoodTrackerScreen}
          options={{ title: i18n.t("moodTracker") }}
        />

        <Stack.Screen
          name="Chatbot"
          component={ChatbotScreen}
          options={{ title: i18n.t("chatbot") }}
        />

        <Stack.Screen
          name="Songs"
          component={SongsScreen}
          options={{ title: i18n.t("songs") }}
        />

        <Stack.Screen
          name="Exercise"
          component={ExerciseScreen}
          options={{ title: i18n.t("exercise") }}
        />

        <Stack.Screen
          name="CameraEmotion"
          component={CameraEmotionScreen}
          options={{ title: i18n.t("cameraEmotion") }}
        />

        <Stack.Screen
          name="VoiceEmotion"
          component={VoiceEmotionScreen}
          options={{ title: i18n.t("voiceEmotion") }}
        />

        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ title: i18n.t("games") }}
        />

        <Stack.Screen
          name="Journal"
          component={JournalScreen}
          options={{ title: i18n.t("journal") }}
        />

        <Stack.Screen
          name="HabitTracker"
          component={HabitTrackerScreen}
          options={{ title: i18n.t("habitTracker") || "Habit Tracker" }}
        />

        {/* Language Screen */}
        <Stack.Screen name="Language" options={{ headerShown: false }}>
          {(props) => (
            <LanguageScreen
              {...props}
              setAppLocale={setAppLocale}
              currentLocale={locale}
            />
          )}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
