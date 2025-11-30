/**
 * Barrel exports for all Zustand stores
 *
 * Provides centralized access to all store hooks and types.
 * Organized by domain: Scene Interaction, User Interface, and Three.js Scene.
 *
 * See Phase-0.md for rationale on store organization and architecture decisions.
 *
 * @example
 * ```typescript
 * // Import store hooks
 * import { useSceneInteractionStore, useUserInterfaceStore } from 'stores';
 *
 * // Import store types (for testing)
 * import type { SceneInteractionState } from 'stores';
 * ```
 */

// Scene Interaction Store
export {
  useSceneInteractionStore,
  type SceneInteractionState,
} from './sceneInteractionStore';

// User Interface Store
export {
  useUserInterfaceStore,
  type UserInterfaceState,
} from './userInterfaceStore';

// Three.js Scene Store
export {
  useThreeJSSceneStore,
  type ThreeJSSceneState,
} from './threeJSSceneStore';
