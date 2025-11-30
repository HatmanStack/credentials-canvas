/**
 * Custom hook for camera position animation
 *
 * Handles camera rotation targets, close-up view animations, and initial
 * camera movement animations when the scene loads.
 *
 * TODO: Phase 2 - Replace Context dependencies with Zustand
 */

import { useEffect, useState, useCallback } from 'react';
import { Vector3 } from 'three';
import type { Camera } from 'three';
import {
  CAMERA_ROTATION_POSITION_ARRAY,
  CLOSE_UP_CAMERA_POSITION_ARRAY,
  CLOSE_UP_CAMERA_POSITION_ARRAY_SMALL_SCREEN,
  CLOSE_UP_CAMERA_ROTATION_ARRAY,
  MESH_NAME_TO_CAMERA_POSITION_INDEX_MAP,
  NO_CLOSE_UP_INDEX
} from '@/constants/cameraConfiguration';
import type { CameraPositionTuple } from '@/types';

/**
 * Parameters for useCameraPositionAnimation hook
 */
export interface UseCameraPositionAnimationParameters {
  camera: Camera;
  windowWidth: number;
  closeUp: boolean;
  closeUpPosIndex: number;
  setCloseUpPosIndex: (index: number) => void;
  currentPosIndex: number;
  clickPoint: string | null;
  setClickPoint: (point: string | null) => void;
  setCloseUp: (isCloseUp: boolean) => void;
  setCameraClone: (position: Vector3 | boolean) => void;
}

/**
 * Return type for useCameraPositionAnimation hook
 */
export interface UseCameraPositionAnimationReturn {
  rotationPoint: Vector3;
}

/**
 * Hook for managing camera position animations
 */
export const useCameraPositionAnimation = ({
  camera,
  windowWidth: screenWidth,
  closeUp: isCloseUpView,
  closeUpPosIndex: closeUpCameraIndex,
  setCloseUpPosIndex: setCloseUpCameraIndex,
  currentPosIndex: currentCameraIndex,
  clickPoint,
  setClickPoint,
  setCloseUp,
  setCameraClone: setUsePrimaryCameraPosition
}: UseCameraPositionAnimationParameters): UseCameraPositionAnimationReturn => {
  const [cameraRotationTarget, setCameraRotationTarget] = useState<Vector3>(new Vector3());

  // Update rotation target based on camera state
  useEffect(() => {
    let newRotationTarget: Vector3;
    if (isCloseUpView) {
      const safeCloseUpIndex = Math.max(0, Math.min(closeUpCameraIndex, CLOSE_UP_CAMERA_ROTATION_ARRAY.length - 1));
      newRotationTarget = new Vector3(...CLOSE_UP_CAMERA_ROTATION_ARRAY[safeCloseUpIndex]);
    } else {
      const safeCameraIndex = Math.max(0, Math.min(currentCameraIndex, CAMERA_ROTATION_POSITION_ARRAY.length - 1));
      newRotationTarget = new Vector3(...CAMERA_ROTATION_POSITION_ARRAY[safeCameraIndex]);
    }
    setCameraRotationTarget(newRotationTarget);
  }, [isCloseUpView, closeUpCameraIndex, currentCameraIndex]);

  // Handle click point navigation
  useEffect(() => {
    if (clickPoint) {
      setCloseUp(true);
      const targetCameraIndex = MESH_NAME_TO_CAMERA_POSITION_INDEX_MAP[clickPoint] || 0;
      setCloseUpCameraIndex(targetCameraIndex);
      setClickPoint(null);
    }
  }, [clickPoint, setCloseUp, setCloseUpCameraIndex, setClickPoint]);

  // Handle close-up camera positioning
  useEffect(() => {
    if (closeUpCameraIndex !== NO_CLOSE_UP_INDEX) {
      // Pick the appropriate positions array based on screen width
      const positions = screenWidth > 800 ?
        CLOSE_UP_CAMERA_POSITION_ARRAY :
        CLOSE_UP_CAMERA_POSITION_ARRAY_SMALL_SCREEN;

      // Validate index is within bounds before accessing array
      if (closeUpCameraIndex >= 0 && closeUpCameraIndex < positions.length) {
        const targetPosition: CameraPositionTuple = positions[closeUpCameraIndex];
        camera.position.copy(new Vector3(...targetPosition));
      }
    }
  }, [closeUpCameraIndex, screenWidth, camera]);

  // Initial camera animation on mount
  const animateInitialCameraMovement = useCallback((
    cameraToAnimate: Camera,
    targetPoint: Vector3,
    arcCenter: Vector3,
    radius: number,
    startAngle: number,
    endAngle: number,
    duration: number
  ): void => {
    let animationStartTime: number | null = null;
    const animateFrame = (currentTime: number): void => {
      if (!animationStartTime) animationStartTime = currentTime;
      const elapsedTime = currentTime - animationStartTime;
      const animationProgress = elapsedTime / duration;
      setUsePrimaryCameraPosition(cameraToAnimate.position.clone());

      if (animationProgress < 1) {
        const currentAngle = startAngle + (endAngle - startAngle) * animationProgress;
        const xPosition = arcCenter.y + radius * Math.cos(currentAngle);
        const zPosition = arcCenter.z + radius * Math.sin(currentAngle);
        cameraToAnimate.position.z = xPosition;
        cameraToAnimate.position.y = zPosition;
        cameraToAnimate.lookAt(targetPoint);
        requestAnimationFrame(animateFrame);
      }
    };
    requestAnimationFrame(animateFrame);
  }, [setUsePrimaryCameraPosition]);

  // Initial animation setup
  useEffect(() => {
    const targetPoint = new Vector3(...CAMERA_ROTATION_POSITION_ARRAY[0]);
    const arcCenter = new Vector3(10, 15, 15);
    const radius = 15;
    const startAngle = Math.PI / 2;
    const endAngle = (Math.PI * 3) / 2;
    const duration = 3500;

    if (camera) {
      animateInitialCameraMovement(
        camera,
        targetPoint,
        arcCenter,
        radius,
        startAngle,
        endAngle,
        duration
      );
    }
  }, [camera, animateInitialCameraMovement]);

  return { rotationPoint: cameraRotationTarget };
};
