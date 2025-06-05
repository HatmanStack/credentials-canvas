import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { InteractiveElement } from './InteractiveElement';

export const VideoMesh = ({ 
  meshName, 
  videoSrc, 
  geometry, 
  material,
  position,
  rotation,
  scale,
  ...props 
}) => {
  const meshRef = useRef();

  useEffect(() => {
    if (!meshRef.current || !videoSrc) return;

    const video = document.createElement("video");
    video.src = videoSrc;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    
    // Graceful autoplay handling
    video.play().catch(() => {
      video.autoplay = false;
    });

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.wrapS = THREE.RepeatWrapping;
    videoTexture.repeat.x = -1;
    
    // Apply video texture to material
    const meshMaterial = meshRef.current.material;
    if (meshMaterial) {
      meshMaterial.map = videoTexture;
      meshMaterial.needsUpdate = true;
    }

    // Cleanup function
    return () => {
      if (videoTexture) {
        videoTexture.dispose();
      }
      if (video && !video.paused) {
        video.pause();
      }
    };
  }, [videoSrc]);

  return (
    <InteractiveElement
      meshRef={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      name={meshName}
      {...props}
    >
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" />
    </InteractiveElement>
  );
};