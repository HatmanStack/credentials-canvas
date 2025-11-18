/**
 * Barrel exports for all context providers and hooks
 *
 * TODO: Phase 2 - This file will be removed when migrating to Zustand
 */

// UI Context
export { UIProvider, useUI } from './UIContext';
export type { UIContextState, UIContextActions, UIContextValue, UIProviderProps } from './UIContext';

// Interaction Context
export { InteractionProvider, useInteraction } from './InteractionContext';
export type { InteractionContextState, InteractionContextActions, InteractionContextValue, InteractionProviderProps } from './InteractionContext';
