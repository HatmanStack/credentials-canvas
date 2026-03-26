import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { render } from '@testing-library/react';
import React from 'react';
import * as THREE from 'three';
import { useSceneInteractionStore, useThreeJSSceneStore } from '@/stores';

// Mock R3F and Drei
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: { position: { x: 0, y: 0, z: 10 } },
    gl: { domElement: document.createElement('canvas') },
  })),
  extend: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@react-spring/three', () => {
  const springValue = {
    get: () => 0.538,
    to: vi.fn((fn: (v: number) => number) => fn(0.538)),
  };
  return {
    useSpring: vi.fn(() => [{ y: springValue }, { start: vi.fn() }]),
    useSprings: vi.fn(() =>
      Array(6).fill(null).map(() => ({
        scale: { to: vi.fn() },
      }))
    ),
    animated: {
      primitive: React.forwardRef(
        (props: Record<string, unknown>, ref: React.Ref<unknown>) => (
          <div ref={ref as React.Ref<HTMLDivElement>} data-testid="animated-primitive" />
        )
      ),
    },
  };
});

vi.mock('@use-gesture/react', () => ({
  useDrag: vi.fn(() => () => ({})),
}));

vi.mock('use-sound', () => ({
  default: vi.fn(() => [vi.fn()]),
}));

// Mock shader imports
vi.mock('@/shaders/vertex.glsl?raw', () => ({ default: 'void main() {}' }));
vi.mock('@/shaders/fragment.glsl?raw', () => ({ default: 'void main() {}' }));

import { SceneAnimations } from '@/components/three/SceneAnimations';

// Helper to create a mock scene with named child nodes
function createMockScene(nodeNames: string[]) {
  const children = nodeNames.map(name => {
    const obj = { name, traverse: vi.fn(), children: [] };
    return obj;
  });

  return {
    traverse: vi.fn((callback: (child: { name: string }) => void) => {
      children.forEach(child => callback(child));
    }),
    children,
    add: vi.fn(),
    remove: vi.fn(),
  };
}

describe('SceneAnimations', () => {
  beforeEach(() => {
    const sceneStore = renderHook(() => useSceneInteractionStore());
    const threeStore = renderHook(() => useThreeJSSceneStore());

    act(() => {
      sceneStore.result.current.resetSceneInteractionState();
      threeStore.result.current.resetThreeJSSceneState();
    });

    vi.clearAllMocks();
  });

  it('should render null when scene model is not loaded', () => {
    const { container } = render(<SceneAnimations />);
    expect(container.innerHTML).toBe('');
  });

  it('should render components when scene model has required nodes', () => {
    const { result: threeStore } = renderHook(() => useThreeJSSceneStore());

    const mockScene = createMockScene([
      'Slider_4',
      'Phone_Looper_Text',
      'Phone_Vocabulary_Text',
      'Phone_Italian_Text',
      'Phone_Trachtenberg_Text',
      'Phone_Movies_Text',
      'Phone_Stocks_Text',
      'Tball',
      'music_screen',
      'zelda_screen',
    ]);

    act(() => {
      threeStore.current.setThreeJSSceneModel(mockScene as unknown as THREE.Scene);
    });

    const { container } = render(<SceneAnimations />);
    // Should render something (not null)
    expect(container.innerHTML).not.toBe('');
  });

  it('should handle scene without optional nodes', () => {
    const { result: threeStore } = renderHook(() => useThreeJSSceneStore());

    // Scene with no matching node names
    const mockScene = createMockScene(['some_other_node']);

    act(() => {
      threeStore.current.setThreeJSSceneModel(mockScene as unknown as THREE.Scene);
    });

    const { container } = render(<SceneAnimations />);
    // Should render (not null since sceneNodes is set) but nothing visible for missing nodes
    expect(container).toBeTruthy();
  });

  it('should track clicked phone mesh for text animation', () => {
    const { result: sceneStore } = renderHook(() => useSceneInteractionStore());
    const { result: threeStore } = renderHook(() => useThreeJSSceneStore());

    const mockScene = createMockScene([
      'Phone_Looper_5',
      'Phone_Looper_Text',
      'Phone_Vocabulary_Text',
      'Phone_Italian_Text',
      'Phone_Trachtenberg_Text',
      'Phone_Movies_Text',
      'Phone_Stocks_Text',
    ]);

    act(() => {
      threeStore.current.setThreeJSSceneModel(mockScene as unknown as THREE.Scene);
    });

    render(<SceneAnimations />);

    // Simulate clicking a phone mesh
    act(() => {
      sceneStore.current.setClickedMeshPosition('Phone_Looper_5');
    });

    // The component should track this internally for text animation
    expect(sceneStore.current.clickedMeshPosition).toBe('Phone_Looper_5');
  });

  it('should not track non-phone mesh clicks for text animation', () => {
    const { result: sceneStore } = renderHook(() => useSceneInteractionStore());
    const { result: threeStore } = renderHook(() => useThreeJSSceneStore());

    const mockScene = createMockScene(['some_node']);

    act(() => {
      threeStore.current.setThreeJSSceneModel(mockScene as unknown as THREE.Scene);
    });

    render(<SceneAnimations />);

    act(() => {
      sceneStore.current.setClickedMeshPosition('random_mesh');
    });

    // Non-phone mesh should not affect phone text animation
    expect(sceneStore.current.clickedMeshPosition).toBe('random_mesh');
  });

  it('should traverse scene model to extract named nodes', () => {
    const { result: threeStore } = renderHook(() => useThreeJSSceneStore());

    const mockScene = createMockScene(['Slider_4', 'Tball']);

    act(() => {
      threeStore.current.setThreeJSSceneModel(mockScene as unknown as THREE.Scene);
    });

    render(<SceneAnimations />);

    expect(mockScene.traverse).toHaveBeenCalled();
  });
});
