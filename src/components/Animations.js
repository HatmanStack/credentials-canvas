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

const sliderRotation = [7.36, 0, 0];
const sliderScale = [0.4, 0.4, 0.4];

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
    hasScrollStarted, clickPoint, isCloseUpView, setIsDragging
  } = useInteraction();
  const { 
    showHighQualityGraphics, screenWidth, selectedVibe, gltfModel, showArcadeIframe, showMusicIframe, 
    setPlayer, setLightIntensity 
  } = useUI();
  const [sceneNodes, setSceneNodes] = useState();
  const [clickedPhoneName, setClickedPhoneName] = useState();
  
  // Memoized values to prevent unnecessary recalculations
  const iframePosition = useMemo(() => 
    screenWidth < 800 ? [-4.055, -2.7, -1.6] : [-4.055, -2.7, -1.6], [screenWidth]
  );
  const iframeClassName = useMemo(() => 
    screenWidth < 800 ? "arcadewrapper-small" : "arcadewrapper", [screenWidth]
  );
  
  const iframe1Ref = useRef(null);
  const iframe2Ref = useRef(null);
  
 const handleIframeLoad = useCallback(() => {
    if (gltfModel && iframe1Ref.current) {
      iframe1Ref.current.classList.add('loaded');
      /** Waiting on change to freepacman.org 
      // Monitor for scaledTileSize changes and adjust scale
      const checkScale = () => {
        console.log('Checking scaledTileSize...');
        try {
          const iframeWindow = iframe1Ref.current;
          
          if (iframeWindow && iframeWindow.scaledTileSize) {
            const scaledTileSize = iframeWindow.scaledTileSize;
            console.log('scaledTileSize detected:', scaledTileSize);
            
            if (scaledTileSize === 8) {
              iframe1Ref.current.style.transform = 'scale(0.5)';
              console.log('Applied scale(0.5) for scaledTileSize 8');
            } else {
              iframe1Ref.current.style.transform = 'scale(0.25)';
              console.log('Applied scale(0.25) for scaledTileSize', scaledTileSize);
            }
          }
        } catch (error) {
          // CORS restrictions
        }
      };
      
      // Check periodically for scaledTileSize changes
      const interval = setInterval(checkScale, 1000);
      iframe1Ref.current.scaleInterval = interval;
      */
    }
  }, [gltfModel]);


  useEffect(() => {
    if (sceneNodes) {
      if (iframe1Ref.current) {
        if (showArcadeIframe) {
          iframe1Ref.current.style.display = "block";
        } else {
          iframe1Ref.current.style.display = "none";
        }
      }
      if (iframe2Ref.current) {
        if (showMusicIframe) {
          iframe2Ref.current.style.display = "block";
        } else {
          iframe2Ref.current.style.display = "none";
        }
      }
    }
  }, [showArcadeIframe, showMusicIframe, sceneNodes]);

  const textSpring = useSprings(
    nodesList.length,
    nodesList.map((node, index) => {
      const isMatch = phoneList.indexOf(clickedPhoneName) === index;
      return {
        scale: isMatch && isCloseUpView ? [100, 100, 100] : [1, 1, 1],
        config: { tension: 200, friction: 5 },
      };
    })
  );

  const sliderSpring = useSliderSpring(
      "Slider_4",
      0,
      sliderPosition[0][1],
      sliderPosition,
      setIsDragging,
      setLightIntensity
    );

  useEffect(() => {
    if (phoneList.includes(clickPoint)) {
      setClickedPhoneName(clickPoint);
    }
  }, [clickPoint]);

  useEffect(() => {
    if (gltfModel) {
      const { nodes } = gltfModel;
      setSceneNodes(nodes);
    }
  }, [gltfModel]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      const playerInstance = new window.YT.Player(iframe2Ref.current, {
        videoId: vibeURLs[selectedVibe].srcID,
      });
      setPlayer(playerInstance);
    };

    // Cleanup interval on unmount
    return () => {
      if (iframe1Ref.current && iframe1Ref.current.scaleInterval) {
        clearInterval(iframe1Ref.current.scaleInterval);
      }
    };
  }, []);

  return (
    <>
      {sceneNodes && (
      <animated.primitive
        key="Slider_4"
        object={sceneNodes["Slider_4"]}
        {...sliderSpring.bind()}
        position={sliderPosition[0]}
        rotation={sliderRotation}
        position-y={sliderSpring.y}
        scale={sliderScale}
      />
    )}
      {sceneNodes &&
        nodesList.map((node, index) => {
          return (
            <animated.primitive
              key={node}
              scale={textSpring[index].scale}
              object={sceneNodes[node]}
              position={textPosition[index]}
              rotation={rotation[index]}
            />
          );
        })}

      {sceneNodes && (
        <>
          <primitive
            scale={0.15}
            object={sceneNodes["Tball"]}
            position={[5.11, 0.33, 2.145]}
          >
            <CustomGeometryParticles count={1500} />
          </primitive>
          <primitive key="music_screen" object={sceneNodes["music_screen"]} rotation-y={.3}>
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
                  src={vibeURLs[selectedVibe].iframe2}
                  allow="autoplay"
                  title="description"
                />
              </div>
            </Html>
          </primitive>
          
            <primitive key="zelda_screen" object={sceneNodes["zelda_screen"]}>
              <Html
                className={iframeClassName}
                position={iframePosition}
                transform
                distanceFactor={1.16}
              >
                <div className="arcade">
                  <iframe
                  ref={iframe1Ref}     
                  src={vibeURLs[selectedVibe].iframe1}
                  onLoad={handleIframeLoad}
                  allow="muted"
                  title="Arcade Content" 
                />
                </div>
              </Html>
            </primitive>
          
        </>
      )}
    </>
  );
});


