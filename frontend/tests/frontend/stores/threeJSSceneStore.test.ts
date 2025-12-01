import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useThreeJSSceneStore } from 'stores/threeJSSceneStore';
import { createMockScene } from 'test-helpers/threeMocks';

describe('threeJSSceneStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useThreeJSSceneStore());
    act(() => {
      result.current.resetThreeJSSceneState();
    });
  });

  describe('Three.js scene model', () => {
    it('should initialize with null scene model', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());

      expect(result.current.threeJSSceneModel).toBeNull();
    });

    it('should set Three.js scene model', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());
      const mockScene = createMockScene();

      act(() => {
        result.current.setThreeJSSceneModel(mockScene as any);
      });

      expect(result.current.threeJSSceneModel).toBe(mockScene);
    });

    it('should clear scene model with null', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());
      const mockScene = createMockScene();

      act(() => {
        result.current.setThreeJSSceneModel(mockScene as any);
      });

      expect(result.current.threeJSSceneModel).toBe(mockScene);

      act(() => {
        result.current.setThreeJSSceneModel(null);
      });

      expect(result.current.threeJSSceneModel).toBeNull();
    });

    it('should replace existing scene model', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());
      const mockScene1 = createMockScene();
      const mockScene2 = createMockScene();

      act(() => {
        result.current.setThreeJSSceneModel(mockScene1 as any);
      });

      expect(result.current.threeJSSceneModel).toBe(mockScene1);

      act(() => {
        result.current.setThreeJSSceneModel(mockScene2 as any);
      });

      expect(result.current.threeJSSceneModel).toBe(mockScene2);
      expect(result.current.threeJSSceneModel).not.toBe(mockScene1);
    });
  });

  describe('HTML video player element', () => {
    it('should initialize with null video player', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());

      expect(result.current.htmlVideoPlayerElement).toBeNull();
    });

    it('should set video player element', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());
      const mockPlayer = {
        playVideo: vi.fn(),
        pauseVideo: vi.fn(),
        seekTo: vi.fn(),
      };

      act(() => {
        result.current.setHTMLVideoPlayerElement(mockPlayer as any);
      });

      expect(result.current.htmlVideoPlayerElement).toBe(mockPlayer);
    });

    it('should clear video player with null', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());
      const mockPlayer = {
        playVideo: vi.fn(),
        pauseVideo: vi.fn(),
      };

      act(() => {
        result.current.setHTMLVideoPlayerElement(mockPlayer as any);
      });

      expect(result.current.htmlVideoPlayerElement).toBe(mockPlayer);

      act(() => {
        result.current.setHTMLVideoPlayerElement(null);
      });

      expect(result.current.htmlVideoPlayerElement).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset all Three.js references to null', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());
      const mockScene = createMockScene();
      const mockPlayer = {
        playVideo: vi.fn(),
      };

      act(() => {
        result.current.setThreeJSSceneModel(mockScene as any);
        result.current.setHTMLVideoPlayerElement(mockPlayer as any);
      });

      expect(result.current.threeJSSceneModel).toBe(mockScene);
      expect(result.current.htmlVideoPlayerElement).toBe(mockPlayer);

      act(() => {
        result.current.resetThreeJSSceneState();
      });

      expect(result.current.threeJSSceneModel).toBeNull();
      expect(result.current.htmlVideoPlayerElement).toBeNull();
    });
  });

  describe('state persistence', () => {
    it('should maintain scene reference across multiple reads', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());
      const mockScene = createMockScene();

      act(() => {
        result.current.setThreeJSSceneModel(mockScene as any);
      });

      expect(result.current.threeJSSceneModel).toBe(mockScene);
      expect(result.current.threeJSSceneModel).toBe(mockScene);
      expect(result.current.threeJSSceneModel).toBe(mockScene);
    });

    it('should update scene and video player independently', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());
      const mockScene = createMockScene();
      const mockPlayer = { playVideo: vi.fn() };

      act(() => {
        result.current.setThreeJSSceneModel(mockScene as any);
      });

      expect(result.current.threeJSSceneModel).toBe(mockScene);
      expect(result.current.htmlVideoPlayerElement).toBeNull();

      act(() => {
        result.current.setHTMLVideoPlayerElement(mockPlayer as any);
      });

      expect(result.current.threeJSSceneModel).toBe(mockScene);
      expect(result.current.htmlVideoPlayerElement).toBe(mockPlayer);
    });
  });

  describe('nullability handling', () => {
    it('should handle null scene model gracefully', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());

      act(() => {
        result.current.setThreeJSSceneModel(null);
      });

      expect(result.current.threeJSSceneModel).toBeNull();
      expect(() => result.current.threeJSSceneModel).not.toThrow();
    });

    it('should handle null video player gracefully', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());

      act(() => {
        result.current.setHTMLVideoPlayerElement(null);
      });

      expect(result.current.htmlVideoPlayerElement).toBeNull();
      expect(() => result.current.htmlVideoPlayerElement).not.toThrow();
    });

    it('should allow setting to null multiple times', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());

      act(() => {
        result.current.setThreeJSSceneModel(null);
        result.current.setThreeJSSceneModel(null);
        result.current.setHTMLVideoPlayerElement(null);
        result.current.setHTMLVideoPlayerElement(null);
      });

      expect(result.current.threeJSSceneModel).toBeNull();
      expect(result.current.htmlVideoPlayerElement).toBeNull();
    });
  });
});
