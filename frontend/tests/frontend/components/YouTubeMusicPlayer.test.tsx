import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
  Html: ({ children }: { children: React.ReactNode }) => <div data-testid="html-wrapper">{children}</div>,
}));

// Mock stores
const mockSetHTMLVideoPlayerElement = vi.fn();
vi.mock('@/stores', () => ({
  useUserInterfaceStore: vi.fn((selector: (state: Record<string, unknown>) => unknown) => {
    const state = {
      selectedThemeConfiguration: { id: '0', name: 'urban' },
      shouldShowMusicIframe: true,
    };
    return selector(state);
  }),
  useThreeJSSceneStore: vi.fn((selector: (state: Record<string, unknown>) => unknown) => {
    const state = {
      setHTMLVideoPlayerElement: mockSetHTMLVideoPlayerElement,
    };
    return selector(state);
  }),
}));

// Mock shaders
vi.mock('@/shaders/vertex.glsl?raw', () => ({ default: 'void main() {}' }));
vi.mock('@/shaders/fragment.glsl?raw', () => ({ default: 'void main() {}' }));

import { YouTubeMusicPlayer } from '@/components/three/YouTubeMusicPlayer';

describe('YouTubeMusicPlayer', () => {
  let sceneNode: THREE.Object3D;

  beforeEach(() => {
    sceneNode = new THREE.Object3D();
    vi.clearAllMocks();
    // Clean up any YouTube scripts from previous tests
    document.querySelectorAll('script[src*="youtube.com"]').forEach(s => s.remove());
    // Reset window.YT
    delete (window as Record<string, unknown>).YT;
    delete (window as Record<string, unknown>).onYouTubeIframeAPIReady;
  });

  afterEach(() => {
    cleanup();
    document.querySelectorAll('script[src*="youtube.com"]').forEach(s => s.remove());
  });

  it('should render the music iframe element', () => {
    const { container } = render(<YouTubeMusicPlayer sceneNode={sceneNode} />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute('title')).toBe('Music Player');
  });

  it('should inject YouTube API script tag when not already present', () => {
    render(<YouTubeMusicPlayer sceneNode={sceneNode} />);
    const scripts = document.querySelectorAll('script[src*="youtube.com/iframe_api"]');
    expect(scripts.length).toBe(1);
  });

  it('should not inject duplicate script when YouTube API script already exists', () => {
    // Pre-add a script tag
    const existingScript = document.createElement('script');
    existingScript.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(existingScript);

    render(<YouTubeMusicPlayer sceneNode={sceneNode} />);

    const scripts = document.querySelectorAll('script[src*="youtube.com/iframe_api"]');
    expect(scripts.length).toBe(1);
  });

  it('should create player when window.YT is already available', () => {
    const mockDestroy = vi.fn();
    const mockPlayer = { isMuted: vi.fn(), mute: vi.fn(), unMute: vi.fn(), destroy: mockDestroy };
    function MockPlayer() { return mockPlayer; }
    (window as Record<string, unknown>).YT = {
      Player: MockPlayer,
    };

    render(<YouTubeMusicPlayer sceneNode={sceneNode} />);
    expect(mockSetHTMLVideoPlayerElement).toHaveBeenCalledWith(mockPlayer);
  });

  it('should clean up script tag and player on unmount when script was injected', () => {
    // No window.YT, so the script injection path runs (which has cleanup)
    const { unmount } = render(<YouTubeMusicPlayer sceneNode={sceneNode} />);

    // Script was injected
    expect(document.querySelectorAll('script[src*="youtube.com/iframe_api"]').length).toBe(1);

    unmount();

    // Script should be removed from document body on cleanup
    expect(document.querySelectorAll('script[src*="youtube.com/iframe_api"]').length).toBe(0);
  });

  it('should initialize player via onYouTubeIframeAPIReady callback', () => {
    render(<YouTubeMusicPlayer sceneNode={sceneNode} />);

    // Script was injected (no window.YT on mount)
    expect(document.querySelectorAll('script[src*="youtube.com/iframe_api"]').length).toBe(1);

    // Simulate YouTube API becoming ready
    const mockDestroy = vi.fn();
    const mockPlayer = { isMuted: vi.fn(), mute: vi.fn(), unMute: vi.fn(), destroy: mockDestroy };
    function MockPlayer() { return mockPlayer; }
    (window as Record<string, unknown>).YT = { Player: MockPlayer };

    // Invoke the callback the component registered
    expect(window.onYouTubeIframeAPIReady).toBeTypeOf('function');
    window.onYouTubeIframeAPIReady!();

    expect(mockSetHTMLVideoPlayerElement).toHaveBeenCalledWith(mockPlayer);
  });

  it('should set iframe src from theme configuration', () => {
    const { container } = render(<YouTubeMusicPlayer sceneNode={sceneNode} />);
    const iframe = container.querySelector('iframe');
    // Theme id '0' maps to THEME_IFRAME_URL_CONFIGURATIONS[0].iframe2
    expect(iframe?.src).toContain('youtube.com/embed');
  });
});
