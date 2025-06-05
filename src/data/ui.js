// UI configuration and theme data
export const colorMap = {
  0: { active: "#E96929", rest: "#B68672", title: 20},
  1: { active: "#80C080", rest: "#869582", title: 120 },
  2: { active: "#EF5555", rest: "#f38484", title: 0 },
  3: { active: "#9FA8DA", rest: "#8F909D", title: 235 },
  default: { active: "#B68672", rest: "#E96929" },
};

// Vibe theme names and IDs
export const vibeThemes = [
  { id: "0", name: "urban", color: "#E96929", displayName: "URBAN", svgWidth: 280 },
  { id: "1", name: "rural", color: "#80C080", displayName: "RURAL", svgWidth: 275 },
  { id: "2", name: "classy", color: "#EF5555", displayName: "CLASSY", svgWidth: 320 },
  { id: "3", name: "chill", color: "#9FA8DA", displayName: "CHILL", svgWidth: 240 },
];

// Breakpoints
export const breakpoints = {
  mobile: 800,
  tablet: 1200,
};

// Asset imports (SVGs are handled by CSS, not imported as modules)
export const assets = {
  handGif: require("../assets/hand.gif"),
  volumeUp: require("../assets/volume_up.svg"),
  volumeMute: require("../assets/volume_mute.svg"),
};