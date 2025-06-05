/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
// Inspired by https://jesse-zhou.com/
import React, { Suspense, useEffect, useRef, useMemo, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "./components/Environment";
import { useProgress, useGLTF } from "@react-three/drei";
import Model from "./components/Model";
import { CameraControls } from "./components/CameraControls";
import { Animations } from "./components/Animations";
import { Sounds } from "./components/Sounds";
import { LaunchScreen } from "./components/LaunchScreen";
import { InteractionProvider, UIProvider, useInteraction, useUI } from "./contexts";
import handGif from "./assets/hand.gif";
import volumeUp from "./assets/volume_up.svg";
import mute from "./assets/volume_mute.svg";
import { colorMap } from './data';

// Preload GLTF model
useGLTF.preload(process.env.PUBLIC_URL + "compressed_model.glb");

const TitleEffect = React.memo(({ text, startColorHue}) => {
  const totalLetters = text.length;
  
  const titleStyle = useMemo(() => ({
    "--total-letters": totalLetters,
    "--start-color-hue": startColorHue, 
    "--end-color-hue": startColorHue < 100 ? startColorHue + 30 : startColorHue + 50
  }), [totalLetters, startColorHue]);

  const letters = useMemo(() => 
    text.split("").map((char, index) => (
      <span
        key={index}
        className="main__title-letter"
        style={{ "--main__title-letter": index + 1  }}
      >
        {char}
      </span>
    )), [text]
  );

  return (
    <h1 className="main__title" style={titleStyle}>
      {letters}
    </h1>
  );
});

const AppContent = () => {
  // Use contexts instead of local state
  const {
    clickPoint, clickLight, clickCount, closeUp, isDragging, scrollStarted, mobileScroll,
    setMobileScroll
  } = useInteraction();
  
  const {
    vibe, gltf, player, windowWidth, lightIntensity, titleColor, iframe1, iframe2, isMuted, graphics,
    setVibe, setWindowWidth
  } = useUI();

  const navigateButtonRef = useRef(null);
  const muteButtonRef = useRef(null);


  useEffect(() => {
    if (vibe !== null && navigateButtonRef.current && muteButtonRef.current) {
      const colors = colorMap[vibe] || colorMap["default"];
      
      [navigateButtonRef.current, muteButtonRef.current].forEach((button) => {
        button.style.setProperty("--active-color", colors.active);
        button.style.setProperty("--rest-color", colors.rest);
      });
    }
  }, [vibe]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setWindowWidth]);

  const handleMute = useCallback(() => {
    if (player && player.isMuted() === false) {
      player.mute();
    }
    if (player && player.isMuted() === true) {
      player.unMute();
    }
  }, [player]);

  const { progress } = useProgress();

  const Loader = useMemo(() => () => (
    <>
    <link rel="manifest" href="/manifest.json"></link>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          background: "#171519",
          margin: "10rem",
        }}
      >
        <img src={handGif} width="250" />
        {Math.round(progress)} % loaded<br></br>
        <br></br>
        <TitleEffect text="Click to engage with dynamic 3D objects" startColorHue={titleColor} />
        <p style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.1rem', lineHeight: '1.5' }}>
        <br></br>
        lights, joystick, phone displays, signposts,<br></br>
        control panels, text and antenna surfaces.
        </p>
      </div>
    </>
  ), [progress, titleColor]);

  const handleStart = useCallback(() => {
    setMobileScroll(prev => prev + 1);
  }, [setMobileScroll]);

  // Memoized button styles to prevent re-creation
  const navigateButtonStyle = useMemo(() => ({
    opacity: progress < 100 ? 0 : 1,
    marginLeft: 20,
    marginBottom: 20,
  }), [progress]);

  const muteButtonStyle = useMemo(() => ({
    opacity: progress < 100 ? 0 : 1,
    cursor: 'pointer', 
    width: '40px', 
    height: '40px',
    backgroundImage: `url(${isMuted ? mute : volumeUp})`,
    backgroundColor: isMuted ? 'var(--rest-color)' : 'var(--active-color)',
    marginTop: 20,
    marginRight: 20,
    border: 'none', 
    padding: 0
  }), [progress, isMuted]);

  return (
    <>
    <link rel="manifest" href="/manifest.json"></link>
      {vibe != null ? (
        <Suspense fallback={<Loader />}>
          
          <div className="button-container">
            <Canvas>
              <Sounds />
              <Model />
              <CameraControls />
              <Environment />
              <Animations />
            </Canvas>
            <button
              className="navigate"
              ref={navigateButtonRef}
              style={navigateButtonStyle}
              onMouseDown={handleStart}
              onTouchStart={handleStart}
            />
            <button
              className="mute"
              ref={muteButtonRef}
              style={muteButtonStyle}
              onClick={handleMute}
            />
          </div>
        </Suspense>
      ) : (
        <LaunchScreen />
      )}
    </>
  );
};

export default function App() {
  return (
    <InteractionProvider>
      <UIProvider>
        <AppContent />
      </UIProvider>
    </InteractionProvider>
  );
}
