import { vi } from 'vitest';
import { create } from 'zustand';
import type {
  SceneInteractionState,
  UserInterfaceState,
  ThreeJSSceneState,
} from '@stores';
import type { VibeThemeConfiguration, LightIntensityConfiguration } from '@types';

export const createMockSceneInteractionStore = (
  overrides?: Partial<SceneInteractionState>,
) => {
  return create<SceneInteractionState>()((set, get) => ({
    clickedMeshPosition: null,
    clickedLightName: null,
    totalClickCount: 0,
    isCloseUpViewActive: false,
    isUserCurrentlyDragging: false,
    hasUserStartedScrolling: false,
    mobileScrollTriggerCount: null,
    currentCameraPositionIndex: 0,
    cameraInterpolationProgress: 0,

    setClickedMeshPosition: vi.fn(position =>
      set({ clickedMeshPosition: position }),
    ),
    setClickedLightName: vi.fn(name =>
      set({ clickedLightName: name }),
    ),
    incrementClickCount: vi.fn(() =>
      set(state => ({ totalClickCount: state.totalClickCount + 1 })),
    ),
    resetClickCount: vi.fn(() =>
      set({ totalClickCount: 0 }),
    ),
    setIsCloseUpViewActive: vi.fn(isActive =>
      set({ isCloseUpViewActive: isActive }),
    ),
    setIsUserCurrentlyDragging: vi.fn(isDragging =>
      set({ isUserCurrentlyDragging: isDragging }),
    ),
    setHasUserStartedScrolling: vi.fn(hasStarted =>
      set({ hasUserStartedScrolling: hasStarted }),
    ),
    setMobileScrollTriggerCount: vi.fn(count =>
      set({ mobileScrollTriggerCount: count }),
    ),
    triggerMobileScrollNavigation: vi.fn(() => {
      const state = get();
      set({ mobileScrollTriggerCount: (state.mobileScrollTriggerCount || 0) + 1 });
    }),
    setCurrentCameraPositionIndex: vi.fn(index =>
      set({ currentCameraPositionIndex: index }),
    ),
    setCameraInterpolationProgress: vi.fn(progress =>
      set({ cameraInterpolationProgress: progress }),
    ),
    resetSceneInteractionState: vi.fn(() =>
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

    ...overrides,
  }));
};

export const createMockUserInterfaceStore = (
  overrides?: Partial<UserInterfaceState>,
) => {
  const defaultLightConfig: LightIntensityConfiguration = {
    sliderName: 'DefaultLight',
    intensity: 1,
  };

  return create<UserInterfaceState>()((set, get) => ({
    selectedThemeConfiguration: null,
    titleTextColorHue: null,
    shouldShowArcadeIframe: false,
    shouldShowMusicIframe: false,
    isAudioCurrentlyMuted: false,
    currentWindowWidth: 1920,
    currentLightIntensityConfiguration: defaultLightConfig,

    setSelectedThemeConfiguration: vi.fn(theme =>
      set({ selectedThemeConfiguration: theme }),
    ),
    setTitleTextColorHue: vi.fn(hue =>
      set({ titleTextColorHue: hue }),
    ),
    setShouldShowArcadeIframe: vi.fn(show =>
      set({ shouldShowArcadeIframe: show }),
    ),
    setShouldShowMusicIframe: vi.fn(show =>
      set({ shouldShowMusicIframe: show }),
    ),
    setIsAudioCurrentlyMuted: vi.fn(isMuted =>
      set({ isAudioCurrentlyMuted: isMuted }),
    ),
    toggleAudioMute: vi.fn(() => {
      const state = get();
      set({ isAudioCurrentlyMuted: !state.isAudioCurrentlyMuted });
    }),
    setCurrentWindowWidth: vi.fn(width =>
      set({ currentWindowWidth: width }),
    ),
    setCurrentLightIntensityConfiguration: vi.fn(config =>
      set({ currentLightIntensityConfiguration: config }),
    ),
    resetUserInterfaceState: vi.fn(() =>
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

    ...overrides,
  }));
};

export const createMockThreeJSSceneStore = (
  overrides?: Partial<ThreeJSSceneState>,
) => {
  return create<ThreeJSSceneState>()(set => ({
    threeJSSceneModel: null,
    htmlVideoPlayerElement: null,

    setThreeJSSceneModel: vi.fn(scene =>
      set({ threeJSSceneModel: scene }),
    ),
    setHTMLVideoPlayerElement: vi.fn(player =>
      set({ htmlVideoPlayerElement: player }),
    ),
    resetThreeJSSceneState: vi.fn(() =>
      set({
        threeJSSceneModel: null,
        htmlVideoPlayerElement: null,
      }),
    ),

    ...overrides,
  }));
};

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
