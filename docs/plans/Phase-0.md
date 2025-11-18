# Phase 0: Foundation & Architecture

## Overview

This document contains the architectural foundation that applies to ALL implementation phases. Read this document completely before starting any phase. Return to this document when you need clarification on design decisions, naming conventions, or architectural patterns.

**Purpose:** Establish consistent patterns, conventions, and technical decisions that will guide all implementation work.

---

## Architecture Decision Records (ADRs)

### ADR-001: Full TypeScript Migration

**Decision:** Convert entire codebase from JavaScript to TypeScript

**Rationale:**
- **Type Safety:** Catch errors at compile time, especially critical for complex Three.js object manipulation
- **Developer Experience:** Better IDE autocomplete, inline documentation, refactoring tools
- **Industry Standard:** TypeScript is the de facto standard for new React projects in 2025
- **Three.js Integration:** Strong type definitions available for Three.js reduce runtime errors
- **Maintainability:** Explicit types serve as living documentation

**Alternatives Considered:**
- JSDoc with type hints: Less powerful, no compile-time checking
- Incremental adoption: Creates inconsistent codebase, deferred benefits
- PropTypes: Runtime only, verbose, less powerful than TypeScript

**Implications:**
- All `.js` → `.tsx` (components) or `.ts` (utilities)
- Add type definitions for all props, state, functions
- Configure strict TypeScript settings
- Learning curve for TypeScript concepts (generics, unions, etc.)

### ADR-002: Zustand for State Management

**Decision:** Replace React Context API with Zustand

**Rationale:**
- **Performance:** Context causes re-renders across all consumers even when unrelated state changes. Zustand uses selectors for granular subscriptions
- **Developer Experience:** Simpler API, less boilerplate than Context + useReducer
- **Bundle Size:** Zustand is tiny (~1kb gzipped) vs Redux (~10kb)
- **Three.js Optimization:** Frequent state updates (camera position, click counts) benefit from Zustand's performance
- **Debugging:** Better dev tools, easier to trace state changes
- **Scalability:** Easier to split stores by domain without provider nesting

**Current Problems with Context:**
```javascript
// Problem: Every UI state change re-renders ALL consumers
const { titleColorHue, showArcadeIframe, screenWidth, lightIntensity } = useUI();
// Even components only using screenWidth re-render when titleColorHue changes
```

**Zustand Solution:**
```typescript
// Only re-renders when screenWidth changes
const screenWidth = useUIStore(state => state.screenWidth);
```

**Alternatives Considered:**
- Keep Context with optimization: Still has fundamental limitations
- Redux Toolkit: Overkill for this project size, more boilerplate
- Jotai/Recoil: Atomic approach, but steeper learning curve

**Implications:**
- Remove Context providers and hooks
- Create Zustand stores organized by domain
- Migrate all state consumers to Zustand selectors
- Update component hierarchy (remove Provider wrappers)

### ADR-003: Layer-Based Component Organization

**Decision:** Organize components by technical layer, not feature

**Structure:**
```
src/
├── components/
│   ├── three/         # WebGL/Three.js components
│   ├── controls/      # Interaction controllers (camera, animations)
│   └── ui/            # DOM-based UI components
├── hooks/             # Custom React hooks
├── stores/            # Zustand state stores
├── types/             # TypeScript type definitions
├── constants/         # Configuration and constants
└── utils/             # Pure utility functions
```

**Rationale:**
- **Clear Separation:** Three.js (WebGL) vs DOM components have different concerns
- **Three.js Architecture:** Industry pattern in Three.js apps (r3f documentation uses this)
- **Mental Model:** Developers think about "3D scene", "controls", "UI" as distinct layers
- **Import Clarity:** `from 'components/three/SceneModel'` makes purpose obvious
- **Performance Optimization:** Easier to optimize render performance by layer

**Alternatives Considered:**
- Feature-based (features/scene, features/audio): Less natural for Three.js split
- Atomic design: Too abstract for this project's needs
- Flat structure: Doesn't scale, harder to navigate

