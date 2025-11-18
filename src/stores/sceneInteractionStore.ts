/**
 * Scene Interaction Zustand Store
 *
 * Manages all user interactions with the 3D scene including:
 * - Click interactions (mesh clicks, light clicks)
 * - Scroll behavior and camera positioning
 * - View states (close-up view, dragging)
 * - Mobile navigation
 *
 * Replaces InteractionContext for better performance through selective subscriptions.
 *
 * @example
 * ```typescript
 * // In a component - selective subscription
 * const clickedMeshPosition = useSceneInteractionStore(state => state.clickedMeshPosition);
 * const incrementClickCount = useSceneInteractionStore(state => state.incrementClickCount);
 * ```
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Scene Interaction State Interface
 *
 * Defines all state and actions for scene interactions
 */
export interface SceneInteractionState {
  // Mesh interaction state
  /** Position/identifier of clicked mesh (null if no mesh clicked) */
  clickedMeshPosition: string | null;

  /** Name of clicked light object (null if no light clicked) */
  clickedLightName: string | null;

  /** Total number of clicks in the scene */
  totalClickCount: number;

  // View state
  /** Whether the camera is in close-up view mode */
  isCloseUpViewActive: boolean;

  /** Whether the user is currently dragging */
  isUserCurrentlyDragging: boolean;

  // Scroll state
  /** Whether the user has started scrolling the scene */
  hasUserStartedScrolling: boolean;

  /** Mobile scroll navigation trigger count (null if not triggered) */
  mobileScrollTriggerCount: number | null;

  // Camera state
  /** Current camera position index in the camera path array */
  currentCameraPositionIndex: number;

  /** Camera interpolation progress between positions (0.0 to 1.0) */
  cameraInterpolationProgress: number;

  // Actions - Mesh interactions
  /** Set the position/identifier of the clicked mesh */
  setClickedMeshPosition: (position: string | null) => void;

  /** Set the name of the clicked light */
  setClickedLightName: (name: string | null) => void;

  /** Increment the total click count */
  incrementClickCount: () => void;

  /** Reset the click count to zero */
  resetClickCount: () => void;

  // Actions - View state
  /** Set whether close-up view is active */
  setIsCloseUpViewActive: (isActive: boolean) => void;

  /** Set whether user is currently dragging */
  setIsUserCurrentlyDragging: (isDragging: boolean) => void;

  // Actions - Scroll state
  /** Set whether user has started scrolling */
  setHasUserStartedScrolling: (hasStarted: boolean) => void;

  /** Set the mobile scroll trigger count */
  setMobileScrollTriggerCount: (count: number | null) => void;

  /** Trigger mobile scroll navigation (increments count) */
  triggerMobileScrollNavigation: () => void;

  // Actions - Camera state
  /** Set the current camera position index */
  setCurrentCameraPositionIndex: (index: number) => void;

  /** Set the camera interpolation progress */
  setCameraInterpolationProgress: (progress: number) => void;

  // Reset action
  /** Reset all scene interaction state to defaults */
  resetSceneInteractionState: () => void;
}

/**
 * Scene Interaction Zustand Store
 *
 * Use selective subscriptions to prevent unnecessary re-renders:
 * @example
 * const clickCount = useSceneInteractionStore(state => state.totalClickCount);
 * const incrementClick = useSceneInteractionStore(state => state.incrementClickCount);
 */
export const useSceneInteractionStore = create<SceneInteractionState>()(
  devtools(
    (set, get) => ({
      // Initial state - Mesh interactions
      clickedMeshPosition: null,
      clickedLightName: null,
      totalClickCount: 0,

      // Initial state - View state
      isCloseUpViewActive: false,
      isUserCurrentlyDragging: false,

      // Initial state - Scroll state
      hasUserStartedScrolling: false,
      mobileScrollTriggerCount: null,

      // Initial state - Camera state
      currentCameraPositionIndex: 0,
      cameraInterpolationProgress: 0,

      // Actions - Mesh interactions
      setClickedMeshPosition: (position) =>
        set({ clickedMeshPosition: position }, false, 'setClickedMeshPosition'),

      setClickedLightName: (name) =>
        set({ clickedLightName: name }, false, 'setClickedLightName'),

      incrementClickCount: () =>
        set(
          (state) => ({ totalClickCount: state.totalClickCount + 1 }),
          false,
          'incrementClickCount'
        ),

      resetClickCount: () =>
        set({ totalClickCount: 0 }, false, 'resetClickCount'),

      // Actions - View state
      setIsCloseUpViewActive: (isActive) =>
        set({ isCloseUpViewActive: isActive }, false, 'setIsCloseUpViewActive'),

      setIsUserCurrentlyDragging: (isDragging) =>
        set({ isUserCurrentlyDragging: isDragging }, false, 'setIsUserCurrentlyDragging'),

      // Actions - Scroll state
      setHasUserStartedScrolling: (hasStarted) =>
        set({ hasUserStartedScrolling: hasStarted }, false, 'setHasUserStartedScrolling'),

      setMobileScrollTriggerCount: (count) =>
        set({ mobileScrollTriggerCount: count }, false, 'setMobileScrollTriggerCount'),

      triggerMobileScrollNavigation: () => {
        const currentCount = get().mobileScrollTriggerCount || 0;
        set(
          { mobileScrollTriggerCount: currentCount + 1 },
          false,
          'triggerMobileScrollNavigation'
        );
      },

      // Actions - Camera state
      setCurrentCameraPositionIndex: (index) =>
        set({ currentCameraPositionIndex: index }, false, 'setCurrentCameraPositionIndex'),

      setCameraInterpolationProgress: (progress) =>
        set({ cameraInterpolationProgress: progress }, false, 'setCameraInterpolationProgress'),

      // Reset action
      resetSceneInteractionState: () =>
        set(
          {
            clickedMeshPosition: null,
            clickedLightName: null,
            totalClickCount: 0,
            isCloseUpViewActive: false,
            isUserCurrentlyDragging: false,
            hasUserStartedScrolling: false,
            mobileScrollTriggerCount: null,
            currentCameraPositionIndex: 0,
            cameraInterpolationProgress: 0,
          },
          false,
          'resetSceneInteractionState'
        ),
    }),
    { name: 'SceneInteractionStore' }
  )
);
