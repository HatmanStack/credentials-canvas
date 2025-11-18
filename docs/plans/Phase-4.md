# Phase 4: Testing Infrastructure & Unit Tests

## Phase Goal

Establish comprehensive unit testing infrastructure for business logic, custom hooks, and Zustand stores. This phase implements Jest configuration, creates testing utilities, and writes unit tests for critical application logic to ensure code quality and prevent regressions.

**Success Criteria:**
- Jest and React Testing Library configured
- All custom hooks have unit tests
- All Zustand stores have unit tests
- All utility functions have unit tests
- Test coverage >80% for business logic
- All tests passing
- CI/CD ready test scripts

**Estimated Tokens:** ~70,000

---

## Prerequisites

### Must Be Complete Before Starting
- Phase 3 complete (Tailwind migration done)
- All components and hooks in TypeScript
- Zustand stores implemented
- Application fully functional
- Clean git state

### Verify Environment
```bash
# Verify Phase 3 complete
npm start  # Should run with Tailwind

# Verify TypeScript
npx tsc --noEmit  # Should pass

# Clean git state
git status
```

---

## Tasks

### Task 1: Install Testing Dependencies

**Goal:** Install Jest, React Testing Library, and testing utilities.

**Files to Modify/Create:**
- `package.json` - Add test dependencies

**Prerequisites:**
- Phase 3 complete
- Clean npm state

**Implementation Steps:**

1. Install Jest (if not already included with CRA):
   - React Scripts includes Jest by default
   - Verify Jest available: `npm test` should work
   - If not, install: `npm install --save-dev jest`

2. Install React Testing Library packages:
   - Run `npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event`
   - `@testing-library/react`: React component testing utilities
   - `@testing-library/jest-dom`: Custom Jest matchers for DOM
   - `@testing-library/user-event`: User interaction simulation

3. Install testing utilities:
   - Run `npm install --save-dev @testing-library/react-hooks` (if testing hooks separately)
   - Note: Modern React Testing Library includes `renderHook` natively

4. Install type definitions:
   - Run `npm install --save-dev @types/jest`
   - Enables TypeScript support for Jest

5. Verify installation:
   - Check package.json has dependencies
   - Run `npm test` (will have no tests yet, but should work)
   - Verify Jest recognized

**Verification Checklist:**
- [ ] Testing dependencies installed
- [ ] Type definitions installed
- [ ] `npm test` command works
- [ ] No installation errors
- [ ] Jest CLI accessible

**Testing Instructions:**
- Run `npm test` - should say "No tests found"
- Run `npx jest --version` - should output version
- Verify TypeScript recognizes Jest globals

**Commit Message Template:**
```
chore(deps): install testing dependencies

- Add @testing-library/react for component testing
- Add @testing-library/jest-dom for DOM matchers
- Add @testing-library/user-event for interactions
- Add @types/jest for TypeScript support
- Verify Jest configuration from React Scripts
```

**Estimated Tokens:** ~2,000

---

### Task 2: Configure Jest for TypeScript

**Goal:** Configure Jest to work with TypeScript and path aliases.

**Files to Modify/Create:**
- `jest.config.js` - Create Jest configuration (if not using CRA defaults)
- OR `package.json` - Add Jest config section

**Prerequisites:**
- Task 1 complete (dependencies installed)
- TypeScript configured from Phase 1

**Implementation Steps:**

1. Determine if custom Jest config needed:
   - React Scripts handles most Jest config
   - Custom config needed for:
     - Path aliases (from tsconfig.json)
     - Custom setup files
     - Coverage thresholds
   - For this project: likely need custom config for paths

2. Create jest.config.js (or add to package.json):
   ```javascript
   module.exports = {
     preset: 'react-scripts', // Use CRA preset
     moduleNameMapper: {
       // Map TypeScript path aliases
       '^components/(.*)$': '<rootDir>/src/components/$1',
       '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
       '^stores/(.*)$': '<rootDir>/src/stores/$1',
       '^types/(.*)$': '<rootDir>/src/types/$1',
       '^constants/(.*)$': '<rootDir>/src/constants/$1',
       '^utils/(.*)$': '<rootDir>/src/utils/$1',
       // Handle CSS imports
       '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
     },
     setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
     testEnvironment: 'jsdom',
     collectCoverageFrom: [
       'src/**/*.{ts,tsx}',
       '!src/**/*.d.ts',
       '!src/index.tsx',
       '!src/reportWebVitals.ts',
     ],
     coverageThresholds: {
       global: {
         branches: 70,
         functions: 70,
         lines: 70,
         statements: 70,
       },
     },
   };
   ```

3. Create setupTests.ts:
   - Create `src/setupTests.ts`
   - Import jest-dom matchers
   - Add global test setup
   ```typescript
   import '@testing-library/jest-dom';

   // Mock window.matchMedia for responsive tests
   Object.defineProperty(window, 'matchMedia', {
     writable: true,
     value: jest.fn().mockImplementation(query => ({
       matches: false,
       media: query,
       onchange: null,
       addListener: jest.fn(),
       removeListener: jest.fn(),
       addEventListener: jest.fn(),
       removeEventListener: jest.fn(),
       dispatchEvent: jest.fn(),
     })),
   });
   ```

4. Configure path mapping:
   - Ensure moduleNameMapper matches tsconfig paths
   - Test import resolution

5. Configure coverage settings:
   - Set reasonable coverage thresholds
   - Exclude non-testable files (index, types)
   - Configure coverage reports

**Verification Checklist:**
- [ ] Jest config created or updated
- [ ] Path aliases mapped
- [ ] setupTests.ts created
- [ ] Coverage configured
- [ ] `npm test` still works

**Testing Instructions:**
- Run `npm test` - should work
- Create simple test file to verify config
- Check path imports resolve

**Commit Message Template:**
```
chore(config): configure Jest for TypeScript

- Create jest.config.js with path mappings
- Map TypeScript path aliases for tests
- Create setupTests.ts with jest-dom
- Configure coverage thresholds and collection
- Add window.matchMedia mock for tests
- Verify test environment configuration
```

**Estimated Tokens:** ~4,000

---

### Task 3: Create Test Utilities and Mocks

**Goal:** Create reusable test utilities and mock factories for stores and Three.js.

**Files to Modify/Create:**
- `src/__tests__/utils/testUtils.tsx` - Custom render functions
- `src/__tests__/mocks/storeMocks.ts` - Zustand store mocks
- `src/__tests__/mocks/threeMocks.ts` - Three.js mocks

**Prerequisites:**
- Task 2 complete (Jest configured)
- Understanding of Zustand stores
- Understanding of Three.js usage

