// Emotions data structure
const emotions = [
    {
        id: "joy",
        name: "Joy",
        color: "#f1c40f",
        emoji: "😊"
    },
    {
        id: "sadness",
        name: "Sadness",
        color: "#3498db",
        emoji: "😢"
    },
    {
        id: "anger",
        name: "Anger",
        color: "#e74c3c",
        emoji: "😠"
    },
    {
        id: "fear",
        name: "Fear",
        color: "#9b59b6",
        emoji: "😨"
    },
    {
        id: "surprise",
        name: "Surprise",
        color: "#1abc9c",
        emoji: "😲"
    },
    {
        id: "love",
        name: "Love",
        color: "#e84393",
        emoji: "❤️"
    }
];

// Create a mood entry
const createMoodEntry = (emotion, intensity) => {
    return {
        timestamp: Date.now(),
        date: new Date().toISOString(),
        emotion: emotion,
        intensity: intensity
    };
};

// Local storage key
const STORAGE_KEY = "stellar_mood_tracker_data";

// Save mood entries to local storage
const saveMoodEntries = (entries) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

// Load mood entries from local storage
const loadMoodEntries = () => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
};