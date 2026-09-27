import { db } from "../firebase";
import { ref, get, set, update, runTransaction, push } from "firebase/database";

// -----------------------------------------
// Helper: Get today date in stable format
// -----------------------------------------
const getToday = () => {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
};

// -----------------------------------------
// Initialize user fields if missing
// -----------------------------------------
export const initializeUserStats = async (uid) => {
  const baseRef = ref(db, `users/${uid}`);
  const snap = await get(baseRef);

  if (!snap.exists()) {
    await set(baseRef, {
      streak: {
        count: 0,
        lastOpened: getToday(),
      },
      usageCount: 0,
      lastEmotion: "Neutral",
      emotions: {},
    });
  }
};

// -----------------------------------------
// SAVE EMOTION (camera + voice use this)
// -----------------------------------------
export const saveEmotion = async (uid, emotion) => {
  const userRef = ref(db, `users/${uid}`);

  // Save lastEmotion
  await update(userRef, {
    lastEmotion: emotion,
  });

  // Save emotion history
  const emotionRef = push(ref(db, `users/${uid}/emotions`));
  await set(emotionRef, {
    emotion,
    timestamp: Date.now(),
  });

  // 🔥 IMPORTANT: update usage & streak here
  await updateUsageAndStreak(uid);
};

// -----------------------------------------
// Update usage + streak
// -----------------------------------------
export const updateUsageAndStreak = async (uid) => {
  const streakRef = ref(db, `users/${uid}/streak`);
  const usageRef = ref(db, `users/${uid}/usageCount`);

  // Increase usage count
  runTransaction(usageRef, (current) => {
    return (current || 0) + 1;
  });

  // Handle streak logic
  runTransaction(streakRef, (current) => {
    const today = getToday();

    if (!current || !current.lastOpened) {
      return {
        count: 1,
        lastOpened: today,
      };
    }

    // If already updated today
    if (current.lastOpened === today) {
      return current;
    }

    // New day
    return {
      count: (current.count || 0) + 1,
      lastOpened: today,
    };
  });
};
