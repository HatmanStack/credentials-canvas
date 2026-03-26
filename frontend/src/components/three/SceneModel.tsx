import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useSceneInteractionStore, useThreeJSSceneStore } from '@/stores';
import { MESH_NAME_TO_URL_MAPPING, INTERACTIVE_PHONE_URL_CONFIGURATIONS } from '@/constants/urlConfiguration';
import {
  INTERACTIVE_LIGHT_MESH_NAMES,
  PHONE_VIDEO_CONFIGURATIONS,
  CLOSE_UP_CLICK_THRESHOLD_COUNT,
  GLTF_MODEL_FILE_PATH
} from '@/constants/meshConfiguration';
import { logger } from '@/utils/logger';

// DRACO decoder path - drei's useGLTF handles loader setup internally
// Using JS decoder for broader browser compatibility
const DRACO_DECODER_PATH = '/draco/javascript/';

function useGLTFLoaderWithDRACO(path: string) {
  // drei's useGLTF accepts a string path to DRACO decoders as second argument
  const gltf = useGLTF(path, DRACO_DECODER_PATH);

  useEffect(() => {
    return () => {
      if (gltf) {
        gltf.scenes?.forEach(scene => scene.traverse(object => {
          if (!(object instanceof THREE.Mesh)) return;
          if (object.geometry) object.geometry.dispose();
          if (object.material instanceof THREE.MeshStandardMaterial) {
            if (object.material.map) object.material.map.dispose();
            if (object.material.normalMap) object.material.normalMap.dispose();
            if (object.material.roughnessMap) object.material.roughnessMap.dispose();
            if (object.material.metalnessMap) object.material.metalnessMap.dispose();
            object.material.dispose();
          }
        }));
      }
    };
  }, [gltf]);

  return gltf;
}

export const SceneModel: React.FC = React.memo(() => {
  const isCloseUpViewActive = useSceneInteractionStore(state => state.isCloseUpViewActive);
  const setClickedMeshPosition = useSceneInteractionStore(state => state.setClickedMeshPosition);
  const setClickedLightName = useSceneInteractionStore(state => state.setClickedLightName);
  const incrementClickCount = useSceneInteractionStore(state => state.incrementClickCount);

  const setThreeJSSceneModel = useThreeJSSceneStore(state => state.setThreeJSSceneModel);

  const [clickThroughCount, setClickThroughCount] = useState<number>(0);

  const filePath = GLTF_MODEL_FILE_PATH;
  const gltf = useGLTFLoaderWithDRACO(filePath);

  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});
  const videoTextureRefs = useRef<Record<string, THREE.VideoTexture>>({});

  useEffect(() => {
    if (gltf) {
      gltf.scene.traverse(node => {
        if (!(node instanceof THREE.Mesh)) return;

        // Videos are eagerly loaded since all 6 phone screens are visible from
        // the initial camera position; lazy-loading would cause visible pop-in
        for (let i = 0; i < PHONE_VIDEO_CONFIGURATIONS.length; i++) {
          const config = PHONE_VIDEO_CONFIGURATIONS[i];

          if (node.name === config.name) {
            const video = document.createElement('video');
            video.src = config.video;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.preload = 'auto';

            video.play().catch((error: Error) => {
              // Autoplay blocked by browser policy - video will remain paused
              // User interaction required to start playback
              logger.warn('Video autoplay blocked', {
                meshName: config.name,
                error: error.message,
              });
            });

            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.wrapS = THREE.RepeatWrapping;
            videoTexture.repeat.x = -1;

            if (node.material instanceof THREE.MeshStandardMaterial) {
              node.material.map = videoTexture;
              node.material.needsUpdate = true;
            }

            videoRefs.current[config.name] = video;
            videoTextureRefs.current[config.name] = videoTexture;
          }

          if (node.name === 'Base') {
            const circle = node.children.find(
              child => child.name === 'Circle_1'
            );

            if (circle instanceof THREE.Mesh
              && circle.material instanceof THREE.MeshStandardMaterial
              && circle.material.name === 'Glass1.002') {
              circle.material.transparent = true;
            }
          }
        }
      });

      setThreeJSSceneModel(gltf.scene);
    }

    const currentVideoRefs = videoRefs.current;
    const currentTextureRefs = videoTextureRefs.current;

    return () => {
      Object.values(currentVideoRefs).forEach(video => {
        if (video && !video.paused) {
          video.pause();
        }
      });
      Object.values(currentTextureRefs).forEach(texture => {
        texture.dispose();
      });
    };
  }, [gltf, setThreeJSSceneModel]);

  const handleClick = (event: ThreeEvent<MouseEvent>): void => {
    const signName = event.object.name;

    const mappedUrl = MESH_NAME_TO_URL_MAPPING[signName];
    if (mappedUrl) {
      incrementClickCount();
      window.open(mappedUrl, '_blank', 'noopener,noreferrer');
    } else if (INTERACTIVE_LIGHT_MESH_NAMES.includes(signName)) {
      setClickedLightName(signName);
      incrementClickCount();
    } else {
      for (const phoneUrl of INTERACTIVE_PHONE_URL_CONFIGURATIONS) {
        if (phoneUrl.signName.includes(signName)) {
          setClickedMeshPosition(signName);
          if (isCloseUpViewActive) {
            const nextCount = clickThroughCount + 1;
            setClickThroughCount(nextCount);
            if (
              nextCount >= CLOSE_UP_CLICK_THRESHOLD_COUNT &&
              !phoneUrl.signName.includes('Music_Control_Box') &&
              !phoneUrl.signName.includes('Cube009_2') &&
              phoneUrl.url
            ) {
              window.open(phoneUrl.url, '_blank', 'noopener,noreferrer');
              setClickThroughCount(0);
            }
          }
          break;
        }
      }
    }
  };

  return (
    <>
      <primitive
        onClick={handleClick}
        object={gltf.scene}
      />
    </>
  );
});

export default SceneModel;
