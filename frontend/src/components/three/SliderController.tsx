import React, { useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';
import { useSceneInteractionStore, useUserInterfaceStore } from '@/stores';
import {
  SLIDER_POSITION_ARRAY,
  SLIDER_ROTATION_VALUES,
  SLIDER_SCALE_VALUES,
  SPRING_PHYSICS,
} from '@/constants/animationConfiguration';
import type { CameraPositionTuple } from '@/types';

interface SliderSpringResult {
  y: ReturnType<typeof useSpring>[0]['y'];
  bind: ReturnType<typeof useDrag>;
}

function useSliderSpring(
  slider: string,
  index: number,
  initialY: number,
  setIsDragging: (dragging: boolean) => void,
  setLightIntensity: (config: { sliderName: string; intensity: number }) => void
): SliderSpringResult {
  // Track base position separately to avoid mutating the original array
  const basePositionRef = useRef<number>(initialY);
  const dragStartRef = useRef<number | null>(null);

  const [{ y }, set] = useSpring(() => ({
    y: initialY,
    config: {
      tension: SPRING_PHYSICS.SLIDER_TENSION,
      friction: SPRING_PHYSICS.SLIDER_FRICTION,
    },
  }));

  const bind = useDrag(
    ({ down, movement: [, my] }) => {
      const minY = index === 7 ? 0.375 - 0.033 : 0.538 - 0.033;
      const maxY = index === 7 ? 0.375 + 0.025 : 0.538 + 0.025;

      if (down) {
        // Capture the fixed start position on drag begin
        if (dragStartRef.current === null) {
          dragStartRef.current = basePositionRef.current;
        }
        const movementY = -my * 0.001 + dragStartRef.current;
        const newY = Math.min(Math.max(movementY, minY), maxY);
        set.start({ y: newY });
        setLightIntensity({ sliderName: slider, intensity: newY });
      } else {
        // Commit final position on drag end
        const finalY = dragStartRef.current !== null
          ? -my * 0.001 + dragStartRef.current
          : basePositionRef.current;
        basePositionRef.current = Math.min(Math.max(finalY, minY), maxY);
        dragStartRef.current = null;
        set.start({ y: basePositionRef.current });
        setLightIntensity({ sliderName: slider, intensity: basePositionRef.current });
      }
      setIsDragging(down);
    },
    { filterTaps: true }
  );

  return { y, bind };
}

interface SliderControllerProps {
  sceneNode: THREE.Object3D;
}

export const SliderController: React.FC<SliderControllerProps> = React.memo(
  ({ sceneNode }) => {
    const setIsUserCurrentlyDragging = useSceneInteractionStore(
      state => state.setIsUserCurrentlyDragging
    );
    const setCurrentLightIntensityConfiguration = useUserInterfaceStore(
      state => state.setCurrentLightIntensityConfiguration
    );

    // Mutable copy of slider positions for drag updates
    const sliderPositions = useRef<CameraPositionTuple[]>(
      [...SLIDER_POSITION_ARRAY]
    );

    const sliderSpring = useSliderSpring(
      'Slider_4',
      0,
      sliderPositions.current[0][1],
      setIsUserCurrentlyDragging,
      setCurrentLightIntensityConfiguration
    );

    return (
      // @ts-expect-error - react-spring animated.primitive has complex types
      <animated.primitive
        key="Slider_4"
        object={sceneNode}
        {...sliderSpring.bind()}
        position={sliderPositions.current[0]}
        rotation={SLIDER_ROTATION_VALUES}
        position-y={sliderSpring.y}
        scale={SLIDER_SCALE_VALUES}
      />
    );
  }
);