**Implementation Steps:**

1. Create test directory structure:
   - Create `src/__tests__/utils/`
   - Create `src/__tests__/mocks/`
   - Create `src/__tests__/hooks/` (for hook tests)
   - Create `src/__tests__/stores/` (for store tests)
   - Create `src/__tests__/utils/` (for utility tests)

2. Create custom render utility (testUtils.tsx):
   ```typescript
   import React from 'react';
   import { render, RenderOptions } from '@testing-library/react';

   /**
    * Custom render function with common providers
    * Currently no providers needed (no Context after Phase 2)
    * But keeps pattern for future needs
    */
   const customRender = (
     ui: React.ReactElement,
     options?: Omit<RenderOptions, 'wrapper'>,
   ) => {
     return render(ui, { ...options });
   };

   // Re-export everything
   export * from '@testing-library/react';
   export { customRender as render };
   ```

3. Create Zustand store mocks (storeMocks.ts):
   ```typescript
   import { create } from 'zustand';
   import type {
     SceneInteractionState,
     UserInterfaceState,
     ThreeJSSceneState,
   } from 'types/storeTypes';

   /**
    * Create mock scene interaction store for testing
    */
   export const createMockSceneInteractionStore = (
     overrides?: Partial<SceneInteractionState>
   ) => {
     return create<SceneInteractionState>()((set) => ({
       // Default mock state
       clickedMeshPosition: null,
       clickedLightName: null,
       totalClickCount: 0,
       isCloseUpViewActive: false,
       isUserCurrentlyDragging: false,
       hasUserStartedScrolling: false,
       mobileScrollTriggerCount: null,
       currentCameraPositionIndex: 0,
       cameraInterpolationProgress: 0,

       // Mock actions
       setClickedMeshPosition: jest.fn((position) => set({ clickedMeshPosition: position })),
       setClickedLightName: jest.fn((name) => set({ clickedLightName: name })),
       incrementClickCount: jest.fn(() => set((state) => ({ totalClickCount: state.totalClickCount + 1 }))),
       resetClickCount: jest.fn(() => set({ totalClickCount: 0 })),
       setIsCloseUpViewActive: jest.fn((isActive) => set({ isCloseUpViewActive: isActive })),
       setIsUserCurrentlyDragging: jest.fn((isDragging) => set({ isUserCurrentlyDragging: isDragging })),
       setHasUserStartedScrolling: jest.fn((hasStarted) => set({ hasUserStartedScrolling: hasStarted })),
       setMobileScrollTriggerCount: jest.fn((count) => set({ mobileScrollTriggerCount: count })),
       triggerMobileScrollNavigation: jest.fn(() => {
         const state = useSceneInteractionStore.getState();
         set({ mobileScrollTriggerCount: (state.mobileScrollTriggerCount || 0) + 1 });
       }),
       setCurrentCameraPositionIndex: jest.fn((index) => set({ currentCameraPositionIndex: index })),
       setCameraInterpolationProgress: jest.fn((progress) => set({ cameraInterpolationProgress: progress })),
       resetSceneInteractionState: jest.fn(() => set({
         clickedMeshPosition: null,
         clickedLightName: null,
         totalClickCount: 0,
         isCloseUpViewActive: false,
         isUserCurrentlyDragging: false,
         hasUserStartedScrolling: false,
         mobileScrollTriggerCount: null,
         currentCameraPositionIndex: 0,
         cameraInterpolationProgress: 0,
       })),

       // Apply overrides
       ...overrides,
     }));
   };

   // Similar for other stores...
   ```

4. Create Three.js mocks (threeMocks.ts):
   ```typescript
   /**
    * Mock Three.js Vector3 for testing
    */
   export const createMockVector3 = (x = 0, y = 0, z = 0) => ({
     x,
     y,
     z,
     copy: jest.fn(),
     set: jest.fn(),
     lerp: jest.fn(),
     lerpVectors: jest.fn(),
   });

   /**
    * Mock Three.js Scene for testing
    */
   export const createMockScene = () => ({
     traverse: jest.fn(),
     add: jest.fn(),
     remove: jest.fn(),
   });

   /**
    * Mock Three.js Camera for testing
    */
   export const createMockCamera = () => ({
     position: createMockVector3(),
     lookAt: jest.fn(),
   });
   ```

5. Add JSDoc documentation:
   - Document each utility function
   - Provide usage examples
   - Explain mock patterns

**Verification Checklist:**
- [ ] Test utilities created
- [ ] Store mocks implemented
- [ ] Three.js mocks implemented
- [ ] JSDoc documentation added
- [ ] No TypeScript errors

**Testing Instructions:**
- Import utilities in test file
- Verify mocks create correctly
- Check TypeScript types work

**Commit Message Template:**
```
test(utils): create test utilities and mocks

- Create custom render utility for testing
- Create Zustand store mock factories
- Create Three.js object mocks
- Add JSDoc documentation with usage examples
- Enable consistent testing patterns across project
```

**Estimated Tokens:** ~8,000

---

### Task 4: Write Tests for Zustand Stores

**Goal:** Create comprehensive unit tests for all Zustand stores.

**Files to Modify/Create:**
- `src/__tests__/stores/sceneInteractionStore.test.ts`
- `src/__tests__/stores/userInterfaceStore.test.ts`
- `src/__tests__/stores/threeJSSceneStore.test.ts`

**Prerequisites:**
- Task 3 complete (test utilities available)
- Zustand stores implemented from Phase 2

**Implementation Steps:**

