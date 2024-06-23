/* eslint-disable react/no-unknown-property */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import { useState, useEffect, useRef } from "react";
import { useSpring, animated, useSprings } from "@react-spring/three";
import { Html } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";
import { CustomGeometryParticles } from "./Lamp";

function useSliderSpring(
  slider,
  index,
  initialY,
  sliderPosition,
  setIsDragging,
  setLightIntensity
) {
  const [{ y }, set] = useSpring(() => ({
    y: initialY,
    config: {
      tension: 15,
      friction: 10,
    },
  }));

  const bind = useDrag(
    ({ down, movement: [, my] }) => {
      const movementY = -my * 0.001 + sliderPosition[index][1];
      const newY = down
        ? Math.min(
            Math.max(movementY, index === 7 ? 0.375 - 0.033 : 0.538 - 0.033),
            index === 7 ? 0.375 + 0.025 : 0.538 + 0.025
          )
        : sliderPosition[index][1];
      set.start({ y: newY });
      setIsDragging(down);
      sliderPosition[index][1] = newY;
      setLightIntensity({ sliderName: slider, intensity: newY });
    },
    { filterTaps: true }
  );

  return { y, bind };
}

export function Animations({
  graphics,
  setPlayer,
  windowWidth,
  scrollStarted,
  vibe,
  gltf,
  setIsDragging,
  setLightIntensity,
  clickPoint,
  iframe1,
  iframe2,
  closeUp,
}) {
  const [nodes, setNodes] = useState();
  const [phoneClicked, setPhoneClicked] = useState();
  const position =
    windowWidth < 800 ? [-4.055, -2.7, -1.6] : [-4.055, -2.7, -1.6];
  const className = windowWidth < 800 ? "arcadewrapper-small" : "arcadewrapper";
  const iframe1Ref = useRef(null);
  const iframe2Ref = useRef(null);

  useEffect(() => {
    if (true) {
      if (nodes) {
        if (graphics) {
          if (iframe1) {
            iframe1Ref.current.style.display = "block";
          } else {
            iframe1Ref.current.style.display = "none";
          }
        }
        if (iframe2) {
          iframe2Ref.current.style.display = "block";
        } else {
          iframe2Ref.current.style.display = "none";
        }
      }
    }
  }, [iframe1, iframe2]);

  const textSpring = useSprings(
    nodesList.length,
    nodesList.map((node, index) => {
      const isMatch = phoneList.indexOf(phoneClicked) === index;
      return {
        scale: isMatch && closeUp ? [100, 100, 100] : [1, 1, 1],
        config: { tension: 200, friction: 5 },
      };
    })
  );

  const sliderSpring = slidersList.map((slider, index) =>
    useSliderSpring(
      slider,
      index,
      sliderPosition[index][1],
      sliderPosition,
      setIsDragging,
      setLightIntensity
    )
  );

  useEffect(() => {
    if (phoneList.includes(clickPoint)) {
      setPhoneClicked(clickPoint);
    }
  }, [clickPoint]);

  useEffect(() => {
    if (gltf) {
      const { nodes } = gltf;
      setNodes(nodes);
    }
  }, [gltf]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      const playerInstance = new window.YT.Player(iframe2Ref.current, {
        videoId: vibeURLs[vibe].srcID,
      });
      setPlayer(playerInstance);
    };
  }, []);

  return (
    <>
      {nodes &&
        slidersList.map((slider, index) => {
          return (
            <animated.primitive
              key={slider}
              object={nodes[slider]}
              {...sliderSpring[index].bind()}
              position={sliderPosition[index]}
              rotation={sliderRotation}
              position-y={sliderSpring[index].y}
              scale={sliderScale}
            />
          );
        })}
      {nodes &&
        nodesList.map((node, index) => {
          return (
            <animated.primitive
              key={node}
              scale={textSpring[index].scale}
              object={nodes[node]}
              position={textPosition[index]}
              rotation={rotation[index]}
            />
          );
        })}

      {nodes && (
        <>
          <primitive
            scale={0.15}
            object={nodes["Tball"]}
            position={[5.11, 0.33, 2.145]}
          >
            <CustomGeometryParticles count={3000} />
          </primitive>
          <primitive key="music_screen" object={nodes["music_screen"]}>
            <Html
              className="musicwrapper"
              position={[-0.073, -0.145, -0.01]}
              transform
              distanceFactor={1.16}
            >
              <div className="music">
                <iframe
                  ref={iframe2Ref}
                  id="player"
                  src={vibeURLs[vibe].iframe2}
                  allow="autoplay"
                  title="description"
                />
              </div>
            </Html>
          </primitive>
          {graphics && (
            <primitive key="zelda_screen" object={nodes["zelda_screen"]}>
              <Html
                className={className}
                position={position}
                transform
                distanceFactor={1.16}
              >
                <div className="arcade">
                  <iframe
                    ref={iframe1Ref}
                    src={vibeURLs[vibe].iframe1}
                    allow="muted"
                  />
                </div>
              </Html>
            </primitive>
          )}
        </>
      )}
    </>
  );
}