**Implications:**
- Move Model → components/three/SceneModel
- Move CameraControls → components/controls/CameraController
- Move LaunchScreen → components/ui/LaunchScreen
- Update all import paths

### ADR-004: Descriptive & Explicit Naming Convention

**Decision:** Use long, self-documenting names throughout codebase

**Philosophy:** Code is read 10x more than written. Prioritize clarity over brevity.

**Examples:**
```typescript
// Before (ambiguous)
const gltfModel = useUI();
const selectedVibe = state.vibe;
function handleClick() { }

// After (explicit)
const threeJSSceneModel = useUIStore(state => state.threeJSSceneModel);
const selectedThemeConfiguration = state.selectedThemeConfiguration;
function handleMeshClickInteraction() { }
```

**Rationale:**
- **Onboarding:** New developers understand code without context
- **Maintenance:** Less time spent deciphering abbreviations
- **Refactoring:** Explicit names make search/replace safer
- **TypeScript Synergy:** Types + descriptive names = self-documenting code

**Naming Rules:**
1. **Variables:** camelCase, descriptive noun phrases
2. **Functions:** camelCase, descriptive verb phrases
3. **Components:** PascalCase, descriptive noun
4. **Types/Interfaces:** PascalCase, often `{ComponentName}Props`
5. **Constants:** SCREAMING_SNAKE_CASE or camelCase config objects
6. **Files:** PascalCase (components), camelCase (utilities)

**Common Patterns:**
- `handle{Action}{Context}` → `handleMuteButtonClick`, `handleCameraScrollAnimation`
- `is{State}` / `has{State}` → `isAudioMuted`, `hasUserScrolledScene`
- `set{Property}` → `setSelectedThemeConfiguration`, `setAudioMutedState`
- `use{Purpose}` → `useCameraScrollBehavior`, `useThreeJSSceneInteraction`

**Alternatives Considered:**
- Concise naming: Prioritizes typing speed over reading comprehension
- Domain-specific jargon: Less accessible to new team members

**Implications:**
- Systematic renaming of all variables, functions, components
- Update all import statements
- Potential git history complexity (use `git log --follow`)

### ADR-005: Tailwind CSS with Custom CSS Exceptions

**Decision:** Migrate to Tailwind CSS utility classes, preserve complex custom CSS where appropriate

**What Stays Custom CSS:**
- `checkbox.css` - Complex animations with keyframes and pseudo-elements
- Custom Three.js-related animations if they exist
- Theme variable definitions

**What Migrates to Tailwind:**
- Layout classes (flexbox, positioning)
- Spacing (margin, padding)
- Sizing (width, height)
- Basic styling (colors, borders, shadows)
- Responsive breakpoints

**Rationale:**
- **Developer Velocity:** Tailwind classes faster than writing custom CSS
- **Consistency:** Design system built-in (spacing scale, colors)
- **Bundle Size:** PurgeCSS removes unused utilities
- **Maintenance:** No need to name CSS classes, no orphaned styles
- **Pragmatism:** Custom CSS warranted for complex animations (checkbox)

**Implementation Strategy:**
```typescript
// Before
<div className="button-container">
  <button className="navigate" />
</div>

// After
<div className="relative h-full">
  <button className="w-12 h-12 absolute bottom-0 left-0 rounded-full
                     bg-rest-color active:bg-active-color" />
</div>

// For complex patterns, use utility function
import { cn } from 'utils/classNames';
<button className={cn(
  "w-12 h-12 rounded-full",
  isActive && "bg-active-color",
  "hover:scale-95 transition-transform"
)} />
```

**Alternatives Considered:**
- CSS Modules: Scoping without utility classes, more custom CSS
- Styled Components: CSS-in-JS with runtime cost
- Keep current CSS: Misses modernization benefits

**Implications:**
- Install Tailwind dependencies
- Configure tailwind.config.js with custom colors
- Create utility functions for conditional classes
- Gradually migrate each component's styles
- Preserve checkbox.css and import alongside Tailwind

### ADR-006: Unit Testing Only (Phase 1)

