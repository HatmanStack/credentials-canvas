import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserInterfaceStore } from 'stores/userInterfaceStore';
import { createMockThemeConfiguration } from 'test-helpers/storeMocks';

describe('userInterfaceStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useUserInterfaceStore());
    act(() => {
      result.current.resetUserInterfaceState();
    });
  });

  describe('theme configuration', () => {
    it('should set selected theme configuration', () => {
      const { result } = renderHook(() => useUserInterfaceStore());
      const mockTheme = createMockThemeConfiguration('urban');

      expect(result.current.selectedThemeConfiguration).toBeNull();

      act(() => {
        result.current.setSelectedThemeConfiguration(mockTheme);
      });

      expect(result.current.selectedThemeConfiguration).toEqual(mockTheme);
    });

    it('should clear selected theme configuration with null', () => {
      const { result } = renderHook(() => useUserInterfaceStore());
      const mockTheme = createMockThemeConfiguration('rural');

      act(() => {
        result.current.setSelectedThemeConfiguration(mockTheme);
      });

      expect(result.current.selectedThemeConfiguration).toEqual(mockTheme);

      act(() => {
        result.current.setSelectedThemeConfiguration(null);
      });

      expect(result.current.selectedThemeConfiguration).toBeNull();
    });

    it('should handle different theme configurations', () => {
      const { result } = renderHook(() => useUserInterfaceStore());
      const urbanTheme = createMockThemeConfiguration('urban');
      const ruralTheme = createMockThemeConfiguration('rural');

      act(() => {
        result.current.setSelectedThemeConfiguration(urbanTheme);
      });

      expect(result.current.selectedThemeConfiguration?.name).toBe('urban');

      act(() => {
        result.current.setSelectedThemeConfiguration(ruralTheme);
      });

      expect(result.current.selectedThemeConfiguration?.name).toBe('rural');
    });

    it('should set title text color hue', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      expect(result.current.titleTextColorHue).toBeNull();

      act(() => {
        result.current.setTitleTextColorHue(180);
      });

      expect(result.current.titleTextColorHue).toBe(180);
    });

    it('should clear title text color hue with null', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.setTitleTextColorHue(90);
      });

      act(() => {
        result.current.setTitleTextColorHue(null);
      });

      expect(result.current.titleTextColorHue).toBeNull();
    });
  });

  describe('iframe visibility', () => {
    it('should set arcade iframe visibility', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      expect(result.current.shouldShowArcadeIframe).toBe(true);

      act(() => {
        result.current.setShouldShowArcadeIframe(false);
      });

      expect(result.current.shouldShowArcadeIframe).toBe(false);
    });

    it('should toggle arcade iframe visibility', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      expect(result.current.shouldShowArcadeIframe).toBe(true);

      act(() => {
        result.current.setShouldShowArcadeIframe(false);
      });

      expect(result.current.shouldShowArcadeIframe).toBe(false);

      act(() => {
        result.current.setShouldShowArcadeIframe(true);
      });

      expect(result.current.shouldShowArcadeIframe).toBe(true);
    });

    it('should set music iframe visibility', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      expect(result.current.shouldShowMusicIframe).toBe(true);

      act(() => {
        result.current.setShouldShowMusicIframe(false);
      });

      expect(result.current.shouldShowMusicIframe).toBe(false);
    });

    it('should handle both iframes independently', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      expect(result.current.shouldShowArcadeIframe).toBe(true);
      expect(result.current.shouldShowMusicIframe).toBe(true);

      act(() => {
        result.current.setShouldShowArcadeIframe(false);
      });

      expect(result.current.shouldShowArcadeIframe).toBe(false);
      expect(result.current.shouldShowMusicIframe).toBe(true);

      act(() => {
        result.current.setShouldShowMusicIframe(false);
      });

      expect(result.current.shouldShowArcadeIframe).toBe(false);
      expect(result.current.shouldShowMusicIframe).toBe(false);
    });
  });

  describe('audio state', () => {
    it('should set audio muted state', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      expect(result.current.isAudioCurrentlyMuted).toBe(false);

      act(() => {
        result.current.setIsAudioCurrentlyMuted(true);
      });

      expect(result.current.isAudioCurrentlyMuted).toBe(true);
    });

    it('should toggle audio mute state', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      expect(result.current.isAudioCurrentlyMuted).toBe(false);

      act(() => {
        result.current.toggleAudioMute();
      });

      expect(result.current.isAudioCurrentlyMuted).toBe(true);

      act(() => {
        result.current.toggleAudioMute();
      });

      expect(result.current.isAudioCurrentlyMuted).toBe(false);
    });

    it('should toggle audio mute multiple times', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.toggleAudioMute();
        result.current.toggleAudioMute();
        result.current.toggleAudioMute();
      });

      expect(result.current.isAudioCurrentlyMuted).toBe(true);
    });
  });

  describe('responsive state', () => {
    it('should set current window width', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      const initialWidth = result.current.currentWindowWidth;
      expect(typeof initialWidth).toBe('number');

      act(() => {
        result.current.setCurrentWindowWidth(768);
      });

      expect(result.current.currentWindowWidth).toBe(768);
    });

    it('should update window width for mobile', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.setCurrentWindowWidth(375);
      });

      expect(result.current.currentWindowWidth).toBe(375);
    });

    it('should update window width for tablet', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.setCurrentWindowWidth(1024);
      });

      expect(result.current.currentWindowWidth).toBe(1024);
    });
  });

  describe('lighting controls', () => {
    it('should set light intensity configuration', () => {
      const { result } = renderHook(() => useUserInterfaceStore());
      const lightConfig = {
        sliderName: 'Slider_1',
        intensity: 5.0,
      };

      act(() => {
        result.current.setCurrentLightIntensityConfiguration(lightConfig);
      });

      expect(result.current.currentLightIntensityConfiguration).toEqual(lightConfig);
    });

    it('should update light intensity value', () => {
      const { result } = renderHook(() => useUserInterfaceStore());
      const config1 = {
        sliderName: 'Slider_1',
        intensity: 1.0,
      };
      const config2 = {
        sliderName: 'Slider_1',
        intensity: 15.0,
      };

      act(() => {
        result.current.setCurrentLightIntensityConfiguration(config1);
      });

      expect(result.current.currentLightIntensityConfiguration.intensity).toBe(1.0);

      act(() => {
        result.current.setCurrentLightIntensityConfiguration(config2);
      });

      expect(result.current.currentLightIntensityConfiguration.intensity).toBe(15.0);
    });
  });

  describe('reset', () => {
    it('should reset all UI state to initial values', () => {
      const { result } = renderHook(() => useUserInterfaceStore());
      const mockTheme = createMockThemeConfiguration('classy');

      act(() => {
        result.current.setSelectedThemeConfiguration(mockTheme);
        result.current.setTitleTextColorHue(270);
        result.current.setShouldShowArcadeIframe(false);
        result.current.setShouldShowMusicIframe(false);
        result.current.setIsAudioCurrentlyMuted(true);
        result.current.setCurrentWindowWidth(480);
        result.current.setCurrentLightIntensityConfiguration({
          sliderName: 'TestSlider',
          intensity: 5.0,
        });
      });

      expect(result.current.selectedThemeConfiguration).toEqual(mockTheme);
      expect(result.current.shouldShowArcadeIframe).toBe(false);
      expect(result.current.isAudioCurrentlyMuted).toBe(true);
      expect(result.current.currentWindowWidth).toBe(480);

      act(() => {
        result.current.resetUserInterfaceState();
      });

      expect(result.current.selectedThemeConfiguration).toBeNull();
      expect(result.current.titleTextColorHue).toBeNull();
      expect(result.current.shouldShowArcadeIframe).toBe(true);
      expect(result.current.shouldShowMusicIframe).toBe(true);
      expect(result.current.isAudioCurrentlyMuted).toBe(false);
      expect(typeof result.current.currentWindowWidth).toBe('number');
      expect(result.current.currentLightIntensityConfiguration.sliderName).toBe('Slider_4');
    });
  });

  describe('state persistence', () => {
    it('should maintain theme across multiple reads', () => {
      const { result } = renderHook(() => useUserInterfaceStore());
      const mockTheme = createMockThemeConfiguration('chill');

      act(() => {
        result.current.setSelectedThemeConfiguration(mockTheme);
      });

      expect(result.current.selectedThemeConfiguration).toEqual(mockTheme);
      expect(result.current.selectedThemeConfiguration).toEqual(mockTheme);
      expect(result.current.selectedThemeConfiguration).toEqual(mockTheme);
    });

    it('should update states independently', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      expect(result.current.shouldShowArcadeIframe).toBe(true);
      expect(result.current.shouldShowMusicIframe).toBe(true);
      expect(result.current.isAudioCurrentlyMuted).toBe(false);

      act(() => {
        result.current.setShouldShowArcadeIframe(false);
      });

      expect(result.current.shouldShowArcadeIframe).toBe(false);
      expect(result.current.shouldShowMusicIframe).toBe(true);

      act(() => {
        result.current.setIsAudioCurrentlyMuted(true);
      });

      expect(result.current.shouldShowArcadeIframe).toBe(false);
      expect(result.current.shouldShowMusicIframe).toBe(true);
      expect(result.current.isAudioCurrentlyMuted).toBe(true);
    });
  });
});
