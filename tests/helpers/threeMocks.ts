import { vi, type Mock } from 'vitest';

type MockVector3 = {
  x: number;
  y: number;
  z: number;
  copy: Mock;
  set: Mock;
  lerp: Mock;
  lerpVectors: Mock;
  clone: Mock;
};

export const createMockVector3 = (x = 0, y = 0, z = 0): MockVector3 => {
  const vec = { x, y, z };

  const mockVector: MockVector3 = {
    get x() {
      return vec.x;
    },
    get y() {
      return vec.y;
    },
    get z() {
      return vec.z;
    },
    set x(value: number) {
      vec.x = value;
    },
    set y(value: number) {
      vec.y = value;
    },
    set z(value: number) {
      vec.z = value;
    },
    copy: vi.fn((v: MockVector3) => {
      vec.x = v.x;
      vec.y = v.y;
      vec.z = v.z;
      return mockVector;
    }),
    set: vi.fn((x: number, y: number, z: number) => {
      vec.x = x;
      vec.y = y;
      vec.z = z;
      return mockVector;
    }),
    lerp: vi.fn((v: MockVector3, alpha: number) => {
      vec.x += (v.x - vec.x) * alpha;
      vec.y += (v.y - vec.y) * alpha;
      vec.z += (v.z - vec.z) * alpha;
      return mockVector;
    }),
    lerpVectors: vi.fn((v1: MockVector3, v2: MockVector3, alpha: number) => {
      vec.x = v1.x + (v2.x - v1.x) * alpha;
      vec.y = v1.y + (v2.y - v1.y) * alpha;
      vec.z = v1.z + (v2.z - v1.z) * alpha;
      return mockVector;
    }),
    clone: vi.fn(() => {
      return createMockVector3(vec.x, vec.y, vec.z);
    }),
  } as MockVector3;

  return mockVector;
};

export const createMockScene = () => ({
  traverse: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
  children: [],
  getObjectByName: vi.fn(),
});

export const createMockCamera = () => ({
  position: createMockVector3(),
  rotation: createMockVector3(),
  lookAt: vi.fn(),
  updateProjectionMatrix: vi.fn(),
});

export const createMockMesh = (name = 'MockMesh') => ({
  name,
  position: createMockVector3(),
  rotation: createMockVector3(),
  scale: createMockVector3(1, 1, 1),
  visible: true,
  material: {
    color: { set: vi.fn() },
    opacity: 1,
  },
  geometry: {
    dispose: vi.fn(),
  },
  traverse: vi.fn(),
});

export const createMockLight = (name = 'MockLight', intensity = 1) => ({
  name,
  intensity,
  position: createMockVector3(),
  color: { set: vi.fn() },
});

export const createMockGLTF = () => ({
  scene: createMockScene(),
  scenes: [createMockScene()],
  cameras: [createMockCamera()],
  animations: [],
  asset: {},
});
