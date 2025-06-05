/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { extend, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three";
import { useInteraction, useUI } from "../contexts";
import { useCameraScroll } from '../hooks/useCameraScroll';
import { useCameraAnimation } from '../hooks/useCameraAnimation';

class OrbitControls extends ThreeOrbitControls {
  constructor(...args) {
    super(...args);
    this.currentPosIndex = 0;
  }
  update() {
    super.update();
  }
}

extend({ OrbitControls });

export const CameraControls = React.memo(() => {
  const { 
    mobileScrollCount, clickPoint, setClickPoint, setCloseUp, isDragging, isCloseUpView,
    setScrollStarted, currentCameraIndex, setCurrentPosIndex, cameraProgress, setCameraProgress
  } = useInteraction();
  const { screenWidth, setIframe1, setIframe2 } = useUI();
  const [closeUpCameraIndex, setCloseUpCameraIndex] = useState(0);
  const [usePrimaryCameraPosition, setUsePrimaryCameraPosition] = useState(true);
  const [shouldResetCamera, setShouldResetCamera] = useState(true);
  
  // Memoized positions to prevent recreation
  const cameraPositions = useMemo(() => [
    usePrimaryCameraPosition ? [1, 1, 13] : [10, 1, 13],
    [4, 1, 2],
    [3, 1, 3.75],
    [0, 1, 6.5],
    [-12, 6, 0],
  ], [usePrimaryCameraPosition]);

  const {
    camera,
    gl: { domElement },
  } = useThree();
  const controls = useRef();

  // Custom hooks for scroll and animation logic
  const { handleMobileScroll } = useCameraScroll({
    currentPosIndex: currentCameraIndex,
    setCurrentPosIndex,
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
  });

  const { rotationPoint } = useCameraAnimation({
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
      

      if (
        camera.position.x > 1.78 &&
        camera.position.y > 0 &&
        camera.position.z > 0.25
      ) {
        setIframe1(true);
      } else {
        setIframe1(false);
      }
     
      if (
        camera.position.y > 0 &&
        camera.position.z > 4.3
      ) {
        
          setIframe2(true);
        
      } else {
        setIframe2(false);
      }
      if (
        camera.position.y > 3
      ){
        setIframe2(false);
      }
      if (
        camera.position.y > 1.2 &&
        camera.position.x > -1.5 &&
        camera.position.z < 5.2
      ){
        setIframe2(false);
      }
    }
  });


  useEffect(() => {
    if (isDragging) {
      controls.current.update();
      controls.enabled = !isDragging;
      controls.current.update();
    }
  }, [isDragging]);



  useEffect(() => {
    controls.current = new OrbitControls(camera, domElement);
    return () => {
      if (controls.current) {
        controls.current.dispose();
      }
    };
  }, [camera, domElement]);


  useEffect(() => {
    if (isDragging) {
      controls.current.enabled = false;
    } else {
      controls.current.enabled = true;
    }
  }, [isDragging]);


  return null;
});
