import { useEffect, useRef, useCallback } from 'react';
import { Vector3 } from 'three';
import type { Camera } from 'three';
import { CAMERA_SCROLL_CONFIGURATION, NO_CLOSE_UP_INDEX } from '@/constants/cameraConfiguration';
import type { CameraPositionTuple } from '@/types';

export interface UseCameraScrollBehaviorParameters {
  currentPosIndex: number;
  setCurrentPosIndex: (index: number) => void;
  positions: CameraPositionTuple[];
  camera: Camera;
  domElement: HTMLElement | null;
  setScrollStarted: (hasStarted: boolean) => void;
  setCloseUp: (isCloseUp: boolean) => void;
  setCloseUpPosIndex: (index: number | null) => void;
  setCameraClone: (position: Vector3 | null) => void;
  mobileScroll: number | null;
}

export interface UseCameraScrollBehaviorReturn {
  handleMobileScroll: () => void;
}

interface ScrollVectorRefs {
  currentPos: Vector3;
  nextPos: Vector3;
  interpolatedPos: Vector3;
}

interface ScrollInterpolationParams {
  currentIndex: number;
  positions: CameraPositionTuple[];
  scrollSpeed: number;
  progressRef: React.RefObject<number>;
  camera: Camera;
  vectors: ScrollVectorRefs;
}

interface ScrollInterpolationResult {
  completed: boolean;
  nextIndex: number;
}

function interpolateScroll({
  currentIndex,
  positions,
  scrollSpeed,
  progressRef,
  camera,
  vectors,
}: ScrollInterpolationParams): ScrollInterpolationResult {
  const interpolationSteps = currentIndex >= 1 && currentIndex <= 3 ? 3 : 2;
  progressRef.current += scrollSpeed / 2;

  vectors.currentPos.set(...positions[currentIndex]);
  vectors.nextPos.set(
    ...positions[(currentIndex + 1) % positions.length]
  );
  vectors.interpolatedPos.lerpVectors(
    vectors.currentPos,
    vectors.nextPos,
    Math.max(0, Math.min(1, progressRef.current / interpolationSteps))
  );

  camera.position.copy(vectors.interpolatedPos);

  const nextIndex = (currentIndex + 1) % positions.length;

  if (progressRef.current >= interpolationSteps) {
    progressRef.current = 0;
    return { completed: true, nextIndex };
  }

  return { completed: false, nextIndex };
}

export const useCameraScrollBehavior = ({
  currentPosIndex: currentCameraIndex,
  setCurrentPosIndex: setCurrentCameraIndex,
  positions: cameraPositions,
  camera,
  domElement,
  setScrollStarted,
  setCloseUp,
  setCloseUpPosIndex: setCloseUpCameraIndex,
  setCameraClone: setUsePrimaryCameraPosition,
  mobileScroll: mobileScrollCount
}: UseCameraScrollBehaviorParameters): UseCameraScrollBehaviorReturn => {
  const mobileIndexRef = useRef<number>(currentCameraIndex);
  const desktopIndexRef = useRef<number>(currentCameraIndex);
  const desktopScrollProgress = useRef<number>(0);
  const mobileScrollProgress = useRef<number>(0);

  // Pre-allocated Vector3 instances to avoid per-scroll-event allocations
  const scrollVectors = useRef<ScrollVectorRefs>({
    currentPos: new Vector3(),
    nextPos: new Vector3(),
    interpolatedPos: new Vector3(),
  });

  useEffect(() => {
    mobileIndexRef.current = currentCameraIndex;
    desktopIndexRef.current = currentCameraIndex;
    desktopScrollProgress.current = 0;
    mobileScrollProgress.current = 0;
  }, [currentCameraIndex]);

  const handleMobileScroll = useCallback(() => {
    if (cameraPositions.length === 0) return;

    setScrollStarted(true);
    setCloseUp(false);
    setCloseUpCameraIndex(NO_CLOSE_UP_INDEX);

    const currentIndex = mobileIndexRef.current;
    if (currentIndex < 0 || currentIndex >= cameraPositions.length) return;

    const result = interpolateScroll({
      currentIndex,
      positions: cameraPositions,
      scrollSpeed: CAMERA_SCROLL_CONFIGURATION.mobile,
      progressRef: mobileScrollProgress,
      camera,
      vectors: scrollVectors.current,
    });

    if (result.completed) {
      setUsePrimaryCameraPosition(null);
      mobileIndexRef.current = result.nextIndex;
      setCurrentCameraIndex(result.nextIndex);
    }
  }, [
    cameraPositions, camera, setScrollStarted, setCloseUp,
    setCloseUpCameraIndex, setUsePrimaryCameraPosition, setCurrentCameraIndex
  ]);

  useEffect(() => {
    if (mobileScrollCount) {
      handleMobileScroll();
    }
  }, [mobileScrollCount, handleMobileScroll]);

  useEffect(() => {
    if (!domElement) return;

    const handleDesktopScroll = (_event: WheelEvent): void => {
      if (cameraPositions.length === 0) return;

      setScrollStarted(true);
      setCloseUp(false);
      setCloseUpCameraIndex(NO_CLOSE_UP_INDEX);

      const currentIndex = desktopIndexRef.current;
      if (currentIndex < 0 || currentIndex >= cameraPositions.length) return;

      const result = interpolateScroll({
        currentIndex,
        positions: cameraPositions,
        scrollSpeed: CAMERA_SCROLL_CONFIGURATION.desktop,
        progressRef: desktopScrollProgress,
        camera,
        vectors: scrollVectors.current,
      });

      if (result.completed) {
        setUsePrimaryCameraPosition(null);
        desktopIndexRef.current = result.nextIndex;
        setCurrentCameraIndex(result.nextIndex);
      }
    };

    domElement.addEventListener('wheel', handleDesktopScroll);
    return () => {
      domElement.removeEventListener('wheel', handleDesktopScroll);
    };
  }, [
    camera, domElement, cameraPositions, setScrollStarted, setCloseUp,
    setCloseUpCameraIndex, setUsePrimaryCameraPosition, setCurrentCameraIndex
  ]);

  return { handleMobileScroll };
};
