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
import { useSceneInteractionStore, useUserInterfaceStore, useThreeJSSceneStore } from 'stores';
import { THEME_COLOR_CONFIGURATION_MAP } from 'constants/themeConfiguration';
import { GLTF_MODEL_FILE_PATH } from 'constants/meshConfiguration';
import handGif from './assets/hand.gif';
import volumeUp from './assets/volume_up.svg';
import mute from './assets/volume_mute.svg';
import arrowIcon from './assets/arrow.svg';
import { cn } from 'utils/classNameUtils';

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
 * App content component
 */
const AppContent: React.FC = () => {
  // Scene interaction store - selective subscriptions
  const mobileScrollTriggerCount = useSceneInteractionStore(state => state.mobileScrollTriggerCount);
  const setMobileScrollTriggerCount = useSceneInteractionStore(state => state.setMobileScrollTriggerCount);

  // User interface store - selective subscriptions
  const selectedThemeConfiguration = useUserInterfaceStore(state => state.selectedThemeConfiguration);
  const titleTextColorHue = useUserInterfaceStore(state => state.titleTextColorHue);
  const isAudioCurrentlyMuted = useUserInterfaceStore(state => state.isAudioCurrentlyMuted);
  const setCurrentWindowWidth = useUserInterfaceStore(state => state.setCurrentWindowWidth);
  const setIsAudioCurrentlyMuted = useUserInterfaceStore(state => state.setIsAudioCurrentlyMuted);
  const setTitleTextColorHue = useUserInterfaceStore(state => state.setTitleTextColorHue);

  // Three.js scene store - selective subscription
  const htmlVideoPlayerElement = useThreeJSSceneStore(state => state.htmlVideoPlayerElement);

  const navigationButtonRef = useRef<HTMLButtonElement>(null);
  const muteButtonRef = useRef<HTMLButtonElement>(null);

  // Update theme colors when theme changes
  useEffect(() => {
    if (selectedThemeConfiguration !== null && navigationButtonRef.current && muteButtonRef.current) {
      const vibeId = selectedThemeConfiguration.id;
      const vibeColors = THEME_COLOR_CONFIGURATION_MAP[vibeId] || THEME_COLOR_CONFIGURATION_MAP['default'];
      setTitleTextColorHue(vibeColors.title);

      [navigationButtonRef.current, muteButtonRef.current].forEach(button => {
        button.style.setProperty('--active-color', vibeColors.active);
        button.style.setProperty('--rest-color', vibeColors.rest);
      });
    }
  }, [selectedThemeConfiguration, setTitleTextColorHue]);

  // Handle window resize
  useEffect(() => {
    const handleResize = (): void => {
      setCurrentWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setCurrentWindowWidth]);

  // Handle mute toggle
  const handleMuteToggle = useCallback((): void => {
    if (htmlVideoPlayerElement) {
      if (htmlVideoPlayerElement.isMuted()) {
        htmlVideoPlayerElement.unMute();
        setIsAudioCurrentlyMuted(false);
      } else {
        htmlVideoPlayerElement.mute();
        setIsAudioCurrentlyMuted(true);
      }
    }
  }, [htmlVideoPlayerElement, setIsAudioCurrentlyMuted]);

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
        <TitleEffect text="Click to engage with dynamic 3D objects" startColorHue={titleTextColorHue} />
        <p style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.1rem', lineHeight: '1.5' }}>
          <br />
          lights, joystick, phone displays, signposts,<br />
          control panels, text and antenna surfaces.
        </p>
      </div>
    </>
  ), [loadingProgress, titleTextColorHue]);

  // Handle mobile navigation
  const handleNavigationClick = useCallback((): void => {
    setMobileScrollTriggerCount((mobileScrollTriggerCount || 0) + 1);
  }, [setMobileScrollTriggerCount, mobileScrollTriggerCount]);

  // Memoized button styles
  const navigationButtonStyle = useMemo((): React.CSSProperties => ({
    opacity: loadingProgress < 100 ? 0 : 1,
    backgroundImage: `url(${arrowIcon})`,
  }), [loadingProgress]);

  const muteButtonStyle = useMemo((): React.CSSProperties => ({
    opacity: loadingProgress < 100 ? 0 : 1,
    backgroundImage: `url(${isAudioCurrentlyMuted ? mute : volumeUp})`,
  }), [loadingProgress, isAudioCurrentlyMuted]);

  return (
    <>
      <link rel="manifest" href="/manifest.json" />
      {selectedThemeConfiguration != null ? (
        <Suspense fallback={<LoadingScreen />}>
          <div className={cn('relative h-full')}>
            <Canvas>
              <AudioController />
              <SceneModel />
              <CameraController />
              <SceneEnvironment />
            </Canvas>
            <button
              className={cn(
                'w-12 h-12 rounded-full',
                'absolute bottom-0 left-0',
                'ml-5 mb-5',
                'border-0 p-0',
                'bg-rest-color',
                'bg-no-repeat bg-center',
                'bg-[length:75%]',
                'z-10',
                'active:scale-95 active:bg-active-color',
                'transition-transform duration-200'
              )}
              ref={navigationButtonRef}
              style={navigationButtonStyle}
              onMouseDown={handleNavigationClick}
              onTouchStart={handleNavigationClick}
            />
            <button
              className={cn(
                'w-10 h-10 rounded-full',
                'absolute top-0 right-0',
                'mt-5 mr-5',
                'border-0 p-0',
                'cursor-pointer',
                'bg-no-repeat bg-center',
                'bg-[length:75%]',
                'z-10',
                'transition-transform duration-200',
                'active:scale-95',
                isAudioCurrentlyMuted ? 'bg-rest-color' : 'bg-active-color'
              )}
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
 * Root App component
 */
export default function App(): React.ReactElement {
  return <AppContent />;
}
