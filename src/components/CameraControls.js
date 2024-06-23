/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import { useEffect, useRef, useState } from "react";
import { extend, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three";

const rotationPoints = [
  [5.1, 0.1, 2],
  [1.3, 0.4, 3.9],
  [0.1, 0.6, 3.36],
  [-12.1, 5.8, -6.1],
  [0, 0, 0],
];
const closeUpPositions = [
  [0, 0.5, 4.07],
  [-0.6, 0.3, 4.1],
  [5.4, 0.2, 2.34],
  [4.76, 0.2, 1.72],
  [0.5, 0.3, 3.6],
  [4.53, 0.2, 2.7],
  [1.8, 0.9, 3.62],
  [0.93, 0.68, 4.55],
];
const closeUpPositionsSmallScreen = [
  [0, 0.5, 4.07],
  [-0.6, 0.6, 4.1],
  [5.4, 0.5, 2.34],
  [4.76, 0.5, 1.72],
  [0.5, 0.6, 3.6],
  [4.53, 0.5, 2.7],
  [1.8, 0.9, 3.62],
  [0.93, 0.68, 4.55],
];
const closeUpRotations = [
  [-0.2, 0.3, 3.4],
  [-0.6, -1, 4.1],
  [5.4, -1, 2.34],
  [4.76, -1, 1.72],
  [0.5, -1, 3.6],
  [4.53, -0.1, 2.7],
  [1.5, 0.6, 3.62],
  [0.93, 0.53, 3.95],
  [0, 0, 0],
];
const positionMap = {
  Phone_Stocks: 0,
  Phone_Looper_5: 1,
  Phone_Looper_Text: 1,
  Phone_Vocabulary_5: 2,
  Phone_Vocabulary_Text: 2,
  Phone_Movies_5: 3,
  Phone_Movies_Text: 3,
  Phone_Trachtenberg_5: 4,
  Phone_Trachtenberg_Text: 4,
  Phone_Italian_5: 5,
  Phone_Italian_Text: 5,
  Cube009_2: 6,
  Light_Control_Box: 7,
  Music_Control_Box: 7,
};

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

export function CameraControls({
  mobileScroll,
  windowWidth,
  setScrollStarted,
  clickPoint,
  setClickPoint,
  setCloseUp,
  isDragging,
  setIframe1,
  setIframe2,
  closeUp,
}) {
  const [closeUpPosIndex, setCloseUpPosIndex] = useState(0);
  const [rotationPoint, setRotationPoint] = useState(new Vector3());
  const [cameraClone, setCameraClone] = useState(true);
  const [patchCamera, setPatchCamera] = useState(true);
  const [holderprogress, setProgress] = useState(0);
  const positions = [
    cameraClone ? [1, 1, 13] : [10, 1, 13],
    [4, 1, 2],
    [3, 1, 3.75],
    [0, 1, 6.5],
    [-12, 6, 0],
  ];
  const currentPos = useRef(new Vector3());
  const nextPos = useRef(new Vector3());
  const newPos = useRef(new Vector3());

  const {
    camera,
    gl: { domElement },
  } = useThree();
  const [currentPosIndex, setCurrentPosIndex] = useState(0);
  const controls = useRef();

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
        camera.position.y > -0.5 &&
        camera.position.y < 1.5 &&
        camera.position.z > 3.9
      ) {
        if (!cameraClone) {
          setIframe2(true);
        }
      } else {
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
    let newRotationPoint;
    if (closeUp) {
      newRotationPoint = new Vector3(...closeUpRotations[closeUpPosIndex]);
    } else {
      newRotationPoint = new Vector3(...rotationPoints[currentPosIndex]);
    }
    setRotationPoint(newRotationPoint);
  }, [closeUp, closeUpPosIndex, currentPosIndex]);

  useEffect(() => {
    if (mobileScroll) {
      const event = { deltaY: 400 };
      handleMobileScroll(event);
    }
  }, [mobileScroll]);

  const handleMobileScroll = (event) => {
    setScrollStarted(true);
    if (closeUp) {
      setCloseUpPosIndex(8);
    }
    setCloseUp(false);

    const scrollAmount = Math.abs(event.deltaY) * 0.001;
    const newProgress = holderprogress + scrollAmount;
    currentPos.current.set(...positions[currentPosIndex]);
    nextPos.current.set(...positions[(currentPosIndex + 1) % positions.length]);
    const steps = currentPosIndex >= 1 && currentPosIndex <= 3 ? 3 : 2;
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
  };

  useEffect(() => {
    controls.current = new OrbitControls(camera, domElement);
    let progress = 0;
    const handleScroll = (event) => {
      setScrollStarted(true);
      setCloseUp(false);
      setCloseUpPosIndex(8);
      const scrollAmount = Math.abs(event.deltaY) * 0.001;
      progress += scrollAmount;
      const currentPos = new Vector3(...positions[currentPosIndex]);

      const nextPos = new Vector3(
        ...positions[(currentPosIndex + 1) % positions.length]
      );
      const steps = currentPosIndex >= 1 && currentPosIndex <= 3 ? 3 : 2;
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
      controls.current.dispose();
      domElement.removeEventListener("wheel", handleScroll);
    };
  }, [camera, domElement, currentPosIndex]);

  useEffect(() => {
    if (clickPoint) {
      setCloseUp(true);
      const positionIndex = positionMap[clickPoint] || 0;
      setCloseUpPosIndex(positionIndex);
      setClickPoint(null);
    }
  }, [clickPoint]);

  useEffect(() => {
    if (isDragging) {
      controls.current.enabled = false;
    } else {
      controls.current.enabled = true;
    }
  }, [isDragging]);

  useEffect(() => {
    if (closeUpPosIndex !== 8) {
      const position =
        windowWidth > 800
          ? closeUpPositions[closeUpPosIndex]
          : closeUpPositionsSmallScreen[closeUpPosIndex];
      camera.position.copy(new Vector3(...position));
    }
  }, [closeUpPosIndex]);

  const animateCameraPosition = (
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
  };

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
  }, []);
  return null;
}
