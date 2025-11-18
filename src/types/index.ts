/**
 * Barrel exports for all type definitions
 */

// Three.js types
export type {
  ThreeJSSceneModel,
  ThreeJSVector3Position,
  CameraPositionTuple,
  MeshClickHandler,
  MeshPointerOverHandler,
  MeshPointerOutHandler,
  GLTFResult,
} from './threeJSTypes';

// Camera types
export type {
  CameraScrollConfiguration,
  MeshNameToPositionIndexMap,
  CameraAnimationState,
  CameraPositionArray,
  CloseUpCameraPositions,
} from './cameraTypes';

// Component types
export type {
  ThemeIdentifier,
  ThemeName,
  ThemeColorConfiguration,
  ThemeColorConfigurationMap,
  VibeThemeConfiguration,
  LightIntensityConfiguration,
  MeshNameToURLMapping,
  AssetConfiguration,
  BreakpointConfiguration,
} from './componentTypes';

// Store types (for Phase 2)
export type {
  SceneInteractionState,
  UserInterfaceState,
  ThreeJSSceneState,
} from './storeTypes';