1. Test sceneInteractionStore:
   ```typescript
   import { renderHook, act } from '@testing-library/react';
   import { useSceneInteractionStore } from 'stores/sceneInteractionStore';

   describe('sceneInteractionStore', () => {
     beforeEach(() => {
       // Reset store before each test
       const { result } = renderHook(() => useSceneInteractionStore());
       act(() => {
         result.current.resetSceneInteractionState();
       });
     });

     describe('click interactions', () => {
       it('should increment click count when incrementClickCount called', () => {
         const { result } = renderHook(() => useSceneInteractionStore());

         expect(result.current.totalClickCount).toBe(0);

         act(() => {
           result.current.incrementClickCount();
         });

         expect(result.current.totalClickCount).toBe(1);
       });

       it('should set clicked mesh position', () => {
         const { result } = renderHook(() => useSceneInteractionStore());
         const mockPosition = { x: 1, y: 2, z: 3 };

         act(() => {
           result.current.setClickedMeshPosition(mockPosition);
         });

         expect(result.current.clickedMeshPosition).toEqual(mockPosition);
       });

       it('should reset click count', () => {
         const { result } = renderHook(() => useSceneInteractionStore());

         act(() => {
           result.current.incrementClickCount();
           result.current.incrementClickCount();
         });

         expect(result.current.totalClickCount).toBe(2);

         act(() => {
           result.current.resetClickCount();
         });

         expect(result.current.totalClickCount).toBe(0);
       });
     });

     describe('camera interactions', () => {
       it('should set current camera position index', () => {
         const { result } = renderHook(() => useSceneInteractionStore());

         act(() => {
           result.current.setCurrentCameraPositionIndex(3);
         });

         expect(result.current.currentCameraPositionIndex).toBe(3);
       });

       it('should set camera interpolation progress', () => {
         const { result } = renderHook(() => useSceneInteractionStore());

         act(() => {
           result.current.setCameraInterpolationProgress(0.5);
         });

         expect(result.current.cameraInterpolationProgress).toBe(0.5);
       });
     });

     describe('mobile scroll', () => {
       it('should trigger mobile scroll navigation', () => {
         const { result } = renderHook(() => useSceneInteractionStore());

         expect(result.current.mobileScrollTriggerCount).toBeNull();

         act(() => {
           result.current.triggerMobileScrollNavigation();
         });

         expect(result.current.mobileScrollTriggerCount).toBe(1);

         act(() => {
           result.current.triggerMobileScrollNavigation();
         });

         expect(result.current.mobileScrollTriggerCount).toBe(2);
       });
     });

     describe('view state', () => {
       it('should set close up view active state', () => {
         const { result } = renderHook(() => useSceneInteractionStore());

         expect(result.current.isCloseUpViewActive).toBe(false);

         act(() => {
           result.current.setIsCloseUpViewActive(true);
         });

         expect(result.current.isCloseUpViewActive).toBe(true);
       });

       it('should set dragging state', () => {
         const { result } = renderHook(() => useSceneInteractionStore());

         act(() => {
           result.current.setIsUserCurrentlyDragging(true);
         });

         expect(result.current.isUserCurrentlyDragging).toBe(true);
       });
     });

     describe('reset', () => {
       it('should reset all state to initial values', () => {
         const { result } = renderHook(() => useSceneInteractionStore());

         // Set various states
         act(() => {
           result.current.incrementClickCount();
           result.current.setCurrentCameraPositionIndex(5);
           result.current.setIsCloseUpViewActive(true);
           result.current.setHasUserStartedScrolling(true);
         });

         // Verify states changed
         expect(result.current.totalClickCount).toBe(1);
         expect(result.current.currentCameraPositionIndex).toBe(5);

         // Reset
         act(() => {
           result.current.resetSceneInteractionState();
         });

         // Verify all reset
         expect(result.current.totalClickCount).toBe(0);
         expect(result.current.currentCameraPositionIndex).toBe(0);
         expect(result.current.isCloseUpViewActive).toBe(false);
         expect(result.current.hasUserStartedScrolling).toBe(false);
       });
     });
   });
   ```

2. Test userInterfaceStore:
   - Test theme configuration setting
   - Test audio mute state
   - Test window width updates
   - Test iframe visibility toggles
   - Test light intensity configuration

3. Test threeJSSceneStore:
   - Test scene model reference setting
   - Test video player element setting
   - Verify nullability handling

4. Follow testing patterns:
   - Arrange-Act-Assert structure
   - Descriptive test names
   - Group related tests in describe blocks
   - Test edge cases
   - Test reset functionality

**Verification Checklist:**
- [ ] All store tests written
- [ ] All actions tested
- [ ] All state updates tested
- [ ] Edge cases covered
- [ ] All tests passing
- [ ] Coverage > 90% for stores

**Testing Instructions:**
- Run `npm test stores`
- Verify all tests pass
- Check coverage report
- Ensure no flaky tests

**Commit Message Template:**
```
test(stores): add comprehensive Zustand store tests

- Test sceneInteractionStore actions and state
- Test userInterfaceStore theme and settings
- Test threeJSSceneStore reference management
- Cover all state updates and edge cases
- Achieve >90% coverage for store logic
- Verify all tests pass consistently
```

**Estimated Tokens:** ~12,000

---

### Task 5: Write Tests for Camera Scroll Hook

**Goal:** Create comprehensive tests for useCameraScrollBehavior hook.

**Files to Modify/Create:**
- `src/__tests__/hooks/useCameraScrollBehavior.test.ts`

**Prerequisites:**
- Task 3 complete (mocks available)
- useCameraScrollBehavior hook exists from Phase 1

**Implementation Steps:**

