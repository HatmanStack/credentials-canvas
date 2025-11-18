/**
 * Camera Controller Component
 *
 * Manages camera position, rotation, and user controls (orbit, scroll, drag).
 * Coordinates with camera scroll and animation hooks for smooth navigation.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Vector3 } from 'three';
import { useSceneInteractionStore, useUserInterfaceStore } from 'stores';
import { useCameraScrollBehavior } from 'hooks/useCameraScrollBehavior';
import { useCameraPositionAnimation } from 'hooks/useCameraPositionAnimation';

/**
 * Extended OrbitControls class with camera index tracking
 */
class OrbitControls extends ThreeOrbitControls {
  currentPosIndex: number;

  constructor(object: any, domElement: any) {
    super(object, domElement);
    this.currentPosIndex = 0;
  }

  update(): boolean {
    return super.update();
  }
}

extend({ OrbitControls });

/**
 * Camera controller component
 */
export const CameraController: React.FC = React.memo(() => {
  // Scene interaction store - selective subscriptions
  const mobileScrollTriggerCount = useSceneInteractionStore(state => state.mobileScrollTriggerCount);
  const clickedMeshPosition = useSceneInteractionStore(state => state.clickedMeshPosition);
  const setClickedMeshPosition = useSceneInteractionStore(state => state.setClickedMeshPosition);
  const setIsCloseUpViewActive = useSceneInteractionStore(state => state.setIsCloseUpViewActive);
  const isUserCurrentlyDragging = useSceneInteractionStore(state => state.isUserCurrentlyDragging);
  const isCloseUpViewActive = useSceneInteractionStore(state => state.isCloseUpViewActive);
  const setHasUserStartedScrolling = useSceneInteractionStore(state => state.setHasUserStartedScrolling);
  const currentCameraPositionIndex = useSceneInteractionStore(state => state.currentCameraPositionIndex);
  const setCurrentCameraPositionIndex = useSceneInteractionStore(state => state.setCurrentCameraPositionIndex);
  const cameraInterpolationProgress = useSceneInteractionStore(state => state.cameraInterpolationProgress);
  const setCameraInterpolationProgress = useSceneInteractionStore(state => state.setCameraInterpolationProgress);

  // User interface store - selective subscriptions
  const currentWindowWidth = useUserInterfaceStore(state => state.currentWindowWidth);
  const setShouldShowArcadeIframe = useUserInterfaceStore(state => state.setShouldShowArcadeIframe);
  const setShouldShowMusicIframe = useUserInterfaceStore(state => state.setShouldShowMusicIframe);

  const [closeUpCameraIndex, setCloseUpCameraIndex] = useState<number>(0);
  const [usePrimaryCameraPosition, setUsePrimaryCameraPosition] = useState<Vector3 | boolean>(true);
  const [shouldResetCamera, setShouldResetCamera] = useState<boolean>(true);

  // Memoized camera positions
  const cameraPositions = useMemo<[number, number, number][]>(() => [
    usePrimaryCameraPosition === true ? [1, 1, 13] : [10, 1, 13],
    [4, 1, 2],
    [3, 1, 3.75],
    [0, 1, 6.5],
    [-12, 6, 0],
  ], [usePrimaryCameraPosition]);

  const {
    camera,
    gl: { domElement },
  } = useThree();
  const controls = useRef<OrbitControls | null>(null);

  // Custom hooks for camera behavior
  useCameraScrollBehavior({
    currentPosIndex: currentCameraPositionIndex,
    setCurrentPosIndex: setCurrentCameraPositionIndex,
    positions: cameraPositions,
    camera,
    domElement,
    setScrollStarted: setHasUserStartedScrolling,
    setCloseUp: setIsCloseUpViewActive,
    setCloseUpPosIndex: setCloseUpCameraIndex,
    setCameraClone: setUsePrimaryCameraPosition,
    holderprogress: cameraInterpolationProgress,
    setProgress: setCameraInterpolationProgress,
    mobileScroll: mobileScrollTriggerCount
  });

  const { rotationPoint } = useCameraPositionAnimation({
    camera,
    windowWidth: currentWindowWidth,
    closeUp: isCloseUpViewActive,
    closeUpPosIndex: closeUpCameraIndex,
    setCloseUpPosIndex: setCloseUpCameraIndex,
    currentPosIndex: currentCameraPositionIndex,
    clickPoint: clickedMeshPosition,
    setClickPoint: setClickedMeshPosition,
    setCloseUp: setIsCloseUpViewActive,
    setCameraClone: setUsePrimaryCameraPosition
  });

  // Update camera controls and iframe visibility each frame
  useFrame(() => {
    if (controls.current) {
      if (shouldResetCamera) {
        camera.position.set(1, 13, 1);
        setShouldResetCamera(false);
      }
      controls.current.update();
      controls.current.target.copy(rotationPoint);
      controls.current.update();

      // Update iframe visibility based on camera position
      if (
        camera.position.x > 1.78 &&
        camera.position.y > 0 &&
        camera.position.z > 0.25
      ) {
        setShouldShowArcadeIframe(true);
      } else {
        setShouldShowArcadeIframe(false);
      }

      if (
        camera.position.y > 0 &&
        camera.position.z > 4.3
      ) {
        setShouldShowMusicIframe(true);
      } else {
        setShouldShowMusicIframe(false);
      }
      if (camera.position.y > 3) {
        setShouldShowMusicIframe(false);
      }
      if (
        camera.position.y > 1.2 &&
        camera.position.x > -1.5 &&
        camera.position.z < 5.2
      ) {
        setShouldShowMusicIframe(false);
      }
    }
  });

  // Handle drag state changes
  useEffect(() => {
    if (controls.current && isUserCurrentlyDragging) {
      controls.current.update();
      controls.current.enabled = !isUserCurrentlyDragging;
      controls.current.update();
    }
  }, [isUserCurrentlyDragging]);

  // Initialize OrbitControls
  useEffect(() => {
    controls.current = new OrbitControls(camera, domElement);
    return () => {
      if (controls.current) {
        controls.current.dispose();
      }
    };
  }, [camera, domElement]);

  // Toggle controls based on drag state
  useEffect(() => {
    if (controls.current) {
      controls.current.enabled = !isUserCurrentlyDragging;
    }
  }, [isUserCurrentlyDragging]);

  return null;
});
