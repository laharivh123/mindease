"use client"

import { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { ActivityIndicator, View } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Screens
import LoginScreen from "./screens/auth/LoginScreen"
import SignupScreen from "./screens/auth/SignupScreen"
import HomeScreen from "./screens/home/HomeScreen"
import EmotionDetectionScreen from "./screens/emotion/EmotionDetectionScreen"
import YogaRecommendationScreen from "./screens/yoga/YogaRecommendationScreen"
import DashboardScreen from "./screens/dashboard/DashboardScreen"
import JournalScreen from "./screens/journal/JournalScreen"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
)

const AppStack = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: true,
      tabBarActiveTintColor: "#10b981",
      tabBarInactiveTintColor: "#9ca3af",
      tabBarStyle: {
        backgroundColor: "#f9fafb",
        borderTopColor: "#e5e7eb",
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: "Home",
        headerTitle: "MindEase",
        headerStyle: { backgroundColor: "#f0fdf4" },
        headerTitleStyle: { color: "#10b981", fontWeight: "bold" },
      }}
    />
    <Tab.Screen
      name="Emotion"
      component={EmotionDetectionScreen}
      options={{
        tabBarLabel: "Emotion",
        headerTitle: "Detect Emotion",
        headerStyle: { backgroundColor: "#f0fdf4" },
        headerTitleStyle: { color: "#10b981", fontWeight: "bold" },
      }}
    />
    <Tab.Screen
      name="Yoga"
      component={YogaRecommendationScreen}
      options={{
        tabBarLabel: "Yoga",
        headerTitle: "Yoga Poses",
        headerStyle: { backgroundColor: "#f0fdf4" },
        headerTitleStyle: { color: "#10b981", fontWeight: "bold" },
      }}
    />
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        tabBarLabel: "Progress",
        headerTitle: "Your Progress",
        headerStyle: { backgroundColor: "#f0fdf4" },
        headerTitleStyle: { color: "#10b981", fontWeight: "bold" },
      }}
    />
    <Tab.Screen
      name="Journal"
      component={JournalScreen}
      options={{
        tabBarLabel: "Journal",
        headerTitle: "My Journal",
        headerStyle: { backgroundColor: "#f0fdf4" },
        headerTitleStyle: { color: "#10b981", fontWeight: "bold" },
      }}
    />
  </Tab.Navigator>
)

const RootNavigator = ({ isLoggedIn, isLoading }) => {
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0fdf4" }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    )
  }

  return <NavigationContainer>{isLoggedIn ? <AppStack /> : <AuthStack />}</NavigationContainer>
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken")
        setIsLoggedIn(!!userToken)
      } catch (error) {
        console.error("Error checking login status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkLoginStatus()
  }, [])

  return <RootNavigator isLoggedIn={isLoggedIn} isLoading={isLoading} />
}
