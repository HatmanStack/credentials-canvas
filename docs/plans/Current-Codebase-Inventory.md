# Current Codebase Inventory

## Overview

This document provides a complete snapshot of the current codebase state BEFORE refactoring begins. Use this as reference when performing migrations in Phase 1-4.

**Last Updated:** Pre-Refactoring (JavaScript codebase)

---

## Directory Structure

```
credentials-canvas/
├── public/
│   ├── compressed_model.glb (3D model file)
│   ├── draco/ (Draco decoder for 3D compression)
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── assets/ (images, videos, SVGs)
│   ├── components/ (11 React components)
│   ├── contexts/ (2 Context providers)
│   ├── css/ (4 CSS files)
│   ├── data/ (6 configuration files)
│   ├── hooks/ (3 custom hooks)
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

---

## Component Inventory

### All Components (11 files in src/components/)

| File | Lines | Purpose | Dependencies |
|------|-------|---------|--------------|
| `Animations.js` | 210 | Manages scene animations and transitions | Three.js, useSpring, contexts |
| `CameraControls.js` | 115 | Handles camera positioning and controls | Three.js, hooks, contexts |
| `Checkbox.js` | 45 | Custom checkbox for theme selection | React, contexts |
| `Environment.js` | 135 | Sets up scene lighting and environment | Three.js, @react-three/drei |
| `InteractiveElement.js` | 60 | Base component for clickable 3D objects | Three.js, contexts |
| `Lamp.js` | 80 | Interactive lamp/light mesh component | Three.js, contexts |
| `LaunchScreen.js` | 105 | Initial loading/theme selection screen | React, contexts, assets |
| `Model.js` | 157 | Main 3D model loader and manager | Three.js, GLTF, Draco, contexts |
| `Sounds.js` | 35 | Audio playback controller | use-sound library |
| `VibeOption.js` | 30 | Individual theme selection option | React, contexts |
| `VideoMesh.js` | 50 | Video texture mesh component | Three.js, contexts |

**Total:** 1,022 lines of JavaScript across 11 components

---

## Context Providers (src/contexts/)

### UIContext.js (97 lines)

**State Managed:**
```javascript
const [uiState, setUIState] = useState({
  titleColorHue: null,
  showArcadeIframe: true,
  showMusicIframe: true,
  isAudioMuted: false
});

const [appState, setAppState] = useState({
  selectedVibe: null,
  gltfModel: null,
  videoPlayer: null,
  screenWidth: window.innerWidth,
  lightIntensity: {
    sliderName: "Slider_4",
    intensity: 10,
  }
});
```

**Actions:** setTitleColor, setIframe1, setIframe2, setIsMuted, setVibe, setGLTF, setPlayer, setWindowWidth, setLightIntensity

### InteractionContext.js (84 lines)

**State Managed:**
```javascript
const [interactionState, setInteractionState] = useState({
  clickPoint: null,
  clickLight: null,
  clickCount: 0,
  isCloseUpView: false,
  isDragging: false,
  hasScrollStarted: false,
  mobileScrollCount: null,
  currentCameraIndex: 0,
  cameraProgress: 0
});
```

**Actions:** setClickPoint, setClickLight, setClickCount, setCloseUp, setIsDragging, setScrollStarted, setMobileScroll, setCurrentPosIndex, setCameraProgress

---

## Custom Hooks (src/hooks/)

### useCameraScroll.js (121 lines)

**Purpose:** Manages camera scroll behavior for desktop and mobile

**Parameters:**
- currentPosIndex, setCurrentPosIndex
- positions (camera position array)
- camera (Three.js camera)
- domElement (scroll target)
- setScrollStarted, setCloseUp, setCloseUpPosIndex
- setCameraClone, holderprogress, setProgress
- mobileScroll

**Key Logic:** Interpolates camera position between points based on scroll events

### useCameraAnimation.js (~100 lines)

**Purpose:** Handles camera position animations

### useLightController.js (~80 lines)

**Purpose:** Manages interactive light intensity control

---

## Data Configuration Files (src/data/)

### camera.js (70 lines)

```javascript
export const rotationPoints = [
  [5.1, 0.1, 2],
  [1.3, 0.4, 3.9],
  [0.1, 0.6, 3.36],
  [-12.1, 5.8, -6.1],
  [0, 0, 0],
];

