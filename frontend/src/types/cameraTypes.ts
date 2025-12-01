import type { CameraPositionTuple } from './threeJSTypes';

export interface CameraScrollConfiguration {
  desktop: number;
  mobile: number;
}

export type MeshNameToPositionIndexMap = Record<string, number>;

export interface CameraAnimationState {
  currentCameraPositionIndex: number;
  interpolationProgress: number;
  isAnimating: boolean;
}

export type CameraPositionArray = CameraPositionTuple[];

export type CloseUpCameraPositions = CameraPositionTuple[];
