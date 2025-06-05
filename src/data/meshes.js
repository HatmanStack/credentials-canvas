// Mesh and asset data
export const lightNames = [
  "small_middle_left",
  "small_middle_right",
  "lamppost",
  "lamp_back",
  "lamp_front",
  "small_right",
  "small_left",
  "Button_Light_1",
  "Button_Light_2",
  "Button_Light_3",
  "Button_Light_4",
  "Button_Light_5",
  "Button_Light_6",
  "Button_Light_7",
  "Button_Music_Back",
  "Button_Music_Forward",
  "Button_Music_Pause",
];

// Unified phone configuration - replaces separate meshNames and phoneList arrays
export const phoneConfigs = [
  { name: "Phone_Vocabulary_5", video: require("../assets/Vocabulary.mp4"), textNode: "Phone_Vocabulary_Text" },
  { name: "Phone_Movies_5", video: require("../assets/Movies.mp4"), textNode: "Phone_Movies_Text" },
  { name: "Phone_Looper_5", video: require("../assets/Looper.mp4"), textNode: "Phone_Looper_Text" },
  { name: "Phone_Trachtenberg_5", video: require("../assets/Trachtenberg.mp4"), textNode: "Phone_Trachtenberg_Text" },
  { name: "Phone_Italian_5", video: require("../assets/Italian.mp4"), textNode: "Phone_Italian_Text" },
  { name: "Phone_Stocks_5", video: require("../assets/Stocks.mp4"), textNode: "Phone_Stocks_Text" },
];

// Legacy exports for backward compatibility (derived from phoneConfigs)
export const meshNames = phoneConfigs.map(config => config.name);
export const videoPaths = phoneConfigs.map(config => config.video);

// Configuration constants
export const closeUpClickThrough = 2; // How many times to click before opening the link

// Model file path
export const MODEL_PATH = process.env.PUBLIC_URL + "compressed_model.glb";