1. Setup test file with mocks:
   ```typescript
   import { renderHook, act } from '@testing-library/react';
   import { useCameraScrollBehavior } from 'hooks/useCameraScrollBehavior';
   import { useSceneInteractionStore } from 'stores/sceneInteractionStore';
   import { createMockCamera, createMockVector3 } from '__tests__/mocks/threeMocks';

   // Mock the store
   jest.mock('stores/sceneInteractionStore');

   describe('useCameraScrollBehavior', () => {
     let mockCamera: any;
     let mockPositions: number[][];
     let mockStoreActions: any;

     beforeEach(() => {
       // Setup mocks
       mockCamera = createMockCamera();
       mockPositions = [
         [0, 0, 10],
         [5, 0, 5],
         [10, 0, 0],
       ];

       mockStoreActions = {
         setCurrentCameraPositionIndex: jest.fn(),
         setHasUserStartedScrolling: jest.fn(),
         setIsCloseUpViewActive: jest.fn(),
       };

       (useSceneInteractionStore as jest.Mock).mockImplementation((selector) => {
         if (typeof selector === 'function') {
           return selector(mockStoreActions);
         }
         return mockStoreActions;
       });
     });

     afterEach(() => {
       jest.clearAllMocks();
     });

     describe('initialization', () => {
       it('should initialize with provided camera and positions', () => {
         const { result } = renderHook(() =>
           useCameraScrollBehavior({
             camera: mockCamera,
             cameraPositions: mockPositions,
             domElement: document.createElement('div'),
           })
         );

         expect(result.current).toBeDefined();
       });
     });

     describe('desktop scroll', () => {
       it('should interpolate camera position on wheel event', () => {
         const domElement = document.createElement('div');

         renderHook(() =>
           useCameraScrollBehavior({
             camera: mockCamera,
             cameraPositions: mockPositions,
             domElement,
           })
         );

         // Simulate wheel event
         const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
         act(() => {
           domElement.dispatchEvent(wheelEvent);
         });

         // Verify camera position updated
         expect(mockCamera.position.copy).toHaveBeenCalled();
       });

       it('should advance camera index after interpolation completes', () => {
         const domElement = document.createElement('div');

         renderHook(() =>
           useCameraScrollBehavior({
             camera: mockCamera,
             cameraPositions: mockPositions,
             domElement,
           })
         );

         // Simulate enough scroll events to complete interpolation
         act(() => {
           for (let i = 0; i < 5; i++) {
             const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
             domElement.dispatchEvent(wheelEvent);
           }
         });

         // Verify index advanced
         expect(mockStoreActions.setCurrentCameraPositionIndex).toHaveBeenCalled();
       });

       it('should set scroll started flag on first scroll', () => {
         const domElement = document.createElement('div');

         renderHook(() =>
           useCameraScrollBehavior({
             camera: mockCamera,
             cameraPositions: mockPositions,
             domElement,
           })
         );

         act(() => {
           const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
           domElement.dispatchEvent(wheelEvent);
         });

         expect(mockStoreActions.setHasUserStartedScrolling).toHaveBeenCalledWith(true);
       });

       it('should wrap camera index to start when reaching end', () => {
         const domElement = document.createElement('div');

         // Mock store to return last index
         (useSceneInteractionStore as jest.Mock).mockImplementation((selector) => {
           if (typeof selector === 'function') {
             return selector({
               ...mockStoreActions,
               currentCameraPositionIndex: mockPositions.length - 1,
             });
           }
           return mockStoreActions;
         });

         renderHook(() =>
           useCameraScrollBehavior({
             camera: mockCamera,
             cameraPositions: mockPositions,
             domElement,
           })
         );

         // Scroll to trigger wrap
         act(() => {
           for (let i = 0; i < 5; i++) {
             const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
             domElement.dispatchEvent(wheelEvent);
           }
         });

         // Verify wrapped to 0
         expect(mockStoreActions.setCurrentCameraPositionIndex).toHaveBeenCalledWith(0);
       });
     });

     describe('mobile scroll', () => {
       it('should handle mobile scroll trigger', () => {
         const { result, rerender } = renderHook(
           ({ mobileScrollCount }) =>
             useCameraScrollBehavior({
               camera: mockCamera,
               cameraPositions: mockPositions,
               domElement: null,
               mobileScrollCount,
             }),
           {
             initialProps: { mobileScrollCount: 0 },
           }
         );

         // Trigger mobile scroll
         act(() => {
           rerender({ mobileScrollCount: 1 });
         });

         // Verify camera updated
         expect(mockCamera.position.copy).toHaveBeenCalled();
       });
     });

     describe('cleanup', () => {
       it('should remove event listeners on unmount', () => {
         const domElement = document.createElement('div');
         const removeEventListenerSpy = jest.spyOn(domElement, 'removeEventListener');

         const { unmount } = renderHook(() =>
           useCameraScrollBehavior({
             camera: mockCamera,
             cameraPositions: mockPositions,
             domElement,
           })
         );

         unmount();

         expect(removeEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function));
       });
     });
   });
   ```

2. Test all hook features:
   - Initialization
   - Desktop wheel scrolling
   - Mobile scroll triggering
   - Camera position interpolation
   - Index advancement
   - Index wrapping
   - Event listener cleanup

3. Test edge cases:
   - No dom element provided
   - Empty positions array
   - Rapid scroll events
   - Camera at last position

**Verification Checklist:**
- [ ] All hook functionality tested
- [ ] Edge cases covered
- [ ] Mocks working correctly
- [ ] All tests passing
- [ ] Coverage > 80% for hook

**Testing Instructions:**
- Run `npm test hooks/useCameraScrollBehavior`
- Verify all tests pass
- Check coverage

**Commit Message Template:**
```
test(hooks): add useCameraScrollBehavior tests

- Test camera position interpolation
- Test desktop wheel scroll handling
- Test mobile scroll navigation
- Test camera index advancement and wrapping
- Test event listener cleanup
- Cover edge cases and error conditions
- Achieve >80% coverage for hook logic
```

**Estimated Tokens:** ~10,000

---

### Task 6: Write Tests for Other Custom Hooks

**Goal:** Create tests for remaining custom hooks.

**Files to Modify/Create:**
- `src/__tests__/hooks/useCameraPositionAnimation.test.ts`
- `src/__tests__/hooks/useLightingController.test.ts`

**Prerequisites:**
- Task 5 complete (pattern established)
- Other hooks exist

**Implementation Steps:**

1. Test useCameraPositionAnimation:
   - Test animation initialization
   - Test animation progress updates
   - Test animation completion
   - Test animation interruption
   - Test cleanup

2. Test useLightingController:
   - Test light intensity updates
   - Test light selection
   - Test light state management
   - Test cleanup

3. Follow patterns from camera scroll tests:
   - Use same mock structure
   - Test all functionality
   - Cover edge cases
   - Verify cleanup

**Verification Checklist:**
- [ ] All hooks tested
- [ ] Edge cases covered
- [ ] All tests passing
- [ ] Coverage > 80%

**Testing Instructions:**
- Run `npm test hooks`
- Verify all pass
- Check coverage

**Commit Message Template:**
```
test(hooks): add tests for remaining custom hooks

- Test useCameraPositionAnimation functionality
- Test useLightingController state management
- Cover animation and light interaction logic
- Test edge cases and cleanup
- Achieve >80% coverage for all hooks
```

**Estimated Tokens:** ~8,000

---

### Task 7: Write Tests for Utility Functions

**Goal:** Create tests for all utility functions.

**Files to Modify/Create:**
- `src/__tests__/utils/classNameUtils.test.ts`
- Any other utility test files needed

**Prerequisites:**
- Task 3 complete (test setup)
- Utility functions exist

**Implementation Steps:**

1. Test cn() utility:
   ```typescript
   import { cn } from 'utils/classNameUtils';

   describe('cn utility', () => {
     it('should merge class names', () => {
       expect(cn('foo', 'bar')).toBe('foo bar');
     });

     it('should handle conditional classes', () => {
       expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar');
     });

     it('should handle Tailwind class conflicts', () => {
       expect(cn('px-2', 'px-4')).toBe('px-4');
     });

     it('should handle empty inputs', () => {
       expect(cn()).toBe('');
     });

     it('should handle null and undefined', () => {
       expect(cn('foo', null, undefined, 'bar')).toBe('foo bar');
     });

     it('should handle arrays', () => {
       expect(cn(['foo', 'bar'])).toBe('foo bar');
     });

     it('should handle objects', () => {
       expect(cn({ foo: true, bar: false })).toBe('foo');
     });
   });
   ```

