/* eslint-disable react/no-unknown-property */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useMemo } from "react";
import {
  AccumulativeShadows,
  RandomizedLight,
  Environment as EnvironmentImpl,
} from "@react-three/drei";
import { useState, useEffect } from "react";
import { useInteraction, useUI } from "../contexts";
import { lightColorWheel, pointLightPositions, vibeToLight } from '../data/lighting';

const lightIntensityStarter = 30;

export const Environment = React.memo(() => {
  const { clickLight, clickCount } = useInteraction();
  const { selectedVibe, lightIntensity } = useUI();
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
  
  const [lightIntensities, setLightIntensities] = useState(() =>
    pointLightPositions.reduce((intensities, light) => {
      intensities[light.sliderName] = 10;
      return intensities;
    }, {})
  );

  useEffect(() => {
    const sliderName = lightIntensity.sliderName;
    const intensity = lightIntensity.intensity;
    const oldRange = 0.563 - 0.503;
    const normalizedIntensity =
      ((intensity - 0.503) / oldRange) * lightIntensityStarter;
    setLightIntensities((prevIntensities) => {
      const newIntensities = { ...prevIntensities };
      if (sliderName === "Slider_4") {
        Object.keys(newIntensities).forEach((name) => {
          newIntensities[name] = normalizedIntensity;
        });
      } else {
        newIntensities[sliderName] = normalizedIntensity;
      }
      return newIntensities;
    });
  }, [lightIntensity]);

  useEffect(() => {
    setLightColors((prevColors) => {
      const newColors = { ...prevColors };
      if (clickLight === "Button_Light_4") {
        const newColor =
          lightColorWheel[Math.floor(Math.random() * lightColorWheel.length)];
        Object.keys(newColors).forEach((name) => {
          newColors[name] = newColor;
        });
      } else {
        pointLightPositions.forEach((light) => {
          light.signName.forEach((name) => {
            if (name === clickLight) {
              newColors[name] =
                lightColorWheel[
                  Math.floor(Math.random() * lightColorWheel.length)
                ];
            }
          });
        });
      }
      return newColors;
    });
  }, [clickLight, clickCount]);

  useEffect(() => {
    setLightColors((prevColors) => {
      const newColors = { ...prevColors };
      pointLightPositions.forEach((light, index) => {
        light.signName.forEach((name) => {
          newColors[name] = vibeToLight[selectedVibe].lightColor3;
          if (index < 1) {
            newColors[name] = vibeToLight[selectedVibe].lightColor2;
          }
        });
      });
      return newColors;
    });
  }, [selectedVibe]);

  // Memoized lights to prevent recreation
  const directionalLights = useMemo(() => (
    <>
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        shadow-mapSize={512}
        castShadow
      />
      <directionalLight
        position={[-5, 5, 5]}
        intensity={0.2}
        shadow-mapSize={256}
        castShadow
      />
    </>
  ), []);

  const pointLights = useMemo(() => 
    pointLightPositions.map((light, index) => {
      let intensity = lightIntensities[light.sliderName];
      if (lightIntensities[light.sliderName] > lightIntensityStarter + 1) {
        intensity = 10;
      }
      return light.signName.map((name, nameIndex) => (
        <pointLight
          key={`${index}-${nameIndex}`}
          position={light.position}
          intensity={intensity * (index === 0 ? 4 : 0.25)}
          color={lightColors[name] || "#FFFFFF"}
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
