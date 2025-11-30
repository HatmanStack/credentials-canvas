/**
 * Custom hook for camera scroll behavior and navigation
 *
 * Handles both desktop wheel scroll and mobile navigation for camera movement
 * through predefined positions in the 3D scene.
 *
 * TODO: Phase 2 - Replace Context hooks with Zustand selectors
 */

import { useEffect, useRef, useCallback } from 'react';
import { Vector3 } from 'three';
import type { Camera } from 'three';
import { CAMERA_SCROLL_CONFIGURATION, NO_CLOSE_UP_INDEX } from '@/constants/cameraConfiguration';
import type { CameraPositionTuple } from '@/types';

/**
 * Parameters for useCameraScrollBehavior hook
 */
export interface UseCameraScrollBehaviorParameters {
  currentPosIndex: number;
  setCurrentPosIndex: (index: number) => void;
  positions: CameraPositionTuple[];
  camera: Camera;
  domElement: HTMLElement | null;
  setScrollStarted: (hasStarted: boolean) => void;
  setCloseUp: (isCloseUp: boolean) => void;
  setCloseUpPosIndex: (index: number) => void;
  setCameraClone: (position: Vector3 | boolean) => void;
  holderprogress: number;
  setProgress: (progress: number) => void;
  mobileScroll: number | null;
}

/**
 * Return type for useCameraScrollBehavior hook
 */
export interface UseCameraScrollBehaviorReturn {
  handleMobileScroll: () => void;
}

/**
 * Hook for managing camera scroll behavior
 */
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
  // Local refs for each scroll type
  const mobileIndexRef = useRef<number>(currentCameraIndex);
  const desktopIndexRef = useRef<number>(currentCameraIndex);
  const desktopScrollProgress = useRef<number>(0);
  const mobileScrollProgress = useRef<number>(0);

  // Sync local refs when context currentCameraIndex changes
  useEffect(() => {
    mobileIndexRef.current = currentCameraIndex;
    desktopIndexRef.current = currentCameraIndex;
    desktopScrollProgress.current = 0;
    mobileScrollProgress.current = 0;
  }, [currentCameraIndex]);

  const handleMobileScroll = useCallback(() => {
    // Guard against invalid positions array or index
    if (cameraPositions.length === 0) return;

    setScrollStarted(true);
    setCloseUp(false);
    setCloseUpCameraIndex(NO_CLOSE_UP_INDEX);

    const currentIndex = mobileIndexRef.current;

    // Validate current index is within bounds
    if (currentIndex < 0 || currentIndex >= cameraPositions.length) {
      return;
    }

    const interpolationSteps = currentIndex >= 1 && currentIndex <= 3 ? 3 : 2;
    mobileScrollProgress.current += CAMERA_SCROLL_CONFIGURATION.mobile / 2;

    const currentPos = new Vector3(...cameraPositions[currentIndex]);
    const nextPos = new Vector3(...cameraPositions[(currentIndex + 1) % cameraPositions.length]);
    const interpolatedPos = new Vector3().lerpVectors(
      currentPos,
      nextPos,
      Math.max(0, Math.min(1, mobileScrollProgress.current / interpolationSteps))
    );

    camera.position.copy(interpolatedPos);

    if (mobileScrollProgress.current >= interpolationSteps) {
      mobileScrollProgress.current = 0;
      setUsePrimaryCameraPosition(false);

      const nextIndex = (currentIndex + 1) % cameraPositions.length;
      mobileIndexRef.current = nextIndex;
      setCurrentCameraIndex(nextIndex);
    }
  }, [
    cameraPositions, camera, setScrollStarted, setCloseUp,
    setCloseUpCameraIndex, setUsePrimaryCameraPosition, setCurrentCameraIndex
  ]);

  // Handle mobile scroll trigger
  useEffect(() => {
    if (mobileScrollCount) {
      handleMobileScroll();
    }
  }, [mobileScrollCount, handleMobileScroll]);

  // Handle desktop scroll
  useEffect(() => {
    if (!domElement) return;

    const handleDesktopScroll = (_event: WheelEvent): void => {
      // Guard against invalid positions array or index
      if (cameraPositions.length === 0) return;

      setScrollStarted(true);
      setCloseUp(false);
      setCloseUpCameraIndex(NO_CLOSE_UP_INDEX);

      const currentIndex = desktopIndexRef.current;

      // Validate current index is within bounds
      if (currentIndex < 0 || currentIndex >= cameraPositions.length) {
        return;
      }

      const interpolationSteps = currentIndex >= 1 && currentIndex <= 3 ? 3 : 2;
      desktopScrollProgress.current += CAMERA_SCROLL_CONFIGURATION.desktop / 2;

      const currentPos = new Vector3(...cameraPositions[currentIndex]);
      const nextPos = new Vector3(...cameraPositions[(currentIndex + 1) % cameraPositions.length]);
      const interpolatedPos = new Vector3().lerpVectors(
        currentPos,
        nextPos,
        Math.max(0, Math.min(1, desktopScrollProgress.current / interpolationSteps))
      );

      camera.position.copy(interpolatedPos);

      if (desktopScrollProgress.current >= interpolationSteps) {
        desktopScrollProgress.current = 0;
        setUsePrimaryCameraPosition(false);

        const nextIndex = (currentIndex + 1) % cameraPositions.length;
        desktopIndexRef.current = nextIndex;
        setCurrentCameraIndex(nextIndex);
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
