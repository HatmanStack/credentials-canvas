import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import * as THREE from 'three';

// Track drag callback for testing
let capturedDragCallback: ((state: { down: boolean; movement: [number, number] }) => void) | null = null;

vi.mock('@react-spring/three', () => {
  const springValue = {
    get: () => 0.538,
    to: vi.fn((fn: (v: number) => number) => fn(0.538)),
  };
  return {
    useSpring: vi.fn(() => [{ y: springValue }, { start: vi.fn() }]),
    animated: {
      primitive: React.forwardRef(
        (props: Record<string, unknown>, ref: React.Ref<unknown>) => (
          <div ref={ref as React.Ref<HTMLDivElement>} data-testid="animated-primitive" {...filterProps(props)} />
        )
      ),
    },
  };
});

// Filter out non-DOM props to avoid React warnings
function filterProps(props: Record<string, unknown>) {
  const domProps: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (['data-testid', 'children', 'className', 'style', 'id'].includes(key)) {
      domProps[key] = props[key];
    }
  }
  return domProps;
}

vi.mock('@use-gesture/react', () => ({
  useDrag: vi.fn((callback: (state: { down: boolean; movement: [number, number] }) => void) => {
    capturedDragCallback = callback;
    return () => ({ onPointerDown: vi.fn() });
  }),
}));

const mockSetIsUserCurrentlyDragging = vi.fn();
const mockSetCurrentLightIntensityConfiguration = vi.fn();

vi.mock('@/stores', () => ({
  useSceneInteractionStore: vi.fn((selector: (state: Record<string, unknown>) => unknown) => {
    const state = {
      setIsUserCurrentlyDragging: mockSetIsUserCurrentlyDragging,
    };
    return selector(state);
  }),
  useUserInterfaceStore: vi.fn((selector: (state: Record<string, unknown>) => unknown) => {
    const state = {
      setCurrentLightIntensityConfiguration: mockSetCurrentLightIntensityConfiguration,
    };
    return selector(state);
  }),
}));

import { SliderController } from '@/components/three/SliderController';

describe('SliderController', () => {
  let sceneNode: THREE.Object3D;

  beforeEach(() => {
    sceneNode = new THREE.Object3D();
    capturedDragCallback = null;
    vi.clearAllMocks();
  });

  it('should render the animated primitive element', () => {
    const { getByTestId } = render(<SliderController sceneNode={sceneNode} />);
    expect(getByTestId('animated-primitive')).toBeTruthy();
  });

  it('should register a drag handler via useDrag', () => {
    render(<SliderController sceneNode={sceneNode} />);
    expect(capturedDragCallback).toBeTypeOf('function');
  });

  it('should set isDragging to true when drag starts', () => {
    render(<SliderController sceneNode={sceneNode} />);
    expect(capturedDragCallback).toBeTruthy();

    capturedDragCallback!({ down: true, movement: [0, -10] });
    expect(mockSetIsUserCurrentlyDragging).toHaveBeenCalledWith(true);
  });

  it('should set isDragging to false when drag ends', () => {
    render(<SliderController sceneNode={sceneNode} />);
    expect(capturedDragCallback).toBeTruthy();

    capturedDragCallback!({ down: false, movement: [0, 0] });
    expect(mockSetIsUserCurrentlyDragging).toHaveBeenCalledWith(false);
  });

  it('should update light intensity on drag', () => {
    render(<SliderController sceneNode={sceneNode} />);
    expect(capturedDragCallback).toBeTruthy();

    capturedDragCallback!({ down: true, movement: [0, -10] });
    expect(mockSetCurrentLightIntensityConfiguration).toHaveBeenCalledWith(
      expect.objectContaining({
        sliderName: 'Slider_4',
        intensity: expect.any(Number),
      })
    );
  });
});
