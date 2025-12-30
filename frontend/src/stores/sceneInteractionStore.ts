import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { SceneInteractionState } from '@/types/storeTypes';

export const useSceneInteractionStore = create<SceneInteractionState>()(
  devtools(
    (set, get) => ({
      clickedMeshPosition: null,
      clickedLightName: null,
      totalClickCount: 0,
      isCloseUpViewActive: false,
      isUserCurrentlyDragging: false,
      hasUserStartedScrolling: false,
      mobileScrollTriggerCount: null,
      currentCameraPositionIndex: 0,
      cameraInterpolationProgress: 0,

      setClickedMeshPosition: position =>
        set({ clickedMeshPosition: position }, false, 'setClickedMeshPosition'),

      setClickedLightName: name =>
        set({ clickedLightName: name }, false, 'setClickedLightName'),

      incrementClickCount: () =>
        set(
          state => ({ totalClickCount: state.totalClickCount + 1 }),
          false,
          'incrementClickCount'
        ),

      resetClickCount: () =>
        set({ totalClickCount: 0 }, false, 'resetClickCount'),

      setIsCloseUpViewActive: isActive =>
        set({ isCloseUpViewActive: isActive }, false, 'setIsCloseUpViewActive'),

      setIsUserCurrentlyDragging: isDragging =>
        set({ isUserCurrentlyDragging: isDragging }, false, 'setIsUserCurrentlyDragging'),

      setHasUserStartedScrolling: hasStarted =>
        set({ hasUserStartedScrolling: hasStarted }, false, 'setHasUserStartedScrolling'),

      setMobileScrollTriggerCount: count =>
        set({ mobileScrollTriggerCount: count }, false, 'setMobileScrollTriggerCount'),

      triggerMobileScrollNavigation: () => {
        const currentCount = get().mobileScrollTriggerCount || 0;
        set(
          { mobileScrollTriggerCount: currentCount + 1 },
          false,
          'triggerMobileScrollNavigation'
        );
      },

      setCurrentCameraPositionIndex: index =>
        set({ currentCameraPositionIndex: index }, false, 'setCurrentCameraPositionIndex'),

      setCameraInterpolationProgress: progress =>
        set({ cameraInterpolationProgress: progress }, false, 'setCameraInterpolationProgress'),

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
