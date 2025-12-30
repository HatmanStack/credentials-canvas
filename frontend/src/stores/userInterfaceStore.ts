import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { UserInterfaceState } from '@/types/storeTypes';

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
