/**
 * Camera-related type definitions
 */

import type { CameraPositionTuple } from './threeJSTypes';

/**
 * Camera scroll speed configuration for different devices
 */
export interface CameraScrollConfiguration {
  desktop: number;
  mobile: number;
}

/**
 * Mapping of mesh names to camera position indices
 */
export type MeshNameToPositionIndexMap = Record<string, number>;

/**
 * Camera animation state
 */
export interface CameraAnimationState {
  currentCameraPositionIndex: number;
  interpolationProgress: number;
  isAnimating: boolean;
}

/**
 * Camera position array
 */
export type CameraPositionArray = CameraPositionTuple[];

/**
 * Close-up camera positions
 */
export type CloseUpCameraPositions = CameraPositionTuple[];
