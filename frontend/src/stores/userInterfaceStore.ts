import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { VibeThemeConfiguration, LightIntensityConfiguration } from '@/types';

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

export const useUserInterfaceStore = create<UserInterfaceState>()(
  devtools(
    set => ({
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

      setSelectedThemeConfiguration: theme =>
        set({ selectedThemeConfiguration: theme }, false, 'setSelectedThemeConfiguration'),

      setTitleTextColorHue: hue =>
        set({ titleTextColorHue: hue }, false, 'setTitleTextColorHue'),

      setShouldShowArcadeIframe: show =>
        set({ shouldShowArcadeIframe: show }, false, 'setShouldShowArcadeIframe'),

      setShouldShowMusicIframe: show =>
        set({ shouldShowMusicIframe: show }, false, 'setShouldShowMusicIframe'),

      setIsAudioCurrentlyMuted: isMuted =>
        set({ isAudioCurrentlyMuted: isMuted }, false, 'setIsAudioCurrentlyMuted'),

      toggleAudioMute: () =>
        set(
          state => ({ isAudioCurrentlyMuted: !state.isAudioCurrentlyMuted }),
          false,
          'toggleAudioMute'
        ),

      setCurrentWindowWidth: width =>
        set({ currentWindowWidth: width }, false, 'setCurrentWindowWidth'),

      setCurrentLightIntensityConfiguration: config =>
        set(
          { currentLightIntensityConfiguration: config },
          false,
          'setCurrentLightIntensityConfiguration'
        ),

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
