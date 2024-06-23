/* eslint-disable react/no-unknown-property */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import {
  AccumulativeShadows,
  RandomizedLight,
  Environment as EnvironmentImpl,
} from "@react-three/drei";
import { useState, useEffect } from "react";

const lightColorWheel = [
  "#FFD700",
  "#FDFD96",
  "#FFFF00",
  "#FFFFE0",
  "#FFFACD",
  "#FAFAD2",
  "#FFEFD5",
  "#FFE4B5",
  "#FFDAB9",
  "#EEE8AA",
  "#F0E68C",
  "#BDB76B",
  "#E6E6FA",
  "#D8BFD8",
  "#DDA0DD",
  "#EE82EE",
  "#FF00FF",
  "#DA70D6",
  "#FFC0CB",
  "#FFB6C1",
  "#FF69B4",
  "#FF1493",
  "#C71585",
  "#DB7093",
  "#FFA07A",
  "#FA8072",
  "#F08080",
  "#CD5C5C",
  "#DC143C",
  "#B22222",
  "#8B0000",
  "#FF0000",
  "#FF4500",
  "#FF6347",
  "#FF7F50",
  "#FF8C00",
  "#FFA500",
  "#FFD700",
  "#FFFF00",
  "#FFFFE0",
  "#FFFACD",
  "#FAFAD2",
  "#FFEFD5",
  "#FFE4B5",
  "#FFDAB9",
  "#EEE8AA",
  "#F0E68C",
  "#BDB76B",
  "#E6E6FA",
  "#D8BFD8",
  "#DDA0DD",
  "#EE82EE",
  "#FF00FF",
  "#DA70D6",
  "#FFC0CB",
  "#FFB6C1",
  "#FF69B4",
  "#FF1493",
  "#C71585",
  "#DB7093",
  "#FFA07A",
  "#FA8072",
  "#F08080",
  "#CD5C5C",
  "#DC143C",
  "#B22222",
  "#8B0000",
  "#FF0000",
  "#FF4500",
  "#FF6347",
  "#FF7F50",
  "#FF8C00",
  "#FFA500",
];

const lightIntensityStarter = 30;

const pointLightPositions = [
  { position: [10.5, 2.8, 9.35], signName: ["lamppost"] },
  {
    position: [6.07, 0.57, 0.6],
    signName: ["small_right", "Button_Light_6"],
    sliderName: "Slider_6",
  },
  {
    position: [4.43, 0.57, 0.6],
    signName: ["small_middle_right", "Button_Light_5"],
    sliderName: "Slider_5",
  },
  {
    position: [1.36, 0.57, 1.25],
    signName: ["small_middle_left", "Button_Light_4"],
    sliderName: "Slider_4",
  },
  {
    position: [-1.26, 0.57, 1.25],
    signName: ["small_left", "Button_Light_3"],
    sliderName: "Slider_3",
  },
  {
    position: [-2, 0.57, 1.22],
    signName: ["lamp_back", "Button_Light_2"],
    sliderName: "Slider_2",
  },
  {
    position: [-2.1, 0.57, 5.05],
    signName: ["lamp_front", "Button_Light_1"],
    sliderName: "Slider_1",
  },
];

const vibeToLight = [
  { lightColor1: "#B68672", lightColor2: "#9E9149", lightColor3: "#E96929" },
  { lightColor1: "#869582", lightColor2: "#72979D", lightColor3: "#80C080" },
  { lightColor1: "#8F909D", lightColor2: "#A28A9B", lightColor3: "#f59b9b" },
  { lightColor1: "#BA827F", lightColor2: "#B38A3C", lightColor3: "#7a87cc" },
];

export function Environment({ vibe, clickLight, lightIntensity, clickCount }) {
  const initialColor =
    lightColorWheel[Math.floor(Math.random() * lightColorWheel.length)];
  const [lightColors, setLightColors] = useState(
    pointLightPositions.reduce((colors, light) => {
      light.signName.forEach((name) => {
        colors[name] = initialColor;
      });
      return colors;
    }, {})
  );
  const [lightIntensities, setLightIntensities] = useState(
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
      if (sliderName === "Slider_7") {
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
      if (clickLight === "Button_Light_7") {
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
          newColors[name] = vibeToLight[vibe].lightColor3;
          if (index < 1) {
            newColors[name] = vibeToLight[vibe].lightColor2;
          }
        });
      });
      return newColors;
    });
  }, [vibe]);

  return (
    <>
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        shadow-mapSize={1024}
        castShadow
      />
      <directionalLight
        position={[-5, 5, 5]}
        intensity={0.1}
        shadow-mapSize={128}
        castShadow
      />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.1}
        shadow-mapSize={128}
        castShadow
      />
      <directionalLight
        position={[0, 5, 0]}
        intensity={0.1}
        shadow-mapSize={128}
        castShadow
      />
      {pointLightPositions.map((light, index) => {
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
      })}
      <AccumulativeShadows
        frames={100}
        alphaTest={0.85}
        opacity={0.75}
        scale={30}
        position={[0, -1.5, 0]}
      >
        <RandomizedLight
          amount={8}
          radius={2.5}
          ambient={0.5}
          intensity={1}
          position={[5, 5, 5]}
          bias={0.001}
        />
      </AccumulativeShadows>
      <EnvironmentImpl preset="night" />
    </>
  );
}
