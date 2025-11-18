/**
 * Interaction Context for managing user interactions with the 3D scene
 *
 * TODO: Phase 2 - Replace with Zustand store
 *
 * This Context provides state for click interactions, scroll behavior,
 * camera positioning, and dragging state.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Interaction state interface
 */
export interface InteractionContextState {
  clickPoint: string | null;
  clickLight: string | null;
  clickCount: number;
  isCloseUpView: boolean;
  isDragging: boolean;
  hasScrollStarted: boolean;
  mobileScrollCount: number | null;
  currentCameraIndex: number;
  cameraProgress: number;
}

/**
 * Interaction action functions interface
 */
export interface InteractionContextActions {
  setClickPoint: (value: string | null) => void;
  setClickLight: (value: string | null) => void;
  setClickCount: (value: number) => void;
  setCloseUp: (value: boolean) => void;
  setIsDragging: (value: boolean) => void;
  setScrollStarted: (value: boolean) => void;
  setMobileScroll: (value: number | null) => void;
  setCurrentPosIndex: (value: number) => void;
  setCameraProgress: (value: number) => void;
}

/**
 * Combined interaction context value
 */
export type InteractionContextValue = InteractionContextState & InteractionContextActions;

const InteractionContext = createContext<InteractionContextValue | undefined>(undefined);

/**
 * Hook to access Interaction context
 *
 * @throws Error if used outside InteractionProvider
 */
export const useInteraction = (): InteractionContextValue => {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error('useInteraction must be used within an InteractionProvider');
  }
  return context;
};

/**
 * Props for InteractionProvider component
 */
export interface InteractionProviderProps {
  children: React.ReactNode;
}

/**
 * Interaction Context Provider component
 */
export const InteractionProvider: React.FC<InteractionProviderProps> = ({ children }) => {
  const [interactionState, setInteractionState] = useState<InteractionContextState>({
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
  const setClickPoint = useCallback((value: string | null): void => {
    setInteractionState(prev => ({ ...prev, clickPoint: value }));
  }, []);

  const setClickLight = useCallback((value: string | null): void => {
    setInteractionState(prev => ({ ...prev, clickLight: value }));
  }, []);

  const setClickCount = useCallback((value: number): void => {
    setInteractionState(prev => ({ ...prev, clickCount: value }));
  }, []);

  const setCloseUp = useCallback((value: boolean): void => {
    setInteractionState(prev => ({ ...prev, isCloseUpView: value }));
  }, []);

  const setIsDragging = useCallback((value: boolean): void => {
    setInteractionState(prev => ({ ...prev, isDragging: value }));
  }, []);

  const setScrollStarted = useCallback((value: boolean): void => {
    setInteractionState(prev => ({ ...prev, hasScrollStarted: value }));
  }, []);

  const setMobileScroll = useCallback((value: number | null): void => {
    setInteractionState(prev => ({ ...prev, mobileScrollCount: value }));
  }, []);

  const setCurrentPosIndex = useCallback((value: number): void => {
    setInteractionState(prev => ({ ...prev, currentCameraIndex: value }));
  }, []);

  const setCameraProgress = useCallback((value: number): void => {
    setInteractionState(prev => ({ ...prev, cameraProgress: value }));
  }, []);

  const value: InteractionContextValue = {
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
