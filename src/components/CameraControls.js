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
    mobileScroll, clickPoint, setClickPoint, setCloseUp, isDragging, closeUp,
    setScrollStarted
  } = useInteraction();
  const { windowWidth, setIframe1, setIframe2 } = useUI();
  const [closeUpPosIndex, setCloseUpPosIndex] = useState(0);
  const [cameraClone, setCameraClone] = useState(true);
  const [patchCamera, setPatchCamera] = useState(true);
  const [holderprogress, setProgress] = useState(0);
  const [currentPosIndex, setCurrentPosIndex] = useState(0);
  
  // Memoized positions to prevent recreation
  const positions = useMemo(() => [
    cameraClone ? [1, 1, 13] : [10, 1, 13],
    [4, 1, 2],
    [3, 1, 3.75],
    [0, 1, 6.5],
    [-12, 6, 0],
  ], [cameraClone]);

  const {
    camera,
    gl: { domElement },
  } = useThree();
  const controls = useRef();

  // Custom hooks for scroll and animation logic
  const { handleMobileScroll } = useCameraScroll({
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
  });

  const { rotationPoint } = useCameraAnimation({
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
  });

  useFrame(() => {
    if (controls.current) {
      if (patchCamera) {
        camera.position.set(1, 13, 1);
        setPatchCamera(false);
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
