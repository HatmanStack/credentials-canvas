/**
 * Scene Environment Component
 *
 * Sets up lighting, shadows, and environment for the 3D scene.
 * Manages point lights, directional lights, and theme-based lighting colors.
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  AccumulativeShadows,
  RandomizedLight,
  Environment as EnvironmentImpl,
} from '@react-three/drei';
import { useInteraction, useUI } from 'contexts';
import {
  LIGHT_COLOR_WHEEL,
  LIGHT_INTENSITY_INITIAL_VALUE,
  POINT_LIGHT_POSITION_CONFIGURATIONS,
  THEME_TO_LIGHT_COLOR_CONFIGURATION_ARRAY
} from 'constants/lightingConfiguration';

/**
 * Scene environment component with dynamic lighting
 */
export const SceneEnvironment: React.FC = React.memo(() => {
  const { clickLight, clickCount } = useInteraction();
  const { selectedVibe, lightIntensity } = useUI();

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

  const [lightIntensities, setLightIntensities] = useState<Record<string, number>>(() =>
    POINT_LIGHT_POSITION_CONFIGURATIONS.reduce((intensities, light) => {
      if (light.sliderName) {
        intensities[light.sliderName] = 10;
      }
      return intensities;
    }, {} as Record<string, number>)
  );

  // Update light intensities based on slider control
  useEffect(() => {
    const sliderName = lightIntensity.sliderName;
    const intensity = lightIntensity.intensity;
    const oldRange = 0.563 - 0.503;
    const normalizedIntensity =
      ((intensity - 0.503) / oldRange) * LIGHT_INTENSITY_INITIAL_VALUE;

    setLightIntensities(prevIntensities => {
      const newIntensities = { ...prevIntensities };
      if (sliderName === 'Slider_4') {
        Object.keys(newIntensities).forEach(name => {
          newIntensities[name] = normalizedIntensity;
        });
      } else {
        newIntensities[sliderName] = normalizedIntensity;
      }
      return newIntensities;
    });
  }, [lightIntensity]);

  // Update light colors on click
  useEffect(() => {
    setLightColors(prevColors => {
      const newColors = { ...prevColors };
      if (clickLight === 'Button_Light_4') {
        const newColor =
          LIGHT_COLOR_WHEEL[Math.floor(Math.random() * LIGHT_COLOR_WHEEL.length)];
        Object.keys(newColors).forEach(name => {
          newColors[name] = newColor;
        });
      } else {
        POINT_LIGHT_POSITION_CONFIGURATIONS.forEach(light => {
          light.signName.forEach(name => {
            if (name === clickLight) {
              newColors[name] =
                LIGHT_COLOR_WHEEL[
                  Math.floor(Math.random() * LIGHT_COLOR_WHEEL.length)
                ];
            }
          });
        });
      }
      return newColors;
    });
  }, [clickLight, clickCount]);

  // Update light colors based on theme/vibe selection
  useEffect(() => {
    if (selectedVibe !== null) {
      const vibeIndex = parseInt(selectedVibe.id, 10);
      const vibeColors = THEME_TO_LIGHT_COLOR_CONFIGURATION_ARRAY[vibeIndex];

      if (vibeColors) {
        setLightColors(prevColors => {
          const newColors = { ...prevColors };
          POINT_LIGHT_POSITION_CONFIGURATIONS.forEach((light, index) => {
            light.signName.forEach(name => {
              newColors[name] = vibeColors.lightColor3;
              if (index < 1) {
                newColors[name] = vibeColors.lightColor2;
              }
            });
          });
          return newColors;
        });
      }
    }
  }, [selectedVibe]);

  // Memoized directional lights
  const directionalLights = useMemo(() => (
    <>
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
      />
      <directionalLight
        position={[-5, 5, 5]}
        intensity={0.2}
        castShadow
      />
    </>
  ), []);

  // Memoized point lights
  const pointLights = useMemo(() =>
    POINT_LIGHT_POSITION_CONFIGURATIONS.map((light, index) => {
      let intensity = light.sliderName ? (lightIntensities[light.sliderName] || 10) : 10;
      if (intensity > LIGHT_INTENSITY_INITIAL_VALUE + 1) {
        intensity = 10;
      }
      return light.signName.map((name, nameIndex) => (
        <pointLight
          key={`${index}-${nameIndex}`}
          position={light.position as [number, number, number]}
          intensity={intensity * (index === 0 ? 4 : 0.25)}
          color={lightColors[name] || '#FFFFFF'}
        />
      ));
    }), [lightIntensities, lightColors]
  );

  // Memoized shadows
  const shadows = useMemo(() => (
    <AccumulativeShadows
      frames={60}
      alphaTest={0.85}
      opacity={0.75}
      scale={30}
      position={[0, -1.5, 0]}
    >
      <RandomizedLight
        amount={4}
        radius={2.5}
        ambient={0.5}
        intensity={1}
        position={[5, 5, 5]}
        bias={0.001}
      />
    </AccumulativeShadows>
  ), []);

  return (
    <>
      {directionalLights}
      {pointLights}
      {shadows}
      <EnvironmentImpl preset="night" />
    </>
  );
});
