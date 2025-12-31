import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { AudioController } from '@/components/controls/AudioController';
import { useSceneInteractionStore, useUserInterfaceStore } from '@/stores';

const mockPlayButtonClick = vi.fn();
const mockPlaySegaSound = vi.fn();

vi.mock('use-sound', () => ({
  default: vi.fn((sound: string) => {
    if (sound.includes('click')) {
      return [mockPlayButtonClick];
    }
    if (sound.includes('sega')) {
      return [mockPlaySegaSound];
    }
    return [vi.fn()];
  }),
}));

vi.mock('@/assets/click.mp3', () => ({ default: 'click.mp3' }));
vi.mock('@/assets/sega.mp3', () => ({ default: 'sega.mp3' }));

describe('AudioController', () => {
  beforeEach(() => {
    const sceneStore = renderHook(() => useSceneInteractionStore());
    const uiStore = renderHook(() => useUserInterfaceStore());

    act(() => {
      sceneStore.result.current.resetSceneInteractionState();
      uiStore.result.current.resetUserInterfaceState();
    });

    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render without throwing', () => {
      expect(() => render(<AudioController />)).not.toThrow();
    });

    it('should return null (no visible DOM elements)', () => {
      const { container } = render(<AudioController />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('button click sound', () => {
    it('should play click sound when light is clicked', () => {
      render(<AudioController />);

      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedLightName('Button_Light_1');
      });

      // Re-render to trigger useEffect
      render(<AudioController />);

      expect(mockPlayButtonClick).toHaveBeenCalled();
    });

    it('should play click sound for each light click', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      // First light click
      act(() => {
        result.current.setClickedLightName('Button_Light_1');
      });

      render(<AudioController />);
      const firstCallCount = mockPlayButtonClick.mock.calls.length;

      // Second light click
      act(() => {
        result.current.setClickedLightName('Button_Light_2');
      });

      render(<AudioController />);

      // Should have more calls after second click
      expect(mockPlayButtonClick.mock.calls.length).toBeGreaterThan(firstCallCount);
    });
  });

  describe('mesh position click sound', () => {
    it('should play click sound when phone mesh is clicked', () => {
      render(<AudioController />);

      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedMeshPosition('Phone_Test_5');
      });

      render(<AudioController />);

      expect(mockPlayButtonClick).toHaveBeenCalled();
    });

    it('should NOT play click sound for Light_Control_Box', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedMeshPosition('Light_Control_Box');
      });

      render(<AudioController />);

      expect(mockPlayButtonClick).not.toHaveBeenCalled();
    });

    it('should NOT play click sound for Music_Control_Box', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      act(() => {
        result.current.setClickedMeshPosition('Music_Control_Box');
      });

      render(<AudioController />);

      expect(mockPlayButtonClick).not.toHaveBeenCalled();
    });
  });

  describe('sega sound', () => {
    it('should play sega sound when Cube009_2 is clicked in urban theme', () => {
      const { result: sceneResult } = renderHook(() => useSceneInteractionStore());
      const { result: uiResult } = renderHook(() => useUserInterfaceStore());

      act(() => {
        uiResult.current.setSelectedThemeConfiguration({
          id: '0',
          name: 'urban',
          color: '#E96929',
          displayName: 'URBAN',
          svgWidth: 280,
        });
      });

      act(() => {
        sceneResult.current.setClickedMeshPosition('Cube009_2');
      });

      render(<AudioController />);

      expect(mockPlaySegaSound).toHaveBeenCalled();
    });

    it('should NOT play sega sound in non-urban theme', () => {
      const { result: sceneResult } = renderHook(() => useSceneInteractionStore());
      const { result: uiResult } = renderHook(() => useUserInterfaceStore());

      act(() => {
        uiResult.current.setSelectedThemeConfiguration({
          id: '1',
          name: 'rural',
          color: '#80C080',
          displayName: 'RURAL',
          svgWidth: 275,
        });
      });

      act(() => {
        sceneResult.current.setClickedMeshPosition('Cube009_2');
      });

      render(<AudioController />);

      expect(mockPlaySegaSound).not.toHaveBeenCalled();
    });

    it('should NOT play sega sound for other meshes in urban theme', () => {
      const { result: sceneResult } = renderHook(() => useSceneInteractionStore());
      const { result: uiResult } = renderHook(() => useUserInterfaceStore());

      act(() => {
        uiResult.current.setSelectedThemeConfiguration({
          id: '0',
          name: 'urban',
          color: '#E96929',
          displayName: 'URBAN',
          svgWidth: 280,
        });
      });

      act(() => {
        sceneResult.current.setClickedMeshPosition('Phone_Test_5');
      });

      render(<AudioController />);

      expect(mockPlaySegaSound).not.toHaveBeenCalled();
    });
  });

  describe('store state dependencies', () => {
    it('should not play any sound when no interactions', () => {
      render(<AudioController />);

      expect(mockPlayButtonClick).not.toHaveBeenCalled();
      expect(mockPlaySegaSound).not.toHaveBeenCalled();
    });

    it('should respond to store state changes', () => {
      const { result } = renderHook(() => useSceneInteractionStore());

      render(<AudioController />);

      expect(result.current.clickedLightName).toBeNull();
      expect(result.current.clickedMeshPosition).toBeNull();

      act(() => {
        result.current.setClickedLightName('lamppost');
      });

      expect(result.current.clickedLightName).toBe('lamppost');
    });
  });
});
