import { useEffect, useState, useCallback } from "react";
import { Vector3 } from "three";
import { rotationPoints, closeUpPositions, closeUpPositionsSmallScreen, closeUpRotations, positionMap } from '../data/camera';

export const useCameraAnimation = ({
  camera,
  windowWidth,
  closeUp,
  closeUpPosIndex,
  setCloseUpPosIndex,
  currentPosIndex,
  clickPoint,
  setClickPoint,
  setCloseUp,
  setCameraClone
}) => {
  const [rotationPoint, setRotationPoint] = useState(new Vector3());

  // Update rotation point based on camera state
  useEffect(() => {
    let newRotationPoint;
    if (closeUp) {
      newRotationPoint = new Vector3(...closeUpRotations[closeUpPosIndex]);
    } else {
      newRotationPoint = new Vector3(...rotationPoints[currentPosIndex]);
    }
    setRotationPoint(newRotationPoint);
  }, [closeUp, closeUpPosIndex, currentPosIndex]);

  // Handle click point navigation
  useEffect(() => {
    if (clickPoint) {
      setCloseUp(true);
      const positionIndex = positionMap[clickPoint] || 0;
      setCloseUpPosIndex(positionIndex);
      setClickPoint(null);
    }
  }, [clickPoint, setCloseUp, setCloseUpPosIndex, setClickPoint]);

  // Handle close-up camera positioning
  useEffect(() => {
    if (closeUpPosIndex !== 9) {
      const position =
        windowWidth > 800
          ? closeUpPositions[closeUpPosIndex]
          : closeUpPositionsSmallScreen[closeUpPosIndex];
      camera.position.copy(new Vector3(...position));
    }
  }, [closeUpPosIndex, windowWidth, camera]);

  // Initial camera animation on mount
  const animateCameraPosition = useCallback((
    camera,
    targetPoint,
    arcCenter,
    radius,
    startAngle,
    endAngle,
    duration
  ) => {
    let startTime = null;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsedTime = time - startTime;
      const fraction = elapsedTime / duration;
      setCameraClone(camera.position.clone());
      
      if (fraction < 1) {
        const angle = startAngle + (endAngle - startAngle) * fraction;
        const x = arcCenter.y + radius * Math.cos(angle);
        const z = arcCenter.z + radius * Math.sin(angle);
        camera.position.z = x;
        camera.position.y = z;
        camera.lookAt(targetPoint);
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [setCameraClone]);

  // Initial animation setup
  useEffect(() => {
    const targetPoint = new Vector3(...rotationPoints[0]);
    const arcCenter = new Vector3(10, 15, 15);
    const radius = 15;
    const startAngle = Math.PI / 2;
    const endAngle = (Math.PI * 3) / 2;
    const duration = 3500;

    if (camera) {
      animateCameraPosition(
        camera,
        targetPoint,
        arcCenter,
        radius,
        startAngle,
        endAngle,
        duration
      );
    }
  }, [camera, animateCameraPosition]);

  return { rotationPoint };
};