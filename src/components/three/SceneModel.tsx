/**
 * Scene Model Component
 *
 * Loads and displays the main GLTF 3D model with DRACO compression.
 * Handles video texture application and mesh click interactions.
 */

import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useGLTF } from '@react-three/drei';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { useSceneInteractionStore, useThreeJSSceneStore } from 'stores';
import { MESH_NAME_TO_URL_MAPPING, INTERACTIVE_PHONE_URL_CONFIGURATIONS } from 'constants/urlConfiguration';
import {
  INTERACTIVE_LIGHT_MESH_NAMES,
  PHONE_VIDEO_CONFIGURATIONS,
  CLOSE_UP_CLICK_THRESHOLD_COUNT,
  GLTF_MODEL_FILE_PATH
} from 'constants/meshConfiguration';

// Configure DRACO loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: 'js' });
dracoLoader.setDecoderPath(process.env.PUBLIC_URL + '/draco/javascript/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Custom hook to load GLTF with DRACO compression
 */
function useGLTFLoaderWithDRACO(path: string) {
  const gltf = useGLTF(path, gltfLoader as any);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (gltf) {
        gltf.scenes?.forEach(scene => scene.traverse(object => {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            const material = mesh.material as THREE.MeshStandardMaterial;
            if (material.map) material.map.dispose();
            if (material.normalMap) material.normalMap.dispose();
            if (material.roughnessMap) material.roughnessMap.dispose();
            if (material.metalnessMap) material.metalnessMap.dispose();
            material.dispose();
          }
        }));
      }
    };
  }, [gltf]);

  return gltf;
}

/**
 * Main scene model component
 */
export const SceneModel: React.FC = React.memo(() => {
  // Scene interaction store - selective subscriptions
  const isCloseUpViewActive = useSceneInteractionStore(state => state.isCloseUpViewActive);
  const setClickedMeshPosition = useSceneInteractionStore(state => state.setClickedMeshPosition);
  const setClickedLightName = useSceneInteractionStore(state => state.setClickedLightName);
  const incrementClickCount = useSceneInteractionStore(state => state.incrementClickCount);

  // Three.js scene store
  const setThreeJSSceneModel = useThreeJSSceneStore(state => state.setThreeJSSceneModel);

  const [clickThroughCount, setClickThroughCount] = useState<number>(0);

  const filePath = GLTF_MODEL_FILE_PATH;
  const gltf = useGLTFLoaderWithDRACO(filePath);

  // Create refs for video elements
  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});

  // Setup video textures when model loads
  useEffect(() => {
    if (gltf) {
      gltf.scene.traverse(node => {
        const mesh = node as THREE.Mesh;

        // Apply video textures to matching meshes
        for (let i = 0; i < PHONE_VIDEO_CONFIGURATIONS.length; i++) {
          const config = PHONE_VIDEO_CONFIGURATIONS[i];

          if (mesh.isMesh && mesh.name === config.name) {
            const video = document.createElement('video');
            video.src = config.video;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.preload = 'auto';

            video.play().catch(() => {
              video.autoplay = false;
            });

            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.wrapS = THREE.RepeatWrapping;
            videoTexture.repeat.x = -1;

            const material = mesh.material as THREE.MeshStandardMaterial;
            material.map = videoTexture;
            material.needsUpdate = true;

            videoRefs.current[config.name] = video;
          }

          // Handle glass transparency for Base mesh
          if (mesh.name === 'Base') {
            const circle = mesh.children.find(
              child => child.name === 'Circle_1'
            ) as THREE.Mesh;

            if (circle) {
              const material = circle.material as THREE.MeshStandardMaterial;
              if (material && material.name === 'Glass1.002') {
                material.transparent = true;
              }
            }
          }
        }
      });

      setThreeJSSceneModel(gltf.scene);
    }

    // Cleanup video elements
    return () => {
      Object.values(videoRefs.current).forEach(video => {
        if (video && !video.paused) {
          video.pause();
        }
      });
    };
  }, [gltf, setThreeJSSceneModel]);

  const handleClick = (event: ThreeEvent<MouseEvent>): void => {
    const signName = event.object.name;

    if (MESH_NAME_TO_URL_MAPPING[signName]) {
      incrementClickCount();
      window.open(MESH_NAME_TO_URL_MAPPING[signName], '_blank');
    } else if (INTERACTIVE_LIGHT_MESH_NAMES.includes(signName)) {
      setClickedLightName(signName);
      incrementClickCount();
    } else {
      for (const phoneUrl of INTERACTIVE_PHONE_URL_CONFIGURATIONS) {
        if (phoneUrl.signName.includes(signName)) {
          setClickedMeshPosition(signName);
          if (isCloseUpViewActive) {
            setClickThroughCount(prevCount => prevCount + 1);
            if (
              clickThroughCount >= CLOSE_UP_CLICK_THRESHOLD_COUNT &&
              !phoneUrl.signName.includes('Music_Control_Box') &&
              !phoneUrl.signName.includes('Cube009_4')
            ) {
              window.open(phoneUrl.url, '_blank');
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
