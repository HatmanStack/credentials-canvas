/**
 * Mock Three.js objects for testing
 * These mocks simulate Three.js behavior without WebGL dependencies
 */

/**
 * Mock Three.js Vector3 for testing
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param z - Z coordinate
 * @returns Mock Vector3 object
 */
export const createMockVector3 = (x = 0, y = 0, z = 0) => ({
  x,
  y,
  z,
  copy: jest.fn(function(this: any, v: any) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }),
  set: jest.fn(function(this: any, x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }),
  lerp: jest.fn(function(this: any, v: any, alpha: number) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;
    return this;
  }),
  lerpVectors: jest.fn(function(
      this: any,
      v1: any,
      v2: any,
      alpha: number,
  ) {
    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;
    this.z = v1.z + (v2.z - v1.z) * alpha;
    return this;
  }),
  clone: jest.fn(function(this: any) {
    return createMockVector3(this.x, this.y, this.z);
  }),
});

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
    color: {set: jest.fn()},
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
  color: {set: jest.fn()},
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