**Decision:** Implement unit tests for business logic, hooks, and utilities. Defer integration and E2E tests.

**Scope:**
- ✅ **Test:** Pure functions (utils, calculations)
- ✅ **Test:** Custom hooks (useCameraScroll, useLightController)
- ✅ **Test:** Zustand stores (state updates, actions)
- ✅ **Test:** Business logic (click handlers, scroll logic)
- ❌ **Defer:** Component rendering (too coupled to Three.js)
- ❌ **Defer:** E2E user flows (requires Playwright setup)
- ❌ **Defer:** Visual regression tests (requires Storybook/Chromatic)

**Rationale:**
- **Quick Wins:** Test high-value logic with minimal setup
- **Three.js Complexity:** Mocking WebGL is complex and brittle
- **ROI Focus:** Business logic has highest bug risk
- **Incremental:** Can add integration tests later
- **Performance:** Unit tests run fast, enable TDD workflow

**Testing Philosophy:**
- **Arrange-Act-Assert** pattern
- **Test behavior, not implementation**
- **Mock external dependencies (Three.js, DOM APIs)**
- **Descriptive test names:** `it('should increment camera index when user scrolls down')`

**Tools:**
- **Jest:** Test runner
- **React Testing Library:** Hook testing utilities
- **jest-environment-jsdom:** DOM simulation
- **@testing-library/user-event:** User interaction simulation

**Alternatives Considered:**
- Full integration tests: Too much complexity for initial implementation
- E2E with Playwright: Overkill for validating refactoring equivalence
- No tests: Risks regression bugs during refactoring

**Implications:**
- Configure Jest in package.json
- Create test files adjacent to source (`*.test.ts`)
- Write tests for all hooks and utilities
- Mock Zustand stores in tests
- Establish coverage baseline (target 80%+ for business logic)

---

## Design Decisions & Rationale

### Naming Convention Reference

#### File Naming

| File Type | Convention | Example |
|-----------|-----------|---------|
| React Component | PascalCase.tsx | `SceneModel.tsx`, `CameraController.tsx`, `LaunchScreen.tsx` |
| Custom Hook | camelCase.ts | `useCameraScrollBehavior.ts`, `useThreeJSSceneInteraction.ts` |
| Zustand Store | camelCase.ts | `sceneInteractionStore.ts`, `userInterfaceStore.ts` |
| Type Definitions | camelCase.ts | `threeJSTypes.ts`, `cameraTypes.ts` |
| Constants | camelCase.ts | `cameraConfiguration.ts`, `lightingConfiguration.ts` |
| Utility Functions | camelCase.ts | `classNameUtils.ts`, `vectorCalculations.ts` |

#### Variable & Function Naming

```typescript
// ✅ GOOD - Explicit and clear
const threeJSSceneModel: THREE.Scene
const isAudioCurrentlyMuted: boolean
const hasUserStartedScrolling: boolean
const selectedThemeConfiguration: ThemeConfiguration
const currentCameraPositionIndex: number

function handleMobileNavigationButtonClick(): void
function handleThreeJSMeshClickInteraction(event: ThreeEvent<MouseEvent>): void
function initializeVideoTextureForMesh(meshName: string): void
function calculateInterpolatedCameraPosition(progress: number): Vector3

// ❌ BAD - Ambiguous, abbreviated
const gltf: any
const muted: boolean
const scroll: boolean
const vibe: any
const idx: number

function onClick(): void
function handle(e: any): void
function init(name: string): void
function calc(p: number): Vector3
```

#### Component Naming

```typescript
// Component file: SceneModel.tsx
export const SceneModel: React.FC<SceneModelProps> = (props) => { }

// Component file: CameraController.tsx
export const CameraController: React.FC<CameraControllerProps> = (props) => { }

// Component file: AudioMuteButton.tsx
export const AudioMuteButton: React.FC<AudioMuteButtonProps> = (props) => { }
```

#### Type Naming

