import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSceneInteractionStore, useUserInterfaceStore } from '@/stores';

// CameraController uses R3F hooks extensively, so we test its logic through store interactions
// The actual camera behavior is tested in useCameraPositionAnimation and useCameraScrollBehavior tests

vi.mock('@/constants/cameraConfiguration', () => ({
  MAIN_CAMERA_POSITIONS: {
    primary: [1, 1, 13] as [number, number, number],
    alternate: [10, 1, 13] as [number, number, number],
    positions: [
      [4, 1, 2] as [number, number, number],
      [3, 1, 3.75] as [number, number, number],
      [0, 1, 6.5] as [number, number, number],
      [-12, 6, 0] as [number, number, number],
    ],
  },
  IFRAME_VISIBILITY_THRESHOLDS: {
    arcade: { minX: 1.78, minY: 0, minZ: 0.25 },
    music: {
      minY: 0,
      minZ: 4.3,
      maxY: 3,
      hideWhen: { minY: 1.2, minX: -1.5, maxZ: 5.2 },
    },
  },
}));

describe('CameraController logic', () => {
  beforeEach(() => {
    const sceneStore = renderHook(() => useSceneInteractionStore());
    const uiStore = renderHook(() => useUserInterfaceStore());

    act(() => {
      sceneStore.result.current.resetSceneInteractionState();
      uiStore.result.current.resetUserInterfaceState();
    });

    vi.clearAllMocks();
  });

  describe('camera position index', () => {
    it('should initialize at position index 0', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.currentCameraPositionIndex).toBe(0);
    });

    it('should update camera position index', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setCurrentCameraPositionIndex(2);
      });

      expect(result.current.currentCameraPositionIndex).toBe(2);
    });

    it('should cycle through camera positions', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setCurrentCameraPositionIndex(0);
      });

      expect(result.current.currentCameraPositionIndex).toBe(0);

      act(() => {
        result.current.setCurrentCameraPositionIndex(1);
      });

      expect(result.current.currentCameraPositionIndex).toBe(1);

      act(() => {
        result.current.setCurrentCameraPositionIndex(2);
      });

      expect(result.current.currentCameraPositionIndex).toBe(2);
    });
  });

  describe('close-up view state', () => {
    it('should initialize with close-up view inactive', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.isCloseUpViewActive).toBe(false);
    });

    it('should activate close-up view', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setIsCloseUpViewActive(true);
      });

      expect(result.current.isCloseUpViewActive).toBe(true);
    });

    it('should deactivate close-up view', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setIsCloseUpViewActive(true);
      });

      act(() => {
        result.current.setIsCloseUpViewActive(false);
      });

      expect(result.current.isCloseUpViewActive).toBe(false);
    });
  });

  describe('scroll state', () => {
    it('should track scroll started state', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.hasUserStartedScrolling).toBe(false);

      act(() => {
        result.current.setHasUserStartedScrolling(true);
      });

      expect(result.current.hasUserStartedScrolling).toBe(true);
    });

    it('should track mobile scroll trigger count', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.mobileScrollTriggerCount).toBeNull();

      act(() => {
        result.current.setMobileScrollTriggerCount(1);
      });

      expect(result.current.mobileScrollTriggerCount).toBe(1);

      act(() => {
        result.current.triggerMobileScrollNavigation();
      });

      expect(result.current.mobileScrollTriggerCount).toBe(2);
    });
  });

  describe('iframe visibility', () => {
    it('should track arcade iframe visibility', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      expect(result.current.shouldShowArcadeIframe).toBe(true);

      act(() => {
        result.current.setShouldShowArcadeIframe(false);
      });

      expect(result.current.shouldShowArcadeIframe).toBe(false);
    });

    it('should track music iframe visibility', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      expect(result.current.shouldShowMusicIframe).toBe(true);

      act(() => {
        result.current.setShouldShowMusicIframe(false);
      });

      expect(result.current.shouldShowMusicIframe).toBe(false);
    });

    it('should update both iframes independently', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.setShouldShowArcadeIframe(false);
        result.current.setShouldShowMusicIframe(true);
      });

      expect(result.current.shouldShowArcadeIframe).toBe(false);
      expect(result.current.shouldShowMusicIframe).toBe(true);
    });
  });

  describe('dragging state', () => {
    it('should track user dragging state', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.isUserCurrentlyDragging).toBe(false);

      act(() => {
        result.current.setIsUserCurrentlyDragging(true);
      });

      expect(result.current.isUserCurrentlyDragging).toBe(true);

      act(() => {
        result.current.setIsUserCurrentlyDragging(false);
      });

      expect(result.current.isUserCurrentlyDragging).toBe(false);
    });
  });

  describe('mesh click navigation', () => {
    it('should track clicked mesh position for camera navigation', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.clickedMeshPosition).toBeNull();

      act(() => {
        result.current.setClickedMeshPosition('Phone_Stocks_5');
      });

      expect(result.current.clickedMeshPosition).toBe('Phone_Stocks_5');
    });

    it('should clear clicked mesh position', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedMeshPosition('Phone_Test');
      });

      act(() => {
        result.current.setClickedMeshPosition(null);
      });

      expect(result.current.clickedMeshPosition).toBeNull();
    });
  });

  describe('window width tracking', () => {
    it('should track current window width', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      // Default should be window width or 1920
      expect(result.current.currentWindowWidth).toBeGreaterThan(0);

      act(() => {
        result.current.setCurrentWindowWidth(800);
      });

      expect(result.current.currentWindowWidth).toBe(800);
    });

    it('should update for mobile width', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.setCurrentWindowWidth(375);
      });

      expect(result.current.currentWindowWidth).toBe(375);
    });

    it('should update for desktop width', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.setCurrentWindowWidth(1920);
      });

      expect(result.current.currentWindowWidth).toBe(1920);
    });
  });

  describe('state reset', () => {
    it('should reset all camera-related state', () => {
      const { result: sceneResult } = renderHook(() => useSceneInteractionStore());
      const { result: uiResult } = renderHook(() => useUserInterfaceStore());

      act(() => {
        sceneResult.current.setCurrentCameraPositionIndex(3);
        sceneResult.current.setIsCloseUpViewActive(true);
        sceneResult.current.setHasUserStartedScrolling(true);
        sceneResult.current.setMobileScrollTriggerCount(5);
        sceneResult.current.setClickedMeshPosition('Phone_Test');
        uiResult.current.setShouldShowArcadeIframe(false);
        uiResult.current.setShouldShowMusicIframe(false);
      });

      act(() => {
        sceneResult.current.resetSceneInteractionState();
        uiResult.current.resetUserInterfaceState();
      });

      expect(sceneResult.current.currentCameraPositionIndex).toBe(0);
      expect(sceneResult.current.isCloseUpViewActive).toBe(false);
      expect(sceneResult.current.hasUserStartedScrolling).toBe(false);
      expect(sceneResult.current.mobileScrollTriggerCount).toBeNull();
      expect(sceneResult.current.clickedMeshPosition).toBeNull();
      expect(uiResult.current.shouldShowArcadeIframe).toBe(true);
      expect(uiResult.current.shouldShowMusicIframe).toBe(true);
    });
  });
});
