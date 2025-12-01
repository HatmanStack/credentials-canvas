import { useState, useEffect, useMemo } from 'react';
import {
  LIGHT_COLOR_WHEEL,
  POINT_LIGHT_POSITION_CONFIGURATIONS,
  THEME_TO_LIGHT_COLOR_CONFIGURATION_ARRAY
} from '@/constants/lightingConfiguration';
import type { PointLightPositionConfiguration, VibeLightColorConfiguration } from '@/constants/lightingConfiguration';
import type { LightIntensityConfiguration } from '@/types';

export interface UseLightingControllerReturn {
  lightColors: Record<string, string>;
  vibeBasedLights: VibeLightColorConfiguration | null;
  getLightColor: (lightName: string) => string;
  getLightIntensity: (lightName: string) => number;
  pointLightPositions: PointLightPositionConfiguration[];
}

export const useLightingController = (
  clickLight: string | null,
  clickCount: number,
  vibe: { id: string } | null,
  lightIntensity: LightIntensityConfiguration
): UseLightingControllerReturn => {
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

  useEffect(() => {
    if (clickLight) {
      const randomColor = LIGHT_COLOR_WHEEL[Math.floor(Math.random() * LIGHT_COLOR_WHEEL.length)];
      setLightColors(prev => ({
        ...prev,
        [clickLight]: randomColor
      }));
    }
  }, [clickLight, clickCount]);

  const vibeBasedLights = useMemo((): VibeLightColorConfiguration | null => {
    if (vibe !== null) {
      const vibeIndex = parseInt(vibe.id, 10);
      if (THEME_TO_LIGHT_COLOR_CONFIGURATION_ARRAY[vibeIndex]) {
        return THEME_TO_LIGHT_COLOR_CONFIGURATION_ARRAY[vibeIndex];
      }
    }
    return null;
  }, [vibe]);

  const getLightColor = (lightName: string): string => {
    return lightColors[lightName] || initialColor;
  };

  const getLightIntensity = (lightName: string): number => {
    const light = POINT_LIGHT_POSITION_CONFIGURATIONS.find(pos =>
      pos.signName.includes(lightName)
    );

    if (light && light.sliderName === lightIntensity.sliderName) {
      return lightIntensity.intensity;
    }

    return 30;
  };

  return {
    lightColors,
    vibeBasedLights,
    getLightColor,
    getLightIntensity,
    pointLightPositions: POINT_LIGHT_POSITION_CONFIGURATIONS
  };
};