```typescript
// Props types
interface SceneModelProps {
  threeJSSceneModel: THREE.Scene;
  enableInteractions: boolean;
}

// State types
interface CameraPositionState {
  currentCameraPositionIndex: number;
  interpolationProgress: number;
  isAnimating: boolean;
}

// Configuration types
interface ThemeConfiguration {
  themeIdentifier: string;
  titleColorHue: number;
  activeButtonColor: string;
  restingButtonColor: string;
}

// Event handler types
type MeshClickHandler = (event: ThreeEvent<MouseEvent>) => void;
type ScrollEventHandler = (deltaY: number) => void;
```

### Directory Structure

```
src/
├── components/
│   ├── three/
│   │   ├── SceneModel.tsx              # Main 3D model
│   │   ├── SceneEnvironment.tsx        # Lighting and environment
│   │   ├── InteractiveMeshElement.tsx  # Clickable 3D objects
│   │   ├── VideoTextureMesh.tsx        # Video-textured meshes
│   │   └── LightMeshElement.tsx        # Interactive lights
│   │
│   ├── controls/
│   │   ├── CameraController.tsx        # Camera positioning logic
│   │   ├── SceneAnimationController.tsx # Animation orchestration
│   │   └── AudioController.tsx         # Sound management
│   │
│   └── ui/
│       ├── LaunchScreen.tsx            # Initial loading screen
│       ├── ThemeSelectionOption.tsx    # Theme/vibe selector
│       ├── CustomCheckbox.tsx          # Custom checkbox component
│       ├── MobileNavigationButton.tsx  # Mobile scroll button
│       └── AudioMuteButton.tsx         # Audio mute toggle
│
├── hooks/
│   ├── useCameraScrollBehavior.ts      # Camera scroll logic
│   ├── useCameraPositionAnimation.ts   # Camera animation
│   └── useLightingController.ts        # Light intensity control
│
├── stores/
│   ├── sceneInteractionStore.ts        # Click, scroll, drag state
│   ├── userInterfaceStore.ts           # UI state (theme, audio, dimensions)
│   └── threeJSSceneStore.ts            # Three.js object references
│
├── types/
│   ├── threeJSTypes.ts                 # Three.js-specific types
│   ├── cameraTypes.ts                  # Camera-related types
│   ├── storeTypes.ts                   # Zustand store types
│   └── componentTypes.ts               # Shared component prop types
│
├── constants/
│   ├── cameraConfiguration.ts          # Camera positions, scroll speeds
│   ├── lightingConfiguration.ts        # Light names, intensities
│   ├── meshConfiguration.ts            # Mesh names, video paths
│   ├── urlConfiguration.ts             # External URLs
│   ├── themeConfiguration.ts           # Theme/vibe settings
│   └── applicationConfiguration.ts     # General app config
│
├── utils/
│   ├── classNameUtils.ts               # Tailwind class helpers (cn)
│   ├── vectorCalculations.ts           # Three.js math utilities
│   └── loaderUtilities.ts              # GLTF/texture loading helpers
│
├── styles/
│   ├── customAnimations.css            # Preserved checkbox animations
│   └── themeVariables.css              # CSS custom properties
│
├── assets/
│   ├── images/                         # SVG, PNG, GIF files
│   └── sounds/                         # Audio files
│
└── __tests__/
    ├── hooks/
    ├── stores/
    └── utils/
```

### State Architecture

#### Zustand Store Organization

**Three Stores by Domain:**

1. **sceneInteractionStore.ts** - User interactions with 3D scene
2. **userInterfaceStore.ts** - UI state and configuration
3. **threeJSSceneStore.ts** - Three.js object references

