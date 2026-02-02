import { useEffect, useState, useRef } from 'react';
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
import { ANIMATION_DURATIONS } from '@/constants/animationConfiguration';
import type { CameraPositionTuple } from '@/types';

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

export interface UseCameraPositionAnimationReturn {
  rotationPoint: Vector3;
}

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

  useEffect(() => {
    if (clickPoint) {
      setCloseUp(true);
      const targetCameraIndex = MESH_NAME_TO_CAMERA_POSITION_INDEX_MAP[clickPoint] || 0;
      setCloseUpCameraIndex(targetCameraIndex);
      setClickPoint(null);
    }
  }, [clickPoint, setCloseUp, setCloseUpCameraIndex, setClickPoint]);

  useEffect(() => {
    if (closeUpCameraIndex !== NO_CLOSE_UP_INDEX) {
      const positions = screenWidth > 800 ?
        CLOSE_UP_CAMERA_POSITION_ARRAY :
        CLOSE_UP_CAMERA_POSITION_ARRAY_SMALL_SCREEN;

      if (closeUpCameraIndex >= 0 && closeUpCameraIndex < positions.length) {
        const targetPosition: CameraPositionTuple = positions[closeUpCameraIndex];
        camera.position.copy(new Vector3(...targetPosition));
      }
    }
  }, [closeUpCameraIndex, screenWidth, camera]);

  // Track animation frame ID for cleanup on unmount
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!camera) return;

    const targetPoint = new Vector3(...CAMERA_ROTATION_POSITION_ARRAY[0]);
    const arcCenter = new Vector3(10, 15, 15);
    const radius = 15;
    const startAngle = Math.PI / 2;
    const endAngle = (Math.PI * 3) / 2;
    const duration = ANIMATION_DURATIONS.INITIAL_CAMERA_ARC_MS;

    let animationStartTime: number | null = null;
    let isCancelled = false;

    const animateFrame = (currentTime: number): void => {
      if (isCancelled) return;

      if (!animationStartTime) animationStartTime = currentTime;
      const elapsedTime = currentTime - animationStartTime;
      const animationProgress = elapsedTime / duration;
      setUsePrimaryCameraPosition(camera.position.clone());

      if (animationProgress < 1) {
        const currentAngle = startAngle + (endAngle - startAngle) * animationProgress;
        const xPosition = arcCenter.y + radius * Math.cos(currentAngle);
        const zPosition = arcCenter.z + radius * Math.sin(currentAngle);
        camera.position.z = xPosition;
        camera.position.y = zPosition;
        camera.lookAt(targetPoint);
        animationFrameIdRef.current = requestAnimationFrame(animateFrame);
      }
    };

    animationFrameIdRef.current = requestAnimationFrame(animateFrame);

    return () => {
      isCancelled = true;
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [camera, setUsePrimaryCameraPosition]);

  return { rotationPoint: cameraRotationTarget };
};
