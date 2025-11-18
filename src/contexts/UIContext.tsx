/**
 * UI Context for managing UI state
 *
 * TODO: Phase 2 - Replace with Zustand store
 *
 * This Context provides UI-related state including theme selection,
 * iframe visibility, audio state, window dimensions, and lighting controls.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { VibeThemeConfiguration, LightIntensityConfiguration } from 'types';

/**
 * UI state interface
 */
export interface UIContextState {
  titleColorHue: number | null;
  showArcadeIframe: boolean;
  showMusicIframe: boolean;
  isAudioMuted: boolean;
  selectedVibe: VibeThemeConfiguration | null;
  gltfModel: any;
  videoPlayer: HTMLVideoElement | null;
  screenWidth: number;
  lightIntensity: LightIntensityConfiguration;
}

/**
 * UI action functions interface
 */
export interface UIContextActions {
  setTitleColor: (value: number | null) => void;
  setIframe1: (value: boolean) => void;
  setIframe2: (value: boolean) => void;
  setIsMuted: (value: boolean) => void;
  setVibe: (value: VibeThemeConfiguration | null) => void;
  setGLTF: (value: THREE.Scene | null) => void;
  setPlayer: (value: HTMLVideoElement | null) => void;
  setWindowWidth: (value: number) => void;
  setLightIntensity: (value: LightIntensityConfiguration) => void;
}

/**
 * Combined UI context value
 */
export type UIContextValue = UIContextState & UIContextActions;

const UIContext = createContext<UIContextValue | undefined>(undefined);

/**
 * Hook to access UI context
 *
 * @throws Error if used outside UIProvider
 */
export const useUI = (): UIContextValue => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

/**
 * Props for UIProvider component
 */
export interface UIProviderProps {
  children: React.ReactNode;
}

/**
 * UI Context Provider component
 */
export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [uiState, setUIState] = useState<Omit<UIContextState, 'selectedVibe' | 'gltfModel' | 'videoPlayer' | 'screenWidth' | 'lightIntensity'>>({
    titleColorHue: null,
    showArcadeIframe: true,
    showMusicIframe: true,
    isAudioMuted: false
  });

  const [appState, setAppState] = useState<Pick<UIContextState, 'selectedVibe' | 'gltfModel' | 'videoPlayer' | 'screenWidth' | 'lightIntensity'>>({
    selectedVibe: null,
    gltfModel: null,
    videoPlayer: null,
    screenWidth: window.innerWidth,
    lightIntensity: {
      sliderName: "Slider_4",
      intensity: 10,
    }
  });

  // UI State setters
  const setTitleColor = useCallback((value: number | null): void => {
    setUIState(prev => ({ ...prev, titleColorHue: value }));
  }, []);

  const setIframe1 = useCallback((value: boolean): void => {
    setUIState(prev => ({ ...prev, showArcadeIframe: value }));
  }, []);

  const setIframe2 = useCallback((value: boolean): void => {
    setUIState(prev => ({ ...prev, showMusicIframe: value }));
  }, []);

  const setIsMuted = useCallback((value: boolean): void => {
    setUIState(prev => ({ ...prev, isAudioMuted: value }));
  }, []);

  // App State setters
  const setVibe = useCallback((value: VibeThemeConfiguration | null): void => {
    setAppState(prev => ({ ...prev, selectedVibe: value }));
  }, []);

  const setGLTF = useCallback((value: THREE.Scene | null): void => {
    setAppState(prev => ({ ...prev, gltfModel: value }));
  }, []);

  const setPlayer = useCallback((value: HTMLVideoElement | null): void => {
    setAppState(prev => ({ ...prev, videoPlayer: value }));
  }, []);

  const setWindowWidth = useCallback((value: number): void => {
    setAppState(prev => ({ ...prev, screenWidth: value }));
  }, []);

  const setLightIntensity = useCallback((value: LightIntensityConfiguration): void => {
    setAppState(prev => ({ ...prev, lightIntensity: value }));
  }, []);

  const value: UIContextValue = {
    // UI State
    ...uiState,

    // App State
    ...appState,

    // UI Setters
    setTitleColor,
    setIframe1,
    setIframe2,
    setIsMuted,

    // App Setters
    setVibe,
    setGLTF,
    setPlayer,
    setWindowWidth,
    setLightIntensity,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};