```typescript
// sceneInteractionStore.ts
interface SceneInteractionState {
  // Click interactions
  clickedMeshPosition: THREE.Vector3 | null;
  clickedLightName: string | null;
  totalClickCount: number;

  // Scroll interactions
  hasUserStartedScrolling: boolean;
  mobileScrollTriggerCount: number | null;

  // Camera state
  currentCameraPositionIndex: number;
  cameraInterpolationProgress: number;

  // View state
  isCloseUpViewActive: boolean;
  isUserCurrentlyDragging: boolean;

  // Actions
  setClickedMeshPosition: (position: THREE.Vector3 | null) => void;
  setClickedLightName: (name: string | null) => void;
  incrementClickCount: () => void;
  setHasUserStartedScrolling: (hasStarted: boolean) => void;
  triggerMobileScrollNavigation: () => void;
  setCurrentCameraPositionIndex: (index: number) => void;
  setCameraInterpolationProgress: (progress: number) => void;
  setIsCloseUpViewActive: (isActive: boolean) => void;
  setIsUserCurrentlyDragging: (isDragging: boolean) => void;
}

// userInterfaceStore.ts
interface UserInterfaceState {
  // Theme
  selectedThemeConfiguration: ThemeConfiguration | null;
  titleTextColorHue: number | null;

  // UI visibility
  shouldShowArcadeIframe: boolean;
  shouldShowMusicIframe: boolean;

  // Audio
  isAudioCurrentlyMuted: boolean;

  // Responsive
  currentWindowWidth: number;

  // Lighting
  currentLightIntensityConfiguration: {
    sliderName: string;
    intensity: number;
  };

  // Actions
  setSelectedThemeConfiguration: (theme: ThemeConfiguration) => void;
  setTitleTextColorHue: (hue: number) => void;
  setShouldShowArcadeIframe: (show: boolean) => void;
  setShouldShowMusicIframe: (show: boolean) => void;
  setIsAudioCurrentlyMuted: (isMuted: boolean) => void;
  setCurrentWindowWidth: (width: number) => void;
  setCurrentLightIntensityConfiguration: (config: LightIntensityConfig) => void;
}

// threeJSSceneStore.ts
interface ThreeJSSceneState {
  // Three.js objects
  threeJSSceneModel: THREE.Scene | null;
  htmlVideoPlayerElement: HTMLVideoElement | null;

  // Actions
  setThreeJSSceneModel: (scene: THREE.Scene) => void;
  setHTMLVideoPlayerElement: (player: HTMLVideoElement) => void;
}
```

**Migration Strategy from Context:**
```typescript
// Before (Context)
const { clickPoint, clickLight, isCloseUpView } = useInteraction();
const { selectedVibe, isAudioMuted } = useUI();

// After (Zustand with selectors)
const clickedMeshPosition = useSceneInteractionStore(state => state.clickedMeshPosition);
const clickedLightName = useSceneInteractionStore(state => state.clickedLightName);
const isCloseUpViewActive = useSceneInteractionStore(state => state.isCloseUpViewActive);
const selectedThemeConfiguration = useUserInterfaceStore(state => state.selectedThemeConfiguration);
const isAudioCurrentlyMuted = useUserInterfaceStore(state => state.isAudioCurrentlyMuted);
```

### TypeScript Configuration

