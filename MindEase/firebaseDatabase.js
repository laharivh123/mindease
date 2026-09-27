import { database } from "./firebase";
import { ref, set, push, onValue } from "firebase/database";

// Save Mood
export const saveMood = async (userId, mood) => {
  const moodRef = push(ref(database, `users/${userId}/moods`));
  await set(moodRef, {
    mood,
    timestamp: Date.now(),
  });
};

// Get Moods
export const getMoods = (userId, callback) => {
  const moodsRef = ref(database, `users/${userId}/moods`);
  onValue(moodsRef, (snapshot) => {
    const data = snapshot.val() || {};
    callback(Object.values(data));
  });
};

// Save Journal Note
export const saveJournal = async (userId, text) => {
  const journalRef = push(ref(database, `users/${userId}/journal`));
  await set(journalRef, {
    text,
    timestamp: Date.now(),
  });
};

// Get Journal Notes
export const getJournal = (userId, callback) => {
  const journalRef = ref(database, `users/${userId}/journal`);
  onValue(journalRef, (snapshot) => {
    const data = snapshot.val() || {};
    callback(Object.values(data));
  });
};

// Save Emotion Detection Result
export const saveEmotion = async (userId, emotion) => {
  const emoRef = push(ref(database, `users/${userId}/emotions`));
  await set(emoRef, {
    emotion,
    timestamp: Date.now(),
  });
};

// Save Game Score
export const saveGameScore = async (userId, game, score) => {
  const scoreRef = push(ref(database, `users/${userId}/games/${game}`));
  await set(scoreRef, {
    score,
    timestamp: Date.now(),
  });
};

// Get Game Scores
export const getGameScores = (userId, game, callback) => {
  const refPath = ref(database, `users/${userId}/games/${game}`);
  onValue(refPath, (snapshot) => {
    const data = snapshot.val() || {};
    callback(Object.values(data));
  });
};
