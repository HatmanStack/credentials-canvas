/**
 * Custom hook for controlling lighting in the 3D scene
 *
 * Manages light colors, intensities, and theme-based lighting configurations.
 *
 * TODO: Phase 2 - Replace Context hooks with Zustand selectors
 */

import { useState, useEffect, useMemo } from 'react';
import {
  LIGHT_COLOR_WHEEL,
  POINT_LIGHT_POSITION_CONFIGURATIONS,
  THEME_TO_LIGHT_COLOR_CONFIGURATION_ARRAY
} from '@/constants/lightingConfiguration';
import type { PointLightPositionConfiguration, VibeLightColorConfiguration } from '@/constants/lightingConfiguration';
import type { LightIntensityConfiguration } from '@/types';

/**
 * Return type for useLightingController hook
 */
export interface UseLightingControllerReturn {
  lightColors: Record<string, string>;
  vibeBasedLights: VibeLightColorConfiguration | null;
  getLightColor: (lightName: string) => string;
  getLightIntensity: (lightName: string) => number;
  pointLightPositions: PointLightPositionConfiguration[];
}

/**
 * Hook for managing scene lighting
 *
 * @param clickLight - Currently clicked light name from context
 * @param clickCount - Click counter from context
 * @param vibe - Selected theme/vibe from context
 * @param lightIntensity - Current light intensity configuration from context
 */
export const useLightingController = (
  clickLight: string | null,
  clickCount: number,
  vibe: { id: string } | null,
  lightIntensity: LightIntensityConfiguration
): UseLightingControllerReturn => {
  // Memoize initial color to prevent random regeneration
  const initialColor = useMemo(() =>
    LIGHT_COLOR_WHEEL[Math.floor(Math.random() * LIGHT_COLOR_WHEEL.length)], []
  );

  const [lightColors, setLightColors] = useState<Record<string, string>>(() =>
    POINT_LIGHT_POSITION_CONFIGURATIONS.reduce((colors, light) => {
      light.signName.forEach(name => {
        colors[name] = initialColor;
      });
      return colors;
    }, {} as Record<string, string>)
  );

  // Handle light color changes on click
  useEffect(() => {
    if (clickLight) {
      const randomColor = LIGHT_COLOR_WHEEL[Math.floor(Math.random() * LIGHT_COLOR_WHEEL.length)];
      setLightColors(prev => ({
        ...prev,
        [clickLight]: randomColor
      }));
    }
  }, [clickLight, clickCount]);

  // Get vibe-based light colors
  const vibeBasedLights = useMemo((): VibeLightColorConfiguration | null => {
    if (vibe !== null) {
      const vibeIndex = parseInt(vibe.id, 10);
      if (THEME_TO_LIGHT_COLOR_CONFIGURATION_ARRAY[vibeIndex]) {
        return THEME_TO_LIGHT_COLOR_CONFIGURATION_ARRAY[vibeIndex];
      }
    }
    return null;
  }, [vibe]);

  // Get light color for specific light name
  const getLightColor = (lightName: string): string => {
    return lightColors[lightName] || initialColor;
  };

  // Get light intensity for specific light
  const getLightIntensity = (lightName: string): number => {
    const light = POINT_LIGHT_POSITION_CONFIGURATIONS.find(pos =>
      pos.signName.includes(lightName)
    );

    if (light && light.sliderName === lightIntensity.sliderName) {
      return lightIntensity.intensity;
    }

    return 30; // Default intensity
  };

  return {
    lightColors,
    vibeBasedLights,
    getLightColor,
    getLightIntensity,
    pointLightPositions: POINT_LIGHT_POSITION_CONFIGURATIONS
  };
};