**tsconfig.json settings:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,

    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,

    "baseUrl": "src",
    "paths": {
      "components/*": ["components/*"],
      "hooks/*": ["hooks/*"],
      "stores/*": ["stores/*"],
      "types/*": ["types/*"],
      "constants/*": ["constants/*"],
      "utils/*": ["utils/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "build", "public"]
}
```

### Tailwind Configuration

**tailwind.config.js:**
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-primary': 'var(--background-primary)',
        'rest-color': 'var(--rest-color)',
        'active-color': 'var(--active-color)',
        'urban-theme': '#e96929',
        'rural-theme': '#80c080',
        'classy-theme': '#ef5555',
        'chill-theme': '#9fa8da',
      },
      animation: {
        // Custom animations if needed
      },
    },
  },
  plugins: [],
}
```

---

## Common Patterns & Best Practices

### Pattern 1: Component Structure

```typescript
import React, { useCallback, useEffect, useMemo } from 'react';
import { useSceneInteractionStore } from 'stores/sceneInteractionStore';
import type { ComponentNameProps } from 'types/componentTypes';

/**
 * Brief description of component purpose
 *
 * @example
 * <ComponentName prop1="value" prop2={42} />
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  propOne,
  propTwo
}) => {
  // 1. Zustand store selectors (grouped by store)
  const stateValue = useSceneInteractionStore(state => state.stateValue);
  const actionFunction = useSceneInteractionStore(state => state.actionFunction);

  // 2. Local state (if needed)
  const [localState, setLocalState] = React.useState<number>(0);

  // 3. Refs (if needed)
  const elementRef = React.useRef<HTMLDivElement>(null);

  // 4. Memoized values
  const computedValue = useMemo(() => {
    return propOne + propTwo;
  }, [propOne, propTwo]);

  // 5. Callbacks
  const handleSomeAction = useCallback(() => {
    actionFunction(computedValue);
  }, [actionFunction, computedValue]);

  // 6. Effects
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, []);

  // 7. Render
  return (
    <div ref={elementRef} className="flex flex-col">
      {/* JSX */}
    </div>
  );
};
```

### Pattern 2: Custom Hook Structure

```typescript
import { useEffect, useRef, useCallback } from 'react';
import { useSceneInteractionStore } from 'stores/sceneInteractionStore';
import type { HookReturnType, HookParameters } from 'types/hookTypes';

/**
 * Brief description of hook purpose
 *
 * @param parameters - Description
 * @returns Description of return value
 */
export const useCustomHookName = (parameters: HookParameters): HookReturnType => {
  // 1. Store selectors
  const stateValue = useSceneInteractionStore(state => state.stateValue);

  // 2. Refs for non-reactive values
  const internalRef = useRef<number>(0);

  // 3. Hook logic
  const someMethod = useCallback(() => {
    // Implementation
  }, [stateValue]);

  // 4. Effects
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, [someMethod]);

  // 5. Return API
  return {
    someMethod,
    someValue: internalRef.current,
  };
};
```

### Pattern 3: Zustand Store Creation

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { StoreState } from 'types/storeTypes';

export const useStoreName = create<StoreState>()(
  devtools(
    (set, get) => ({
      // State
      propertyName: initialValue,

      // Actions
      setPropertyName: (value) => set({ propertyName: value }),

      // Complex actions
      complexAction: () => {
        const currentState = get();
        // Logic
        set({
          propertyName: newValue,
          anotherProperty: derivedValue
        });
      },

      // Reset action
      reset: () => set({
        propertyName: initialValue,
        // Reset all state
      }),
    }),
    { name: 'StoreName' }
  )
);
```

### Pattern 4: Type Definition

```typescript
// types/componentTypes.ts

import type { Vector3 } from 'three';

// Component props
export interface ComponentNameProps {
  requiredProp: string;
  optionalProp?: number;
  callbackProp: (value: string) => void;
  children?: React.ReactNode;
}

// State types
export interface CameraState {
  currentPositionIndex: number;
  interpolationProgress: number;
  isAnimating: boolean;
}

// Configuration types
export interface ThemeConfiguration {
  themeIdentifier: 'urban' | 'rural' | 'classy' | 'chill';
  titleColorHue: number;
  activeButtonColor: string;
  restingButtonColor: string;
}

// Utility types
export type MeshClickHandler = (event: ThreeEvent<MouseEvent>) => void;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
```

### Pattern 5: Tailwind Class Composition

```typescript
// utils/classNameUtils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage in components
import { cn } from 'utils/classNameUtils';

<button
  className={cn(
    "w-12 h-12 rounded-full",
    "transition-all duration-200",
    isActive && "bg-active-color scale-95",
    !isActive && "bg-rest-color"
  )}
/>
```

### Pattern 6: Testing Structure

```typescript
// __tests__/hooks/useCameraScrollBehavior.test.ts

import { renderHook, act } from '@testing-library/react';
import { useCameraScrollBehavior } from 'hooks/useCameraScrollBehavior';
import { useSceneInteractionStore } from 'stores/sceneInteractionStore';

// Mock stores
jest.mock('stores/sceneInteractionStore');

describe('useCameraScrollBehavior', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('when user scrolls down', () => {
    it('should increment camera position index', () => {
      // Arrange
      const mockSetIndex = jest.fn();
      (useSceneInteractionStore as jest.Mock).mockReturnValue({
        currentCameraPositionIndex: 0,
        setCurrentCameraPositionIndex: mockSetIndex,
      });

      const { result } = renderHook(() => useCameraScrollBehavior({
        /* parameters */
      }));

      // Act
      act(() => {
        result.current.handleScroll({ deltaY: 100 });
      });

      // Assert
      expect(mockSetIndex).toHaveBeenCalledWith(1);
    });
  });

  describe('when at last camera position', () => {
    it('should wrap around to first position', () => {
      // Test implementation
    });
  });
});
```

---

## Common Pitfalls to Avoid

### Pitfall 1: Over-Selecting from Zustand

**Problem:**
```typescript
// ❌ BAD - Re-renders on any store change
const entireStore = useSceneInteractionStore();
const { clickedMeshPosition } = entireStore;
```

**Solution:**
```typescript
// ✅ GOOD - Only re-renders when clickedMeshPosition changes
const clickedMeshPosition = useSceneInteractionStore(
  state => state.clickedMeshPosition
);
```

### Pitfall 2: Not Cleaning Up Three.js Resources

**Problem:**
```typescript
// ❌ BAD - Memory leak
useEffect(() => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial();
  // No cleanup
}, []);
```

**Solution:**
```typescript
// ✅ GOOD - Proper disposal
useEffect(() => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial();

  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);
