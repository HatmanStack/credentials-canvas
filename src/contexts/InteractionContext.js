import React, { createContext, useContext, useState, useCallback } from 'react';

const InteractionContext = createContext();

export const useInteraction = () => {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error('useInteraction must be used within an InteractionProvider');
  }
  return context;
};

export const InteractionProvider = ({ children }) => {
  const [interactionState, setInteractionState] = useState({
    clickPoint: null,
    clickLight: null,
    clickCount: 0,
    isCloseUpView: false,
    isDragging: false,
    hasScrollStarted: false,
    mobileScrollCount: null,
    currentCameraIndex: 0,
    cameraProgress: 0
  });

  // Memoized setters to prevent unnecessary re-renders
  const setClickPoint = useCallback((value) => {
    setInteractionState(prev => ({ ...prev, clickPoint: value }));
  }, []);

  const setClickLight = useCallback((value) => {
    setInteractionState(prev => ({ ...prev, clickLight: value }));
  }, []);

  const setClickCount = useCallback((value) => {
    setInteractionState(prev => ({ ...prev, clickCount: value }));
  }, []);

  const setCloseUp = useCallback((value) => {
    setInteractionState(prev => ({ ...prev, isCloseUpView: value }));
  }, []);

  const setIsDragging = useCallback((value) => {
    setInteractionState(prev => ({ ...prev, isDragging: value }));
  }, []);

  const setScrollStarted = useCallback((value) => {
    setInteractionState(prev => ({ ...prev, hasScrollStarted: value }));
  }, []);

  const setMobileScroll = useCallback((value) => {
    setInteractionState(prev => ({ ...prev, mobileScrollCount: value }));
  }, []);

  const setCurrentPosIndex = useCallback((value) => {
    setInteractionState(prev => ({ ...prev, currentCameraIndex: value }));
  }, []);

  const setCameraProgress = useCallback((value) => {
    setInteractionState(prev => ({ ...prev, cameraProgress: value }));
  }, []);

  const value = {
    // State
    ...interactionState,
    
    // Setters
    setClickPoint,
    setClickLight,
    setClickCount,
    setCloseUp,
    setIsDragging,
    setScrollStarted,
    setMobileScroll,
    setCurrentPosIndex,
    setCameraProgress,
  };

  return (
    <InteractionContext.Provider value={value}>
      {children}
    </InteractionContext.Provider>
  );
};