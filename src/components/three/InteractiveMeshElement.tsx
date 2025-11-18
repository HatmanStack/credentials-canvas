/**
 * Interactive Mesh Element Component
 *
 * Wrapper component for clickable 3D meshes that handles interactions
 * like opening URLs, triggering light changes, and camera close-ups.
 */

import React from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useInteraction } from 'contexts';
import { MESH_NAME_TO_URL_MAPPING, INTERACTIVE_PHONE_URL_CONFIGURATIONS } from 'constants/urlConfiguration';
import { INTERACTIVE_LIGHT_MESH_NAMES, CLOSE_UP_CLICK_THRESHOLD_COUNT } from 'constants/meshConfiguration';

/**
 * Props for InteractiveMeshElement component
 */
export interface InteractiveMeshElementProps {
  children: React.ReactNode;
  meshRef?: React.RefObject<THREE.Mesh>;
  [key: string]: any;
}

/**
 * Interactive mesh element component for handling 3D object clicks
 */
export const InteractiveMeshElement: React.FC<InteractiveMeshElementProps> = ({
  children,
  meshRef,
  ...props
}) => {
  const { isCloseUpView, setClickPoint, setClickLight, setClickCount } = useInteraction();

  const handleClick = (event: ThreeEvent<MouseEvent>): void => {
    const signName = event.object.name;

    // Direct URL links (external sites)
    if (MESH_NAME_TO_URL_MAPPING[signName]) {
      setClickCount((prevCount: number) => prevCount + 1);
      window.open(MESH_NAME_TO_URL_MAPPING[signName], '_blank');
      return;
    }

    // Light controls
    if (INTERACTIVE_LIGHT_MESH_NAMES.includes(signName)) {
      setClickLight(signName);
      setClickCount((prevCount: number) => prevCount + 1);
      return;
    }

    // Phone/interactive elements with camera positioning
    for (const phoneUrl of INTERACTIVE_PHONE_URL_CONFIGURATIONS) {
      if (phoneUrl.signName.includes(signName)) {
        setClickPoint(signName);

        if (isCloseUpView) {
          // Handle multiple clicks in close-up mode
          const currentCount = (meshRef?.current?.userData?.clickCount as number) || 0;
          const newCount = currentCount + 1;

          if (meshRef?.current) {
            meshRef.current.userData.clickCount = newCount;
          }

          if (newCount >= CLOSE_UP_CLICK_THRESHOLD_COUNT && phoneUrl.url) {
            window.open(phoneUrl.url, '_blank');
          }
        }
        break;
      }
    }
  };

  return (
    <mesh ref={meshRef} onClick={handleClick} {...props}>
      {children}
    </mesh>
  );
};
