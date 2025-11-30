/**
 * Three.js-related type definitions
 */

import type * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';

/**
 * Type alias for Three.js Scene
 */
export type ThreeJSSceneModel = THREE.Scene;

/**
 * Type alias for Three.js Vector3 position
 */
export type ThreeJSVector3Position = THREE.Vector3;

/**
 * Camera position as a tuple [x, y, z]
 */
export type CameraPositionTuple = [number, number, number];

/**
 * Three.js mesh click event handler type
 */
export type MeshClickHandler = (event: ThreeEvent<MouseEvent>) => void;

/**
 * Three.js mesh pointer over event handler type
 */
export type MeshPointerOverHandler = (event: ThreeEvent<MouseEvent>) => void;

/**
 * Three.js mesh pointer out event handler type
 */
export type MeshPointerOutHandler = (event: ThreeEvent<MouseEvent>) => void;

/**
 * GLTF model type from drei
 */
export interface GLTFResult {
  scene: THREE.Scene;
  nodes: Record<string, THREE.Object3D>;
  materials: Record<string, THREE.Material>;
}
