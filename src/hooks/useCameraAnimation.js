import { useEffect, useState, useCallback } from "react";
import { Vector3 } from "three";
import { rotationPoints, closeUpPositions, closeUpPositionsSmallScreen, closeUpRotations, positionMap } from '../data/camera';

export const useCameraAnimation = ({
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
}) => {
  const [cameraRotationTarget, setCameraRotationTarget] = useState(new Vector3());

  // Update rotation target based on camera state
  useEffect(() => {
    let newRotationTarget;
    if (isCloseUpView) {
      const safeCloseUpIndex = Math.min(closeUpCameraIndex, closeUpRotations.length - 1);
      newRotationTarget = new Vector3(...closeUpRotations[safeCloseUpIndex]);
    } else {
      const safeCameraIndex = Math.min(currentCameraIndex, rotationPoints.length - 1);
      newRotationTarget = new Vector3(...rotationPoints[safeCameraIndex]);
    }
    setCameraRotationTarget(newRotationTarget);
  }, [isCloseUpView, closeUpCameraIndex, currentCameraIndex]);

  // Handle click point navigation
  useEffect(() => {
    if (clickPoint) {
      setCloseUp(true);
      const targetCameraIndex = positionMap[clickPoint] || 0;
      setCloseUpCameraIndex(targetCameraIndex);
      setClickPoint(null);
    }
  }, [clickPoint, setCloseUp, setCloseUpCameraIndex, setClickPoint]);

  // Handle close-up camera positioning
  useEffect(() => {
    if (closeUpCameraIndex !== 9) {
      const targetPosition =
        screenWidth > 800
          ? closeUpPositions[closeUpCameraIndex]
          : closeUpPositionsSmallScreen[closeUpCameraIndex];
      camera.position.copy(new Vector3(...targetPosition));
    }
  }, [closeUpCameraIndex, screenWidth, camera]);

  // Initial camera animation on mount
  const animateInitialCameraMovement = useCallback((
    camera,
    targetPoint,
    arcCenter,
    radius,
    startAngle,
    endAngle,
    duration
  ) => {
    let animationStartTime = null;
    const animateFrame = (currentTime) => {
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
        requestAnimationFrame(animateFrame);
      }
    };
    requestAnimationFrame(animateFrame);
  }, [setUsePrimaryCameraPosition]);

  // Initial animation setup
  useEffect(() => {
    const targetPoint = new Vector3(...rotationPoints[0]);
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