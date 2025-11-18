/**
 * Three.js Scene Zustand Store
 *
 * Manages references to Three.js scene objects:
 * - GLTF Scene model (THREE.Group or THREE.Scene)
 * - HTML Video player element for video textures
 *
 * Separated from UI state for better architecture and clear separation of concerns.
 * Allows components to access scene objects without prop drilling.
 *
 * @example
 * ```typescript
 * // In a component - selective subscription
 * const sceneModel = useThreeJSSceneStore(state => state.threeJSSceneModel);
 * const setScene = useThreeJSSceneStore(state => state.setThreeJSSceneModel);
 * ```
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type * as THREE from 'three';
import type { YouTubePlayer } from 'types/youtubeTypes';

/**
 * Three.js Scene State Interface
 *
 * Stores references to Three.js objects that need to be shared across components
 */
export interface ThreeJSSceneState {
  // Three.js object references
  /** The loaded GLTF scene model (THREE.Group or THREE.Scene) */
  threeJSSceneModel: THREE.Group | THREE.Scene | null;

  /** YouTube IFrame player for video control */
  htmlVideoPlayerElement: YouTubePlayer | null;

  // Actions
  /** Set the Three.js scene model reference */
  setThreeJSSceneModel: (scene: THREE.Group | THREE.Scene | null) => void;

  /** Set the YouTube IFrame player reference */
  setHTMLVideoPlayerElement: (player: YouTubePlayer | null) => void;

  // Reset action
  /** Clear all Three.js object references */
  resetThreeJSSceneState: () => void;
}

/**
 * Three.js Scene Zustand Store
 *
 * Store for Three.js object references. These are set once during scene initialization
 * and accessed by various components that need to interact with the 3D scene.
 *
 * @example
 * // Setting scene after GLTF load
 * const setScene = useThreeJSSceneStore(state => state.setThreeJSSceneModel);
 * useGLTF('/model.gltf', (gltf) => {
 *   setScene(gltf.scene);
 * });
 *
 * @example
 * // Accessing scene in another component
 * const scene = useThreeJSSceneStore(state => state.threeJSSceneModel);
 */
export const useThreeJSSceneStore = create<ThreeJSSceneState>()(
  devtools(
    set => ({
      // Initial state
      threeJSSceneModel: null,
      htmlVideoPlayerElement: null,

      // Actions
      setThreeJSSceneModel: scene =>
        set({ threeJSSceneModel: scene }, false, 'setThreeJSSceneModel'),

      setHTMLVideoPlayerElement: player =>
        set({ htmlVideoPlayerElement: player }, false, 'setHTMLVideoPlayerElement'),

      // Reset action
      resetThreeJSSceneState: () =>
        set(
          {
            threeJSSceneModel: null,
            htmlVideoPlayerElement: null,
          },
          false,
          'resetThreeJSSceneState'
        ),
    }),
    { name: 'ThreeJSSceneStore' }
  )
);