2. Test any other utility functions:
   - Vector calculations (if any)
   - Format functions (if any)
   - Validation functions (if any)

3. Aim for 100% coverage on utilities:
   - Utilities are pure functions
   - Easy to test comprehensively
   - Should have complete coverage

**Verification Checklist:**
- [ ] All utilities tested
- [ ] 100% coverage for utilities
- [ ] All edge cases covered
- [ ] All tests passing

**Testing Instructions:**
- Run `npm test utils`
- Verify 100% coverage
- Check all edge cases

**Commit Message Template:**
```
test(utils): add comprehensive utility function tests

- Test cn() class name utility thoroughly
- Cover all input types and edge cases
- Test Tailwind class conflict resolution
- Achieve 100% coverage for utility functions
- Verify all utilities work correctly
```

**Estimated Tokens:** ~5,000

---

### Task 8: Write Tests for Constants and Configurations

**Goal:** Create validation tests for constants and configurations.

**Files to Modify/Create:**
- `src/__tests__/constants/cameraConfiguration.test.ts`
- `src/__tests__/constants/meshConfiguration.test.ts`
- Other configuration test files

**Prerequisites:**
- Constants defined from Phase 1

**Implementation Steps:**

1. Test camera configuration:
   ```typescript
   import {
     CAMERA_POSITION_ARRAY,
     CAMERA_SCROLL_CONFIGURATION,
   } from 'constants/cameraConfiguration';

   describe('cameraConfiguration', () => {
     describe('CAMERA_POSITION_ARRAY', () => {
       it('should have valid positions', () => {
         expect(Array.isArray(CAMERA_POSITION_ARRAY)).toBe(true);
         expect(CAMERA_POSITION_ARRAY.length).toBeGreaterThan(0);
       });

       it('should have positions as number arrays of length 3', () => {
         CAMERA_POSITION_ARRAY.forEach((position) => {
           expect(Array.isArray(position)).toBe(true);
           expect(position).toHaveLength(3);
           position.forEach((coord) => {
             expect(typeof coord).toBe('number');
           });
         });
       });
     });

     describe('CAMERA_SCROLL_CONFIGURATION', () => {
       it('should have desktop scroll constant', () => {
         expect(typeof CAMERA_SCROLL_CONFIGURATION.desktop).toBe('number');
         expect(CAMERA_SCROLL_CONFIGURATION.desktop).toBeGreaterThan(0);
       });

       it('should have mobile scroll constant', () => {
         expect(typeof CAMERA_SCROLL_CONFIGURATION.mobile).toBe('number');
         expect(CAMERA_SCROLL_CONFIGURATION.mobile).toBeGreaterThan(0);
       });
     });
   });
   ```

2. Test mesh configuration:
   - Validate mesh name arrays
   - Validate video path arrays
   - Validate arrays match length
   - Validate model path

3. Test URL configuration:
   - Validate URL formats
   - Validate mapping completeness

4. Test theme configuration:
   - Validate color values
   - Validate theme names
   - Validate configuration structure

5. Purpose of these tests:
   - Catch configuration errors early
   - Validate data integrity
   - Document expected structure
   - Prevent runtime errors

**Verification Checklist:**
- [ ] Configuration tests written
- [ ] Data validation working
- [ ] Structure tests passing
- [ ] Documentation value provided

**Testing Instructions:**
- Run `npm test constants`
- Verify validation working
- Check tests document structure

**Commit Message Template:**
```
test(constants): add configuration validation tests

- Test camera position array structure
- Test mesh configuration completeness
- Test URL configuration validity
- Test theme configuration structure
- Validate data integrity
- Document expected configuration formats
```

**Estimated Tokens:** ~6,000

---

### Task 9: Add Coverage Reporting

**Goal:** Configure and generate test coverage reports.

**Files to Modify/Create:**
- `jest.config.js` - Update coverage settings
- `package.json` - Add coverage scripts

**Prerequisites:**
- Most tests written
- Jest configured

**Implementation Steps:**

1. Update coverage settings in jest.config.js:
   - Already configured in Task 2
   - Verify settings appropriate
   - Adjust thresholds if needed

2. Add coverage scripts to package.json:
   ```json
   {
     "scripts": {
       "test": "react-scripts test",
       "test:coverage": "react-scripts test --coverage --watchAll=false",
       "test:coverage:watch": "react-scripts test --coverage"
     }
   }
   ```

3. Run coverage report:
   - Run `npm run test:coverage`
   - Review coverage report
   - Identify gaps

4. Configure coverage reporters:
   - Text summary (console output)
   - HTML report (for detailed review)
   - LCOV format (for CI/CD)
   ```javascript
   coverageReporters: ['text', 'text-summary', 'html', 'lcov'],
   ```

5. Analyze coverage gaps:
   - Review uncovered lines
   - Identify critical untested code
   - Add tests to reach thresholds
   - Document reasons for uncovered code

6. Add .gitignore for coverage:
   - Add `coverage/` to .gitignore
   - Don't commit coverage reports

**Verification Checklist:**
- [ ] Coverage scripts added
- [ ] Coverage reports generate
- [ ] Thresholds met or documented
- [ ] HTML report accessible
- [ ] Coverage gaps identified

**Testing Instructions:**
- Run `npm run test:coverage`
- Open `coverage/lcov-report/index.html`
- Review coverage by file
- Verify thresholds

**Commit Message Template:**
```
chore(test): configure test coverage reporting

- Add coverage scripts to package.json
- Configure coverage reporters (text, HTML, LCOV)
- Set coverage thresholds for quality gates
- Add coverage directory to .gitignore
- Document coverage goals and gaps
```

**Estimated Tokens:** ~4,000

---

### Task 10: Create Test Documentation

**Goal:** Document testing patterns, conventions, and how to run tests.

**Files to Modify/Create:**
- `docs/TESTING.md` - Testing guide
- Add comments in test files

**Prerequisites:**
- Most tests written
- Patterns established

**Implementation Steps:**

