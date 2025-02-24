/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
// Inspired by https://jesse-zhou.com/
import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "./components/Environment";
import { useProgress } from "@react-three/drei";
import Model from "./components/Model";
import { CameraControls } from "./components/CameraControls";
import { Animations } from "./components/Animations";
import { Sounds } from "./components/Sounds";
import { LaunchScreen } from "./components/LaunchScreen";
import handGif from "./assets/hand.gif";
import volumeUp from "./assets/volume_up.svg";
import mute from "./assets/volume_mute.svg";

function TitleEffect({ text, startColorHue}) {
  const totalLetters = text.length;
  console.log(startColorHue);
  const title = (
    <h1 className="main__title"
    style={{ 
      "--total-letters": totalLetters,
      "--start-color-hue": startColorHue, 
      "--end-color-hue": startColorHue < 100 ? startColorHue + 30 : startColorHue + 50
    }}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="main__title-letter"
          style={{ "--main__title-letter": index + 1  }}
        >
          {char}
        </span>
      ))}
    </h1>

  );
  console.log(title);
  return title;
}

export default function App() {
  const [clickPoint, setClickPoint] = useState(null);
  const [clickLight, setClickLight] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [closeUp, setCloseUp] = useState(false);
  const [titleColor, setTitleColor] = useState(null);
  const [gltf, setGLTF] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lightIntensity, setLightIntensity] = useState({
    sliderName: "Slider_4",
    intensity: 10,
  });
  const [iframe1, setIframe1] = useState(true);
  const [iframe2, setIframe2] = useState(true);
  const [vibe, setVibe] = useState(null);
  const [scrollStarted, setScrollStarted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileScroll, setMobileScroll] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [graphics, setGraphics] = useState(false);
  const navigateButtonRef = useRef(null);
  const muteButtonRef = useRef(null);

  useEffect(() => {
    if (vibe !== null && navigateButtonRef.current && muteButtonRef.current) {
      const colorMap = {
        0: { active: "#E96929", rest: "#B68672", title: 20},
        1: { active: "#80C080", rest: "#869582", title: 120 },
        2: { active: "#EF5555", rest: "#f38484", title: 0 },
        3: { active: "#9FA8DA", rest: "#8F909D", title: 235 },
        default: { active: "#B68672", rest: "#E96929" },
      };

      const colors = colorMap[vibe] || colorMap["default"];
      setTitleColor(colors.title);

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
  }, []);

  const handleMute = () => {
    console.log("muted");
    if (player && player.isMuted() === false) {
      player.mute();
      setIsMuted(true);
    }
    if (player && player.isMuted() === true) {
      player.unMute();
      setIsMuted(false);
    }
  };

  const { progress } = useProgress();

  function Loader() {
    return (
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
    );
  }

  const handleStart = () => {
    setMobileScroll((prevCount) => prevCount + 1);
  };

  return (
    <>
    <link rel="manifest" href="/manifest.json"></link>
      {vibe != null ? (
        <Suspense fallback={<Loader />}>
          
          <div className="button-container">
            <Canvas>
              <Sounds
                vibe={vibe}
                clickLight={clickLight}
                clickCount={clickCount}
                clickPoint={clickPoint}
              />
              <Model
                graphics={graphics}
                setClickPoint={setClickPoint}
                setClickLight={setClickLight}
                setClickCount={setClickCount}
                setGLTF={setGLTF}
                setIsDragging={setIsDragging}
                closeUp={closeUp}
              />
              <CameraControls
                mobileScroll={mobileScroll}
                windowWidth={windowWidth}
                setScrollStarted={setScrollStarted}
                clickPoint={clickPoint}
                setClickPoint={setClickPoint}
                setCloseUp={setCloseUp}
                isDragging={isDragging}
                setIframe1={setIframe1}
                setIframe2={setIframe2}
                closeUp={closeUp}
              />
              <Environment
                vibe={vibe}
                clickLight={clickLight}
                lightIntensity={lightIntensity}
                clickCount={clickCount}
              />
              <Animations
                graphics={graphics}
                setPlayer={setPlayer}
                windowWidth={windowWidth}
                scrollStarted={scrollStarted}
                vibe={vibe}
                gltf={gltf}
                setIsDragging={setIsDragging}
                setLightIntensity={setLightIntensity}
                clickPoint={clickPoint}
                iframe1={iframe1}
                iframe2={iframe2}
                closeUp={closeUp}
              />
            </Canvas>
            <button
              className="navigate"
              ref={navigateButtonRef}
              style={{
                opacity: progress < 100 ? 0 : 1,
                marginLeft: 20,
                marginBottom: 20,
              }}
              onMouseDown={handleStart}
              onTouchStart={handleStart}
            />
            <button
              className="mute"
              ref={muteButtonRef}
              style={{
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
              }}
              onClick={handleMute}
            />
          </div>
        </Suspense>
      ) : (
        <LaunchScreen
          windowWidth={windowWidth}
          setVibe={setVibe}
          graphics={graphics}
          setGraphics={setGraphics}
          fullscreen
        />
      )}
    </>
  );
}
