import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSceneInteractionStore, useThreeJSSceneStore } from '@/stores';

// Test SceneModel logic through store interactions
// GLTF loading and R3F rendering are mocked

vi.mock('@/constants/urlConfiguration', () => ({
  MESH_NAME_TO_URL_MAPPING: {
    Sign_Github: 'https://github.com/HatmanStack',
    Sign_About: 'https://gemenielabs.hatstack.fun',
  },
  INTERACTIVE_PHONE_URL_CONFIGURATIONS: [
    { signName: ['Phone_Stocks_5', 'Phone_Stocks_Text'], url: 'https://stocks.hatstack.fun' },
    { signName: ['Phone_Vocabulary_5'], url: 'https://vocabulary.hatstack.fun' },
    { signName: ['Cube009_2'], url: '' },
    { signName: ['Music_Control_Box', 'Light_Control_Box'], url: '' },
  ],
}));

vi.mock('@/constants/meshConfiguration', () => ({
  INTERACTIVE_LIGHT_MESH_NAMES: ['Button_Light_1', 'Button_Light_2', 'lamppost'],
  PHONE_VIDEO_CONFIGURATIONS: [
    { name: 'Phone_Stocks_5', video: '/test.mp4', textNode: 'Phone_Stocks_Text' },
  ],
  VIDEO_TEXTURE_MESH_NAMES: ['Phone_Stocks_5'],
  CLOSE_UP_CLICK_THRESHOLD_COUNT: 2,
  GLTF_MODEL_FILE_PATH: '/test_model.glb',
}));

describe('SceneModel logic', () => {
  beforeEach(() => {
    const sceneStore = renderHook(() => useSceneInteractionStore());
    const threeStore = renderHook(() => useThreeJSSceneStore());

    act(() => {
      sceneStore.result.current.resetSceneInteractionState();
      threeStore.result.current.resetThreeJSSceneState();
    });

    vi.clearAllMocks();
  });

  describe('scene model management', () => {
    it('should store scene model reference', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());

      const mockScene = { type: 'Group', children: [] };

      act(() => {
        result.current.setThreeJSSceneModel(mockScene as unknown as THREE.Group);
      });

      expect(result.current.threeJSSceneModel).toBe(mockScene);
    });

    it('should initialize with null scene model', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());

      expect(result.current.threeJSSceneModel).toBeNull();
    });

    it('should clear scene model reference', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());

      const mockScene = { type: 'Group', children: [] };

      act(() => {
        result.current.setThreeJSSceneModel(mockScene as unknown as THREE.Group);
      });

      act(() => {
        result.current.setThreeJSSceneModel(null);
      });

      expect(result.current.threeJSSceneModel).toBeNull();
    });
  });

  describe('click handling for URL meshes', () => {
    it('should track URL mesh clicks', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.incrementClickCount();
      });

      expect(result.current.totalClickCount).toBe(1);
    });

    it('should not track click position for direct URL meshes', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      // URL meshes open window directly, don't set clickedMeshPosition
      act(() => {
        result.current.incrementClickCount();
      });

      expect(result.current.clickedMeshPosition).toBeNull();
    });
  });

  describe('click handling for light meshes', () => {
    it('should set clicked light name for light buttons', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedLightName('Button_Light_1');
        result.current.incrementClickCount();
      });

      expect(result.current.clickedLightName).toBe('Button_Light_1');
      expect(result.current.totalClickCount).toBe(1);
    });
  });

  describe('click handling for phone meshes', () => {
    it('should set clicked mesh position for phone meshes', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedMeshPosition('Phone_Stocks_5');
      });

      expect(result.current.clickedMeshPosition).toBe('Phone_Stocks_5');
    });

    it('should handle close-up view click counting', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setIsCloseUpViewActive(true);
        result.current.setClickedMeshPosition('Phone_Vocabulary_5');
      });

      expect(result.current.isCloseUpViewActive).toBe(true);
      expect(result.current.clickedMeshPosition).toBe('Phone_Vocabulary_5');
    });
  });

  describe('video player management', () => {
    it('should store video player element reference', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());

      const mockPlayer = {
        mute: vi.fn(),
        unMute: vi.fn(),
        isMuted: vi.fn(() => false),
      };

      act(() => {
        result.current.setHTMLVideoPlayerElement(mockPlayer as unknown as never);
      });

      expect(result.current.htmlVideoPlayerElement).toBe(mockPlayer);
    });

    it('should initialize with null video player', () => {
      const { result } = renderHook(() => useThreeJSSceneStore());

      expect(result.current.htmlVideoPlayerElement).toBeNull();
    });
  });

  describe('state reset', () => {
    it('should reset scene state completely', () => {
      const { result: sceneResult } = renderHook(() => useSceneInteractionStore());
      const { result: threeResult } = renderHook(() => useThreeJSSceneStore());

      act(() => {
        sceneResult.current.setClickedMeshPosition('Phone_Test');
        sceneResult.current.setClickedLightName('lamppost');
        sceneResult.current.incrementClickCount();
        sceneResult.current.setIsCloseUpViewActive(true);
        threeResult.current.setThreeJSSceneModel({ type: 'Group' } as unknown as THREE.Group);
      });

      act(() => {
        sceneResult.current.resetSceneInteractionState();
        threeResult.current.resetThreeJSSceneState();
      });

      expect(sceneResult.current.clickedMeshPosition).toBeNull();
      expect(sceneResult.current.clickedLightName).toBeNull();
      expect(sceneResult.current.totalClickCount).toBe(0);
      expect(sceneResult.current.isCloseUpViewActive).toBe(false);
      expect(threeResult.current.threeJSSceneModel).toBeNull();
    });
  });

  describe('close-up click threshold', () => {
    it('should track multiple clicks in close-up view', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setIsCloseUpViewActive(true);
      });

      // Simulate multiple clicks
      act(() => {
        result.current.incrementClickCount();
      });

      act(() => {
        result.current.incrementClickCount();
      });

      expect(result.current.totalClickCount).toBe(2);
    });
  });
});
