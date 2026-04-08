import React, { useState, useEffect } from 'react';
import { useSprings, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useSceneInteractionStore, useThreeJSSceneStore } from '@/stores';
import { CustomGeometryParticles } from './Lamp';
import { SliderController } from './SliderController';
import { YouTubeMusicPlayer } from './YouTubeMusicPlayer';
import { ArcadeIframe } from './ArcadeIframe';
import {
  PHONE_TEXT_NODE_MESH_NAMES,
  PHONE_MESH_NAMES,
  TEXT_ELEMENT_POSITION_ARRAY,
  TEXT_ELEMENT_ROTATION_ARRAY,
  SPRING_PHYSICS,
  CLOSE_UP_TEXT_SCALE,
} from '@/constants/animationConfiguration';

export const SceneAnimations: React.FC = React.memo(() => {
  const clickedMeshPosition = useSceneInteractionStore(
    state => state.clickedMeshPosition
  );
  const isCloseUpViewActive = useSceneInteractionStore(
    state => state.isCloseUpViewActive
  );

  const threeJSSceneModel = useThreeJSSceneStore(
    state => state.threeJSSceneModel
  );

  const [sceneNodes, setSceneNodes] = useState<
    Record<string, THREE.Object3D> | null
  >(null);
  const [clickedPhoneName, setClickedPhoneName] = useState<string | null>(null);

  // Text spring animations
  const textSprings = useSprings(
    PHONE_TEXT_NODE_MESH_NAMES.length,
    PHONE_TEXT_NODE_MESH_NAMES.map((_, index) => {
      const isMatch =
        PHONE_MESH_NAMES.indexOf(clickedPhoneName || '') === index;
      return {
        scale: isMatch && isCloseUpViewActive
          ? [CLOSE_UP_TEXT_SCALE, CLOSE_UP_TEXT_SCALE, CLOSE_UP_TEXT_SCALE]
          : [1, 1, 1],
        config: {
          tension: SPRING_PHYSICS.TEXT_TENSION,
          friction: SPRING_PHYSICS.TEXT_FRICTION,
        },
      };
    })
  );

  // Track clicked phone for text animation.
  //
  // Only *record* a new phone name when clickedMeshPosition names a phone;
  // do NOT clear clickedPhoneName when it goes back to null. The camera
  // position hook (useCameraPositionAnimation) intentionally resets
  // clickedMeshPosition to null after consuming the click — that's its
  // way of signaling "I handled it", not a deselect. Clearing here on
  // null created a race where the spring target flipped
  // 1 → CLOSE_UP_TEXT_SCALE → 1 across three consecutive renders, which
  // the user saw as the text briefly growing and then shrinking back.
  //
  // The actual deselection happens below, keyed off isCloseUpViewActive
  // going false (scroll, etc.), which is the real "leaving close-up" event.
  useEffect(() => {
    if (
      clickedMeshPosition &&
      PHONE_MESH_NAMES.includes(clickedMeshPosition)
    ) {
      setClickedPhoneName(clickedMeshPosition);
    }
  }, [clickedMeshPosition]);

  // Reset the highlighted phone when the user leaves close-up view so the
  // spring animates back to resting scale and is primed to re-fire on the
  // next click.
  useEffect(() => {
    if (!isCloseUpViewActive) {
      setClickedPhoneName(null);
    }
  }, [isCloseUpViewActive]);

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

  if (!sceneNodes) return null;

  return (
    <>
      {/* Slider with drag */}
      {sceneNodes['Slider_4'] && (
        <SliderController sceneNode={sceneNodes['Slider_4']} />
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
        <YouTubeMusicPlayer sceneNode={sceneNodes['music_screen']} />
      )}

      {/* Pacman Arcade */}
      {sceneNodes['zelda_screen'] && (
        <ArcadeIframe sceneNode={sceneNodes['zelda_screen']} />
      )}
    </>
  );
});

export default SceneAnimations;
