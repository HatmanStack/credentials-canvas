import React, { useMemo, useState, useEffect } from 'react';
import {
  AccumulativeShadows,
  RandomizedLight,
  Environment as EnvironmentImpl,
} from '@react-three/drei';
import { useSceneInteractionStore, useUserInterfaceStore } from '@/stores';
import {
  LIGHT_COLOR_WHEEL,
  LIGHT_INTENSITY_INITIAL_VALUE,
  POINT_LIGHT_POSITION_CONFIGURATIONS,
  THEME_TO_LIGHT_COLOR_CONFIGURATION_ARRAY
} from '@/constants/lightingConfiguration';

export const SceneEnvironment: React.FC = React.memo(() => {
  const clickedLightName = useSceneInteractionStore(state => state.clickedLightName);
  const totalClickCount = useSceneInteractionStore(state => state.totalClickCount);

  const selectedThemeConfiguration = useUserInterfaceStore(state => state.selectedThemeConfiguration);
  const currentLightIntensityConfiguration = useUserInterfaceStore(state => state.currentLightIntensityConfiguration);

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

  useEffect(() => {
    const sliderName = currentLightIntensityConfiguration.sliderName;
    const intensity = currentLightIntensityConfiguration.intensity;
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
  }, [currentLightIntensityConfiguration]);

  useEffect(() => {
    setLightColors(prevColors => {
      const newColors = { ...prevColors };
      if (clickedLightName === 'Button_Light_4') {
        const newColor =
          LIGHT_COLOR_WHEEL[Math.floor(Math.random() * LIGHT_COLOR_WHEEL.length)];
        Object.keys(newColors).forEach(name => {
          newColors[name] = newColor;
        });
      } else {
        POINT_LIGHT_POSITION_CONFIGURATIONS.forEach(light => {
          light.signName.forEach(name => {
            if (name === clickedLightName) {
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
  }, [clickedLightName, totalClickCount]);

  useEffect(() => {
    if (selectedThemeConfiguration !== null) {
      const vibeIndex = parseInt(selectedThemeConfiguration.id, 10);
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
  }, [selectedThemeConfiguration]);

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
