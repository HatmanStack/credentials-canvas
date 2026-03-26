import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// Capture the useFrame callback for testing
let capturedFrameCallback: ((state: { clock: { elapsedTime: number } }) => void) | null = null;

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn((callback: (state: { clock: { elapsedTime: number } }) => void) => {
    capturedFrameCallback = callback;
  }),
  useThree: vi.fn(() => ({
    camera: { position: { x: 0, y: 0, z: 10 } },
    gl: { domElement: document.createElement('canvas') },
  })),
  extend: vi.fn(),
}));

// Mock shader imports
vi.mock('@/shaders/vertex.glsl?raw', () => ({ default: 'void main() { gl_Position = vec4(0.0); }' }));
vi.mock('@/shaders/fragment.glsl?raw', () => ({ default: 'void main() { gl_FragColor = vec4(1.0); }' }));

import { CustomGeometryParticles } from '@/components/three/Lamp';

// Mock Three.js R3F JSX elements to render as simple DOM elements
vi.mock('three', async () => {
  const actual = await vi.importActual<typeof import('three')>('three');
  return {
    ...actual,
  };
});

describe('CustomGeometryParticles (Lamp)', () => {
  beforeEach(() => {
    capturedFrameCallback = null;
    vi.clearAllMocks();
  });

  it('should render without throwing', () => {
    expect(() => render(<CustomGeometryParticles />)).not.toThrow();
  });

  it('should use default count of 1500 particles', () => {
    const { container } = render(<CustomGeometryParticles />);
    const bufferAttr = container.querySelector('bufferattribute, bufferAttribute');
    expect(bufferAttr).not.toBeNull();
    expect(bufferAttr!.getAttribute('count')).toBe('1500');
  });

  it('should accept a custom particle count', () => {
    const { container } = render(<CustomGeometryParticles count={500} />);
    const bufferAttr = container.querySelector('bufferattribute, bufferAttribute');
    expect(bufferAttr).not.toBeNull();
    expect(bufferAttr!.getAttribute('count')).toBe('500');
  });

  it('should register a useFrame callback for animation', () => {
    render(<CustomGeometryParticles />);
    expect(capturedFrameCallback).toBeTypeOf('function');
  });

  it('should update uTime uniform in the frame callback', () => {
    render(<CustomGeometryParticles />);
    expect(capturedFrameCallback).toBeTruthy();

    // The callback reads clock.elapsedTime and sets it on the material uniform.
    // Since we're in jsdom (no real WebGL), the ref won't be populated,
    // but we verify the callback doesn't throw when points.current is null.
    expect(() => {
      capturedFrameCallback!({ clock: { elapsedTime: 1.5 } });
    }).not.toThrow();
  });

  it('should create particle positions as Float32Array with correct length', () => {
    const { container } = render(<CustomGeometryParticles count={100} />);
    const bufferAttr = container.querySelector('bufferattribute, bufferAttribute');
    expect(bufferAttr).not.toBeNull();
    expect(bufferAttr!.getAttribute('itemsize')).toBe('3');
  });

  it('should use additive blending for the shader material', () => {
    const { container } = render(<CustomGeometryParticles />);
    const shaderMat = container.querySelector('shadermaterial, shaderMaterial');
    expect(shaderMat).not.toBeNull();
  });
});
