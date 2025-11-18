/**
 * Root App Component
 *
 * Main application component that coordinates all sub-components and manages
 * the application state through context providers.
 *
 * Inspired by https://jesse-zhou.com/
 */

import React, { Suspense, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress, useGLTF } from '@react-three/drei';
import { SceneEnvironment } from 'components/three/SceneEnvironment';
import { SceneModel } from 'components/three/SceneModel';
import { CameraController } from 'components/controls/CameraController';
import { AudioController } from 'components/controls/AudioController';
import { LaunchScreen } from 'components/ui/LaunchScreen';
import { InteractionProvider, UIProvider, useInteraction, useUI } from 'contexts';
import { THEME_COLOR_CONFIGURATION_MAP } from 'constants/themeConfiguration';
import { GLTF_MODEL_FILE_PATH } from 'constants/meshConfiguration';
import handGif from './assets/hand.gif';
import volumeUp from './assets/volume_up.svg';
import mute from './assets/volume_mute.svg';

// Preload GLTF model
useGLTF.preload(GLTF_MODEL_FILE_PATH);

/**
 * Props for TitleEffect component
 */
interface TitleEffectProps {
  text: string;
  startColorHue: number | null;
}

/**
 * Animated title component with gradient effect
 */
const TitleEffect: React.FC<TitleEffectProps> = React.memo(({ text, startColorHue }) => {
  const totalLetters = text.length;
  const hue = startColorHue || 0;

  const titleStyle = useMemo(() => ({
    '--total-letters': totalLetters,
    '--start-color-hue': hue,
    '--end-color-hue': hue < 100 ? hue + 30 : hue + 50
  } as React.CSSProperties), [totalLetters, hue]);

  const letters = useMemo(() =>
    text.split('').map((char, index) => (
      <span
        key={index}
        className="main__title-letter"
        style={{ '--main__title-letter': index + 1 } as React.CSSProperties}
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

/**
 * App content component (requires context providers)
 */
const AppContent: React.FC = () => {
  const { setMobileScroll, mobileScrollCount } = useInteraction();
  const {
    selectedVibe, videoPlayer, titleColorHue, isAudioMuted,
    setWindowWidth, setIsMuted, setTitleColor
  } = useUI();

  const navigationButtonRef = useRef<HTMLButtonElement>(null);
  const muteButtonRef = useRef<HTMLButtonElement>(null);

  // Update theme colors when vibe changes
  useEffect(() => {
    if (selectedVibe !== null && navigationButtonRef.current && muteButtonRef.current) {
      const vibeId = selectedVibe.id;
      const vibeColors = THEME_COLOR_CONFIGURATION_MAP[vibeId] || THEME_COLOR_CONFIGURATION_MAP['default'];
      setTitleColor(vibeColors.title);

      [navigationButtonRef.current, muteButtonRef.current].forEach((button) => {
        button.style.setProperty('--active-color', vibeColors.active);
        button.style.setProperty('--rest-color', vibeColors.rest);
      });
    }
  }, [selectedVibe, setTitleColor]);

  // Handle window resize
  useEffect(() => {
    const handleResize = (): void => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setWindowWidth]);

  // Handle mute toggle
  const handleMuteToggle = useCallback((): void => {
    if (videoPlayer) {
      if ((videoPlayer as any).isMuted()) {
        (videoPlayer as any).unMute();
        setIsMuted(false);
      } else {
        (videoPlayer as any).mute();
        setIsMuted(true);
      }
    }
  }, [videoPlayer, setIsMuted]);

  const { progress: loadingProgress } = useProgress();

  // Loading screen component
  const LoadingScreen = useMemo(() => () => (
    <>
      <link rel="manifest" href="/manifest.json" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          background: '#171519',
          margin: '10rem',
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

  // Handle mobile navigation
  const handleNavigationClick = useCallback((): void => {
    setMobileScroll((mobileScrollCount || 0) + 1);
  }, [setMobileScroll, mobileScrollCount]);

  // Memoized button styles
  const navigationButtonStyle = useMemo((): React.CSSProperties => ({
    opacity: loadingProgress < 100 ? 0 : 1,
    marginLeft: 20,
    marginBottom: 20,
  }), [loadingProgress]);

  const muteButtonStyle = useMemo((): React.CSSProperties => ({
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
              <AudioController />
              <SceneModel />
              <CameraController />
              <SceneEnvironment />
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

/**
 * Root App component with context providers
 */
export default function App(): React.ReactElement {
  return (
    <InteractionProvider>
      <UIProvider>
        <AppContent />
      </UIProvider>
    </InteractionProvider>
  );
}
