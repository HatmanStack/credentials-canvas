import React, { useEffect, useRef, useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useUserInterfaceStore, useThreeJSSceneStore } from '@/stores';
import { THEME_IFRAME_URL_CONFIGURATIONS } from '@/constants/animationConfiguration';
import type { YouTubePlayer } from '@/types/youtubeTypes';

interface YouTubeMusicPlayerProps {
  sceneNode: THREE.Object3D;
}

export const YouTubeMusicPlayer: React.FC<YouTubeMusicPlayerProps> = React.memo(
  ({ sceneNode }) => {
    const selectedThemeConfiguration = useUserInterfaceStore(
      state => state.selectedThemeConfiguration
    );
    const shouldShowMusicIframe = useUserInterfaceStore(
      state => state.shouldShowMusicIframe
    );
    const setHTMLVideoPlayerElement = useThreeJSSceneStore(
      state => state.setHTMLVideoPlayerElement
    );

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const playerInstanceRef = useRef<YouTubePlayer | null>(null);

    const selectedVibeIndex = selectedThemeConfiguration
      ? parseInt(selectedThemeConfiguration.id, 10)
      : 0;
    const currentIframeConfig =
      THEME_IFRAME_URL_CONFIGURATIONS[selectedVibeIndex] ||
      THEME_IFRAME_URL_CONFIGURATIONS[0];

    const iframeStyle = useMemo(() => ({
      display: shouldShowMusicIframe ? 'block' as const : 'none' as const,
    }), [shouldShowMusicIframe]);

    useEffect(() => {
      // Skip injection if YouTube API is already loaded or script tag exists
      const existingScript = document.querySelector(
        'script[src*="youtube.com/iframe_api"]'
      );
      if (window.YT || existingScript) {
        if (window.YT && iframeRef.current) {
          // Destroy existing player before creating a new one
          if (playerInstanceRef.current) {
            try {
              playerInstanceRef.current.destroy?.();
            } catch {
              // Player may already be destroyed
            }
            playerInstanceRef.current = null;
            setHTMLVideoPlayerElement(null);
          }
          const player = new window.YT.Player(iframeRef.current, {
            videoId: currentIframeConfig.srcID,
          });
          playerInstanceRef.current = player;
          setHTMLVideoPlayerElement(player);
        }
        // Cleanup for early-return path: destroy player on unmount
        return () => {
          if (playerInstanceRef.current) {
            try {
              playerInstanceRef.current.destroy?.();
            } catch {
              // Player may already be destroyed
            }
            playerInstanceRef.current = null;
            setHTMLVideoPlayerElement(null);
          }
        };
      }

      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';

      const originalCallback = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        if (typeof originalCallback === 'function') {
          originalCallback();
        }

        if (iframeRef.current && window.YT) {
          const player = new window.YT.Player(iframeRef.current, {
            videoId: currentIframeConfig.srcID,
          });
          playerInstanceRef.current = player;
          setHTMLVideoPlayerElement(player);
        }
      };

      document.body.appendChild(script);

      return () => {
        if (playerInstanceRef.current) {
          try {
            playerInstanceRef.current.destroy?.();
          } catch {
            // Player may already be destroyed
          }
          playerInstanceRef.current = null;
          setHTMLVideoPlayerElement(null);
        }

        if (typeof originalCallback === 'function') {
          window.onYouTubeIframeAPIReady = originalCallback;
        }

        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }, [currentIframeConfig.srcID, setHTMLVideoPlayerElement]);

    return (
      /* eslint-disable-next-line react/no-unknown-property */
      <primitive key="music_screen" object={sceneNode} rotation-y={0.3}>
        <Html
          className="musicwrapper"
          position={[-0.9, -0.145, -0.65]}
          transform
          distanceFactor={1.5}
        >
          <div className="music">
            <iframe
              ref={iframeRef}
              id="player"
              src={currentIframeConfig.iframe2}
              allow="autoplay"
              title="Music Player"
              style={iframeStyle}
            />
          </div>
        </Html>
      </primitive>
    );
  }
);
