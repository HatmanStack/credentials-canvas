/**
 * Zustand store type definitions
 * These will be used in Phase 2 for state management migration
 */

import type * as THREE from 'three';
import type { LightIntensityConfiguration, VibeThemeConfiguration } from './componentTypes';

/**
 * Scene interaction store state
 * TODO: Phase 2 - Implement Zustand store
 */
export interface SceneInteractionState {
  // Click interactions
  clickedMeshPosition: THREE.Vector3 | null;
  clickedLightName: string | null;
  totalClickCount: number;

  // Scroll interactions
  hasUserStartedScrolling: boolean;
  mobileScrollTriggerCount: number | null;

  // Camera state
  currentCameraPositionIndex: number;
  cameraInterpolationProgress: number;

  // View state
  isCloseUpViewActive: boolean;
  isUserCurrentlyDragging: boolean;

  // Actions
  setClickedMeshPosition: (position: THREE.Vector3 | null) => void;
  setClickedLightName: (name: string | null) => void;
  incrementClickCount: () => void;
  setHasUserStartedScrolling: (hasStarted: boolean) => void;
  triggerMobileScrollNavigation: () => void;
  setCurrentCameraPositionIndex: (index: number) => void;
  setCameraInterpolationProgress: (progress: number) => void;
  setIsCloseUpViewActive: (isActive: boolean) => void;
  setIsUserCurrentlyDragging: (isDragging: boolean) => void;
}

/**
 * User interface store state
 * TODO: Phase 2 - Implement Zustand store
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

  // Actions
  setSelectedThemeConfiguration: (theme: VibeThemeConfiguration | null) => void;
  setTitleTextColorHue: (hue: number | null) => void;
  setShouldShowArcadeIframe: (show: boolean) => void;
  setShouldShowMusicIframe: (show: boolean) => void;
  setIsAudioCurrentlyMuted: (isMuted: boolean) => void;
  setCurrentWindowWidth: (width: number) => void;
  setCurrentLightIntensityConfiguration: (config: LightIntensityConfiguration) => void;
}

/**
 * Three.js scene store state
 * TODO: Phase 2 - Implement Zustand store
 */
export interface ThreeJSSceneState {
  // Three.js objects
  threeJSSceneModel: THREE.Scene | null;
  htmlVideoPlayerElement: HTMLVideoElement | null;

  // Actions
  setThreeJSSceneModel: (scene: THREE.Scene | null) => void;
  setHTMLVideoPlayerElement: (player: HTMLVideoElement | null) => void;
}
