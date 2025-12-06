import React from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useSceneInteractionStore } from '@/stores';
import { MESH_NAME_TO_URL_MAPPING, INTERACTIVE_PHONE_URL_CONFIGURATIONS } from '@/constants/urlConfiguration';
import { INTERACTIVE_LIGHT_MESH_NAMES, CLOSE_UP_CLICK_THRESHOLD_COUNT } from '@/constants/meshConfiguration';

export interface InteractiveMeshElementProps {
  children: React.ReactNode;
  meshRef?: React.RefObject<THREE.Mesh>;
  // R3F mesh props are extensive and version-dependent; index signature avoids
  // tight coupling to @react-three/fiber internals while preserving prop spreading
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const InteractiveMeshElement: React.FC<InteractiveMeshElementProps> = ({
  children,
  meshRef,
  ...props
}) => {
  const isCloseUpViewActive = useSceneInteractionStore(state => state.isCloseUpViewActive);
  const setClickedMeshPosition = useSceneInteractionStore(state => state.setClickedMeshPosition);
  const setClickedLightName = useSceneInteractionStore(state => state.setClickedLightName);
  const incrementClickCount = useSceneInteractionStore(state => state.incrementClickCount);

  const handleClick = (event: ThreeEvent<MouseEvent>): void => {
    const signName = event.object.name;

    if (MESH_NAME_TO_URL_MAPPING[signName]) {
      incrementClickCount();
      window.open(MESH_NAME_TO_URL_MAPPING[signName], '_blank', 'noopener,noreferrer');
      return;
    }

    if (INTERACTIVE_LIGHT_MESH_NAMES.includes(signName)) {
      setClickedLightName(signName);
      incrementClickCount();
      return;
    }

    for (const phoneUrl of INTERACTIVE_PHONE_URL_CONFIGURATIONS) {
      if (phoneUrl.signName.includes(signName)) {
        setClickedMeshPosition(signName);

        if (isCloseUpViewActive) {
          const currentCount = (meshRef?.current?.userData?.clickCount as number) || 0;
          const newCount = currentCount + 1;

          if (meshRef?.current) {
            meshRef.current.userData.clickCount = newCount;
          }

          if (newCount >= CLOSE_UP_CLICK_THRESHOLD_COUNT && phoneUrl.url) {
            window.open(phoneUrl.url, '_blank', 'noopener,noreferrer');
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
