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
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
//It is a "record generator". Each time the user clicks "Record mood," this function creates a "complete data object" with time, mood, and intensity. You can then display this data on a web page, save it to localStorage, or draw it on a star chart
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

//https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
//This is an arrow function called saveMoodEntries, which means "save emotional records." It accepts one parameter, entries, which is an array of all the sentiment data
// Save mood entries to local storage
//Convert entries (the array of mood records) to strings and store them in the browser with localStorage.setItem(), STORAGE_KEY. Since localStorage can only store strings, we use JSON.stringify() to turn the array into a string. The next time you want to read this data, just use JSON.parse() in loadMoodEntries() to get it back
const saveMoodEntries = (entries) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

//https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
//Let the page load as soon as you can recover previously recorded emotional data
// Load mood entries from local storage
//This is an arrow function called loadMoodEntries, which means load mood record.
const loadMoodEntries = () => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    //If storedData has a value (indicating that it did have a record before), convert it to an array with JSON.parse() and return it.
    return storedData ? JSON.parse(storedData) : [];
};