1. Create TESTING.md:
   ```markdown
   # Testing Guide

   ## Running Tests

   ```bash
   # Run all tests
   npm test

   # Run tests in coverage mode
   npm run test:coverage

   # Run specific test file
   npm test -- useCameraScrollBehavior

   # Run tests matching pattern
   npm test -- --testNamePattern="should increment"
   ```

   ## Test Structure

   Tests are organized by type:
   - `__tests__/stores/` - Zustand store tests
   - `__tests__/hooks/` - Custom hook tests
   - `__tests__/utils/` - Utility function tests
   - `__tests__/constants/` - Configuration tests

   ## Writing Tests

   ### Naming Convention
   - Test files: `{fileName}.test.ts`
   - Test suites: Describe the unit under test
   - Test cases: Start with "should"

   ### Structure
   - Arrange: Set up test data
   - Act: Execute the code
   - Assert: Verify results

   ### Example
   [Provide example test]

   ## Mocking

   [Document mock patterns]

   ## Coverage Goals

   - Stores: >90%
   - Hooks: >80%
   - Utils: 100%
   - Constants: Documentation value

   ## CI/CD Integration

   [Document how tests run in CI]
   ```

2. Add JSDoc to test files:
   - Document test purpose
   - Explain complex setups
   - Reference related tests

3. Document mocking patterns:
   - How to mock Zustand stores
   - How to mock Three.js objects
   - Common mock scenarios

4. Document testing decisions:
   - Why unit tests only (Phase-0 decision)
   - What's not tested and why
   - Future testing considerations

**Verification Checklist:**
- [ ] TESTING.md created
- [ ] Test commands documented
- [ ] Patterns explained
- [ ] Examples provided
- [ ] Mocking documented

**Testing Instructions:**
- Review documentation
- Verify commands work
- Ensure clarity

**Commit Message Template:**
```
docs(test): create testing documentation

- Create TESTING.md with comprehensive guide
- Document test commands and scripts
- Explain test structure and patterns
- Provide testing examples
- Document mocking strategies
- Define coverage goals
```

**Estimated Tokens:** ~5,000

---

### Task 11: Add Pre-commit Test Hook (Optional)

**Goal:** Optionally add pre-commit hook to run tests before commits.

**Files to Modify/Create:**
- `.husky/pre-commit` - Git pre-commit hook
- `package.json` - Husky configuration

**Prerequisites:**
- All tests written and passing
- Team agreement on pre-commit hooks

**Implementation Steps:**

1. Decide if pre-commit tests desired:
   - Pros: Catches failures before commit
   - Cons: Slows down commit workflow
   - Consider: run type-check only, not full tests
   - Decision: Document in Phase-0 or discuss with team

2. If implementing, install Husky:
   - Run `npm install --save-dev husky`
   - Run `npx husky install`
   - Create pre-commit hook

3. Configure pre-commit hook:
   ```bash
   #!/bin/sh
   . "$(dirname "$0")/_/husky.sh"

   # Run type check (fast)
   npm run type-check

   # Optionally run tests (slow)
   # npm run test:coverage
   ```

4. Update package.json:
   ```json
   {
     "scripts": {
       "prepare": "husky install"
     }
   }
   ```

5. Document decision:
   - If enabled, document why
   - If not enabled, document reasoning
   - Explain how to bypass if needed: `git commit --no-verify`

**Verification Checklist:**
- [ ] Decision made (enable or not)
- [ ] If enabled: Husky installed
- [ ] If enabled: Hook working
- [ ] Decision documented

**Testing Instructions:**
- If enabled: Try committing with failing test
- Verify hook prevents commit
- Verify --no-verify bypasses hook

**Commit Message Template:**
```
chore(git): add pre-commit test hook [optional]

- Install Husky for git hooks
- Add pre-commit hook for type checking
- Optionally run tests before commit
- Document hook purpose and bypass method
- Ensure quality before commits
```

**Estimated Tokens:** ~3,000

---

### Task 12: Improve Test Coverage for Gaps

**Goal:** Write additional tests to meet coverage thresholds.

**Files to Modify/Create:**
- Various test files - Add missing tests

**Prerequisites:**
- Coverage report generated (Task 9)
- Gaps identified

**Implementation Steps:**

1. Review coverage report:
   - Open HTML coverage report
   - Identify files below threshold
   - Identify uncovered lines
   - Prioritize by criticality

2. Add tests for critical gaps:
   - Focus on business logic
   - Focus on complex functions
   - Less priority on simple getters/setters

3. Document intentionally untested code:
   - If code is truly untestable (e.g., Three.js integration)
   - If testing would require E2E setup
   - If code is deprecated or will be refactored
   - Add comments explaining why not tested

4. Reach coverage thresholds:
   - Stores: >90%
   - Hooks: >80%
   - Utils: 100%
   - Overall: >70%

5. Balance coverage vs. value:
   - Don't write tests just for coverage %
   - Focus on meaningful tests
   - Document uncovered code that's low risk

**Verification Checklist:**
- [ ] Critical gaps covered
- [ ] Thresholds met or documented
- [ ] No flaky tests added
- [ ] All new tests passing
- [ ] Coverage report improved

**Testing Instructions:**
- Run coverage report
- Verify thresholds met
- Check report for remaining gaps
- Review gap justifications

**Commit Message Template:**
```
test(coverage): improve test coverage to meet thresholds

- Add tests for previously uncovered code
- Focus on critical business logic
- Document intentionally untested code
- Achieve >80% coverage for hooks
- Achieve >90% coverage for stores
- Meet overall coverage threshold
```

**Estimated Tokens:** ~6,000

---

### Task 13: Add Test Scripts for CI/CD

**Goal:** Add npm scripts optimized for CI/CD environments.

**Files to Modify/Create:**
- `package.json` - Add CI-optimized scripts

**Prerequisites:**
- All tests passing
- Coverage configured

**Implementation Steps:**

1. Add CI test script:
   ```json
   {
     "scripts": {
       "test:ci": "react-scripts test --ci --coverage --maxWorkers=2"
     }
   }
   ```
   - `--ci`: Non-interactive mode
   - `--coverage`: Generate coverage
   - `--maxWorkers=2`: Limit parallelization

2. Add test script variations:
   ```json
   {
     "scripts": {
       "test": "react-scripts test",
       "test:coverage": "react-scripts test --coverage --watchAll=false",
       "test:ci": "react-scripts test --ci --coverage --maxWorkers=2",
       "test:watch": "react-scripts test --watch",
       "test:debug": "react-scripts --inspect-brk test --runInBand --no-cache"
     }
   }
   ```

3. Document CI requirements:
   - Node version needed
   - Dependencies installation
   - Test command to run
   - Coverage thresholds enforced

4. Create CI configuration example (optional):
   - GitHub Actions example
   - GitLab CI example
   - Document in TESTING.md

**Verification Checklist:**
- [ ] CI test script added
- [ ] Script variations added
- [ ] Scripts tested locally
- [ ] CI requirements documented

**Testing Instructions:**
- Run `npm run test:ci` locally
- Verify it completes non-interactively
- Check coverage generated
- Verify exit code

