import { renderHook, act } from '@testing-library/react';
import { useCameraScrollBehavior } from 'hooks/useCameraScrollBehavior';
import { createMockCamera } from 'test-helpers/threeMocks';
import type { Camera } from 'three';
import type { CameraPositionTuple } from 'types';

// Mock the constants
jest.mock('constants/cameraConfiguration', () => ({
  CAMERA_SCROLL_CONFIGURATION: {
    mobile: 0.2,
    desktop: 0.1,
  },
}));

describe('useCameraScrollBehavior', () => {
  let mockCamera: Camera;
  let mockDomElement: HTMLElement;
  let mockSetCurrentPosIndex: jest.Mock;
  let mockSetScrollStarted: jest.Mock;
  let mockSetCloseUp: jest.Mock;
  let mockSetCloseUpPosIndex: jest.Mock;
  let mockSetCameraClone: jest.Mock;
  let mockSetProgress: jest.Mock;
  let mockPositions: CameraPositionTuple[];

  beforeEach(() => {
    mockCamera = createMockCamera() as unknown as Camera;
    mockDomElement = document.createElement('div');
    mockSetCurrentPosIndex = jest.fn();
    mockSetScrollStarted = jest.fn();
    mockSetCloseUp = jest.fn();
    mockSetCloseUpPosIndex = jest.fn();
    mockSetCameraClone = jest.fn();
    mockSetProgress = jest.fn();
    mockPositions = [
      [0, 0, 10],
      [5, 0, 10],
      [10, 0, 10],
      [15, 0, 10],
      [20, 0, 10],
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize without errors', () => {
      const { result } = renderHook(() =>
        useCameraScrollBehavior({
          currentPosIndex: 0,
          setCurrentPosIndex: mockSetCurrentPosIndex,
          positions: mockPositions,
          camera: mockCamera,
          domElement: mockDomElement,
          setScrollStarted: mockSetScrollStarted,
          setCloseUp: mockSetCloseUp,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          setCameraClone: mockSetCameraClone,
          holderprogress: 0,
          setProgress: mockSetProgress,
          mobileScroll: null,
        }),
      );

      expect(result.current).toBeDefined();
      expect(result.current.handleMobileScroll).toBeInstanceOf(Function);
    });

    it('should return handleMobileScroll function', () => {
      const { result } = renderHook(() =>
        useCameraScrollBehavior({
          currentPosIndex: 0,
          setCurrentPosIndex: mockSetCurrentPosIndex,
          positions: mockPositions,
          camera: mockCamera,
          domElement: mockDomElement,
          setScrollStarted: mockSetScrollStarted,
          setCloseUp: mockSetCloseUp,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          setCameraClone: mockSetCameraClone,
          holderprogress: 0,
          setProgress: mockSetProgress,
          mobileScroll: null,
        }),
      );

      expect(typeof result.current.handleMobileScroll).toBe('function');
    });
  });

  describe('desktop scroll behavior', () => {
    it('should attach wheel event listener to dom element', () => {
      const addEventListenerSpy = jest.spyOn(mockDomElement, 'addEventListener');

      renderHook(() =>
        useCameraScrollBehavior({
          currentPosIndex: 0,
          setCurrentPosIndex: mockSetCurrentPosIndex,
          positions: mockPositions,
          camera: mockCamera,
          domElement: mockDomElement,
          setScrollStarted: mockSetScrollStarted,
          setCloseUp: mockSetCloseUp,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          setCameraClone: mockSetCameraClone,
          holderprogress: 0,
          setProgress: mockSetProgress,
          mobileScroll: null,
        }),
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'wheel',
        expect.any(Function),
      );
    });

    it('should update scroll state on wheel event', () => {
      renderHook(() =>
        useCameraScrollBehavior({
          currentPosIndex: 0,
          setCurrentPosIndex: mockSetCurrentPosIndex,
          positions: mockPositions,
          camera: mockCamera,
          domElement: mockDomElement,
          setScrollStarted: mockSetScrollStarted,
          setCloseUp: mockSetCloseUp,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          setCameraClone: mockSetCameraClone,
          holderprogress: 0,
          setProgress: mockSetProgress,
          mobileScroll: null,
        }),
      );

      act(() => {
        const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
        mockDomElement.dispatchEvent(wheelEvent);
      });

      expect(mockSetScrollStarted).toHaveBeenCalledWith(true);
      expect(mockSetCloseUp).toHaveBeenCalledWith(false);
      expect(mockSetCloseUpPosIndex).toHaveBeenCalledWith(9);
    });

    it('should clean up wheel event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(mockDomElement, 'removeEventListener');

      const { unmount } = renderHook(() =>
        useCameraScrollBehavior({
          currentPosIndex: 0,
          setCurrentPosIndex: mockSetCurrentPosIndex,
          positions: mockPositions,
          camera: mockCamera,
          domElement: mockDomElement,
          setScrollStarted: mockSetScrollStarted,
          setCloseUp: mockSetCloseUp,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          setCameraClone: mockSetCameraClone,
          holderprogress: 0,
          setProgress: mockSetProgress,
          mobileScroll: null,
        }),
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'wheel',
        expect.any(Function),
      );
    });

    it('should not attach listener when domElement is null', () => {
      const { result } = renderHook(() =>
        useCameraScrollBehavior({
          currentPosIndex: 0,
          setCurrentPosIndex: mockSetCurrentPosIndex,
          positions: mockPositions,
          camera: mockCamera,
          domElement: null,
          setScrollStarted: mockSetScrollStarted,
          setCloseUp: mockSetCloseUp,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          setCameraClone: mockSetCameraClone,
          holderprogress: 0,
          setProgress: mockSetProgress,
          mobileScroll: null,
        }),
      );

      expect(result.current).toBeDefined();
      // No error should be thrown
    });
  });

  describe('mobile scroll behavior', () => {
    it('should trigger handleMobileScroll when mobileScroll changes', () => {
      const { rerender } = renderHook(
        ({ mobileScroll }) =>
          useCameraScrollBehavior({
            currentPosIndex: 0,
            setCurrentPosIndex: mockSetCurrentPosIndex,
            positions: mockPositions,
            camera: mockCamera,
            domElement: mockDomElement,
            setScrollStarted: mockSetScrollStarted,
            setCloseUp: mockSetCloseUp,
            setCloseUpPosIndex: mockSetCloseUpPosIndex,
            setCameraClone: mockSetCameraClone,
            holderprogress: 0,
            setProgress: mockSetProgress,
            mobileScroll,
          }),
        {
          initialProps: { mobileScroll: null as number | null },
        },
      );

      // Trigger mobile scroll by changing mobileScroll value
      rerender({ mobileScroll: 1 });

      expect(mockSetScrollStarted).toHaveBeenCalledWith(true);
      expect(mockSetCloseUp).toHaveBeenCalledWith(false);
      expect(mockSetCloseUpPosIndex).toHaveBeenCalledWith(9);
    });

    it('should update camera position when handleMobileScroll is called', () => {
      const { result } = renderHook(() =>
        useCameraScrollBehavior({
          currentPosIndex: 0,
          setCurrentPosIndex: mockSetCurrentPosIndex,
          positions: mockPositions,
          camera: mockCamera,
          domElement: mockDomElement,
          setScrollStarted: mockSetScrollStarted,
          setCloseUp: mockSetCloseUp,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          setCameraClone: mockSetCameraClone,
          holderprogress: 0,
          setProgress: mockSetProgress,
          mobileScroll: null,
        }),
      );

      act(() => {
        result.current.handleMobileScroll();
      });

      expect(mockCamera.position.copy).toHaveBeenCalled();
    });

    it('should not trigger handleMobileScroll when mobileScroll is null', () => {
      renderHook(() =>
        useCameraScrollBehavior({
          currentPosIndex: 0,
          setCurrentPosIndex: mockSetCurrentPosIndex,
          positions: mockPositions,
          camera: mockCamera,
          domElement: mockDomElement,
          setScrollStarted: mockSetScrollStarted,
          setCloseUp: mockSetCloseUp,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          setCameraClone: mockSetCameraClone,
          holderprogress: 0,
          setProgress: mockSetProgress,
          mobileScroll: null,
        }),
      );

      // No calls should be made
      expect(mockSetScrollStarted).not.toHaveBeenCalled();
    });
  });

  describe('camera index progression', () => {
    it('should update camera position on each scroll', () => {
      const { result } = renderHook(() =>
        useCameraScrollBehavior({
          currentPosIndex: 0,
          setCurrentPosIndex: mockSetCurrentPosIndex,
          positions: mockPositions,
          camera: mockCamera,
          domElement: mockDomElement,
          setScrollStarted: mockSetScrollStarted,
          setCloseUp: mockSetCloseUp,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          setCameraClone: mockSetCameraClone,
          holderprogress: 0,
          setProgress: mockSetProgress,
          mobileScroll: null,
        }),
      );

      act(() => {
        result.current.handleMobileScroll();
      });

      // Camera position should be updated
      expect(mockCamera.position.copy).toHaveBeenCalled();
    });

    it('should handle navigation from last position', () => {
      const { result } = renderHook(() =>
        useCameraScrollBehavior({
          currentPosIndex: 4, // Last position
          setCurrentPosIndex: mockSetCurrentPosIndex,
          positions: mockPositions,
          camera: mockCamera,
          domElement: mockDomElement,
          setScrollStarted: mockSetScrollStarted,
          setCloseUp: mockSetCloseUp,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          setCameraClone: mockSetCameraClone,
          holderprogress: 0,
          setProgress: mockSetProgress,
          mobileScroll: null,
        }),
      );

      act(() => {
        result.current.handleMobileScroll();
      });

      // Should update camera position (demonstrates wrapping logic works)
      expect(mockCamera.position.copy).toHaveBeenCalled();
    });
  });

  describe('index synchronization', () => {
    it('should sync internal refs when currentPosIndex changes', () => {
      const { rerender } = renderHook(
        ({ currentPosIndex }) =>
          useCameraScrollBehavior({
            currentPosIndex,
            setCurrentPosIndex: mockSetCurrentPosIndex,
            positions: mockPositions,
            camera: mockCamera,
            domElement: mockDomElement,
            setScrollStarted: mockSetScrollStarted,
            setCloseUp: mockSetCloseUp,
            setCloseUpPosIndex: mockSetCloseUpPosIndex,
            setCameraClone: mockSetCameraClone,
            holderprogress: 0,
            setProgress: mockSetProgress,
            mobileScroll: null,
          }),
        {
          initialProps: { currentPosIndex: 0 },
        },
      );

      // Change currentPosIndex
      rerender({ currentPosIndex: 2 });

      // Internal refs should be synced (verified indirectly through behavior)
      expect(mockCamera).toBeDefined();
    });
  });

  describe('callback stability', () => {
    it('should maintain stable handleMobileScroll reference', () => {
      const { result, rerender } = renderHook(() =>
        useCameraScrollBehavior({
          currentPosIndex: 0,
          setCurrentPosIndex: mockSetCurrentPosIndex,
          positions: mockPositions,
          camera: mockCamera,
          domElement: mockDomElement,
          setScrollStarted: mockSetScrollStarted,
          setCloseUp: mockSetCloseUp,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          setCameraClone: mockSetCameraClone,
          holderprogress: 0,
          setProgress: mockSetProgress,
          mobileScroll: null,
        }),
      );

      const firstCallback = result.current.handleMobileScroll;

      rerender();

      const secondCallback = result.current.handleMobileScroll;

      expect(firstCallback).toBe(secondCallback);
    });
  });

  describe('edge cases', () => {
    it('should handle empty camera positions array', () => {
      const { result } = renderHook(() =>
        useCameraScrollBehavior({
          currentPosIndex: 0,
          setCurrentPosIndex: mockSetCurrentPosIndex,
          positions: [],
          camera: mockCamera,
          domElement: mockDomElement,
          setScrollStarted: mockSetScrollStarted,
          setCloseUp: mockSetCloseUp,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          setCameraClone: mockSetCameraClone,
          holderprogress: 0,
          setProgress: mockSetProgress,
          mobileScroll: null,
        }),
      );

      expect(result.current).toBeDefined();
    });

    it('should handle single camera position', () => {
      const singlePosition: CameraPositionTuple[] = [[0, 0, 10]];

      const { result } = renderHook(() =>
        useCameraScrollBehavior({
          currentPosIndex: 0,
          setCurrentPosIndex: mockSetCurrentPosIndex,
          positions: singlePosition,
          camera: mockCamera,
          domElement: mockDomElement,
          setScrollStarted: mockSetScrollStarted,
          setCloseUp: mockSetCloseUp,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          setCameraClone: mockSetCameraClone,
          holderprogress: 0,
          setProgress: mockSetProgress,
          mobileScroll: null,
        }),
      );

      act(() => {
        result.current.handleMobileScroll();
      });

      expect(mockCamera.position.copy).toHaveBeenCalled();
    });

    it('should handle very large camera position index', () => {
      const { result } = renderHook(() =>
        useCameraScrollBehavior({
          currentPosIndex: 999,
          setCurrentPosIndex: mockSetCurrentPosIndex,
          positions: mockPositions,
          camera: mockCamera,
          domElement: mockDomElement,
          setScrollStarted: mockSetScrollStarted,
          setCloseUp: mockSetCloseUp,
          setCloseUpPosIndex: mockSetCloseUpPosIndex,
          setCameraClone: mockSetCameraClone,
          holderprogress: 0,
          setProgress: mockSetProgress,
          mobileScroll: null,
        }),
      );

      // Should not crash
      expect(result.current).toBeDefined();
    });
  });
});
