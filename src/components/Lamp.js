/* eslint-disable react/no-unknown-property */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React from "react";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

import * as THREE from "three";

import vertexShader from "!!raw-loader!../shaders/vertex.glsl";
import fragmentShader from "!!raw-loader!../shaders/fragment.glsl";

export const CustomGeometryParticles = React.memo(({ count = 1500 }) => {
  const radius = 2;

  // This reference gives us direct access to our points
  const points = useRef();

  // Generate our positions attributes array - reduced from 3000 to 1500 for better performance
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const distance = Math.sqrt(Math.random()) * radius;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      const x = distance * Math.sin(theta) * Math.cos(phi);
      const y = distance * Math.sin(theta) * Math.sin(phi);
      const z = distance * Math.cos(theta);

      positions.set([x, y, z], i * 3);
    }

    return positions;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
      uRadius: {
        value: radius,
      },
    }),
    [radius]
  );

  useFrame((state) => {
    const { clock } = state;
    if (points.current?.material?.uniforms?.uTime) {
      points.current.material.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  const shaderMaterial = useMemo(() => ({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fragmentShader,
    vertexShader,
    uniforms,
  }), [uniforms]);

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial {...shaderMaterial} />
    </points>
  );
});

export default CustomGeometryParticles;