**Commit Message Template:**
```
chore(ci): add CI/CD test scripts

- Add test:ci script for non-interactive testing
- Add test script variations for different scenarios
- Configure optimal settings for CI environments
- Document CI requirements and usage
- Prepare for automated testing pipeline
```

**Estimated Tokens:** ~4,000

---

### Task 14: Review and Refactor Tests

**Goal:** Review all tests for quality, remove duplication, improve clarity.

**Files to Modify/Create:**
- All test files - Refactor for quality

**Prerequisites:**
- All tests written
- Coverage goals met

**Implementation Steps:**

1. Review test quality:
   - Clear test names
   - Proper assertions
   - No hard-coded values
   - Good setup/teardown
   - Proper mocking

2. Remove duplication:
   - Extract common setup to beforeEach
   - Create helper functions
   - Reuse mock factories
   - Share test utilities

3. Improve test clarity:
   - Add comments for complex tests
   - Use descriptive variable names
   - Break down large tests
   - Group related tests

4. Verify test independence:
   - Each test should work in isolation
   - No shared mutable state
   - Proper cleanup
   - No test order dependencies

5. Check test speed:
   - Tests should be fast
   - Avoid unnecessary timeouts
   - Mock slow operations
   - Run in parallel safely

6. Review assertions:
   - Use specific matchers
   - Verify meaningful expectations
   - Avoid testing implementation details
   - Test behavior, not internals

**Verification Checklist:**
- [ ] Tests clear and readable
- [ ] No duplication
- [ ] Tests independent
- [ ] Tests fast
- [ ] Assertions meaningful
- [ ] All tests still passing

**Testing Instructions:**
- Run full test suite
- Verify all pass
- Check test execution time
- Review test output

**Commit Message Template:**
```
refactor(test): improve test quality and clarity

- Remove test duplication with shared setup
- Improve test names for clarity
- Extract common test utilities
- Ensure test independence
- Optimize test performance
- Improve assertion specificity
- Verify all tests still pass
```

**Estimated Tokens:** ~5,000

---

### Task 15: Final Phase 4 Verification

**Goal:** Comprehensive verification that Phase 4 is complete and successful.

**Files to Modify/Create:**
- None (verification only)

**Prerequisites:**
- ALL Phase 4 tasks complete

**Implementation Steps:**

1. Test execution verification:
   - Run `npm test` - all tests pass
   - Run `npm run test:coverage` - thresholds met
   - Run `npm run test:ci` - CI mode works
   - Check for flaky tests

2. Coverage verification:
   - Open coverage report
   - Verify thresholds met:
     - Stores: >90%
     - Hooks: >80%
     - Utils: 100%
     - Overall: >70%
   - Document any gaps
   - Verify gaps justified

3. Documentation verification:
   - TESTING.md complete
   - Test commands work
   - Examples clear
   - Patterns documented

4. Quality verification:
   - Tests are meaningful
   - No brittle tests
   - Good mocking
   - Clear assertions

5. CI/CD readiness:
   - test:ci script works
   - Non-interactive mode
   - Coverage generates
   - Exits correctly

6. Integration verification:
   - Tests work with Zustand stores
   - Tests work with TypeScript
   - Tests work with Tailwind
   - No conflicts with other phases

7. Performance verification:
   - Tests run quickly
   - No slow tests
   - Good parallelization

**Verification Checklist:**
- [ ] All tests passing
- [ ] Coverage thresholds met
- [ ] Documentation complete
- [ ] CI scripts working
- [ ] Tests maintainable
- [ ] Tests valuable
- [ ] Phase 4 criteria met

**Testing Instructions:**
- Run complete test suite multiple times
- Verify no flaky tests
- Check coverage report
- Review documentation
- Test CI script

**Commit Message Template:**
```
test(phase-4): verify Phase 4 completion

- Verify all tests passing consistently
- Confirm coverage thresholds met
- Validate test documentation complete
- Test CI/CD scripts working
- Ensure test quality and maintainability
- Confirm Phase 4 success criteria met
- Complete testing infrastructure established
```

**Estimated Tokens:** ~4,000

---

## Phase 4 Verification

### Completion Criteria

Before marking Phase 4 complete, verify:

1. **Testing Infrastructure:**
   - Jest configured correctly
   - React Testing Library integrated
   - Test utilities created
   - Mocks available

2. **Test Coverage:**
   - Zustand stores >90% coverage
   - Custom hooks >80% coverage
   - Utils 100% coverage
   - Overall >70% coverage

3. **Test Quality:**
   - All tests passing
   - No flaky tests
   - Tests meaningful
   - Tests maintainable

4. **Documentation:**
   - TESTING.md complete
   - Patterns documented
   - Examples provided

5. **CI/CD Ready:**
   - CI scripts working
   - Coverage reports generating
   - Non-interactive mode working

### Success Metrics

- ✅ 100+ unit tests written
- ✅ All tests passing
- ✅ Coverage thresholds met
- ✅ Test suite runs < 30 seconds
- ✅ Documentation complete
- ✅ CI/CD ready

### Known Limitations

1. **No Integration Tests:** By design (Phase-0 decision)
2. **No E2E Tests:** Deferred for future
3. **No Component Tests:** Three.js components too complex to test in unit tests
4. **No Visual Regression:** Would require Storybook/Chromatic setup

### Future Testing Considerations

1. **Integration Tests:** Test component interactions with stores
2. **E2E Tests:** Playwright for full user journeys
3. **Visual Regression:** Chromatic or Percy for visual changes
4. **Performance Tests:** Lighthouse CI for performance monitoring

---

## Rollback Procedure

If Phase 4 needs rollback:

```bash
# Find commit before Phase 4
git log --oneline

# Reset to Phase 3 completion
git reset --hard <phase-3-completion-commit>

# Force push if necessary
git push -f origin claude/design-feature-naming-refactor-01SwsoFYJoanSP88r5nfjhMG
```

Note: Rollback just removes tests, doesn't affect application code.

---

## Project Completion

After Phase 4 completion:

1. **Review all phases:** Comprehensive project review
2. **Final documentation:** Update README with new architecture
3. **Team demo:** Show completed refactoring
4. **Create PR:** Submit for review
5. **Deploy:** After PR approval

### Final Checklist

- ✅ Phase 1: TypeScript migration complete
- ✅ Phase 2: Zustand state management complete
- ✅ Phase 3: Tailwind CSS styling complete
- ✅ Phase 4: Testing infrastructure complete
- ✅ All tests passing
- ✅ Build succeeds
- ✅ Application functions correctly
- ✅ Performance improved
- ✅ Code quality improved
- ✅ Documentation complete

