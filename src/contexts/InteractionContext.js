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
    closeUp: false,
    isDragging: false,
    scrollStarted: false,
    mobileScroll: null
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
    setInteractionState(prev => ({ ...prev, closeUp: value }));
  }, []);

  const setIsDragging = useCallback((value) => {
    setInteractionState(prev => ({ ...prev, isDragging: value }));
  }, []);

  const setScrollStarted = useCallback((value) => {
    setInteractionState(prev => ({ ...prev, scrollStarted: value }));
  }, []);

  const setMobileScroll = useCallback((value) => {
    setInteractionState(prev => ({ ...prev, mobileScroll: value }));
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
  };

  return (
    <InteractionContext.Provider value={value}>
      {children}
    </InteractionContext.Provider>
  );
};