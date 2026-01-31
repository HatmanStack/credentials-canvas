import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '@/shaders/vertex.glsl?raw';
import fragmentShader from '@/shaders/fragment.glsl?raw';

interface CustomGeometryParticlesProps {
  count?: number;
}

interface PointsWithMaterial extends THREE.Points {
  material: THREE.ShaderMaterial & {
    uniforms: {
      uTime: { value: number };
      uRadius: { value: number };
    };
  };
}

export const CustomGeometryParticles: React.FC<CustomGeometryParticlesProps> = React.memo(({ count = 1500 }) => {
  const radius = 2;
  const points = useRef<PointsWithMaterial>(null);

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
      uTime: { value: 0.0 },
      uRadius: { value: radius },
    }),
    []
  );

  useFrame(state => {
    const { clock } = state;
    if (points.current?.material?.uniforms?.uTime) {
      points.current.material.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  const shaderMaterialProps = useMemo(() => ({
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
          /* eslint-disable react/no-unknown-property */
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
          /* eslint-enable react/no-unknown-property */
        />
      </bufferGeometry>
      <shaderMaterial {...shaderMaterialProps} />
    </points>
  );
});

export default CustomGeometryParticles;
