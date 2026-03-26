import React, { useRef, useMemo, useCallback } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useUserInterfaceStore, useThreeJSSceneStore } from '@/stores';
import { THEME_IFRAME_URL_CONFIGURATIONS } from '@/constants/animationConfiguration';

const IFRAME_POSITION: [number, number, number] = [-4.055, -2.7, -1.6];

interface ArcadeIframeProps {
  sceneNode: THREE.Object3D;
}

export const ArcadeIframe: React.FC<ArcadeIframeProps> = React.memo(
  ({ sceneNode }) => {
    const currentWindowWidth = useUserInterfaceStore(
      state => state.currentWindowWidth
    );
    const selectedThemeConfiguration = useUserInterfaceStore(
      state => state.selectedThemeConfiguration
    );
    const shouldShowArcadeIframe = useUserInterfaceStore(
      state => state.shouldShowArcadeIframe
    );
    const threeJSSceneModel = useThreeJSSceneStore(
      state => state.threeJSSceneModel
    );

    const iframeRef = useRef<HTMLIFrameElement>(null);

    const iframeClassName = useMemo(
      () => currentWindowWidth < 800 ? 'arcadewrapper-small' : 'arcadewrapper',
      [currentWindowWidth]
    );

    const selectedVibeIndex = selectedThemeConfiguration
      ? parseInt(selectedThemeConfiguration.id, 10)
      : 0;
    const currentIframeConfig =
      THEME_IFRAME_URL_CONFIGURATIONS[selectedVibeIndex] ||
      THEME_IFRAME_URL_CONFIGURATIONS[0];

    const handleIframeLoad = useCallback(() => {
      if (threeJSSceneModel && iframeRef.current) {
        iframeRef.current.classList.add('loaded');
      }
    }, [threeJSSceneModel]);

    return (
      <primitive key="zelda_screen" object={sceneNode}>
        <Html
          className={iframeClassName}
          position={IFRAME_POSITION}
          transform
          distanceFactor={1.16}
        >
          <div className="arcade">
            <iframe
              ref={iframeRef}
              src={currentIframeConfig.iframe1}
              onLoad={handleIframeLoad}
              allow="muted"
              title="Arcade Content"
              style={{ display: shouldShowArcadeIframe ? 'block' : 'none' }}
            />
          </div>
        </Html>
      </primitive>
    );
  }
);
