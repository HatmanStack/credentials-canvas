import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Html } from '@react-three/drei';
import { useSpring, animated, useSprings } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';
import { useSceneInteractionStore, useUserInterfaceStore, useThreeJSSceneStore } from '@/stores';
import { CustomGeometryParticles } from './Lamp';
import {
  THEME_IFRAME_URL_CONFIGURATIONS,
  PHONE_TEXT_NODE_MESH_NAMES,
  PHONE_MESH_NAMES,
  SLIDER_POSITION_ARRAY,
  SLIDER_ROTATION_VALUES,
  SLIDER_SCALE_VALUES,
  TEXT_ELEMENT_POSITION_ARRAY,
  TEXT_ELEMENT_ROTATION_ARRAY,
} from '@/constants/animationConfiguration';
import type { YouTubePlayer } from '@/types/youtubeTypes';
import type { CameraPositionTuple } from '@/types';

declare global {
  interface Window {
    YT: {
      Player: new (element: HTMLElement | null, config: { videoId: string }) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface SliderSpringResult {
  y: ReturnType<typeof useSpring>[0]['y'];
  bind: ReturnType<typeof useDrag>;
}

function useSliderSpring(
  slider: string,
  index: number,
  initialY: number,
  sliderPositions: CameraPositionTuple[],
  setIsDragging: (dragging: boolean) => void,
  setLightIntensity: (config: { sliderName: string; intensity: number }) => void
): SliderSpringResult {
  const [{ y }, set] = useSpring(() => ({
    y: initialY,
    config: {
      tension: 15,
      friction: 10,
    },
  }));

  const bind = useDrag(
    ({ down, movement: [, my] }) => {
      const movementY = -my * 0.001 + sliderPositions[index][1];
      const minY = index === 7 ? 0.375 - 0.033 : 0.538 - 0.033;
      const maxY = index === 7 ? 0.375 + 0.025 : 0.538 + 0.025;
      const newY = down
        ? Math.min(Math.max(movementY, minY), maxY)
        : sliderPositions[index][1];
      set.start({ y: newY });
      setIsDragging(down);
      sliderPositions[index][1] = newY;
      setLightIntensity({ sliderName: slider, intensity: newY });
    },
    { filterTaps: true }
  );

  return { y, bind };
}

export const SceneAnimations: React.FC = React.memo(() => {
  const clickedMeshPosition = useSceneInteractionStore(state => state.clickedMeshPosition);
  const isCloseUpViewActive = useSceneInteractionStore(state => state.isCloseUpViewActive);
  const setIsUserCurrentlyDragging = useSceneInteractionStore(state => state.setIsUserCurrentlyDragging);

  const currentWindowWidth = useUserInterfaceStore(state => state.currentWindowWidth);
  const selectedThemeConfiguration = useUserInterfaceStore(state => state.selectedThemeConfiguration);
  const shouldShowArcadeIframe = useUserInterfaceStore(state => state.shouldShowArcadeIframe);
  const shouldShowMusicIframe = useUserInterfaceStore(state => state.shouldShowMusicIframe);
  const setCurrentLightIntensityConfiguration = useUserInterfaceStore(
    state => state.setCurrentLightIntensityConfiguration
  );

  const threeJSSceneModel = useThreeJSSceneStore(state => state.threeJSSceneModel);
  const setHTMLVideoPlayerElement = useThreeJSSceneStore(state => state.setHTMLVideoPlayerElement);

  const [sceneNodes, setSceneNodes] = useState<Record<string, THREE.Object3D> | null>(null);
  const [clickedPhoneName, setClickedPhoneName] = useState<string | null>(null);

  // Mutable copy of slider positions for drag updates
  const sliderPositions = useRef<CameraPositionTuple[]>([...SLIDER_POSITION_ARRAY]);

  const iframePosition = useMemo(
    (): [number, number, number] => currentWindowWidth < 800 ? [-4.055, -2.7, -1.6] : [-4.055, -2.7, -1.6],
    [currentWindowWidth]
  );

  const iframeClassName = useMemo(
    () => currentWindowWidth < 800 ? 'arcadewrapper-small' : 'arcadewrapper',
    [currentWindowWidth]
  );

  const iframe1Ref = useRef<HTMLIFrameElement>(null);
  const iframe2Ref = useRef<HTMLIFrameElement>(null);

  const selectedVibeIndex = selectedThemeConfiguration ? parseInt(selectedThemeConfiguration.id, 10) : 0;
  const currentIframeConfig = THEME_IFRAME_URL_CONFIGURATIONS[selectedVibeIndex] || THEME_IFRAME_URL_CONFIGURATIONS[0];

  // Slider spring animation
  const sliderSpring = useSliderSpring(
    'Slider_4',
    0,
    sliderPositions.current[0][1],
    sliderPositions.current,
    setIsUserCurrentlyDragging,
    setCurrentLightIntensityConfiguration
  );

  // Text spring animations
  const textSprings = useSprings(
    PHONE_TEXT_NODE_MESH_NAMES.length,
    PHONE_TEXT_NODE_MESH_NAMES.map((_, index) => {
      const isMatch = PHONE_MESH_NAMES.indexOf(clickedPhoneName || '') === index;
      return {
        scale: isMatch && isCloseUpViewActive ? [100, 100, 100] : [1, 1, 1],
        config: { tension: 200, friction: 5 },
      };
    })
  );

  const handleIframeLoad = useCallback(() => {
    if (threeJSSceneModel && iframe1Ref.current) {
      iframe1Ref.current.classList.add('loaded');
    }
  }, [threeJSSceneModel]);

  // Track clicked phone for text animation
  useEffect(() => {
    if (clickedMeshPosition && PHONE_MESH_NAMES.includes(clickedMeshPosition)) {
      setClickedPhoneName(clickedMeshPosition);
    }
  }, [clickedMeshPosition]);

  useEffect(() => {
    if (sceneNodes) {
      if (iframe1Ref.current) {
        iframe1Ref.current.style.display = shouldShowArcadeIframe ? 'block' : 'none';
      }
      if (iframe2Ref.current) {
        iframe2Ref.current.style.display = shouldShowMusicIframe ? 'block' : 'none';
      }
    }
  }, [shouldShowArcadeIframe, shouldShowMusicIframe, sceneNodes]);

  useEffect(() => {
    if (threeJSSceneModel) {
      const nodes: Record<string, THREE.Object3D> = {};
      threeJSSceneModel.traverse(child => {
        if (child.name) {
          nodes[child.name] = child;
        }
      });
      setSceneNodes(nodes);
    }
  }, [threeJSSceneModel]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      if (iframe2Ref.current && window.YT) {
        const playerInstance = new window.YT.Player(iframe2Ref.current, {
          videoId: currentIframeConfig.srcID,
        });
        setHTMLVideoPlayerElement(playerInstance);
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [currentIframeConfig.srcID, setHTMLVideoPlayerElement]);

  if (!sceneNodes) return null;

  return (
    <>
      {/* Slider with drag */}
      {sceneNodes['Slider_4'] && (
        // @ts-expect-error - react-spring animated.primitive has complex types
        <animated.primitive
          key="Slider_4"
          object={sceneNodes['Slider_4']}
          {...sliderSpring.bind()}
          position={sliderPositions.current[0]}
          rotation={SLIDER_ROTATION_VALUES}
          position-y={sliderSpring.y}
          scale={SLIDER_SCALE_VALUES}
        />
      )}

      {/* Animated text nodes */}
      {PHONE_TEXT_NODE_MESH_NAMES.map((nodeName, index) => {
        if (!sceneNodes[nodeName]) return null;
        return (
          <animated.primitive
            key={nodeName}
            object={sceneNodes[nodeName]}
            scale={textSprings[index].scale}
            position={TEXT_ELEMENT_POSITION_ARRAY[index]}
            rotation={TEXT_ELEMENT_ROTATION_ARRAY[index]}
          />
        );
      })}

      {/* Particle System on Lamp */}
      {sceneNodes['Tball'] && (
        <primitive
          scale={0.15}
          object={sceneNodes['Tball']}
          position={[5.11, 0.33, 2.145]}
        >
          <CustomGeometryParticles count={1500} />
        </primitive>
      )}

      {/* YouTube Music Player */}
      {sceneNodes['music_screen'] && (
        /* eslint-disable-next-line react/no-unknown-property */
        <primitive key="music_screen" object={sceneNodes['music_screen']} rotation-y={0.3}>
          <Html
            className="musicwrapper"
            position={[-0.9, -0.145, -0.65]}
            transform
            distanceFactor={1.5}
          >
            <div className="music">
              <iframe
                ref={iframe2Ref}
                id="player"
                src={currentIframeConfig.iframe2}
                allow="autoplay"
                title="Music Player"
              />
            </div>
          </Html>
        </primitive>
      )}

      {/* Pacman Arcade */}
      {sceneNodes['zelda_screen'] && (
        <primitive key="zelda_screen" object={sceneNodes['zelda_screen']}>
          <Html
            className={iframeClassName}
            position={iframePosition}
            transform
            distanceFactor={1.16}
          >
            <div className="arcade">
              <iframe
                ref={iframe1Ref}
                src={currentIframeConfig.iframe1}
                onLoad={handleIframeLoad}
                allow="muted"
                title="Arcade Content"
              />
            </div>
          </Html>
        </primitive>
      )}
    </>
  );
});

export default SceneAnimations;