export const closeUpPositions = [
  [0, 0.5, 4.07],
  [-0.6, 0.3, 4.1],
  // ... 7 more positions
];

export const closeUpPositionsSmallScreen = [ /* similar array */ ];

export const closeUpRotations = [ /* rotation vectors */ ];

export const positionMap = {
  Phone_Stocks: 0,
  Phone_Looper_5: 1,
  Phone_Vocabulary_5: 2,
  // ... more mappings
};

export const scrollConstants = {
  desktop: 0.3,
  mobile: 0.8,
};
```

### lighting.js (54 lines)

```javascript
export const lightColorWheel = [
  "#FFD700", "#FDFD96", "#FFFF00", /* ~70 color hex codes */
];

export const lightIntensityStarter = 30;

export const pointLightPositions = [
  { position: [10.5, 2.8, 9.35], signName: ["lamppost"] },
  {
    position: [6.07, 0.57, 0.6],
    signName: ["small_right", "Button_Light_6"],
    sliderName: "Slider_6",
  },
  // ... more lights
];

export const vibeToLight = [
  { lightColor1: "#B68672", lightColor2: "#9E9149", lightColor3: "#E96929" },
  { lightColor1: "#869582", lightColor2: "#72979D", lightColor3: "#80C080" },
  { lightColor1: "#8F909D", lightColor2: "#A28A9B", lightColor3: "#f59b9b" },
  { lightColor1: "#BA827F", lightColor2: "#B38A3C", lightColor3: "#7a87cc" },
];
```

### meshes.js (40 lines)

```javascript
export const lightNames = [
  "small_middle_left",
  "small_middle_right",
  "lamppost",
  // ... 14 more light names
];

export const phoneConfigs = [
  { name: "Phone_Vocabulary_5", video: require("../assets/Vocabulary.mp4"), textNode: "Phone_Vocabulary_Text" },
  { name: "Phone_Movies_5", video: require("../assets/Movies.mp4"), textNode: "Phone_Movies_Text" },
  // ... 4 more phone configs
];

export const meshNames = phoneConfigs.map(config => config.name);
export const videoPaths = phoneConfigs.map(config => config.video);

export const closeUpClickThrough = 2; // Clicks before opening link
export const MODEL_PATH = process.env.PUBLIC_URL + "compressed_model.glb";
```

### urls.js (52 lines)

```javascript
export const urlMap = {
  text_name: "https://www.gemenielabs.com/contact/",
  Sign_About: "https://www.gemenielabs.com/contact/",
  Sign_Articles: "https://medium.com/@HatmanStack",
  Sign_Github: "https://github.com/HatmanStack",
  // ... 10 more URL mappings
};

export const phoneUrls = [
  {
    signName: ["Phone_Stocks_5", "Phone_Stocks_Text"],
    url: "https://www.gemenielabs.com/#stocks",
  },
  // ... more phone URL configs
];
```

### animations.js (84 lines)

```javascript
export const slidersList = ["Slider_4"];

export const instructionsList = [
  "text_navigate",
  "text_rotate",
  "text_scroll",
  "text_middle",
  "text_click",
];

export const vibeURLs = [
  {
    iframe1: "https://freepacman.org/",
    iframe2: "https://www.youtube.com/embed/pCx5Std7mCo?...",
    srcID: "pCx5Std7mCo",
  },
  // ... 3 more vibe URLs
];

export const nodesList = [ /* text node names */ ];
export const phoneList = [ /* phone mesh names */ ];

export const sliderRotation = [7.36, 0, 0];
export const sliderScale = [0.4, 0.4, 0.4];
export const sliderPosition = [[0.9305, 0.538, 3.986]];
export const textPosition = [ /* 6 text positions */ ];
export const rotation = [ /* 6 rotations */ ];
```

### ui.js (29 lines)

```javascript
export const colorMap = {
  0: { active: "#E96929", rest: "#B68672", title: 20},
  1: { active: "#80C080", rest: "#869582", title: 120 },
  2: { active: "#EF5555", rest: "#f38484", title: 0 },
  3: { active: "#9FA8DA", rest: "#8F909D", title: 235 },
  default: { active: "#B68672", rest: "#E96929" },
};

