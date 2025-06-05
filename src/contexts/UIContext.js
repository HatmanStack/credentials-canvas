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
    titleColor: null,
    iframe1: true,
    iframe2: true,
    isMuted: false,
    graphics: false
  });

  const [appState, setAppState] = useState({
    vibe: null,
    gltf: null,
    player: null,
    windowWidth: window.innerWidth,
    lightIntensity: {
      sliderName: "Slider_4",
      intensity: 10,
    }
  });

  // UI State setters
  const setTitleColor = useCallback((value) => {
    setUIState(prev => ({ ...prev, titleColor: value }));
  }, []);

  const setIframe1 = useCallback((value) => {
    setUIState(prev => ({ ...prev, iframe1: value }));
  }, []);

  const setIframe2 = useCallback((value) => {
    setUIState(prev => ({ ...prev, iframe2: value }));
  }, []);

  const setIsMuted = useCallback((value) => {
    setUIState(prev => ({ ...prev, isMuted: value }));
  }, []);

  const setGraphics = useCallback((value) => {
    setUIState(prev => ({ ...prev, graphics: value }));
  }, []);

  // App State setters
  const setVibe = useCallback((value) => {
    setAppState(prev => ({ ...prev, vibe: value }));
  }, []);

  const setGLTF = useCallback((value) => {
    setAppState(prev => ({ ...prev, gltf: value }));
  }, []);

  const setPlayer = useCallback((value) => {
    setAppState(prev => ({ ...prev, player: value }));
  }, []);

  const setWindowWidth = useCallback((value) => {
    setAppState(prev => ({ ...prev, windowWidth: value }));
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
    setGraphics,
    
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