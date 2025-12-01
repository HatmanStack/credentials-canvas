import type * as THREE from 'three';
import type { LightIntensityConfiguration, VibeThemeConfiguration } from './componentTypes';
import type { YouTubePlayer } from './youtubeTypes';

export interface SceneInteractionState {
  clickedMeshPosition: string | null;
  clickedLightName: string | null;
  totalClickCount: number;
  isCloseUpViewActive: boolean;
  isUserCurrentlyDragging: boolean;
  hasUserStartedScrolling: boolean;
  mobileScrollTriggerCount: number | null;
  currentCameraPositionIndex: number;
  cameraInterpolationProgress: number;

  setClickedMeshPosition: (position: string | null) => void;
  setClickedLightName: (name: string | null) => void;
  incrementClickCount: () => void;
  resetClickCount: () => void;
  setIsCloseUpViewActive: (isActive: boolean) => void;
  setIsUserCurrentlyDragging: (isDragging: boolean) => void;
  setHasUserStartedScrolling: (hasStarted: boolean) => void;
  setMobileScrollTriggerCount: (count: number | null) => void;
  triggerMobileScrollNavigation: () => void;
  setCurrentCameraPositionIndex: (index: number) => void;
  setCameraInterpolationProgress: (progress: number) => void;
  resetSceneInteractionState: () => void;
}

export interface UserInterfaceState {
  selectedThemeConfiguration: VibeThemeConfiguration | null;
  titleTextColorHue: number | null;
  shouldShowArcadeIframe: boolean;
  shouldShowMusicIframe: boolean;
  isAudioCurrentlyMuted: boolean;
  currentWindowWidth: number;
  currentLightIntensityConfiguration: LightIntensityConfiguration;

  setSelectedThemeConfiguration: (theme: VibeThemeConfiguration | null) => void;
  setTitleTextColorHue: (hue: number | null) => void;
  setShouldShowArcadeIframe: (show: boolean) => void;
  setShouldShowMusicIframe: (show: boolean) => void;
  setIsAudioCurrentlyMuted: (isMuted: boolean) => void;
  toggleAudioMute: () => void;
  setCurrentWindowWidth: (width: number) => void;
  setCurrentLightIntensityConfiguration: (config: LightIntensityConfiguration) => void;
  resetUserInterfaceState: () => void;
}

export interface ThreeJSSceneState {
  threeJSSceneModel: THREE.Group | THREE.Scene | null;
  htmlVideoPlayerElement: YouTubePlayer | null;

  setThreeJSSceneModel: (scene: THREE.Group | THREE.Scene | null) => void;
  setHTMLVideoPlayerElement: (player: YouTubePlayer | null) => void;
  resetThreeJSSceneState: () => void;
}
