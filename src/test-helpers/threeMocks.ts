/**
 * Mock Three.js objects for testing
 * These mocks simulate Three.js behavior without WebGL dependencies
 */

/**
 * Mock Three.js Vector3 type
 */
type MockVector3 = {
  x: number;
  y: number;
  z: number;
  copy: jest.Mock;
  set: jest.Mock;
  lerp: jest.Mock;
  lerpVectors: jest.Mock;
  clone: jest.Mock;
};

/**
 * Mock Three.js Vector3 for testing
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param z - Z coordinate
 * @returns Mock Vector3 object
 */
export const createMockVector3 = (x = 0, y = 0, z = 0): MockVector3 => {
  // Create mutable vector object that methods close over
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
    copy: jest.fn((v: MockVector3) => {
      vec.x = v.x;
      vec.y = v.y;
      vec.z = v.z;
      return mockVector;
    }),
    set: jest.fn((x: number, y: number, z: number) => {
      vec.x = x;
      vec.y = y;
      vec.z = z;
      return mockVector;
    }),
    lerp: jest.fn((v: MockVector3, alpha: number) => {
      vec.x += (v.x - vec.x) * alpha;
      vec.y += (v.y - vec.y) * alpha;
      vec.z += (v.z - vec.z) * alpha;
      return mockVector;
    }),
    lerpVectors: jest.fn((v1: MockVector3, v2: MockVector3, alpha: number) => {
      vec.x = v1.x + (v2.x - v1.x) * alpha;
      vec.y = v1.y + (v2.y - v1.y) * alpha;
      vec.z = v1.z + (v2.z - v1.z) * alpha;
      return mockVector;
    }),
    clone: jest.fn(() => {
      return createMockVector3(vec.x, vec.y, vec.z);
    }),
  } as MockVector3;

  return mockVector;
};

/**
 * Mock Three.js Scene for testing
 * @returns Mock Scene object
 */
export const createMockScene = () => ({
  traverse: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  children: [],
  getObjectByName: jest.fn(),
});

/**
 * Mock Three.js Camera for testing
 * @returns Mock Camera object
 */
export const createMockCamera = () => ({
  position: createMockVector3(),
  rotation: createMockVector3(),
  lookAt: jest.fn(),
  updateProjectionMatrix: jest.fn(),
});

/**
 * Mock Three.js Mesh for testing
 * @param name - Mesh name
 * @returns Mock Mesh object
 */
export const createMockMesh = (name = 'MockMesh') => ({
  name,
  position: createMockVector3(),
  rotation: createMockVector3(),
  scale: createMockVector3(1, 1, 1),
  visible: true,
  material: {
    color: { set: jest.fn() },
    opacity: 1,
  },
  geometry: {
    dispose: jest.fn(),
  },
  traverse: jest.fn(),
});

/**
 * Mock Three.js Light for testing
 * @param name - Light name
 * @param intensity - Light intensity
 * @returns Mock Light object
 */
export const createMockLight = (name = 'MockLight', intensity = 1) => ({
  name,
  intensity,
  position: createMockVector3(),
  color: { set: jest.fn() },
});

/**
 * Mock GLTF loader result for testing
 * @returns Mock GLTF object
 */
export const createMockGLTF = () => ({
  scene: createMockScene(),
  scenes: [createMockScene()],
  cameras: [createMockCamera()],
  animations: [],
  asset: {},
});
