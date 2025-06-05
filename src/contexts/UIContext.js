import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext();

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  const [uiState, setUIState] = useState({
    titleColorHue: null,
    showArcadeIframe: true,
    showMusicIframe: true,
    isAudioMuted: false
  });

  const [appState, setAppState] = useState({
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
  const setTitleColor = useCallback((value) => {
    setUIState(prev => ({ ...prev, titleColorHue: value }));
  }, []);

  const setIframe1 = useCallback((value) => {
    setUIState(prev => ({ ...prev, showArcadeIframe: value }));
  }, []);

  const setIframe2 = useCallback((value) => {
    setUIState(prev => ({ ...prev, showMusicIframe: value }));
  }, []);

  const setIsMuted = useCallback((value) => {
    setUIState(prev => ({ ...prev, isAudioMuted: value }));
  }, []);

  // App State setters
  const setVibe = useCallback((value) => {
    setAppState(prev => ({ ...prev, selectedVibe: value }));
  }, []);

  const setGLTF = useCallback((value) => {
    setAppState(prev => ({ ...prev, gltfModel: value }));
  }, []);

  const setPlayer = useCallback((value) => {
    setAppState(prev => ({ ...prev, videoPlayer: value }));
  }, []);

  const setWindowWidth = useCallback((value) => {
    setAppState(prev => ({ ...prev, screenWidth: value }));
  }, []);

  const setLightIntensity = useCallback((value) => {
    setAppState(prev => ({ ...prev, lightIntensity: value }));
  }, []);

  const value = {
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