```

### Pitfall 3: Using `any` Type

**Problem:**
```typescript
// ❌ BAD - Defeats purpose of TypeScript
const handleClick = (event: any) => {
  // Type safety lost
};
```

**Solution:**
```typescript
// ✅ GOOD - Explicit types
import type { ThreeEvent } from '@react-three/fiber';

const handleMeshClickInteraction = (
  event: ThreeEvent<MouseEvent>
) => {
  // Full type safety
  const meshName: string = event.object.name;
};
```

### Pitfall 4: Inline Functions in JSX

**Problem:**
```typescript
// ❌ BAD - Creates new function every render
<button onClick={() => handleClick(id)}>Click</button>
```

**Solution:**
```typescript
// ✅ GOOD - Memoized callback
const handleButtonClick = useCallback(() => {
  handleClick(id);
}, [id, handleClick]);

<button onClick={handleButtonClick}>Click</button>
```

### Pitfall 5: Not Testing Edge Cases

**Problem:**
```typescript
// ❌ BAD - Only happy path
it('should scroll camera', () => {
  // Test normal scroll only
});
```

**Solution:**
```typescript
// ✅ GOOD - Edge cases covered
describe('useCameraScrollBehavior', () => {
  it('should scroll camera forward');
  it('should wrap to start when reaching end');
  it('should handle rapid scroll events');
  it('should not scroll when animation in progress');
  it('should handle mobile touch scroll');
});
```

---

## Testing Strategy Overview

### What to Test

**High Priority (Must Test):**
- Store actions and state updates
- Custom hooks with complex logic
- Utility functions (calculations, transformations)
- Event handlers with business logic

**Medium Priority (Should Test):**
- Component logic (conditional rendering)
- Integration between hooks and stores
- Configuration validation

**Low Priority (Nice to Have):**
- Simple presentational components
- Type definitions (TypeScript provides this)
- Constants and configurations

### Testing Patterns

**Pattern: Testing Zustand Store**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useSceneInteractionStore } from 'stores/sceneInteractionStore';

describe('sceneInteractionStore', () => {
  beforeEach(() => {
    // Reset store state
    useSceneInteractionStore.setState({
      clickedMeshPosition: null,
      totalClickCount: 0,
    });
  });

  it('should increment click count', () => {
    const { result } = renderHook(() => useSceneInteractionStore());

    act(() => {
      result.current.incrementClickCount();
    });

    expect(result.current.totalClickCount).toBe(1);
  });
});
```

