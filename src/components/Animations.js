/* eslint-disable react/no-unknown-property */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSpring, animated, useSprings } from "@react-spring/three";
import { Html } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";
import { useInteraction, useUI } from "../contexts";
import { CustomGeometryParticles } from "./Lamp";
import { vibeURLs, nodesList, phoneList, sliderPosition, textPosition, rotation } from '../data/animations';

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

export const Animations = React.memo(() => {
  const { 
    scrollStarted, clickPoint, closeUp, setIsDragging
  } = useInteraction();
  const { 
    graphics, windowWidth, vibe, gltf, iframe1, iframe2, 
    setPlayer, setLightIntensity 
  } = useUI();
  const [nodes, setNodes] = useState();
  const [phoneClicked, setPhoneClicked] = useState();
  
  // Memoized values to prevent unnecessary recalculations
  const position = useMemo(() => 
    windowWidth < 800 ? [-4.055, -2.7, -1.6] : [-4.055, -2.7, -1.6], [windowWidth]
  );
  const className = useMemo(() => 
    windowWidth < 800 ? "arcadewrapper-small" : "arcadewrapper", [windowWidth]
  );
  
  const iframe1Ref = useRef(null);
  const iframe2Ref = useRef(null);

  useEffect(() => {
    if (nodes) {
      if (!graphics && iframe1Ref.current) {
        if (iframe1) {
          iframe1Ref.current.style.display = "block";
        } else {
          iframe1Ref.current.style.display = "none";
        }
      }
      if (iframe2Ref.current) {
        if (iframe2) {
          iframe2Ref.current.style.display = "block";
        } else {
          iframe2Ref.current.style.display = "none";
        }
      }
    }
  }, [iframe1, iframe2, nodes, graphics]);

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
            <CustomGeometryParticles count={1500} />
          </primitive>
          <primitive key="music_screen" object={nodes["music_screen"]} rotation-y={.3}>
            <Html
              className="musicwrapper"
              position={[-.9, -0.145, -0.65]}
              transform
              distanceFactor={1.5}
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
          {!graphics && (
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
});

const slidersList = [
  
  "Slider_4",
  
];

const instructionsList = [
  "text_navigate",
  "text_rotate",
  "text_scroll",
  "text_middle",
  "text_click",
];

const sliderRotation = [7.36, 0, 0];
const sliderScale = [0.4, 0.4, 0.4];