---

**Phase 4 Token Estimate Total:** ~70,000 tokens

This final phase establishes a robust testing infrastructure ensuring code quality and preventing regressions throughout the modernized codebase.

## Complete Refactoring Summary

**Total Estimated Tokens:** ~290,000 tokens across 4 phases

**Deliverables:**
- Modern TypeScript codebase
- Performant Zustand state management
- Clean Tailwind CSS styling
- Comprehensive test coverage
- Excellent developer experience
- Maintainable architecture

**Ready for production deployment! 🚀**

---

## Review Feedback (Iteration 1)

### Overall Assessment

The implementation shows excellent work on what was completed - the store tests are comprehensive, the utility tests are thorough, and the documentation is well-written. However, several key tasks from the plan remain incomplete.

### Task 5: Tests for useCameraScrollBehavior Hook

> **Consider:** Looking at the plan at lines 615-869, this task specifies creating comprehensive tests for the `useCameraScrollBehavior` hook. Have you created the file `src/__tests__/hooks/useCameraScrollBehavior.test.ts`?
>
> **Think about:** When you run `npm run test:coverage`, what is the coverage percentage for `src/hooks/useCameraScrollBehavior.ts`? Does it meet the >80% threshold specified in the success criteria (line 12)?
>
> **Reflect:** The plan provides a detailed test implementation starting at line 627. Why might testing this hook be important for preventing regressions in camera navigation?

### Task 6: Tests for Other Custom Hooks

> **Consider:** Lines 873-928 specify tests for `useCameraPositionAnimation` and `useLightingController`. What is the current test coverage for these hooks?
>
> **Think about:** Run `npm run test:coverage` and examine the hooks section. Are these files showing 0% coverage? How does this compare to the >80% target from line 12?
>
> **Reflect:** These hooks contain ~400 lines of business logic total. What risks exist in production if this logic has no test coverage?

### Task 8: Configuration Validation Tests

> **Consider:** The plan at lines 1017-1113 specifies validation tests for constants and configurations. Have you created files in `src/__tests__/constants/`?
>
> **Think about:** What happens if someone accidentally modifies `CAMERA_POSITION_ARRAY` to have positions with 2 coordinates instead of 3? Would this be caught before runtime?
>
> **Reflect:** The plan at lines 1085-1089 explains these tests "catch configuration errors early" and "prevent runtime errors." Are you confident the configuration data is valid without these tests?

### Task 11: Pre-commit Hook Decision

> **Consider:** Lines 1313-1387 describe an optional pre-commit hook task. Have you documented a decision about whether to implement this?
>
> **Think about:** The task says "Document decision" whether hooks are enabled or not. Where is this decision documented?

### Task 12: Coverage Gap Improvement

> **Consider:** Task 12 (lines 1392-1458) requires improving coverage to meet thresholds. When you run `npm run test:coverage`, what is the coverage for:
> - Stores: Should be >90% (currently ?)
> - Hooks: Should be >80% (currently ?)
> - Utils: Should be 100% (currently ?)
> - Overall: Should be >70% (currently ?)
>
> **Think about:** Looking at the coverage report output, the hooks show 0% coverage. Can the overall >70% threshold be met with entire categories at 0%?

### Task 14 & 15: Test Review and Final Verification

> **Consider:** Lines 1538-1704 specify a comprehensive review and final verification. Have you:
> - Verified test independence (line 1569)?
> - Checked test speed (line 1575)?
> - Confirmed no flaky tests (line 1634)?
> - Met all Phase 4 success criteria (lines 1710-1741)?
>
> **Reflect:** The final verification checklist at line 1675 requires all tests passing, coverage thresholds met, and Phase 4 criteria satisfied. Can you check each box honestly?

### Documentation Inconsistency

> **Consider:** The TESTING.md file at line 87 states hooks are "Not Tested (By Design)" and line 203 says hooks are "⏭️ Future work". But Phase-4.md lines 615-928 specify hook tests should be completed in Phase 4.
>
> **Think about:** Which is correct - should hooks be tested in Phase 4, or deferred? If deferred, why does the plan include detailed hook testing tasks?
>
> **Reflect:** If hooks were intentionally deferred, shouldn't this be documented as an architectural decision with justification, rather than marked as Phase 4 tasks?

### Build Quality

> **Consider:** When running `npm run build`, do you see any warnings? Specifically, check line 37:44 of `src/components/three/SceneModel.tsx`.
>
> **Think about:** The plan's success criteria (line 7-13) include "All tests passing" - should this also include "All builds passing without warnings"?

### Test File Organization

> **Consider:** When running `npm test`, you see 3 test suite failures for files like `storeMocks.ts` and `testUtils.tsx`. These are utility files, not test files.
>
> **Think about:** While `jest.config.js` has `testPathIgnorePatterns` configured, are the mock and utility files still being picked up by the test runner? Should the `testMatch` pattern be more specific?
>
> **Reflect:** Is the error "Your test suite must contain at least one test" acceptable in CI/CD, or could it cause confusion?

### Success Criteria Verification

> **Consider:** Review the Phase 4 success criteria from lines 7-14:
> - ✅ Jest and React Testing Library configured
> - ❓ All custom hooks have unit tests
> - ✅ All Zustand stores have unit tests
> - ✅ All utility functions have unit tests
> - ❓ Test coverage >80% for business logic
> - ❓ All tests passing (with no warnings?)
> - ✅ CI/CD ready test scripts
>
> **Think about:** Can Phase 4 be marked complete if 2-3 success criteria are not met?

### What Was Done Well ✅

The following aspects deserve recognition:

- **Store Tests:** Excellent coverage (100%), well-structured, comprehensive test cases
- **Utility Tests:** Exceptional thoroughness (247 test cases), covers all edge cases
- **Documentation:** TESTING.md is clear, helpful, and comprehensive
- **Test Quality:** The tests that exist follow best practices (AAA pattern, clear names)
- **Mocking Strategy:** Well-designed mock factories for stores and Three.js objects
- **CI/CD Setup:** Proper scripts for different environments

### Recommendation

Before approval, address:

1. **Implement missing hook tests** (Tasks 5 & 6) - This is critical business logic
2. **Add configuration validation tests** (Task 8) - Prevents runtime errors
3. **Improve coverage** (Task 12) to meet all thresholds
4. **Resolve documentation inconsistency** - Either test hooks in Phase 4 or document why they're deferred
5. **Fix build warning** in SceneModel.tsx
6. **Final verification** (Task 15) - Ensure all criteria met

Would you like to complete these remaining tasks to meet all Phase 4 success criteria?
