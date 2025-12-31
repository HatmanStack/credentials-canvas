import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSceneInteractionStore, useUserInterfaceStore } from '@/stores';

// Test the logic and state management of SceneEnvironment
// R3F rendering is mocked, focus on store interactions and light configuration

describe('SceneEnvironment logic', () => {
  beforeEach(() => {
    const sceneStore = renderHook(() => useSceneInteractionStore());
    const uiStore = renderHook(() => useUserInterfaceStore());

    act(() => {
      sceneStore.result.current.resetSceneInteractionState();
      uiStore.result.current.resetUserInterfaceState();
    });
  });

  describe('light click interactions', () => {
    it('should track clicked light name in store', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedLightName('Button_Light_4');
      });

      expect(result.current.clickedLightName).toBe('Button_Light_4');
    });

    it('should increment click count on light click', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.totalClickCount).toBe(0);

      act(() => {
        result.current.setClickedLightName('lamppost');
        result.current.incrementClickCount();
      });

      expect(result.current.totalClickCount).toBe(1);
    });

    it('should track multiple light clicks independently', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedLightName('Button_Light_1');
        result.current.incrementClickCount();
      });

      expect(result.current.clickedLightName).toBe('Button_Light_1');
      expect(result.current.totalClickCount).toBe(1);

      act(() => {
        result.current.setClickedLightName('Button_Light_2');
        result.current.incrementClickCount();
      });

      expect(result.current.clickedLightName).toBe('Button_Light_2');
      expect(result.current.totalClickCount).toBe(2);
    });
  });

  describe('theme-based light configuration', () => {
    it('should update light intensity configuration', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.setCurrentLightIntensityConfiguration({
          sliderName: 'Slider_4',
          intensity: 0.53,
        });
      });

      expect(result.current.currentLightIntensityConfiguration).toEqual({
        sliderName: 'Slider_4',
        intensity: 0.53,
      });
    });

    it('should update individual slider intensity', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.setCurrentLightIntensityConfiguration({
          sliderName: 'Slider_1',
          intensity: 0.55,
        });
      });

      expect(result.current.currentLightIntensityConfiguration.sliderName).toBe('Slider_1');
    });

    it('should handle theme selection for light colors', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.setSelectedThemeConfiguration({
          id: '0',
          name: 'urban',
          color: '#E96929',
          displayName: 'URBAN',
          svgWidth: 280,
        });
      });

      expect(result.current.selectedThemeConfiguration?.id).toBe('0');
      expect(result.current.selectedThemeConfiguration?.name).toBe('urban');
    });
  });

  describe('light intensity bounds', () => {
    it('should accept minimum intensity value', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.setCurrentLightIntensityConfiguration({
          sliderName: 'Slider_4',
          intensity: 0.503, // SLIDER_INPUT_MIN_VALUE
        });
      });

      expect(result.current.currentLightIntensityConfiguration.intensity).toBe(0.503);
    });

    it('should accept maximum intensity value', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.setCurrentLightIntensityConfiguration({
          sliderName: 'Slider_4',
          intensity: 0.563, // SLIDER_INPUT_MAX_VALUE
        });
      });

      expect(result.current.currentLightIntensityConfiguration.intensity).toBe(0.563);
    });
  });

  describe('theme variations', () => {
    const themes = [
      { id: '0', name: 'urban' as const },
      { id: '1', name: 'rural' as const },
      { id: '2', name: 'classy' as const },
      { id: '3', name: 'chill' as const },
    ];

    themes.forEach(theme => {
      it(`should configure lights for ${theme.name} theme`, () => {
        const { result } = renderHook(() => useUserInterfaceStore());

        act(() => {
          result.current.setSelectedThemeConfiguration({
            id: theme.id,
            name: theme.name,
            color: '#000000',
            displayName: theme.name.toUpperCase(),
            svgWidth: 200,
          });
        });

        expect(result.current.selectedThemeConfiguration?.name).toBe(theme.name);
      });
    });
  });

  describe('state reset', () => {
    it('should reset light configuration on user interface reset', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.setCurrentLightIntensityConfiguration({
          sliderName: 'Slider_1',
          intensity: 0.55,
        });
        result.current.setSelectedThemeConfiguration({
          id: '1',
          name: 'rural',
          color: '#80C080',
          displayName: 'RURAL',
          svgWidth: 275,
        });
      });

      act(() => {
        result.current.resetUserInterfaceState();
      });

      expect(result.current.selectedThemeConfiguration).toBeNull();
      expect(result.current.currentLightIntensityConfiguration).toEqual({
        sliderName: 'Slider_4',
        intensity: 10,
      });
    });
  });
});
