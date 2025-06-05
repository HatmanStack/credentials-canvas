import { useEffect, useRef, useState, useCallback } from "react";
import { Vector3 } from "three";
import { useInteraction } from '../contexts';
import { scrollConstants } from '../data/camera';

export const useCameraScroll = ({
  currentPosIndex,
  setCurrentPosIndex,
  positions,
  camera,
  domElement,
  setScrollStarted,
  setCloseUp,
  setCloseUpPosIndex,
  setCameraClone,
  holderprogress,
  setProgress,
  mobileScroll
}) => {
  const currentPos = useRef(new Vector3());
  const nextPos = useRef(new Vector3());
  const newPos = useRef(new Vector3());

  const handleMobileScroll = useCallback((event) => {
    setScrollStarted(true);
    if (setCloseUp) {
      setCloseUpPosIndex(9);
      setCloseUp(false);
    }
    
    const steps = currentPosIndex >= 1 && currentPosIndex <= 3 ? 3 : 2;
    const scrollAmount = scrollConstants.mobile / 2;
    const newProgress = holderprogress + scrollAmount;
    
    currentPos.current.set(...positions[currentPosIndex]);
    nextPos.current.set(...positions[(currentPosIndex + 1) % positions.length]);
    
    newPos.current.lerpVectors(
      currentPos.current,
      nextPos.current,
      Math.max(0, Math.min(1, newProgress / steps))
    );
    
    camera.position.copy(newPos.current);
    
    if (newProgress >= steps) {
      setCameraClone(false);
      setProgress(0);
      setCurrentPosIndex((currentPosIndex + 1) % positions.length);
    } else {
      setProgress(newProgress);
    }
  }, [currentPosIndex, positions, camera, holderprogress, setScrollStarted, setCloseUp, setCloseUpPosIndex, setCameraClone, setProgress, setCurrentPosIndex]);

  // Handle mobile scroll trigger
  useEffect(() => {
    if (mobileScroll) {
      const event = { deltaY: 400 };
      handleMobileScroll(event);
    }
  }, [mobileScroll, handleMobileScroll]);

  // Handle desktop scroll
  useEffect(() => {
    if (!domElement) return;
    
    let progress = 0;
    const handleScroll = (event) => {
      setScrollStarted(true);
      setCloseUp(false);
      setCloseUpPosIndex(9);
      
      const steps = currentPosIndex >= 1 && currentPosIndex <= 3 ? 3 : 2;
      progress += scrollConstants.desktop / 2;
      
      const currentPos = new Vector3(...positions[currentPosIndex]);
      const nextPos = new Vector3(...positions[(currentPosIndex + 1) % positions.length]);
      const newPos = new Vector3().lerpVectors(
        currentPos,
        nextPos,
        Math.max(0, Math.min(1, progress / steps))
      );
      
      camera.position.copy(newPos);
      
      if (progress >= steps) {
        progress = 0;
        setCameraClone(false);
        setCurrentPosIndex((currentPosIndex + 1) % positions.length);
      }
    };

    domElement.addEventListener("wheel", handleScroll);
    return () => {
      domElement.removeEventListener("wheel", handleScroll);
    };
  }, [camera, domElement, currentPosIndex, positions, setScrollStarted, setCloseUp, setCloseUpPosIndex, setCameraClone, setCurrentPosIndex]);

  return { handleMobileScroll };
};