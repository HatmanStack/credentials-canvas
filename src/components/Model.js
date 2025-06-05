/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useInteraction, useUI } from "../contexts";
import { urlMap, phoneUrls } from '../data/urls';
import { lightNames, meshNames, videoPaths, closeUpClickThrough, MODEL_PATH } from '../data/meshes';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: "js" });
dracoLoader.setDecoderPath(process.env.PUBLIC_URL + "/draco/javascript/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

function useGLTFLoaderWithDRACO(path) {
  const { scene } = useThree();
  
  // Use the pre-configured loader
  const gltf = useGLTF(path, gltfLoader);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Only dispose of the specific model's resources
      if (gltf) {
        gltf.scenes?.forEach(scene => scene.traverse(object => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            // Dispose of material textures
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

const Model = React.memo(() => {
  const { isCloseUpView, setClickPoint, setClickLight, setClickCount, setIsDragging } = useInteraction();
  const { setGLTF } = useUI();
  const [clickThroughCount, setClickThroughCount] = useState(true);
 
  
  const filePath = MODEL_PATH;
  
  const gltf = useGLTFLoaderWithDRACO(filePath);


  const videoRefs = meshNames.reduce((acc, name) => {
    acc[name] = React.useRef();
    return acc;
  }, {});


  useEffect(() => {
    
    if (gltf) {
      
        
        gltf.scene.traverse((node) => {
          const interactiveNodes = [];
          if (node) {
            for (let i = 0; i < meshNames.length; i++) {
              if (node.isMesh && node.name === meshNames[i]) {
                const video = (videoRefs[meshNames[i]].current =
                  document.createElement("video"));
                video.src = videoPaths[i];
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                video.preload = "auto";
                
                video.play().catch(() => {
                  video.autoplay = false;
                });

                const videoTexture = new THREE.VideoTexture(video);
                videoTexture.wrapS = THREE.RepeatWrapping;
                videoTexture.repeat.x = -1;
                node.material.map = videoTexture;
                node.material.needsUpdate = true;
              }
              if (node.name == "Base") {
                const circle = node.children.find(
                  (child) => child.name === "Circle_1"
                );
                if (circle) {
                  const material = circle.material;
                  if (material && material.name === "Glass1.002") {
                    material.transparent = true;
                  }
                }
              }
            }
          }
        
        });
      
      setGLTF(gltf);
    }
  }, [gltf]);

  const handleClick = (event) => {
    const signName = event.object.name;
    
    if (urlMap[signName]) {
      setClickCount((prevCount) => prevCount + 1);
      window.open(urlMap[signName], "_blank");
    } else if (lightNames.includes(signName)) {
      setClickLight(signName);
      setClickCount((prevCount) => prevCount + 1);
    } else {
      for (const phoneUrl of phoneUrls) {
        if (phoneUrl.signName.includes(signName)) {
          setClickPoint(signName);
          if (isCloseUpView) {
            setClickThroughCount((prevCount) => prevCount + 1);
            if (
              clickThroughCount >= closeUpClickThrough &&
              !phoneUrl.signName.includes("Music_Control_Box") &&
              !phoneUrl.signName.includes("Cube009_4")
            ) {
              window.open(phoneUrl.url, "_blank");
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
        // eslint-disable-next-line react/no-unknown-property
        object={gltf.scene}
      />
    </>
  );
});

export default Model;


