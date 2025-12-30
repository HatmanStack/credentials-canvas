import { renderHook, act } from '@testing-library/react';
import { useSceneInteractionStore } from '@/stores';

describe('sceneInteractionStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useSceneInteractionStore());
    act(() => {
      result.current.resetSceneInteractionState();
    });
  });

  describe('click interactions', () => {
    it('should increment click count when incrementClickCount called', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.totalClickCount).toBe(0);

      act(() => {
        result.current.incrementClickCount();
      });

      expect(result.current.totalClickCount).toBe(1);
    });

    it('should increment click count multiple times', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.incrementClickCount();
        result.current.incrementClickCount();
        result.current.incrementClickCount();
      });

      expect(result.current.totalClickCount).toBe(3);
    });

    it('should set clicked mesh position', () => {
      const { result } = renderHook(() => useSceneInteractionStore());
      const mockPosition = 'mesh-name-123';

      expect(result.current.clickedMeshPosition).toBeNull();

      act(() => {
        result.current.setClickedMeshPosition(mockPosition);
      });

      expect(result.current.clickedMeshPosition).toBe(mockPosition);
    });

    it('should clear clicked mesh position with null', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedMeshPosition('mesh-1');
      });

      expect(result.current.clickedMeshPosition).toBe('mesh-1');

      act(() => {
        result.current.setClickedMeshPosition(null);
      });

      expect(result.current.clickedMeshPosition).toBeNull();
    });

    it('should set clicked light name', () => {
      const { result } = renderHook(() => useSceneInteractionStore());
      const mockLightName = 'PointLight1';

      act(() => {
        result.current.setClickedLightName(mockLightName);
      });

      expect(result.current.clickedLightName).toBe(mockLightName);
    });

    it('should reset click count', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.incrementClickCount();
        result.current.incrementClickCount();
      });

      expect(result.current.totalClickCount).toBe(2);

      act(() => {
        result.current.resetClickCount();
      });

      expect(result.current.totalClickCount).toBe(0);
    });
  });

  describe('camera interactions', () => {
    it('should set current camera position index', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.currentCameraPositionIndex).toBe(0);

      act(() => {
        result.current.setCurrentCameraPositionIndex(3);
      });

      expect(result.current.currentCameraPositionIndex).toBe(3);
    });

    it('should set camera interpolation progress', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.cameraInterpolationProgress).toBe(0);

      act(() => {
        result.current.setCameraInterpolationProgress(0.5);
      });

      expect(result.current.cameraInterpolationProgress).toBe(0.5);
    });

    it('should update camera interpolation progress to 1.0', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setCameraInterpolationProgress(1.0);
      });

      expect(result.current.cameraInterpolationProgress).toBe(1.0);
    });
  });

  describe('scroll interactions', () => {
    it('should set has user started scrolling flag', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.hasUserStartedScrolling).toBe(false);

      act(() => {
        result.current.setHasUserStartedScrolling(true);
      });

      expect(result.current.hasUserStartedScrolling).toBe(true);
    });

    it('should set mobile scroll trigger count', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.mobileScrollTriggerCount).toBeNull();

      act(() => {
        result.current.setMobileScrollTriggerCount(5);
      });

      expect(result.current.mobileScrollTriggerCount).toBe(5);
    });

    it('should trigger mobile scroll navigation from null', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.mobileScrollTriggerCount).toBeNull();

      act(() => {
        result.current.triggerMobileScrollNavigation();
      });

      expect(result.current.mobileScrollTriggerCount).toBe(1);
    });

    it('should increment mobile scroll navigation count', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.triggerMobileScrollNavigation();
        result.current.triggerMobileScrollNavigation();
        result.current.triggerMobileScrollNavigation();
      });

      expect(result.current.mobileScrollTriggerCount).toBe(3);
    });
  });

  describe('view state', () => {
    it('should set close up view active state', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.isCloseUpViewActive).toBe(false);

      act(() => {
        result.current.setIsCloseUpViewActive(true);
      });

      expect(result.current.isCloseUpViewActive).toBe(true);
    });

    it('should toggle close up view state', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setIsCloseUpViewActive(true);
      });

      expect(result.current.isCloseUpViewActive).toBe(true);

      act(() => {
        result.current.setIsCloseUpViewActive(false);
      });

      expect(result.current.isCloseUpViewActive).toBe(false);
    });

    it('should set dragging state', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.isUserCurrentlyDragging).toBe(false);

      act(() => {
        result.current.setIsUserCurrentlyDragging(true);
      });

      expect(result.current.isUserCurrentlyDragging).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      // Set various states
      act(() => {
        result.current.incrementClickCount();
        result.current.setClickedMeshPosition('mesh-1');
        result.current.setClickedLightName('light-1');
        result.current.setCurrentCameraPositionIndex(5);
        result.current.setCameraInterpolationProgress(0.75);
        result.current.setIsCloseUpViewActive(true);
        result.current.setIsUserCurrentlyDragging(true);
        result.current.setHasUserStartedScrolling(true);
        result.current.triggerMobileScrollNavigation();
      });

      // Verify states changed
      expect(result.current.totalClickCount).toBe(1);
      expect(result.current.clickedMeshPosition).toBe('mesh-1');
      expect(result.current.currentCameraPositionIndex).toBe(5);
      expect(result.current.isCloseUpViewActive).toBe(true);

      // Reset
      act(() => {
        result.current.resetSceneInteractionState();
      });

      // Verify all reset
      expect(result.current.totalClickCount).toBe(0);
      expect(result.current.clickedMeshPosition).toBeNull();
      expect(result.current.clickedLightName).toBeNull();
      expect(result.current.currentCameraPositionIndex).toBe(0);
      expect(result.current.cameraInterpolationProgress).toBe(0);
      expect(result.current.isCloseUpViewActive).toBe(false);
      expect(result.current.isUserCurrentlyDragging).toBe(false);
      expect(result.current.hasUserStartedScrolling).toBe(false);
      expect(result.current.mobileScrollTriggerCount).toBeNull();
    });
  });

  describe('state persistence', () => {
    it('should maintain state across multiple reads', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setCurrentCameraPositionIndex(2);
      });

      expect(result.current.currentCameraPositionIndex).toBe(2);
      expect(result.current.currentCameraPositionIndex).toBe(2);
      expect(result.current.currentCameraPositionIndex).toBe(2);
    });

    it('should update state independently', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedMeshPosition('mesh-1');
      });

      expect(result.current.clickedMeshPosition).toBe('mesh-1');
      expect(result.current.clickedLightName).toBeNull();

      act(() => {
        result.current.setClickedLightName('light-1');
      });

      expect(result.current.clickedMeshPosition).toBe('mesh-1');
      expect(result.current.clickedLightName).toBe('light-1');
    });
  });
});
