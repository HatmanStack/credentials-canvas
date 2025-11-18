/**
 * Mock Zustand stores for testing
 * Provides factory functions to create mock stores with jest functions
 */

import {create} from 'zustand';
import type {
  SceneInteractionState,
  UserInterfaceState,
  ThreeJSSceneState,
} from 'stores';
import type {VibeThemeConfiguration, LightIntensityConfiguration} from 'types';

/**
 * Create mock scene interaction store for testing
 * @param overrides - Partial state to override defaults
 * @returns Mock scene interaction store
 */
export const createMockSceneInteractionStore = (
    overrides?: Partial<SceneInteractionState>,
) => {
  return create<SceneInteractionState>()((set, get) => ({
    // Default mock state
    clickedMeshPosition: null,
    clickedLightName: null,
    totalClickCount: 0,
    isCloseUpViewActive: false,
    isUserCurrentlyDragging: false,
    hasUserStartedScrolling: false,
    mobileScrollTriggerCount: null,
    currentCameraPositionIndex: 0,
    cameraInterpolationProgress: 0,

    // Mock actions with jest functions
    setClickedMeshPosition: jest.fn((position) =>
      set({clickedMeshPosition: position}),
    ),
    setClickedLightName: jest.fn((name) =>
      set({clickedLightName: name}),
    ),
    incrementClickCount: jest.fn(() =>
      set((state) => ({totalClickCount: state.totalClickCount + 1})),
    ),
    resetClickCount: jest.fn(() =>
      set({totalClickCount: 0}),
    ),
    setIsCloseUpViewActive: jest.fn((isActive) =>
      set({isCloseUpViewActive: isActive}),
    ),
    setIsUserCurrentlyDragging: jest.fn((isDragging) =>
      set({isUserCurrentlyDragging: isDragging}),
    ),
    setHasUserStartedScrolling: jest.fn((hasStarted) =>
      set({hasUserStartedScrolling: hasStarted}),
    ),
    setMobileScrollTriggerCount: jest.fn((count) =>
      set({mobileScrollTriggerCount: count}),
    ),
    triggerMobileScrollNavigation: jest.fn(() => {
      const state = get();
      set({mobileScrollTriggerCount: (state.mobileScrollTriggerCount || 0) + 1});
    }),
    setCurrentCameraPositionIndex: jest.fn((index) =>
      set({currentCameraPositionIndex: index}),
    ),
    setCameraInterpolationProgress: jest.fn((progress) =>
      set({cameraInterpolationProgress: progress}),
    ),
    resetSceneInteractionState: jest.fn(() =>
      set({
        clickedMeshPosition: null,
        clickedLightName: null,
        totalClickCount: 0,
        isCloseUpViewActive: false,
        isUserCurrentlyDragging: false,
        hasUserStartedScrolling: false,
        mobileScrollTriggerCount: null,
        currentCameraPositionIndex: 0,
        cameraInterpolationProgress: 0,
      }),
    ),

    // Apply overrides
    ...overrides,
  }));
};

/**
 * Create mock user interface store for testing
 * @param overrides - Partial state to override defaults
 * @returns Mock user interface store
 */
export const createMockUserInterfaceStore = (
    overrides?: Partial<UserInterfaceState>,
) => {
  const defaultLightConfig: LightIntensityConfiguration = {
    sliderName: 'DefaultLight',
    intensity: 1,
  };

  return create<UserInterfaceState>()((set, get) => ({
    // Default mock state
    selectedThemeConfiguration: null,
    titleTextColorHue: null,
    shouldShowArcadeIframe: false,
    shouldShowMusicIframe: false,
    isAudioCurrentlyMuted: false,
    currentWindowWidth: 1920,
    currentLightIntensityConfiguration: defaultLightConfig,

    // Mock actions with jest functions
    setSelectedThemeConfiguration: jest.fn((theme) =>
      set({selectedThemeConfiguration: theme}),
    ),
    setTitleTextColorHue: jest.fn((hue) =>
      set({titleTextColorHue: hue}),
    ),
    setShouldShowArcadeIframe: jest.fn((show) =>
      set({shouldShowArcadeIframe: show}),
    ),
    setShouldShowMusicIframe: jest.fn((show) =>
      set({shouldShowMusicIframe: show}),
    ),
    setIsAudioCurrentlyMuted: jest.fn((isMuted) =>
      set({isAudioCurrentlyMuted: isMuted}),
    ),
    toggleAudioMute: jest.fn(() => {
      const state = get();
      set({isAudioCurrentlyMuted: !state.isAudioCurrentlyMuted});
    }),
    setCurrentWindowWidth: jest.fn((width) =>
      set({currentWindowWidth: width}),
    ),
    setCurrentLightIntensityConfiguration: jest.fn((config) =>
      set({currentLightIntensityConfiguration: config}),
    ),
    resetUserInterfaceState: jest.fn(() =>
      set({
        selectedThemeConfiguration: null,
        titleTextColorHue: null,
        shouldShowArcadeIframe: false,
        shouldShowMusicIframe: false,
        isAudioCurrentlyMuted: false,
        currentWindowWidth: 1920,
        currentLightIntensityConfiguration: defaultLightConfig,
      }),
    ),

    // Apply overrides
    ...overrides,
  }));
};

/**
 * Create mock Three.js scene store for testing
 * @param overrides - Partial state to override defaults
 * @returns Mock Three.js scene store
 */
export const createMockThreeJSSceneStore = (
    overrides?: Partial<ThreeJSSceneState>,
) => {
  return create<ThreeJSSceneState>()((set) => ({
    // Default mock state
    threeJSSceneModel: null,
    htmlVideoPlayerElement: null,

    // Mock actions with jest functions
    setThreeJSSceneModel: jest.fn((scene) =>
      set({threeJSSceneModel: scene}),
    ),
    setHTMLVideoPlayerElement: jest.fn((player) =>
      set({htmlVideoPlayerElement: player}),
    ),
    resetThreeJSSceneState: jest.fn(() =>
      set({
        threeJSSceneModel: null,
        htmlVideoPlayerElement: null,
      }),
    ),

    // Apply overrides
    ...overrides,
  }));
};

/**
 * Create a mock theme configuration for testing
 * @param themeName - Theme name
 * @returns Mock theme configuration
 */
export const createMockThemeConfiguration = (
    themeName: 'urban' | 'rural' | 'classy' | 'chill' = 'urban',
): VibeThemeConfiguration => ({
  id: themeName === 'urban' ? '0' :
    themeName === 'rural' ? '1' :
    themeName === 'classy' ? '2' : '3',
  name: themeName,
  color: themeName === 'urban' ? '#E96929' :
    themeName === 'rural' ? '#80C080' :
    themeName === 'classy' ? '#EF5555' : '#9FA8DA',
  displayName: themeName.toUpperCase() as 'URBAN' | 'RURAL' | 'CLASSY' | 'CHILL',
  svgWidth: themeName === 'urban' ? 280 :
    themeName === 'rural' ? 275 :
    themeName === 'classy' ? 320 : 240,
});
