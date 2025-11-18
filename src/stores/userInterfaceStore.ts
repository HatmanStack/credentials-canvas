/**
 * User Interface Zustand Store
 *
 * Manages all UI-related state including:
 * - Theme/vibe selection and styling
 * - Audio mute state
 * - Iframe visibility (arcade and music players)
 * - Window dimensions for responsive behavior
 * - Lighting controls
 *
 * Replaces UIContext for better performance through selective subscriptions.
 *
 * @example
 * ```typescript
 * // In a component - selective subscription
 * const selectedTheme = useUserInterfaceStore(state => state.selectedThemeConfiguration);
 * const setTheme = useUserInterfaceStore(state => state.setSelectedThemeConfiguration);
 * ```
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { VibeThemeConfiguration, LightIntensityConfiguration } from 'types';

/**
 * User Interface State Interface
 *
 * Defines all UI state and actions
 */
export interface UserInterfaceState {
  // Theme configuration
  /** Currently selected theme/vibe configuration (null if none selected) */
  selectedThemeConfiguration: VibeThemeConfiguration | null;

  /** Title text color hue value (null if using default) */
  titleTextColorHue: number | null;

  // UI visibility states
  /** Whether the arcade iframe should be displayed */
  shouldShowArcadeIframe: boolean;

  /** Whether the music player iframe should be displayed */
  shouldShowMusicIframe: boolean;

  // Audio state
  /** Whether audio is currently muted */
  isAudioCurrentlyMuted: boolean;

  // Responsive state
  /** Current window width in pixels */
  currentWindowWidth: number;

  // Lighting controls
  /** Current light intensity configuration */
  currentLightIntensityConfiguration: LightIntensityConfiguration;

  // Actions - Theme
  /** Set the selected theme configuration */
  setSelectedThemeConfiguration: (theme: VibeThemeConfiguration | null) => void;

  /** Set the title text color hue */
  setTitleTextColorHue: (hue: number | null) => void;

  // Actions - UI visibility
  /** Set whether the arcade iframe should be shown */
  setShouldShowArcadeIframe: (show: boolean) => void;

  /** Set whether the music iframe should be shown */
  setShouldShowMusicIframe: (show: boolean) => void;

  // Actions - Audio
  /** Set whether audio is muted */
  setIsAudioCurrentlyMuted: (isMuted: boolean) => void;

  /** Toggle audio mute state */
  toggleAudioMute: () => void;

  // Actions - Responsive
  /** Set the current window width */
  setCurrentWindowWidth: (width: number) => void;

  // Actions - Lighting
  /** Set the light intensity configuration */
  setCurrentLightIntensityConfiguration: (config: LightIntensityConfiguration) => void;

  // Reset action
  /** Reset all UI state to defaults */
  resetUserInterfaceState: () => void;
}

/**
 * User Interface Zustand Store
 *
 * Use selective subscriptions to prevent unnecessary re-renders:
 * @example
 * const isMuted = useUserInterfaceStore(state => state.isAudioCurrentlyMuted);
 * const toggleMute = useUserInterfaceStore(state => state.toggleAudioMute);
 */
export const useUserInterfaceStore = create<UserInterfaceState>()(
  devtools(
    set => ({
      // Initial state - Theme
      selectedThemeConfiguration: null,
      titleTextColorHue: null,

      // Initial state - UI visibility
      shouldShowArcadeIframe: true,
      shouldShowMusicIframe: true,

      // Initial state - Audio
      isAudioCurrentlyMuted: false,

      // Initial state - Responsive
      currentWindowWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,

      // Initial state - Lighting
      currentLightIntensityConfiguration: {
        sliderName: 'Slider_4',
        intensity: 10,
      },

      // Actions - Theme
      setSelectedThemeConfiguration: theme =>
        set({ selectedThemeConfiguration: theme }, false, 'setSelectedThemeConfiguration'),

      setTitleTextColorHue: hue =>
        set({ titleTextColorHue: hue }, false, 'setTitleTextColorHue'),

      // Actions - UI visibility
      setShouldShowArcadeIframe: show =>
        set({ shouldShowArcadeIframe: show }, false, 'setShouldShowArcadeIframe'),

      setShouldShowMusicIframe: show =>
        set({ shouldShowMusicIframe: show }, false, 'setShouldShowMusicIframe'),

      // Actions - Audio
      setIsAudioCurrentlyMuted: isMuted =>
        set({ isAudioCurrentlyMuted: isMuted }, false, 'setIsAudioCurrentlyMuted'),

      toggleAudioMute: () =>
        set(
          state => ({ isAudioCurrentlyMuted: !state.isAudioCurrentlyMuted }),
          false,
          'toggleAudioMute'
        ),

      // Actions - Responsive
      setCurrentWindowWidth: width =>
        set({ currentWindowWidth: width }, false, 'setCurrentWindowWidth'),

      // Actions - Lighting
      setCurrentLightIntensityConfiguration: config =>
        set(
          { currentLightIntensityConfiguration: config },
          false,
          'setCurrentLightIntensityConfiguration'
        ),

      // Reset action
      resetUserInterfaceState: () =>
        set(
          {
            selectedThemeConfiguration: null,
            titleTextColorHue: null,
            shouldShowArcadeIframe: true,
            shouldShowMusicIframe: true,
            isAudioCurrentlyMuted: false,
            currentWindowWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
            currentLightIntensityConfiguration: {
              sliderName: 'Slider_4',
              intensity: 10,
            },
          },
          false,
          'resetUserInterfaceState'
        ),
    }),
    { name: 'UserInterfaceStore' }
  )
);
