import type * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';

export type ThreeJSSceneModel = THREE.Scene;

export type ThreeJSVector3Position = THREE.Vector3;

export type CameraPositionTuple = [number, number, number];

export type MeshClickHandler = (event: ThreeEvent<MouseEvent>) => void;

export type MeshPointerOverHandler = (event: ThreeEvent<MouseEvent>) => void;

export type MeshPointerOutHandler = (event: ThreeEvent<MouseEvent>) => void;

export interface GLTFResult {
  scene: THREE.Scene;
  nodes: Record<string, THREE.Object3D>;
  materials: Record<string, THREE.Material>;
}
