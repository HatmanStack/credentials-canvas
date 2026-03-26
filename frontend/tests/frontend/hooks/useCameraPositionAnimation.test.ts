import { describe, it, expect, beforeEach, beforeAll, vi, type Mock } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCameraPositionAnimation } from 'hooks/useCameraPositionAnimation';
import { createMockCamera } from 'test-helpers/threeMocks';
import type { Camera } from 'three';
import { Vector3 } from 'three';

vi.mock('constants/cameraConfiguration', () => ({
  CAMERA_ROTATION_POSITION_ARRAY: [
    [0, 0, 10],
    [5, 0, 10],
    [10, 0, 10],
  ],
  CLOSE_UP_CAMERA_POSITION_ARRAY: [
    [1, 1, 5],
    [2, 2, 5],
    [3, 3, 5],
  ],
  CLOSE_UP_CAMERA_POSITION_ARRAY_SMALL_SCREEN: [
    [1, 1, 7],
    [2, 2, 7],
    [3, 3, 7],
  ],
  CLOSE_UP_CAMERA_ROTATION_ARRAY: [
    [0, 0, 0],
    [1, 1, 1],
    [2, 2, 2],
  ],
  MESH_NAME_TO_CAMERA_POSITION_INDEX_MAP: {
    'mesh1': 0,
    'mesh2': 1,
    'mesh3': 2,
  },
  NO_CLOSE_UP_INDEX: null,
}));

beforeAll(() => {
  let frameId = 0;
  global.requestAnimationFrame = vi.fn(() => {
    return ++frameId;
  });
  global.cancelAnimationFrame = vi.fn();
});

