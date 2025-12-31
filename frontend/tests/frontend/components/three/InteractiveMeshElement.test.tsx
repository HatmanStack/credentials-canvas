import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSceneInteractionStore } from '@/stores';

// Since InteractiveMeshElement uses R3F primitives that are hard to test in isolation,
// we test the click handler logic by directly testing the store interactions

vi.mock('@/constants/urlConfiguration', () => ({
  MESH_NAME_TO_URL_MAPPING: {
    Sign_Github: 'https://github.com/test',
    Sign_About: 'https://about.test',
  },
  INTERACTIVE_PHONE_URL_CONFIGURATIONS: [
    { signName: ['Phone_Test_5', 'Phone_Test_Text'], url: 'https://phone.test' },
    { signName: ['Cube009_2'], url: '' },
  ],
}));

vi.mock('@/constants/meshConfiguration', () => ({
  INTERACTIVE_LIGHT_MESH_NAMES: ['Button_Light_1', 'Button_Light_2', 'lamppost'],
  CLOSE_UP_CLICK_THRESHOLD_COUNT: 2,
}));

describe('InteractiveMeshElement logic', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useSceneInteractionStore());
    act(() => {
      result.current.resetSceneInteractionState();
    });
    vi.clearAllMocks();
  });

  describe('store interactions for mesh clicks', () => {
    it('should increment click count when URL mesh is clicked', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.totalClickCount).toBe(0);

      act(() => {
        result.current.incrementClickCount();
      });

      expect(result.current.totalClickCount).toBe(1);
    });

    it('should set clicked light name for light meshes', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.clickedLightName).toBeNull();

      act(() => {
        result.current.setClickedLightName('Button_Light_1');
      });

      expect(result.current.clickedLightName).toBe('Button_Light_1');
    });

    it('should set clicked mesh position for phone meshes', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.clickedMeshPosition).toBeNull();

      act(() => {
        result.current.setClickedMeshPosition('Phone_Test_5');
      });

      expect(result.current.clickedMeshPosition).toBe('Phone_Test_5');
    });

    it('should track close-up view state', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      expect(result.current.isCloseUpViewActive).toBe(false);

      act(() => {
        result.current.setIsCloseUpViewActive(true);
      });

      expect(result.current.isCloseUpViewActive).toBe(true);
    });
  });

  describe('click counting behavior', () => {
    it('should increment click count multiple times', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.incrementClickCount();
        result.current.incrementClickCount();
        result.current.incrementClickCount();
      });

      expect(result.current.totalClickCount).toBe(3);
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

  describe('mesh position tracking', () => {
    it('should update mesh position on subsequent clicks', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedMeshPosition('Phone_Test_5');
      });

      expect(result.current.clickedMeshPosition).toBe('Phone_Test_5');

      act(() => {
        result.current.setClickedMeshPosition('Phone_Other');
      });

      expect(result.current.clickedMeshPosition).toBe('Phone_Other');
    });

    it('should clear mesh position with null', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedMeshPosition('Phone_Test_5');
      });

      act(() => {
        result.current.setClickedMeshPosition(null);
      });

      expect(result.current.clickedMeshPosition).toBeNull();
    });
  });

  describe('light name tracking', () => {
    it('should update light name on subsequent clicks', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedLightName('Button_Light_1');
      });

      expect(result.current.clickedLightName).toBe('Button_Light_1');

      act(() => {
        result.current.setClickedLightName('lamppost');
      });

      expect(result.current.clickedLightName).toBe('lamppost');
    });

    it('should clear light name with null', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedLightName('Button_Light_2');
      });

      act(() => {
        result.current.setClickedLightName(null);
      });

      expect(result.current.clickedLightName).toBeNull();
    });
  });

  describe('close-up view interactions', () => {
    it('should toggle close-up view state', () => {
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
  });
});
