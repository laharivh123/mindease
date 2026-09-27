// firebase.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCGF-NN6b7RTdgGB7RpGFdm1W970cX4Yq4",
  authDomain: "mindease-2d446.firebaseapp.com",
  projectId: "mindease-2d446",
  storageBucket: "mindease-2d446.firebasestorage.app",
  messagingSenderId: "966651045061",
  appId: "1:966651045061:web:f65daa21f286ca10c27cac",
  measurementId: "G-P7N65PL7E8",
  databaseURL: "https://mindease-2d446-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Export Database
export const db = getDatabase(app);

export default app;