export const vibeThemes = [
  { id: "0", name: "urban", color: "#E96929", displayName: "URBAN", svgWidth: 280 },
  { id: "1", name: "rural", color: "#80C080", displayName: "RURAL", svgWidth: 275 },
  { id: "2", name: "classy", color: "#EF5555", displayName: "CLASSY", svgWidth: 320 },
  { id: "3", name: "chill", color: "#9FA8DA", displayName: "CHILL", svgWidth: 240 },
];

export const breakpoints = {
  mobile: 800,
  tablet: 1200,
};

export const assets = {
  handGif: require("../assets/hand.gif"),
  volumeUp: require("../assets/volume_up.svg"),
  volumeMute: require("../assets/volume_mute.svg"),
};
```

---

## CSS Files (src/css/)

### styles.css (122 lines)

**Key Classes:**
```css
html, body, #root {
  width: 100%; height: 100%;
  margin: 0; padding: 0;
  background-color: var(--background-primary);
  --rest-color: #9b9dad;
  --active-color: #b68672;
}

.button-container {
  position: relative;
  height: 100%;
}

.main__title-letter {
  color: hsl(/* dynamic color calculation */);
}

.navigate {
  width: 3rem; height: 3rem;
  bottom: 0; left: 0;
  border-radius: 50%;
  position: absolute;
  background-color: var(--rest-color);
  background-image: url("../assets/arrow.svg");
  /* ... more styles */
}

.mute {
  /* similar button styles */
  top: 0; right: 0;
}

.arcadewrapper { /* iframe container */ }
.musicwrapper { /* music iframe container */ }
```

### checkbox.css (208 lines)

**Purpose:** Complex custom checkbox with theme-specific animations

**Key Features:**
- Toggle animation with bounce effect (`@keyframes grow-in`, `bounce-in`, etc.)
- Theme-specific colors (urban, rural, classy, chill, graphics)
- SVG icon backgrounds
- Pseudo-element styling
- Responsive layout media queries

**Preserved in Phase 3:** ✅ This file will NOT be migrated to Tailwind due to complexity

### launch.css (157 lines)

**Purpose:** Launch screen and theme selection animations

**Key Classes:**
```css
.checkbox-container { /* responsive flex container */ }
.text-container { /* SVG text container */ }
.text-stroke-rural, .text-stroke-urban, /* theme-specific text animations */
.reset { /* reset button styling */ }

@keyframes textStrokeAnim {
  /* SVG stroke animation */
}
```

### theme-variables.css (30 lines)

**Purpose:** CSS custom properties for theming

```css
:root {
  /* Vibe Theme Colors */
  --urban-color: #E96929;
  --rural-color: #80C080;
  --classy-color: #EF5555;
  --chill-color: #9FA8DA;
  --graphics-color: #000000;

  /* Active/Rest States */
  --urban-active: #E96929;
  --urban-rest: #B68672;
  /* ... more theme colors */

  /* Defaults */
  --default-active: #B68672;
  --default-rest: #E96929;
  --background-primary: #171519;
  --text-primary: white;

  /* Animation Durations */
  --transition-fast: 0.2s;
  --transition-medium: 0.4s;
  --transition-slow: 0.8s;
}
```

---

## Root Files

### App.js (198 lines)

**Structure:**
- `TitleEffect` component (memoized sub-component for animated title)
- `AppContent` component (main app logic with contexts)
- Default export `App` with Provider wrappers

**Key Features:**
- Uses both `useInteraction` and `useUI` contexts
- Manages button refs for theme color updates
- Window resize handler
- Mute toggle handler
- Loading screen with progress
- Conditional render: LaunchScreen vs. main Canvas

### index.js (10 lines)

```javascript
import {createRoot} from 'react-dom/client';
import React from 'react';
import './css/styles.css';
import App from './App';

