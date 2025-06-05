import { useState, useEffect, useMemo } from 'react';
import { useInteraction, useUI } from '../contexts';
import { lightColorWheel, pointLightPositions, vibeToLight } from '../data/lighting';

export const useLightController = () => {
  const { clickLight, clickCount } = useInteraction();
  const { vibe, lightIntensity } = useUI();

  // Memoize initial color to prevent random regeneration
  const initialColor = useMemo(() => 
    lightColorWheel[Math.floor(Math.random() * lightColorWheel.length)], []
  );
  
  const [lightColors, setLightColors] = useState(() =>
    pointLightPositions.reduce((colors, light) => {
      light.signName.forEach((name) => {
        colors[name] = initialColor;
      });
      return colors;
    }, {})
  );

  // Handle light color changes on click
  useEffect(() => {
    if (clickLight) {
      const randomColor = lightColorWheel[Math.floor(Math.random() * lightColorWheel.length)];
      setLightColors(prev => ({
        ...prev,
        [clickLight]: randomColor
      }));
    }
  }, [clickLight, clickCount]);

  // Get vibe-based light colors
  const vibeBasedLights = useMemo(() => {
    if (vibe !== null && vibeToLight[vibe]) {
      return vibeToLight[vibe];
    }
    return null;
  }, [vibe]);

  // Get light color for specific light name
  const getLightColor = (lightName) => {
    return lightColors[lightName] || initialColor;
  };

  // Get light intensity for specific light
  const getLightIntensity = (lightName) => {
    const light = pointLightPositions.find(pos => 
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
    pointLightPositions
  };
};