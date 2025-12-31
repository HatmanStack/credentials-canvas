import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import App from '@/App';
import { useUserInterfaceStore, useSceneInteractionStore, useThreeJSSceneStore } from '@/stores';

// Mock all R3F and Three.js related imports to avoid animation/rendering issues
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: {
      position: { x: 0, y: 0, z: 10, set: vi.fn(), copy: vi.fn(), clone: vi.fn() },
      lookAt: vi.fn(),
    },
    gl: { domElement: document.createElement('canvas') },
  })),
  extend: vi.fn(),
}));

vi.mock('@react-three/drei', () => {
  const useGLTF = Object.assign(
    () => ({
      scene: { traverse: vi.fn() },
      nodes: {},
      materials: {},
    }),
    { preload: vi.fn() }
  );
  return {
    useGLTF,
    useProgress: () => ({ progress: 100 }),
    AccumulativeShadows: () => null,
    RandomizedLight: () => null,
    Environment: () => null,
  };
});

vi.mock('use-sound', () => ({
  default: vi.fn(() => [vi.fn()]),
}));

// Mock the Three.js components to prevent animation frame issues
vi.mock('@/components/three/SceneModel', () => ({
  SceneModel: () => <div data-testid="scene-model">SceneModel</div>,
}));

vi.mock('@/components/three/SceneEnvironment', () => ({
  SceneEnvironment: () => <div data-testid="scene-environment">SceneEnvironment</div>,
}));

vi.mock('@/components/controls/CameraController', () => ({
  CameraController: () => null,
}));

vi.mock('@/components/controls/AudioController', () => ({
  AudioController: () => null,
}));

vi.mock('@/assets/hand.gif', () => ({ default: 'hand.gif' }));
vi.mock('@/assets/volume_up.svg', () => ({ default: 'volume_up.svg' }));
vi.mock('@/assets/volume_mute.svg', () => ({ default: 'volume_mute.svg' }));
vi.mock('@/assets/arrow.svg', () => ({ default: 'arrow.svg' }));
vi.mock('@/css/launch.css', () => ({}));

describe('App', () => {
  beforeEach(() => {
    const uiStore = renderHook(() => useUserInterfaceStore());
    const sceneStore = renderHook(() => useSceneInteractionStore());
    const threeStore = renderHook(() => useThreeJSSceneStore());

    act(() => {
      uiStore.result.current.resetUserInterfaceState();
      sceneStore.result.current.resetSceneInteractionState();
      threeStore.result.current.resetThreeJSSceneState();
    });

    vi.clearAllMocks();
  });

  describe('initial rendering', () => {
    it('should render without throwing', () => {
      expect(() => render(<App />)).not.toThrow();
    });

    it('should show LaunchScreen when no theme is selected', () => {
      render(<App />);

      expect(screen.getByText('VIBE')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /launch/i })).toBeInTheDocument();
    });

    it('should display all theme options on launch screen', () => {
      render(<App />);

      expect(screen.getByText('URBAN')).toBeInTheDocument();
      expect(screen.getByText('RURAL')).toBeInTheDocument();
      expect(screen.getByText('CLASSY')).toBeInTheDocument();
      expect(screen.getByText('CHILL')).toBeInTheDocument();
    });

    it('should render Traditional Portfolio link', () => {
      render(<App />);

      const link = screen.getByRole('link', { name: /traditional portfolio/i });
      expect(link).toBeInTheDocument();
    });
  });

  describe('theme selection', () => {
    it('should allow selecting a theme checkbox', () => {
      const { container } = render(<App />);

      const urbanCheckbox = container.querySelector('#urban-checkbox') as HTMLInputElement;
      fireEvent.click(urbanCheckbox);

      expect(urbanCheckbox).toBeChecked();
    });

    it('should show canvas when theme is configured in store', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.setSelectedThemeConfiguration({
          id: '0',
          name: 'urban',
          color: '#E96929',
          displayName: 'URBAN',
          svgWidth: 280,
        });
      });

      render(<App />);

      expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
      expect(screen.queryByText('VIBE')).not.toBeInTheDocument();
    });
  });

  describe('store state management', () => {
    it('should use selectedThemeConfiguration from store', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      expect(result.current.selectedThemeConfiguration).toBeNull();

      render(<App />);
      expect(screen.getByText('VIBE')).toBeInTheDocument();
    });

    it('should hide launch screen when theme is selected', () => {
      const { result } = renderHook(() => useUserInterfaceStore());

      act(() => {
        result.current.setSelectedThemeConfiguration({
          id: '1',
          name: 'rural',
          color: '#80C080',
          displayName: 'RURAL',
          svgWidth: 275,
        });
      });

      render(<App />);

      expect(screen.queryByRole('button', { name: /launch/i })).not.toBeInTheDocument();
    });
  });

  describe('all themes render canvas', () => {
    const themes = [
      { id: '0', name: 'urban' as const, color: '#E96929', displayName: 'URBAN', svgWidth: 280 },
      { id: '1', name: 'rural' as const, color: '#80C080', displayName: 'RURAL', svgWidth: 275 },
      { id: '2', name: 'classy' as const, color: '#EF5555', displayName: 'CLASSY', svgWidth: 320 },
      { id: '3', name: 'chill' as const, color: '#9FA8DA', displayName: 'CHILL', svgWidth: 240 },
    ];

    themes.forEach(theme => {
      it(`should render canvas for ${theme.name} theme`, () => {
        const { result } = renderHook(() => useUserInterfaceStore());

        act(() => {
          result.current.setSelectedThemeConfiguration(theme);
        });

        render(<App />);

        expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
      });
    });
  });
});
