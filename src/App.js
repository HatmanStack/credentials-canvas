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

const TitleEffect = React.memo(({ text, startColorHue }) => {
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
    clickPoint, clickLight, clickCount, isCloseUpView, isDragging, hasScrollStarted, mobileScrollCount,
    setMobileScroll
  } = useInteraction();
  
  const {
    selectedVibe, gltfModel, videoPlayer, screenWidth, lightIntensity, titleColorHue, showArcadeIframe, showMusicIframe, isAudioMuted, showHighQualityGraphics,
    setVibe, setWindowWidth, setIsMuted, setTitleColor
  } = useUI();

  const navigationButtonRef = useRef(null);
  const muteButtonRef = useRef(null);


  useEffect(() => {
    if (selectedVibe !== null && navigationButtonRef.current && muteButtonRef.current) {
      const vibeColors = colorMap[selectedVibe] || colorMap["default"];
      setTitleColor(vibeColors.title);
      
      [navigationButtonRef.current, muteButtonRef.current].forEach((button) => {
        button.style.setProperty("--active-color", vibeColors.active);
        button.style.setProperty("--rest-color", vibeColors.rest);
      });
    }
  }, [selectedVibe, setTitleColor]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setWindowWidth]);

  const handleMuteToggle = useCallback(() => {
    if (videoPlayer) {
      if (videoPlayer.isMuted()) {
        videoPlayer.unMute();
        setIsMuted(false);
      } else {
        videoPlayer.mute();
        setIsMuted(true);
      }
    }
  }, [videoPlayer, setIsMuted]);

  const { progress: loadingProgress } = useProgress();

  const LoadingScreen = useMemo(() => () => (
    <>
      <link rel="manifest" href="/manifest.json" />
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
        <img src={handGif} width="250" alt="Loading animation" />
        {Math.round(loadingProgress)}% loaded<br />
        <br />
        <TitleEffect text="Click to engage with dynamic 3D objects" startColorHue={titleColorHue} />
        <p style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.1rem', lineHeight: '1.5' }}>
          <br />
          lights, joystick, phone displays, signposts,<br />
          control panels, text and antenna surfaces.
        </p>
      </div>
    </>
  ), [loadingProgress, titleColorHue]);

  const handleNavigationClick = useCallback(() => {
    setMobileScroll((mobileScrollCount || 0) + 1);
  }, [setMobileScroll, mobileScrollCount]);

  // Memoized button styles to prevent re-creation
  const navigationButtonStyle = useMemo(() => ({
    opacity: loadingProgress < 100 ? 0 : 1,
    marginLeft: 20,
    marginBottom: 20,
  }), [loadingProgress]);

  const muteButtonStyle = useMemo(() => ({
    opacity: loadingProgress < 100 ? 0 : 1,
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    backgroundImage: `url(${isAudioMuted ? mute : volumeUp})`,
    backgroundColor: isAudioMuted ? 'var(--rest-color)' : 'var(--active-color)',
    marginTop: 20,
    marginRight: 20,
    border: 'none',
    padding: 0
  }), [loadingProgress, isAudioMuted]);

  return (
    <>
      <link rel="manifest" href="/manifest.json" />
      {selectedVibe != null ? (
        <Suspense fallback={<LoadingScreen />}>
          
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
              ref={navigationButtonRef}
              style={navigationButtonStyle}
              onMouseDown={handleNavigationClick}
              onTouchStart={handleNavigationClick}
            />
            <button
              className="mute"
              ref={muteButtonRef}
              style={muteButtonStyle}
              onClick={handleMuteToggle}
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
