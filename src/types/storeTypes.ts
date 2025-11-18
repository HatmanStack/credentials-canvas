/**
 * Zustand store type definitions
 * These will be used in Phase 2 for state management migration
 */

import type * as THREE from 'three';
import type { LightIntensityConfiguration, VibeThemeConfiguration } from './componentTypes';

/**
 * Scene interaction store state
 * Zustand store for managing all 3D scene interactions
 */
export interface SceneInteractionState {
  // Click interactions
  clickedMeshPosition: string | null;
  clickedLightName: string | null;
  totalClickCount: number;

  // View state
  isCloseUpViewActive: boolean;
  isUserCurrentlyDragging: boolean;

  // Scroll interactions
  hasUserStartedScrolling: boolean;
  mobileScrollTriggerCount: number | null;

  // Camera state
  currentCameraPositionIndex: number;
  cameraInterpolationProgress: number;

  // Actions - Mesh interactions
  setClickedMeshPosition: (position: string | null) => void;
  setClickedLightName: (name: string | null) => void;
  incrementClickCount: () => void;
  resetClickCount: () => void;

  // Actions - View state
  setIsCloseUpViewActive: (isActive: boolean) => void;
  setIsUserCurrentlyDragging: (isDragging: boolean) => void;

  // Actions - Scroll state
  setHasUserStartedScrolling: (hasStarted: boolean) => void;
  setMobileScrollTriggerCount: (count: number | null) => void;
  triggerMobileScrollNavigation: () => void;

  // Actions - Camera state
  setCurrentCameraPositionIndex: (index: number) => void;
  setCameraInterpolationProgress: (progress: number) => void;

  // Reset action
  resetSceneInteractionState: () => void;
}

/**
 * User interface store state
 * Zustand store for managing all UI-related state
 */
export interface UserInterfaceState {
  // Theme
  selectedThemeConfiguration: VibeThemeConfiguration | null;
  titleTextColorHue: number | null;

  // UI visibility
  shouldShowArcadeIframe: boolean;
  shouldShowMusicIframe: boolean;

  // Audio
  isAudioCurrentlyMuted: boolean;

  // Responsive
  currentWindowWidth: number;

  // Lighting
  currentLightIntensityConfiguration: LightIntensityConfiguration;

  // Actions - Theme
  setSelectedThemeConfiguration: (theme: VibeThemeConfiguration | null) => void;
  setTitleTextColorHue: (hue: number | null) => void;

  // Actions - UI visibility
  setShouldShowArcadeIframe: (show: boolean) => void;
  setShouldShowMusicIframe: (show: boolean) => void;

  // Actions - Audio
  setIsAudioCurrentlyMuted: (isMuted: boolean) => void;
  toggleAudioMute: () => void;

  // Actions - Responsive
  setCurrentWindowWidth: (width: number) => void;

  // Actions - Lighting
  setCurrentLightIntensityConfiguration: (config: LightIntensityConfiguration) => void;

  // Reset action
  resetUserInterfaceState: () => void;
}

/**
 * Three.js scene store state
 * Zustand store for Three.js object references
 */
export interface ThreeJSSceneState {
  // Three.js objects
  threeJSSceneModel: THREE.Group | THREE.Scene | null;
  htmlVideoPlayerElement: HTMLVideoElement | null;

  // Actions
  setThreeJSSceneModel: (scene: THREE.Group | THREE.Scene | null) => void;
  setHTMLVideoPlayerElement: (player: HTMLVideoElement | null) => void;

  // Reset action
  resetThreeJSSceneState: () => void;
}
