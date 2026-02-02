import React, { useEffect, useRef, useState, useMemo } from 'react';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Vector3 } from 'three';
import type { Camera } from 'three';
import { useSceneInteractionStore, useUserInterfaceStore } from '@/stores';
import { useCameraScrollBehavior } from '@/hooks/useCameraScrollBehavior';
import { useCameraPositionAnimation } from '@/hooks/useCameraPositionAnimation';
import { MAIN_CAMERA_POSITIONS, IFRAME_VISIBILITY_THRESHOLDS } from '@/constants/cameraConfiguration';

class OrbitControls extends ThreeOrbitControls {
  currentPosIndex: number;

  constructor(object: Camera, domElement: HTMLElement) {
    super(object, domElement);
    this.currentPosIndex = 0;
  }

  update(): boolean {
    return super.update();
  }
}

extend({ OrbitControls });

export const CameraController: React.FC = React.memo(() => {
  const mobileScrollTriggerCount = useSceneInteractionStore(state => state.mobileScrollTriggerCount);
  const clickedMeshPosition = useSceneInteractionStore(state => state.clickedMeshPosition);
  const setClickedMeshPosition = useSceneInteractionStore(state => state.setClickedMeshPosition);
  const setIsCloseUpViewActive = useSceneInteractionStore(state => state.setIsCloseUpViewActive);
  const isUserCurrentlyDragging = useSceneInteractionStore(state => state.isUserCurrentlyDragging);
  const isCloseUpViewActive = useSceneInteractionStore(state => state.isCloseUpViewActive);
  const setHasUserStartedScrolling = useSceneInteractionStore(state => state.setHasUserStartedScrolling);
  const currentCameraPositionIndex = useSceneInteractionStore(state => state.currentCameraPositionIndex);
  const setCurrentCameraPositionIndex = useSceneInteractionStore(state => state.setCurrentCameraPositionIndex);

  const currentWindowWidth = useUserInterfaceStore(state => state.currentWindowWidth);
  const setShouldShowArcadeIframe = useUserInterfaceStore(state => state.setShouldShowArcadeIframe);
  const setShouldShowMusicIframe = useUserInterfaceStore(state => state.setShouldShowMusicIframe);

  const [closeUpCameraIndex, setCloseUpCameraIndex] = useState<number>(0);
  const [usePrimaryCameraPosition, setUsePrimaryCameraPosition] = useState<Vector3 | boolean>(true);
  const [shouldResetCamera, setShouldResetCamera] = useState<boolean>(true);

  const cameraPositions = useMemo<[number, number, number][]>(() => [
    usePrimaryCameraPosition ? MAIN_CAMERA_POSITIONS.primary : MAIN_CAMERA_POSITIONS.alternate,
    ...MAIN_CAMERA_POSITIONS.positions,
  ], [usePrimaryCameraPosition]);

  const {
    camera,
    gl: { domElement },
  } = useThree();
  const controls = useRef<OrbitControls | null>(null);

  // Track previous iframe visibility to avoid per-frame setState calls
  const prevArcadeVisible = useRef<boolean>(true);
  const prevMusicVisible = useRef<boolean>(true);

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

  useFrame(() => {
    if (controls.current) {
      if (shouldResetCamera) {
        camera.position.set(1, 13, 1);
        setShouldResetCamera(false);
      }
      controls.current.update();
      controls.current.target.copy(rotationPoint);
      controls.current.update();

      // Iframe visibility computed per-frame to sync with smooth camera transitions;
      // Only update state when visibility actually changes to avoid 60+ setState calls/second
      const { arcade, music } = IFRAME_VISIBILITY_THRESHOLDS;

      const shouldShowArcade =
        camera.position.x > arcade.minX &&
        camera.position.y > arcade.minY &&
        camera.position.z > arcade.minZ;

      if (shouldShowArcade !== prevArcadeVisible.current) {
        setShouldShowArcadeIframe(shouldShowArcade);
        prevArcadeVisible.current = shouldShowArcade;
      }

      let shouldShowMusic =
        camera.position.y > music.minY &&
        camera.position.z > music.minZ;

      if (camera.position.y > music.maxY) {
        shouldShowMusic = false;
      }

      if (
        camera.position.y > music.hideWhen.minY &&
        camera.position.x > music.hideWhen.minX &&
        camera.position.z < music.hideWhen.maxZ
      ) {
        shouldShowMusic = false;
      }

      if (shouldShowMusic !== prevMusicVisible.current) {
        setShouldShowMusicIframe(shouldShowMusic);
        prevMusicVisible.current = shouldShowMusic;
      }
    }
  });

  useEffect(() => {
    controls.current = new OrbitControls(camera, domElement);
    return () => {
      if (controls.current) {
        controls.current.dispose();
      }
    };
  }, [camera, domElement]);

  useEffect(() => {
    if (controls.current) {
      controls.current.enabled = !isUserCurrentlyDragging;
    }
  }, [isUserCurrentlyDragging]);

  return null;
});
