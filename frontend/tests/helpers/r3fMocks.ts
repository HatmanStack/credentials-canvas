import { vi } from 'vitest';
import type { Mock } from 'vitest';

// Mock useFrame callback storage for testing
let frameCallbacks: ((state: unknown, delta: number) => void)[] = [];

export const mockUseFrame = vi.fn((callback: (state: unknown, delta: number) => void) => {
  frameCallbacks.push(callback);
});

export const triggerFrame = (delta: number = 0.016): void => {
  const mockState = {
    camera: createMockR3FCamera(),
    gl: { domElement: document.createElement('canvas') },
    scene: {},
    clock: { elapsedTime: 0 },
  };
  frameCallbacks.forEach(cb => cb(mockState, delta));
};

export const clearFrameCallbacks = (): void => {
  frameCallbacks = [];
};

export interface MockR3FCamera {
  position: {
    x: number;
    y: number;
    z: number;
    set: Mock;
    copy: Mock;
    clone: Mock;
  };
  lookAt: Mock;
  updateProjectionMatrix: Mock;
}

export const createMockR3FCamera = (): MockR3FCamera => ({
  position: {
    x: 0,
    y: 0,
    z: 10,
    set: vi.fn(),
    copy: vi.fn(),
    clone: vi.fn(),
  },
  lookAt: vi.fn(),
  updateProjectionMatrix: vi.fn(),
});

export const mockUseThree = vi.fn(() => ({
  camera: createMockR3FCamera(),
  gl: {
    domElement: document.createElement('canvas'),
    setSize: vi.fn(),
    render: vi.fn(),
  },
  scene: {
    add: vi.fn(),
    remove: vi.fn(),
  },
  size: { width: 800, height: 600 },
  viewport: { width: 800, height: 600 },
}));

export const mockExtend = vi.fn();

// Mock Canvas component
export const MockCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return children as React.ReactElement;
};

// Mock useGLTF hook
export const mockUseGLTF = vi.fn(() => ({
  scene: {
    traverse: vi.fn((callback: (node: unknown) => void) => {
      callback({ isMesh: true, name: 'TestMesh', material: {}, geometry: {} });
    }),
    clone: vi.fn(),
  },
  nodes: {},
  materials: {},
  animations: [],
}));

// Mock useProgress hook
export const mockUseProgress = vi.fn(() => ({
  progress: 100,
  loaded: 10,
  total: 10,
  item: 'test.glb',
}));

// Setup function to apply all R3F mocks
export const setupR3FMocks = (): void => {
  vi.mock('@react-three/fiber', () => ({
    Canvas: MockCanvas,
    useFrame: mockUseFrame,
    useThree: mockUseThree,
    extend: mockExtend,
  }));

  vi.mock('@react-three/drei', () => ({
    useGLTF: mockUseGLTF,
    useProgress: mockUseProgress,
    AccumulativeShadows: ({ children }: { children?: React.ReactNode }) => children,
    RandomizedLight: () => null,
    Environment: () => null,
  }));
};

// Reset all mocks
export const resetR3FMocks = (): void => {
  clearFrameCallbacks();
  mockUseFrame.mockClear();
  mockUseThree.mockClear();
  mockExtend.mockClear();
  mockUseGLTF.mockClear();
  mockUseProgress.mockClear();
};