createRoot(document.getElementById('root')).render(
    <App />,
);
```

---

## Assets Inventory

### Video Files (src/assets/)
- Vocabulary.mp4
- Movies.mp4
- Looper.mp4
- Trachtenberg.mp4
- Italian.mp4
- Stocks.mp4

### Image Files
- hand.gif (loading animation)
- arrow.svg (navigation button)
- volume_up.svg (audio unmuted icon)
- volume_mute.svg (audio muted icon)
- urban.svg, rural.svg, classy.svg, chill.svg, video.svg (checkbox theme icons)

---

## Current Dependencies (package.json)

```json
{
  "dependencies": {
    "@react-spring/three": "^9.7.3",
    "@react-spring/web": "^9.7.3",
    "@react-three/drei": "^9.105.6",
    "@react-three/fiber": "^8.16.6",
    "@use-gesture/react": "^10.3.1",
    "gltf-pipeline": "^4.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-scripts": "5.0.1",
    "serve": "^14.2.4",
    "three": "^0.165.0",
    "use-sound": "^4.0.1"
  },
  "devDependencies": {
    "eslint": "^8.57.0",
    "eslint-config-google": "^0.14.0",
    "eslint-plugin-react": "^7.34.2",
    "raw-loader": "^4.0.2"
  }
}
```

**Note:** TypeScript, Zustand, Tailwind, and Testing libraries NOT yet installed

---

## Migration Checklists

### Components to Migrate (Phase 1)

**To `components/three/`:**
- [ ] Model.js → SceneModel.tsx
- [ ] Environment.js → SceneEnvironment.tsx
- [ ] VideoMesh.js → VideoTextureMesh.tsx
- [ ] Lamp.js → InteractiveLightMesh.tsx
- [ ] InteractiveElement.js → InteractiveMeshElement.tsx

**To `components/controls/`:**
- [ ] CameraControls.js → CameraController.tsx
- [ ] Animations.js → SceneAnimationController.tsx
- [ ] Sounds.js → AudioController.tsx

**To `components/ui/`:**
- [ ] LaunchScreen.js → LaunchScreen.tsx
- [ ] VibeOption.js → ThemeSelectionOption.tsx
- [ ] Checkbox.js → CustomCheckbox.tsx

### Data Files to Migrate (Phase 1)

**To `src/constants/`:**
- [ ] data/camera.js → constants/cameraConfiguration.ts
- [ ] data/lighting.js → constants/lightingConfiguration.ts
- [ ] data/meshes.js → constants/meshConfiguration.ts
- [ ] data/urls.js → constants/urlConfiguration.ts
- [ ] data/animations.js → constants/animationConfiguration.ts
- [ ] data/ui.js → constants/themeConfiguration.ts

### Context to Store Migration (Phase 2)

**From Context to Zustand:**
- [ ] UIContext.js → userInterfaceStore.ts
- [ ] InteractionContext.js → sceneInteractionStore.ts
- [ ] (new) threeJSSceneStore.ts for gltfModel/videoPlayer

### Hooks to Update (Phase 2)

- [ ] useCameraScroll.js → useCameraScrollBehavior.ts (use Zustand)
- [ ] useCameraAnimation.js → useCameraPositionAnimation.ts (use Zustand)
- [ ] useLightController.js → useLightingController.ts (use Zustand)

### CSS to Migrate (Phase 3)

**To Tailwind utilities:**
- [ ] styles.css (most classes) → Tailwind utilities
- [ ] launch.css (most classes) → Tailwind utilities
- [ ] theme-variables.css → tailwind.config.js colors

**Preserve as custom CSS:**
- [ ] checkbox.css → Keep as-is (complex animations)

---

## Code Complexity Metrics

**Total Lines of Code:**
- JavaScript Components: ~1,022 lines
- Context Providers: ~181 lines
- Custom Hooks: ~301 lines
- Data Files: ~329 lines
- CSS Files: ~517 lines
- **Total:** ~2,350 lines

**Estimated Refactoring:**
- Add ~500 lines for TypeScript types
- Remove ~181 lines (Context → Zustand is more concise)
- Add ~1,000 lines for tests
- **Post-Refactor Total:** ~3,700 lines

---

## Common Patterns Found

### State Management Pattern (Context)
```javascript
const { stateValue, actionFunction } = useContext();
// Used in ALL components
```

### Three.js Integration Pattern
```javascript
import { useThree } from "@react-three/fiber";
const { scene, camera } = useThree();
```

### Video Texture Pattern
```javascript
const video = document.createElement("video");
video.src = videoPaths[i];
const videoTexture = new THREE.VideoTexture(video);
node.material.map = videoTexture;
```

### Responsive Breakpoint Pattern
```javascript
if (screenWidth < 800) { /* mobile */ }
else if (screenWidth < 1200) { /* tablet */ }
else { /* desktop */ }
```

---

**Use this inventory as your reference guide throughout all phases of refactoring.**
