import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import * as THREE from 'three';

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
  Html: ({ children, className }: { children: React.ReactNode; className: string }) => (
    <div data-testid="html-wrapper" data-classname={className}>{children}</div>
  ),
}));

let mockShouldShowArcadeIframe = false;
let mockCurrentWindowWidth = 1920;
let mockThreeJSSceneModel: unknown = null;

vi.mock('@/stores', () => ({
  useUserInterfaceStore: vi.fn((selector: (state: Record<string, unknown>) => unknown) => {
    const state = {
      currentWindowWidth: mockCurrentWindowWidth,
      selectedThemeConfiguration: { id: '0', name: 'urban' },
      shouldShowArcadeIframe: mockShouldShowArcadeIframe,
    };
    return selector(state);
  }),
  useThreeJSSceneStore: vi.fn((selector: (state: Record<string, unknown>) => unknown) => {
    const state = {
      threeJSSceneModel: mockThreeJSSceneModel,
    };
    return selector(state);
  }),
}));

import { ArcadeIframe } from '@/components/three/ArcadeIframe';

describe('ArcadeIframe', () => {
  let sceneNode: THREE.Object3D;

  beforeEach(() => {
    sceneNode = new THREE.Object3D();
    mockShouldShowArcadeIframe = false;
    mockCurrentWindowWidth = 1920;
    mockThreeJSSceneModel = null;
    vi.clearAllMocks();
    cleanup();
  });

  it('should render the arcade iframe element', () => {
    const { container } = render(<ArcadeIframe sceneNode={sceneNode} />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute('title')).toBe('Arcade Content');
  });

  it('should hide iframe when shouldShowArcadeIframe is false', () => {
    mockShouldShowArcadeIframe = false;
    const { container } = render(<ArcadeIframe sceneNode={sceneNode} />);
    const iframe = container.querySelector('iframe');
    expect(iframe?.style.display).toBe('none');
  });

  it('should show iframe when shouldShowArcadeIframe is true', () => {
    mockShouldShowArcadeIframe = true;
    const { container } = render(<ArcadeIframe sceneNode={sceneNode} />);
    const iframe = container.querySelector('iframe');
    expect(iframe?.style.display).toBe('block');
  });

  it('should use arcadewrapper class for desktop width', () => {
    mockCurrentWindowWidth = 1920;
    const { getByTestId } = render(<ArcadeIframe sceneNode={sceneNode} />);
    const htmlWrapper = getByTestId('html-wrapper');
    expect(htmlWrapper.getAttribute('data-classname')).toBe('arcadewrapper');
  });

  it('should use arcadewrapper-small class for mobile width', () => {
    mockCurrentWindowWidth = 600;
    const { getByTestId } = render(<ArcadeIframe sceneNode={sceneNode} />);
    const htmlWrapper = getByTestId('html-wrapper');
    expect(htmlWrapper.getAttribute('data-classname')).toBe('arcadewrapper-small');
  });

  it('should set iframe src from theme configuration', () => {
    const { container } = render(<ArcadeIframe sceneNode={sceneNode} />);
    const iframe = container.querySelector('iframe');
    // Theme id '0' maps to THEME_IFRAME_URL_CONFIGURATIONS[0].iframe1
    expect(iframe?.src).toContain('freepacman.org');
  });
});
