import { useEffect, useRef, useState, useCallback } from "react";
import { Vector3 } from "three";
import { useInteraction } from '../contexts';
import { scrollConstants } from '../data/camera';

export const useCameraScroll = ({
  currentPosIndex: currentCameraIndex,
  setCurrentPosIndex: setCurrentCameraIndex,
  positions: cameraPositions,
  camera,
  domElement,
  setScrollStarted,
  setCloseUp,
  setCloseUpPosIndex: setCloseUpCameraIndex,
  setCameraClone: setUsePrimaryCameraPosition,
  holderprogress: cameraProgress,
  setProgress: setCameraProgress,
  mobileScroll: mobileScrollCount
}) => {
  const currentCameraPosition = useRef(new Vector3());
  const nextCameraPosition = useRef(new Vector3());
  const interpolatedPosition = useRef(new Vector3());
  
  // Local refs for each scroll type
  const mobileIndexRef = useRef(currentCameraIndex);
  const desktopIndexRef = useRef(currentCameraIndex);
  const desktopScrollProgress = useRef(0);
  const mobileScrollProgress = useRef(0);

  // Sync local refs when context currentCameraIndex changes
  useEffect(() => {
    mobileIndexRef.current = currentCameraIndex;
    desktopIndexRef.current = currentCameraIndex;
    desktopScrollProgress.current = 0; // Reset progress when position changes externally
    mobileScrollProgress.current = 0; // Reset mobile progress too
  }, [currentCameraIndex]);

  const handleMobileScroll = useCallback(() => {
    setScrollStarted(true);
    setCloseUp(false);
    setCloseUpCameraIndex(9);
    
    const currentIndex = mobileIndexRef.current;
    const interpolationSteps = currentIndex >= 1 && currentIndex <= 3 ? 3 : 2;
    mobileScrollProgress.current += scrollConstants.mobile / 2;
    
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
      
      // Advance mobile index
      const nextIndex = (currentIndex + 1) % cameraPositions.length;
      mobileIndexRef.current = nextIndex;
      
      // Update context and sync desktop ref
      setCurrentCameraIndex(nextIndex);
    }
  }, [cameraPositions, camera, setScrollStarted, setCloseUp, setCloseUpCameraIndex, setUsePrimaryCameraPosition, setCurrentCameraIndex]);

  // Handle mobile scroll trigger
  useEffect(() => {
    if (mobileScrollCount) {
      const mockScrollEvent = { deltaY: 400 };
      handleMobileScroll(mockScrollEvent);
    }
  }, [mobileScrollCount, handleMobileScroll]);

  // Handle desktop scroll
  useEffect(() => {
    if (!domElement) return;
    
    const handleDesktopScroll = (event) => {
      setScrollStarted(true);
      setCloseUp(false);
      setCloseUpCameraIndex(9);
      
      const currentIndex = desktopIndexRef.current;
      const interpolationSteps = currentIndex >= 1 && currentIndex <= 3 ? 3 : 2;
      desktopScrollProgress.current += scrollConstants.desktop / 2;
      
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
        
        // Advance desktop index
        const nextIndex = (currentIndex + 1) % cameraPositions.length;
        desktopIndexRef.current = nextIndex;
        
        // Update context and sync mobile ref
        setCurrentCameraIndex(nextIndex);
      }
    };

    domElement.addEventListener("wheel", handleDesktopScroll);
    return () => {
      domElement.removeEventListener("wheel", handleDesktopScroll);
    };
  }, [camera, domElement, cameraPositions, setScrollStarted, setCloseUp, setCloseUpCameraIndex, setUsePrimaryCameraPosition, setCurrentCameraIndex]);

  return { handleMobileScroll };
};