const slidersList = [
  "Slider_1",
  "Slider_2",
  "Slider_3",
  "Slider_4",
  "Slider_5",
  "Slider_6",
  "Slider_7",
];

const instructionsList = [
  "text_navigate",
  "text_rotate",
  "text_scroll",
  "text_middle",
  "text_click",
];

const vibeURLs = [
  {
    iframe1: "https://freepacman.org/",
    iframe2:
      "https://www.youtube.com/embed/pCx5Std7mCo?enablejsapi=1&autoplay=1&loop=1&mute=0",
    srcID: "pCx5Std7mCo",
  },
  {
    iframe1: "https://freepacman.org/",
    iframe2:
      "https://www.youtube.com/embed/A3svABDnmio?enablejsapi=1&autoplay=1&loop=1&mute=0",
    srcID: "A3svABDnmio",
  },
  {
    iframe1: "https://freepacman.org/",
    iframe2:
      "https://www.youtube.com/embed/JvNQLJ1_HQ0?enablejsapi=1&autoplay=1&loop=1&mute=0",
    srcID: "JvNQLJ1_HQ0",
  },
  {
    iframe1: "https://freepacman.org/",
    iframe2:
      "https://www.youtube.com/embed/6HbrymTIbyg?enablejsapi=1&autoplay=1&loop=1&mute=0",
    srcID: "6HbrymTIbyg",
  },
];

const nodesList = [
  "Phone_Looper_Text",
  "Phone_Vocabulary_Text",
  "Phone_Italian_Text",
  "Phone_Trachtenberg_Text",
  "Phone_Movies_Text",
];

const phoneList = [
  "Phone_Looper_5",
  "Phone_Vocabulary_5",
  "Phone_Italian_5",
  "Phone_Trachtenberg_5",
  "Phone_Movies_5",
];

const sliderRotation = [7.36, 0, 0];
const sliderScale = [0.5, 0.5, 0.5];

const sliderPosition = [
  [0.837, 0.538, 3.986],
  [0.867, 0.538, 3.986],
  [0.897, 0.538, 3.986],
  [0.925, 0.538, 3.986],
  [0.954, 0.538, 3.986],
  [0.9841, 0.538, 3.986],
  [1.031, 0.538, 3.986],
  [0.893, 0.375, 3.986],
];

const textPosition = [
  [-0.668423, 0.008689, 4.06791],
  [5.53658, -0.1, 2.3211],
  [4.66377, -0.1, 2.61365],
  [0.71, 0.03, 3.79],
  [4.73, -0.1, 1.83],
];

const rotation = [
  [0, 44.7, 0],
  [0, 44.612, 0],
  [0, 44.145, 0],
  [0, -9.97, 0],
  [0, 35.17, 0],
];