**Pattern: Testing Custom Hook**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCameraScrollBehavior } from 'hooks/useCameraScrollBehavior';

describe('useCameraScrollBehavior', () => {
  it('should interpolate camera position on scroll', () => {
    const mockCamera = { position: { copy: jest.fn() } };
    const mockPositions = [[0,0,0], [10,10,10]];

    const { result } = renderHook(() =>
      useCameraScrollBehavior({
        camera: mockCamera,
        positions: mockPositions,
      })
    );

    act(() => {
      result.current.handleScroll({ deltaY: 100 });
    });

    expect(mockCamera.position.copy).toHaveBeenCalled();
  });
});
```

### Mock Strategies

**Mocking Three.js:**
```typescript
// __mocks__/three.ts
export const Vector3 = jest.fn().mockImplementation((x, y, z) => ({
  x, y, z,
  copy: jest.fn(),
  lerp: jest.fn(),
}));

export const Scene = jest.fn().mockImplementation(() => ({
  traverse: jest.fn(),
}));
```

**Mocking Zustand Store:**
```typescript
jest.mock('stores/sceneInteractionStore', () => ({
  useSceneInteractionStore: jest.fn((selector) =>
    selector({
      clickedMeshPosition: null,
      setClickedMeshPosition: jest.fn(),
    })
  ),
}));
```

---

## Troubleshooting Guide

### Issue: TypeScript Errors with Three.js

**Symptom:** `Property 'traverse' does not exist on type 'Scene'`

**Solution:**
```typescript
// Install types
npm install --save-dev @types/three

// Import types explicitly
import type * as THREE from 'three';

// Use typed variables
const scene: THREE.Scene = gltf.scene;
```

### Issue: Zustand Store Not Updating

**Symptom:** Component doesn't re-render when store changes

**Solution:**
```typescript
// ❌ Wrong - selector returns new object every time
const { value } = useStore(state => ({ value: state.value }));

// ✅ Correct - selector returns primitive or stable reference
const value = useStore(state => state.value);
```

### Issue: Tailwind Classes Not Applying

**Symptom:** Custom colors or classes not showing

**Solution:**
```typescript
// 1. Ensure content paths in tailwind.config.js include your files
content: ["./src/**/*.{js,jsx,ts,tsx}"]

// 2. Import Tailwind in your entry CSS
@tailwind base;
@tailwind components;
@tailwind utilities;

// 3. Rebuild after config changes
npm run build
```

### Issue: Tests Failing with Module Not Found

**Symptom:** `Cannot find module 'components/three/SceneModel'`

**Solution:**
```json
// Add to jest.config.js or package.json
{
  "jest": {
    "moduleNameMapper": {
      "^components/(.*)$": "<rootDir>/src/components/$1",
      "^hooks/(.*)$": "<rootDir>/src/hooks/$1",
      "^stores/(.*)$": "<rootDir>/src/stores/$1"
    }
  }
}
```

### Issue: Memory Leak with Three.js Components

**Symptom:** Browser slows down over time, memory usage increases

**Solution:**
```typescript
useEffect(() => {
  // Create resources
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);

  // Cleanup function
  return () => {
    geometry.dispose();
    material.dispose();
    if (material.map) material.map.dispose();
  };
}, []);
```

---

## Reference Links

### Official Documentation
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### TypeScript Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Best Practices](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example)

### Testing Resources
- [Jest Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing React Hooks](https://react-hooks-testing-library.com/)

---

## Summary Checklist

Before starting any phase, ensure you understand:

- ✅ Why we chose TypeScript over JavaScript
- ✅ Why Zustand over Context API
- ✅ How to organize components by layer
- ✅ Naming convention rules (descriptive & explicit)
- ✅ When to use Tailwind vs custom CSS
- ✅ What to test and what to skip
- ✅ Common patterns for components, hooks, stores
- ✅ Common pitfalls to avoid
- ✅ Where to find answers (this document!)

**Ready?** Proceed to [Phase-1.md](./Phase-1.md) to begin TypeScript setup and file structure refactoring.