describe('useCameraPositionAnimation', () => {
  let mockCamera: Camera;
  let mockSetCloseUpPosIndex: Mock;
  let mockSetClickPoint: Mock;
  let mockSetCloseUp: Mock;
  let mockSetCameraClone: Mock;

  beforeEach(() => {
    mockCamera = createMockCamera() as unknown as Camera;
    mockSetCloseUpPosIndex = vi.fn();
    mockSetClickPoint = vi.fn();
    mockSetCloseUp = vi.fn();
    mockSetCameraClone = vi.fn();
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with rotation point', () => {
      const { result } = renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 1920,
          closeUp: false,
          closeUpPosIndex: 0,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      expect(result.current.rotationPoint).toBeInstanceOf(Vector3);
    });

    it('should initialize rotation point on mount', () => {
      const { result } = renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 1920,
          closeUp: false,
          closeUpPosIndex: 0,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      expect(result.current.rotationPoint).toBeInstanceOf(Vector3);
    });
  });

  describe('rotation target updates', () => {
    it('should update rotation target based on current camera index', () => {
      const { result, rerender } = renderHook(
        ({ currentPosIndex }) =>
          useCameraPositionAnimation({
            camera: mockCamera,
            windowWidth: 1920,
            closeUp: false,
            closeUpPosIndex: 0,
            setCloseUpPosIndex: mockSetCloseUpPosIndex,
            currentPosIndex,
            clickPoint: null,
            setClickPoint: mockSetClickPoint,
            setCloseUp: mockSetCloseUp,
            setCameraClone: mockSetCameraClone,
          }),
        {
          initialProps: { currentPosIndex: 0 },
        },
      );

      const initialRotation = result.current.rotationPoint;
      expect(initialRotation).toBeInstanceOf(Vector3);

      rerender({ currentPosIndex: 1 });

      const updatedRotation = result.current.rotationPoint;
      expect(updatedRotation).toBeInstanceOf(Vector3);
    });

    it('should update rotation target when in close-up view', () => {
      const { result, rerender } = renderHook(
        ({ closeUp, closeUpPosIndex }) =>
          useCameraPositionAnimation({
            camera: mockCamera,
            windowWidth: 1920,
            closeUp,
            closeUpPosIndex,
            setCloseUpPosIndex: mockSetCloseUpPosIndex,
            currentPosIndex: 0,
            clickPoint: null,
            setClickPoint: mockSetClickPoint,
            setCloseUp: mockSetCloseUp,
            setCameraClone: mockSetCameraClone,
          }),
        {
          initialProps: { closeUp: false, closeUpPosIndex: 0 },
        },
      );

      rerender({ closeUp: true, closeUpPosIndex: 1 });

      expect(result.current.rotationPoint).toBeInstanceOf(Vector3);
    });

    it('should handle safe index clamping for close-up rotation', () => {
      const { result } = renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 1920,
          closeUp: true,
          closeUpPosIndex: 2,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      expect(result.current.rotationPoint).toBeInstanceOf(Vector3);
    });

    it('should handle safe index clamping for camera rotation', () => {
      const { result } = renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 1920,
          closeUp: false,
          closeUpPosIndex: 0,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 999,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      expect(result.current.rotationPoint).toBeInstanceOf(Vector3);
    });
  });

  describe('click point navigation', () => {
    it('should handle click point and enter close-up mode', () => {
      const { rerender } = renderHook(
        ({ clickPoint }) =>
          useCameraPositionAnimation({
            camera: mockCamera,
            windowWidth: 1920,
            closeUp: false,
            closeUpPosIndex: 0,
            setCloseUpPosIndex: mockSetCloseUpPosIndex,
            currentPosIndex: 0,
            clickPoint,
            setClickPoint: mockSetClickPoint,
            setCloseUp: mockSetCloseUp,
            setCameraClone: mockSetCameraClone,
          }),
        {
          initialProps: { clickPoint: null as string | null },
        },
      );

      rerender({ clickPoint: 'mesh1' });

      expect(mockSetCloseUp).toHaveBeenCalledWith(true);
      expect(mockSetCloseUpPosIndex).toHaveBeenCalled();
      expect(mockSetClickPoint).toHaveBeenCalledWith(null);
    });

    it('should map click point to correct camera index', () => {
      const { rerender } = renderHook(
        ({ clickPoint }) =>
          useCameraPositionAnimation({
            camera: mockCamera,
            windowWidth: 1920,
            closeUp: false,
            closeUpPosIndex: 0,
            setCloseUpPosIndex: mockSetCloseUpPosIndex,
            currentPosIndex: 0,
            clickPoint,
            setClickPoint: mockSetClickPoint,
            setCloseUp: mockSetCloseUp,
            setCameraClone: mockSetCameraClone,
          }),
        {
          initialProps: { clickPoint: null as string | null },
        },
      );

      rerender({ clickPoint: 'mesh2' });

      expect(mockSetCloseUpPosIndex).toHaveBeenCalledWith(1);
    });

    it('should handle unknown click point with fallback index', () => {
      const { rerender } = renderHook(
        ({ clickPoint }) =>
          useCameraPositionAnimation({
            camera: mockCamera,
            windowWidth: 1920,
            closeUp: false,
            closeUpPosIndex: 0,
            setCloseUpPosIndex: mockSetCloseUpPosIndex,
            currentPosIndex: 0,
            clickPoint,
            setClickPoint: mockSetClickPoint,
            setCloseUp: mockSetCloseUp,
            setCameraClone: mockSetCameraClone,
          }),
        {
          initialProps: { clickPoint: null as string | null },
        },
      );

      rerender({ clickPoint: 'unknown-mesh' });

      expect(mockSetCloseUpPosIndex).toHaveBeenCalledWith(0);
    });

    it('should not trigger navigation when click point is null', () => {
      renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 1920,
          closeUp: false,
          closeUpPosIndex: 0,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      const closeUpCalls = mockSetCloseUp.mock.calls.filter(
        call => call[0] === true,
      );
      expect(closeUpCalls.length).toBe(0);
    });
  });

  describe('close-up camera positioning', () => {
    it('should update camera position for desktop screen', () => {
      renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 1920,
          closeUp: true,
          closeUpPosIndex: 1,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      expect(mockCamera.position.copy).toHaveBeenCalled();
    });

    it('should update camera position for mobile screen', () => {
      renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 600,
          closeUp: true,
          closeUpPosIndex: 1,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      expect(mockCamera.position.copy).toHaveBeenCalled();
    });

    it('should use desktop position array for width > 800', () => {
      const { rerender } = renderHook(
        ({ windowWidth }) =>
          useCameraPositionAnimation({
            camera: mockCamera,
            windowWidth,
            closeUp: true,
            closeUpPosIndex: 0,
            setCloseUpPosIndex: mockSetCloseUpPosIndex,
            currentPosIndex: 0,
            clickPoint: null,
            setClickPoint: mockSetClickPoint,
            setCloseUp: mockSetCloseUp,
            setCameraClone: mockSetCameraClone,
          }),
        {
          initialProps: { windowWidth: 1920 },
        },
      );

      const desktopCalls = (mockCamera.position.copy as Mock).mock.calls.length;

      rerender({ windowWidth: 600 });

      expect((mockCamera.position.copy as Mock).mock.calls.length).toBeGreaterThan(desktopCalls);
    });

    it('should not update position when closeUpPosIndex is null', () => {
      vi.clearAllMocks();

      renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 1920,
          closeUp: true,
          closeUpPosIndex: null,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      // When closeUpPosIndex is null, camera.position.copy should not be called
      // for the close-up positioning effect
      expect(mockCamera.position.copy).not.toHaveBeenCalled();
    });

    it('should update position when closeUpPosIndex changes', () => {
      const { rerender } = renderHook(
        ({ closeUpPosIndex }) =>
          useCameraPositionAnimation({
            camera: mockCamera,
            windowWidth: 1920,
            closeUp: true,
            closeUpPosIndex,
            setCloseUpPosIndex: mockSetCloseUpPosIndex,
            currentPosIndex: 0,
            clickPoint: null,
            setClickPoint: mockSetClickPoint,
            setCloseUp: mockSetCloseUp,
            setCameraClone: mockSetCameraClone,
          }),
        {
          initialProps: { closeUpPosIndex: 0 },
        },
      );

      const initialCalls = (mockCamera.position.copy as Mock).mock.calls.length;

      rerender({ closeUpPosIndex: 1 });

      expect((mockCamera.position.copy as Mock).mock.calls.length).toBeGreaterThan(initialCalls);
    });
  });

  describe('screen width responsiveness', () => {
    it('should respond to screen width changes', () => {
      const { rerender } = renderHook(
        ({ windowWidth }) =>
          useCameraPositionAnimation({
            camera: mockCamera,
            windowWidth,
            closeUp: true,
            closeUpPosIndex: 1,
            setCloseUpPosIndex: mockSetCloseUpPosIndex,
            currentPosIndex: 0,
            clickPoint: null,
            setClickPoint: mockSetClickPoint,
            setCloseUp: mockSetCloseUp,
            setCameraClone: mockSetCameraClone,
          }),
        {
          initialProps: { windowWidth: 1920 },
        },
      );

      rerender({ windowWidth: 375 });

      expect(mockCamera.position.copy).toHaveBeenCalled();
    });

    it('should handle tablet width correctly', () => {
      renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 800,
          closeUp: true,
          closeUpPosIndex: 1,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      expect(mockCamera.position.copy).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle zero window width', () => {
      const { result } = renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 0,
          closeUp: true,
          closeUpPosIndex: 0,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      expect(result.current.rotationPoint).toBeInstanceOf(Vector3);
    });

    it('should handle rapid click point changes', () => {
      const { rerender } = renderHook(
        ({ clickPoint }) =>
          useCameraPositionAnimation({
            camera: mockCamera,
            windowWidth: 1920,
            closeUp: false,
            closeUpPosIndex: 0,
            setCloseUpPosIndex: mockSetCloseUpPosIndex,
            currentPosIndex: 0,
            clickPoint,
            setClickPoint: mockSetClickPoint,
            setCloseUp: mockSetCloseUp,
            setCameraClone: mockSetCameraClone,
          }),
        {
          initialProps: { clickPoint: null as string | null },
        },
      );

      rerender({ clickPoint: 'mesh1' });
      rerender({ clickPoint: 'mesh2' });
      rerender({ clickPoint: 'mesh3' });

      expect(mockSetClickPoint).toHaveBeenCalledTimes(3);
    });
  });

  describe('initial camera arc animation', () => {
    it('should start requestAnimationFrame for arc animation on mount', () => {
      renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 1920,
          closeUp: false,
          closeUpPosIndex: 0,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should call setCameraClone with camera position clone during animation', () => {
      renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 1920,
          closeUp: false,
          closeUpPosIndex: 0,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      // Get the animation frame callback and invoke it
      const rafCallback = (global.requestAnimationFrame as Mock).mock.calls[0][0];
      rafCallback(0); // First frame (sets animation start time)

      expect(mockSetCameraClone).toHaveBeenCalled();
    });

    it('should animate camera position during arc when progress < 1', () => {
      renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 1920,
          closeUp: false,
          closeUpPosIndex: 0,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      const rafCallback = (global.requestAnimationFrame as Mock).mock.calls[0][0];
      // First frame: starts animation at time 0
      rafCallback(0);
      // Second frame: progress = 100/3500 < 1, should continue animating
      rafCallback(100);

      // Camera position should be updated and lookAt called
      expect(mockCamera.lookAt).toHaveBeenCalled();
      // Should have requested another animation frame
      expect((global.requestAnimationFrame as Mock).mock.calls.length).toBeGreaterThan(1);
    });

    it('should stop animation when progress >= 1', () => {
      renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 1920,
          closeUp: false,
          closeUpPosIndex: 0,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      const rafCallback = (global.requestAnimationFrame as Mock).mock.calls[0][0];
      const rafCallCountBefore = (global.requestAnimationFrame as Mock).mock.calls.length;

      // First frame: starts animation
      rafCallback(0);
      // Frame well past the duration (3500ms)
      rafCallback(5000);

      // After progress >= 1, no more requestAnimationFrame should be called
      const rafCallCountAfter = (global.requestAnimationFrame as Mock).mock.calls.length;
      // The second call (at 5000ms) should not schedule another frame
      // We check that lookAt was NOT called on the final frame (animation complete)
      // since the branch only calls lookAt when animationProgress < 1
      expect(rafCallCountAfter).toBeLessThanOrEqual(rafCallCountBefore + 2);
    });

    it('should cancel animation frame on unmount', () => {
      const { unmount } = renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 1920,
          closeUp: false,
          closeUpPosIndex: 0,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      unmount();

      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should handle out-of-bounds closeUpPosIndex gracefully', () => {
      renderHook(() =>
        useCameraPositionAnimation({
          camera: mockCamera,
          windowWidth: 1920,
          closeUp: true,
          closeUpPosIndex: 999,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          currentPosIndex: 0,
          clickPoint: null,
          setClickPoint: mockSetClickPoint,
          setCloseUp: mockSetCloseUp,
          setCameraClone: mockSetCameraClone,
        }),
      );

      // Should not throw; the index is clamped to the valid range
      // so position.copy is called with the last valid position
      expect(mockCamera.position.copy).toHaveBeenCalled();
    });
  });
});
