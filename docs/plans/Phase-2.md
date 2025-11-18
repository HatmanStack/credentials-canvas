# Phase 2: Zustand State Management Migration

## Phase Goal

Replace React Context API with Zustand for performant, scalable state management. This phase eliminates unnecessary re-renders caused by Context, improves developer experience with simpler state updates, and establishes a more maintainable state architecture optimized for the interactive 3D application.

**Success Criteria:**
- All Context providers removed from component tree
- All state managed through Zustand stores
- Components use selective subscriptions (no over-rendering)
- All state updates working correctly
- Application functions identically with better performance
- DevTools integration working

**Estimated Tokens:** ~75,000

---

## Prerequisites

### Must Be Complete Before Starting
- Phase 1 complete (TypeScript migration done)
- All components TypeScript
- Type definitions exist in `src/types/`
- `src/stores/` directory exists
- Application running successfully

### Verify Environment
```bash
# Verify Phase 1 complete
npx tsc --noEmit  # Should pass
npm start  # Should run

# Verify stores directory exists
ls src/stores/  # Should exist

# Clean git state
git status  # Should be clean or only Phase 1 commits
```

---

## Tasks

### Task 1: Install Zustand

**Goal:** Install Zustand library and development tools.

**Files to Modify/Create:**
- `package.json` - Add Zustand dependency

**Prerequisites:**
- Phase 1 complete
- Clean npm state

**Implementation Steps:**

1. Install Zustand:
   - Run `npm install zustand`
   - Use latest stable version (^4.x)
   - Verify installation successful

2. Install Zustand DevTools (optional but recommended):
   - DevTools middleware included in Zustand package
   - Will configure in store creation

3. Verify installation:
   - Check `package.json` has zustand in dependencies
   - Verify `node_modules/zustand/` exists
   - Check version compatibility with React 18

**Verification Checklist:**
- [ ] Zustand added to package.json dependencies
- [ ] `node_modules/zustand/` directory exists
- [ ] No installation errors
- [ ] `npm start` still works

**Testing Instructions:**
- Run `npm install` to verify clean install
- Run `npm start` to ensure no breaking changes
- No unit tests needed for installation

**Commit Message Template:**
```
chore(deps): install Zustand state management library

- Add zustand ^4.x as dependency
- Prepare for Context to Zustand migration
- Verify compatibility with React 18
```

**Estimated Tokens:** ~1,000

---

### Task 2: Create Scene Interaction Store

**Goal:** Create Zustand store for all scene interaction state (clicks, scroll, camera, drag).

**Files to Modify/Create:**
- `src/stores/sceneInteractionStore.ts` - New Zustand store

**Prerequisites:**
- Task 1 complete (Zustand installed)
- Understanding of current InteractionContext state

**Implementation Steps:**

1. Analyze current InteractionContext:
   - Review `src/contexts/InteractionContext.tsx`
   - List all state properties:
     - clickPoint (Vector3 | null)
     - clickLight (string | null)
     - clickCount (number)
     - isCloseUpView (boolean)
     - isDragging (boolean)
     - hasScrollStarted (boolean)
     - mobileScrollCount (number | null)
     - currentCameraIndex (number)
     - cameraProgress (number)
   - List all setter functions

2. Create interface `SceneInteractionState`:
   - Follow Phase-0 explicit naming convention
   - Rename state properties:
     - `clickPoint` → `clickedMeshPosition`
     - `clickLight` → `clickedLightName`
     - `clickCount` → `totalClickCount`
     - `isCloseUpView` → `isCloseUpViewActive`
     - `isDragging` → `isUserCurrentlyDragging`
     - `hasScrollStarted` → `hasUserStartedScrolling`
     - `mobileScrollCount` → `mobileScrollTriggerCount`
     - `currentCameraIndex` → `currentCameraPositionIndex`
     - `cameraProgress` → `cameraInterpolationProgress`
   - Add explicit types from `src/types/`

3. Create interface for actions:
   - Define action functions with explicit names
   - Follow pattern: `set{PropertyName}` for setters
   - Add convenience methods: `incrementClickCount`, `triggerMobileScrollNavigation`
   - Type all parameters explicitly

4. Implement Zustand store:
   - Use `create` from zustand
   - Wrap with `devtools` middleware for debugging
   - Initialize all state with appropriate default values
   - Implement all action functions
   - Use immer pattern for complex updates (if needed)

5. Add JSDoc documentation:
   - Document store purpose
   - Document each state property
   - Document each action with parameters and usage
   - Add usage examples

6. Export store hook:
   - Export as `useSceneInteractionStore`
   - Follow Zustand conventions

**Example Structure:**
```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Vector3 } from 'three';

interface SceneInteractionState {
  // Mesh interaction state
  clickedMeshPosition: Vector3 | null;
  clickedLightName: string | null;
  totalClickCount: number;

  // View state
  isCloseUpViewActive: boolean;
  isUserCurrentlyDragging: boolean;

  // Scroll state
  hasUserStartedScrolling: boolean;
  mobileScrollTriggerCount: number | null;

  // Camera state
  currentCameraPositionIndex: number;
  cameraInterpolationProgress: number;

  // Actions
  setClickedMeshPosition: (position: Vector3 | null) => void;
  setClickedLightName: (name: string | null) => void;
  incrementClickCount: () => void;
  resetClickCount: () => void;
  setIsCloseUpViewActive: (isActive: boolean) => void;
  setIsUserCurrentlyDragging: (isDragging: boolean) => void;
  setHasUserStartedScrolling: (hasStarted: boolean) => void;
  setMobileScrollTriggerCount: (count: number | null) => void;
  triggerMobileScrollNavigation: () => void;
  setCurrentCameraPositionIndex: (index: number) => void;
  setCameraInterpolationProgress: (progress: number) => void;

  // Reset store
  resetSceneInteractionState: () => void;
}

export const useSceneInteractionStore = create<SceneInteractionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      clickedMeshPosition: null,
      clickedLightName: null,
      totalClickCount: 0,
      isCloseUpViewActive: false,
      isUserCurrentlyDragging: false,
      hasUserStartedScrolling: false,
      mobileScrollTriggerCount: null,
      currentCameraPositionIndex: 0,
      cameraInterpolationProgress: 0,

      // Actions
      setClickedMeshPosition: (position) => set({ clickedMeshPosition: position }),

      setClickedLightName: (name) => set({ clickedLightName: name }),

      incrementClickCount: () => set((state) => ({
        totalClickCount: state.totalClickCount + 1
      })),

      resetClickCount: () => set({ totalClickCount: 0 }),

      setIsCloseUpViewActive: (isActive) => set({ isCloseUpViewActive: isActive }),

      setIsUserCurrentlyDragging: (isDragging) => set({ isUserCurrentlyDragging: isDragging }),

      setHasUserStartedScrolling: (hasStarted) => set({ hasUserStartedScrolling: hasStarted }),

      setMobileScrollTriggerCount: (count) => set({ mobileScrollTriggerCount: count }),

      triggerMobileScrollNavigation: () => {
        const currentCount = get().mobileScrollTriggerCount || 0;
        set({ mobileScrollTriggerCount: currentCount + 1 });
      },

      setCurrentCameraPositionIndex: (index) => set({ currentCameraPositionIndex: index }),

      setCameraInterpolationProgress: (progress) => set({ cameraInterpolationProgress: progress }),

      resetSceneInteractionState: () => set({
        clickedMeshPosition: null,
        clickedLightName: null,
        totalClickCount: 0,
        isCloseUpViewActive: false,
        isUserCurrentlyDragging: false,
        hasUserStartedScrolling: false,
        mobileScrollTriggerCount: null,
        currentCameraPositionIndex: 0,
        cameraInterpolationProgress: 0,
      }),
    }),
    { name: 'SceneInteractionStore' }
  )
);
```

**Verification Checklist:**
- [ ] Store file created in `src/stores/`
- [ ] All state properties typed
- [ ] All actions implemented
- [ ] DevTools middleware configured
- [ ] JSDoc comments added
- [ ] No TypeScript errors
- [ ] Store can be imported

**Testing Instructions:**
- Import store in a test file: `import { useSceneInteractionStore } from 'stores/sceneInteractionStore'`
- Verify no TypeScript errors
- Verify store exports correctly
- No runtime tests yet (will migrate consumers next)

**Commit Message Template:**
```
feat(stores): create scene interaction Zustand store

- Create sceneInteractionStore with all interaction state
- Migrate state from InteractionContext with explicit names
- Implement all setter actions and convenience methods
- Add DevTools middleware for debugging
- Type all state and actions with TypeScript
- Add comprehensive JSDoc documentation
```

**Estimated Tokens:** ~8,000

---

### Task 3: Create User Interface Store

**Goal:** Create Zustand store for all UI-related state (theme, audio, dimensions, settings).

**Files to Modify/Create:**
- `src/stores/userInterfaceStore.ts` - New Zustand store

**Prerequisites:**
- Task 1 complete (Zustand installed)
- Understanding of current UIContext state

**Implementation Steps:**

1. Analyze current UIContext:
   - Review `src/contexts/UIContext.tsx`
   - List all state properties:
     - selectedVibe (theme)
     - titleColorHue
     - showArcadeIframe
     - showMusicIframe
     - isAudioMuted
     - gltfModel
     - videoPlayer
     - screenWidth
     - lightIntensity
   - List all setter functions

2. Create interface `UserInterfaceState`:
   - Follow Phase-0 explicit naming
   - Rename properties:
     - `selectedVibe` → `selectedThemeConfiguration`
     - `titleColorHue` → `titleTextColorHue`
     - `showArcadeIframe` → `shouldShowArcadeIframe`
     - `showMusicIframe` → `shouldShowMusicIframe`
     - `isAudioMuted` → `isAudioCurrentlyMuted`
     - `screenWidth` → `currentWindowWidth`
     - `lightIntensity` → `currentLightIntensityConfiguration`
   - Add explicit types from `src/types/`

3. Separate Three.js references (optional architecture decision):
   - Consider: Should `gltfModel` and `videoPlayer` be in UI store?
   - Alternative: Create separate `threeJSSceneStore` for Three.js object refs
   - Recommendation: Create separate store for better separation of concerns
   - Note this decision for Task 4

4. Implement Zustand store:
   - Use `create` with devtools
   - Initialize all state
   - Implement all action functions
   - Add convenience methods if needed

5. Add JSDoc documentation:
   - Document store purpose
   - Document each property and action
   - Add usage examples

**Verification Checklist:**
- [ ] Store file created
- [ ] All UI state migrated
- [ ] All actions implemented
- [ ] DevTools configured
- [ ] JSDoc added
- [ ] No TypeScript errors

**Testing Instructions:**
- Import and verify exports
- Check TypeScript types
- No runtime tests yet

**Commit Message Template:**
```
feat(stores): create user interface Zustand store

- Create userInterfaceStore with all UI state
- Migrate state from UIContext with explicit names
- Implement theme, audio, and display settings actions
- Add DevTools middleware for debugging
- Type all state and actions
- Add JSDoc documentation
```

**Estimated Tokens:** ~7,000

---

### Task 4: Create Three.js Scene Store

**Goal:** Create dedicated store for Three.js object references (Scene, VideoPlayer).

**Files to Modify/Create:**
- `src/stores/threeJSSceneStore.ts` - New Zustand store

**Prerequisites:**
- Task 3 complete (UI store created)
- Understanding of Three.js object lifecycle

**Implementation Steps:**

1. Define store purpose:
   - Store references to Three.js objects
   - Separate from UI state for better architecture
   - Allows components to access scene without prop drilling

2. Create interface `ThreeJSSceneState`:
   - `threeJSSceneModel: THREE.Scene | null`
   - `htmlVideoPlayerElement: HTMLVideoElement | null`
   - Actions for setting these references

3. Implement store:
   - Use create with devtools
   - Simple setter actions
   - No complex logic (just reference storage)

4. Add JSDoc:
   - Explain purpose of storing Three.js refs in Zustand
   - Document when to set these values
   - Note cleanup considerations

**Verification Checklist:**
- [ ] Store created
- [ ] Three.js types imported
- [ ] Setters implemented
- [ ] JSDoc added
- [ ] No TypeScript errors

**Testing Instructions:**
- Import and verify
- Check types
- No runtime tests yet

**Commit Message Template:**
```
feat(stores): create Three.js scene Zustand store

- Create threeJSSceneStore for Three.js object references
- Store Scene and VideoPlayer references
- Separate from UI state for better architecture
- Add DevTools middleware
- Type with Three.js types
- Add JSDoc documentation
```

**Estimated Tokens:** ~4,000

---

### Task 5: Create Store Barrel Exports

**Goal:** Create index file for clean store imports.

**Files to Modify/Create:**
- `src/stores/index.ts` - Barrel exports

**Prerequisites:**
- Tasks 2-4 complete (all stores created)

**Implementation Steps:**

1. Create barrel export file:
   - Export all store hooks
   - Export store types (for testing)
   - Organize exports by category

2. Add JSDoc:
   - Explain store organization
   - Link to Phase-0 for architecture rationale

3. Enable clean imports:
   - Allow `import { useSceneInteractionStore } from 'stores'`
   - Allow `import { useSceneInteractionStore, useUserInterfaceStore } from 'stores'`

**Verification Checklist:**
- [ ] index.ts created
- [ ] All stores exported
- [ ] Imports work correctly
- [ ] No circular dependencies

**Testing Instructions:**
- Import stores via barrel export
- Verify no errors

**Commit Message Template:**
```
feat(stores): create barrel exports for Zustand stores

- Add stores/index.ts with all store exports
- Enable clean imports from 'stores'
- Organize exports by category
- Add documentation comments
```

**Estimated Tokens:** ~1,000

---

### Task 6: Migrate SceneModel Component to Zustand

**Goal:** Update SceneModel component to use Zustand instead of Context.

**Files to Modify/Create:**
- `src/components/three/SceneModel.tsx` - Update to use Zustand

**Prerequisites:**
- All stores created (Tasks 2-4)
- Understanding of current Context usage in SceneModel

**Implementation Steps:**

1. Analyze current Context usage:
   - Find all `useInteraction` calls
   - Find all `useUI` calls
   - List which state properties used
   - List which actions called

2. Replace Context with Zustand selectors:
   - Remove `useInteraction` and `useUI` imports
   - Import specific stores: `useSceneInteractionStore`, `useThreeJSSceneStore`
   - Replace destructured Context with selective Zustand subscriptions
   - Follow pattern from Phase-0: select only needed state

3. Use selective subscriptions:
   ```typescript
   // ❌ BAD - Over-subscribes
   const store = useSceneInteractionStore();

   // ✅ GOOD - Selective subscription
   const clickedMeshPosition = useSceneInteractionStore(state => state.clickedMeshPosition);
   const incrementClickCount = useSceneInteractionStore(state => state.incrementClickCount);
   ```

4. Update all state property names:
   - Replace old Context names with new Zustand names
   - Example: `isCloseUpView` → `isCloseUpViewActive`
   - Update everywhere in component

5. Update action calls:
   - Replace setter calls with new action names
   - Example: `setClickCount(count + 1)` → `incrementClickCount()`
   - Use convenience methods where available

6. Test functionality:
   - Verify component compiles
   - Test clicking on meshes
   - Verify click handlers work
   - Ensure no performance regression

**Verification Checklist:**
- [ ] All Context imports removed
- [ ] All Zustand subscriptions selective
- [ ] All state names updated
- [ ] All action calls updated
- [ ] Component compiles
- [ ] No TypeScript errors
- [ ] Clicks work correctly
- [ ] Interactions function

**Testing Instructions:**
- Run `npx tsc --noEmit`
- Run `npm start`
- Click on interactive meshes
- Verify URLs open
- Verify light clicks register
- Check console for errors

**Commit Message Template:**
```
refactor(three): migrate SceneModel to Zustand

- Replace Context hooks with Zustand stores
- Use selective subscriptions to prevent over-rendering
- Update state property names to explicit conventions
- Update action calls to use new store methods
- Verify all interactions function correctly
```

**Estimated Tokens:** ~6,000

---

### Task 7: Migrate Control Components to Zustand

**Goal:** Update CameraController, SceneAnimationController, and AudioController to use Zustand.

**Files to Modify/Create:**
- `src/components/controls/CameraController.tsx`
- `src/components/controls/SceneAnimationController.tsx`
- `src/components/controls/AudioController.tsx`

**Prerequisites:**
- Task 6 complete (pattern established)
- Stores available

**Implementation Steps:**

1. Migrate CameraController:
   - Analyze Context usage
   - Replace with selective Zustand subscriptions
   - Update property names
   - Update action calls
   - Test camera scroll functionality

2. Migrate SceneAnimationController:
   - Replace Context with Zustand
   - Update state names
   - Update actions
   - Test animations

3. Migrate AudioController:
   - Replace Context with Zustand
   - Focus on audio mute state and video player reference
   - Update actions
   - Test audio controls

4. For each component:
   - Use selective subscriptions
   - Only subscribe to needed state
   - Verify no performance issues
   - Test thoroughly

**Verification Checklist:**
- [ ] All three controllers migrated
- [ ] Context imports removed
- [ ] Selective subscriptions used
- [ ] State names updated
- [ ] Actions updated
- [ ] Camera scroll works
- [ ] Animations play
- [ ] Audio controls work

**Testing Instructions:**
- Test camera scroll (desktop wheel)
- Test mobile navigation button
- Test animations
- Test audio mute/unmute
- Verify smooth performance

**Commit Message Template:**
```
refactor(controls): migrate control components to Zustand

- Migrate CameraController to use scene interaction store
- Migrate SceneAnimationController to use stores
- Migrate AudioController to use UI and scene stores
- Use selective subscriptions for performance
- Update all state and action names
- Verify all controls function correctly
```

**Estimated Tokens:** ~9,000

---

### Task 8: Migrate Custom Hooks to Zustand

**Goal:** Update custom hooks to accept Zustand store actions instead of Context.

**Files to Modify/Create:**
- `src/hooks/useCameraScrollBehavior.ts`
- `src/hooks/useCameraPositionAnimation.ts`
- `src/hooks/useLightingController.ts`

**Prerequisites:**
- Stores created
- Understanding of hook interfaces

**Implementation Steps:**

1. Analyze hook dependencies:
   - Review which Context values hooks receive as parameters
   - Determine if hooks should:
     - A) Access stores directly inside hook
     - B) Receive store actions as parameters (dependency injection)
   - Recommendation: Option A for simplicity

2. Migrate useCameraScrollBehavior:
   - If using Option A:
     - Import store inside hook
     - Use selectors to get needed state/actions
     - Remove Context parameters
   - Update all internal state names
   - Update all action calls
   - Test scroll behavior

3. Migrate useCameraPositionAnimation:
   - Same approach as camera scroll
   - Update state and actions
   - Test animations

4. Migrate useLightingController:
   - Update to use stores
   - Test light interactions

5. Update hook consumers:
   - Components calling these hooks may need param changes
   - Verify all hook calls updated
   - Test integration

**Verification Checklist:**
- [ ] All hooks migrated
- [ ] Store usage implemented
- [ ] State names updated
- [ ] Actions updated
- [ ] Hook consumers updated
- [ ] Scroll works
- [ ] Animations work
- [ ] Lights work

**Testing Instructions:**
- Test camera scroll extensively
- Test camera animations
- Test light controls
- Verify no regression
- Check performance

**Commit Message Template:**
```
refactor(hooks): migrate custom hooks to Zustand

- Update useCameraScrollBehavior to use scene interaction store
- Update useCameraPositionAnimation to use stores
- Update useLightingController to use stores
- Remove Context dependencies
- Update all state and action names
- Verify all hook functionality preserved
```

**Estimated Tokens:** ~8,000

---

### Task 9: Migrate UI Components to Zustand

**Goal:** Update UI components to use Zustand stores.

**Files to Modify/Create:**
- `src/components/ui/LaunchScreen.tsx`
- `src/components/ui/ThemeSelectionOption.tsx`
- `src/components/ui/CustomCheckbox.tsx`

**Prerequisites:**
- Stores created
- Pattern established from previous migrations

**Implementation Steps:**

1. Migrate LaunchScreen:
   - Replace Context with Zustand
   - Update theme selection logic
   - Update state names
   - Test launch screen functionality

2. Migrate ThemeSelectionOption:
   - Replace Context with store
   - Update theme setting action
   - Test theme selection

3. Migrate CustomCheckbox:
   - Replace Context with store
   - Update checkbox state actions
   - Test checkbox interactions

4. For each component:
   - Use selective subscriptions
   - Update prop types if needed
   - Verify functionality

**Verification Checklist:**
- [ ] All UI components migrated
- [ ] Context removed
- [ ] Zustand stores used
- [ ] State names updated
- [ ] Launch screen works
- [ ] Theme selection works
- [ ] Checkboxes work

**Testing Instructions:**
- Test launch screen appearance
- Test theme selection
- Test each checkbox
- Verify UI responsiveness

**Commit Message Template:**
```
refactor(ui): migrate UI components to Zustand

- Migrate LaunchScreen to use UI store
- Migrate ThemeSelectionOption to use stores
- Migrate CustomCheckbox to use stores
- Use selective subscriptions
- Update state and action names
- Verify all UI interactions work
```

**Estimated Tokens:** ~7,000

---

### Task 10: Migrate App Component to Zustand

**Goal:** Update root App component to use Zustand and remove Context providers.

**Files to Modify/Create:**
- `src/App.tsx` - Remove providers, use Zustand

**Prerequisites:**
- All other components migrated
- Ready to remove Context providers

**Implementation Steps:**

1. Update App component state usage:
   - Replace all `useUI` and `useInteraction` hooks
   - Import appropriate Zustand stores
   - Use selective subscriptions
   - Update state property names
   - Update action calls

2. Remove Context Providers:
   - Remove `<InteractionProvider>`
   - Remove `<UIProvider>`
   - Keep only Canvas and direct children
   - Simplify component tree

3. Update TitleEffect sub-component:
   - If it uses Context, migrate to Zustand
   - Use selective subscription

4. Update event handlers:
   - Update mute toggle handler
   - Update navigation click handler
   - Verify all handlers use new store actions

5. Test application:
   - Verify app renders
   - Test all functionality
   - Check performance improvement
   - Verify no unnecessary re-renders

**Verification Checklist:**
- [ ] All Context usage removed from App
- [ ] Context providers removed from JSX
- [ ] Zustand stores used
- [ ] State names updated
- [ ] Actions updated
- [ ] App compiles
- [ ] App runs correctly
- [ ] All features work

**Testing Instructions:**
- Run full application test:
  - Load app
  - Select theme
  - Test all interactions
  - Test camera
  - Test audio
  - Test mobile
- Check React DevTools for render frequency
- Compare performance to Context version

**Commit Message Template:**
```
refactor(app): migrate App component to Zustand

- Replace Context hooks with Zustand stores
- Remove InteractionProvider and UIProvider wrappers
- Simplify component tree structure
- Use selective subscriptions for performance
- Update all state and action names
- Verify complete application functionality
```

**Estimated Tokens:** ~7,000

---

### Task 11: Delete Context Files

**Goal:** Remove old Context files now that migration is complete.

**Files to Modify/Create:**
- DELETE: `src/contexts/UIContext.tsx`
- DELETE: `src/contexts/InteractionContext.tsx`
- UPDATE: `src/contexts/index.ts` (delete or update if needed)

**Prerequisites:**
- ALL components migrated to Zustand
- No files importing from contexts/
- App fully functional with Zustand

**Implementation Steps:**

1. Verify no Context usage remains:
   - Search codebase: `grep -r "useInteraction\|useUI" src/`
   - Should find no usage (or only in deleted files)
   - Search for Context imports: `grep -r "from.*contexts" src/`
   - Verify no imports exist

2. Delete Context files:
   - Delete `UIContext.tsx`
   - Delete `InteractionContext.tsx`
   - Delete or update `index.ts` in contexts/

3. Consider deleting entire contexts directory:
   - If no other contexts exist
   - If `index.ts` is empty
   - Clean up directory structure

4. Verify application still works:
   - Run app
   - Test all functionality
   - Verify no "module not found" errors

**Verification Checklist:**
- [ ] No Context usage in codebase
- [ ] Context files deleted
- [ ] App compiles successfully
- [ ] App runs without errors
- [ ] No import errors

**Testing Instructions:**
- Run `npx tsc --noEmit`
- Run `npm start`
- Run full application test
- Verify no errors

**Commit Message Template:**
```
chore(cleanup): remove React Context files

- Delete UIContext (replaced by Zustand stores)
- Delete InteractionContext (replaced by Zustand)
- Remove contexts directory if empty
- Verify all functionality works with Zustand
- Confirm no remaining Context dependencies
```

**Estimated Tokens:** ~2,000

---

### Task 12: Add Zustand DevTools Integration

**Goal:** Verify and document Zustand DevTools usage for debugging.

**Files to Modify/Create:**
- None (documentation task)
- Optionally: Create debugging utility helpers

**Prerequisites:**
- All stores created with devtools middleware
- Chrome or Firefox with Redux DevTools extension

**Implementation Steps:**

1. Install Redux DevTools browser extension:
   - Chrome: Redux DevTools from Chrome Web Store
   - Firefox: Redux DevTools from Firefox Add-ons
   - Note: Zustand uses Redux DevTools protocol

2. Verify DevTools connection:
   - Run `npm start`
   - Open browser DevTools
   - Find "Redux" tab
   - Should see Zustand stores listed

3. Test DevTools features:
   - View current state of each store
   - See action history
   - Time-travel debug (replay actions)
   - Export/import state

4. Document DevTools usage:
   - Add comment in store files explaining DevTools
   - Note how to access in browser
   - Explain time-travel debugging
   - Document state inspection

5. (Optional) Create debugging utilities:
   - Create `src/utils/storeDebug.ts`
   - Add function to log all store states
   - Add function to reset all stores
   - Useful for development

**Verification Checklist:**
- [ ] Redux DevTools extension installed
- [ ] Zustand stores visible in DevTools
- [ ] Action history visible
- [ ] State inspection works
- [ ] Time-travel debugging works
- [ ] Documentation added

**Testing Instructions:**
- Open app with DevTools
- Interact with app
- Watch actions in Redux tab
- Try time-travel debug
- Verify helpful for debugging

**Commit Message Template:**
```
docs(stores): document Zustand DevTools integration

- Verify DevTools middleware working in all stores
- Document how to access Redux DevTools for Zustand
- Explain time-travel debugging capabilities
- Add comments in store files about DevTools usage
- Create debugging utilities for development
```

**Estimated Tokens:** ~3,000

---

### Task 13: Performance Verification

**Goal:** Verify that Zustand migration improved performance and eliminated unnecessary re-renders.

**Files to Modify/Create:**
- None (testing/verification task)
- Optionally: Add performance monitoring utilities

**Implementation Steps:**

1. Set up performance monitoring:
   - Use React DevTools Profiler
   - Enable "Highlight updates when components render"
   - Prepare to compare with baseline (if recorded before)

2. Test common interactions and observe re-renders:
   - Camera scroll: Should only update camera-related components
   - Click interaction: Should only update affected components
   - Theme change: Should only update theme-dependent components
   - Audio mute: Should only update audio button
   - Window resize: Should only update responsive components

3. Compare with Context behavior (theoretical):
   - With Context: All consumers re-render on any state change
   - With Zustand: Only subscribed state changes trigger re-renders
   - Document improvements observed

4. Measure bundle size:
   - Run `npm run build`
   - Check build output size
   - Compare to Phase 1 baseline
   - Should be similar or smaller (Zustand is tiny)

5. Measure runtime performance:
   - Use Chrome DevTools Performance tab
   - Record interaction session
   - Analyze frame rate
   - Look for improvements in render time

6. Test on lower-end devices:
   - Use Chrome DevTools throttling
   - Test on actual mobile device if available
   - Verify smooth performance

7. Document findings:
   - Record metrics
   - Note improvements
   - Identify any regressions (should be none)

**Verification Checklist:**
- [ ] React DevTools Profiler used
- [ ] Selective re-renders confirmed
- [ ] Bundle size measured
- [ ] Runtime performance measured
- [ ] Mobile performance tested
- [ ] No performance regressions
- [ ] Improvements documented

**Testing Instructions:**
- Use React DevTools with highlight updates
- Scroll camera and watch re-renders
- Click meshes and watch re-renders
- Toggle theme and watch re-renders
- Verify only affected components update
- Record findings

**Commit Message Template:**
```
test(performance): verify Zustand performance improvements

- Use React DevTools to monitor component re-renders
- Confirm selective subscriptions prevent over-rendering
- Measure bundle size (no significant increase)
- Test runtime performance (smooth interactions)
- Verify mobile device performance
- Document performance improvements from Context migration
```

**Estimated Tokens:** ~5,000

---

### Task 14: Update Store Types for Testing

**Goal:** Ensure store types are properly exported for use in tests (Phase 4).

**Files to Modify/Create:**
- `src/types/storeTypes.ts` - Update with actual store types
- `src/stores/index.ts` - Export types

**Prerequisites:**
- All stores implemented
- Types directory exists from Phase 1

**Implementation Steps:**

1. Update storeTypes.ts:
   - Import store state interfaces from each store
   - Re-export for centralized access
   - Add utility types for testing:
     - `StoreState` type unions
     - `StoreActions` type utilities
   - Add JSDoc for test usage

2. Export types from stores/index.ts:
   - Export type interfaces alongside hooks
   - Enable `import type { SceneInteractionState } from 'stores'`

3. Create mock store utilities (optional):
   - Create `src/utils/storeMocks.ts`
   - Add factory functions for creating mock stores
   - Useful for Phase 4 testing
   - Example: `createMockSceneInteractionStore(overrides)`

4. Document testing patterns:
   - Add comments explaining how to mock stores
   - Reference Phase-0 testing patterns
   - Prepare for Phase 4

**Verification Checklist:**
- [ ] Store types exported
- [ ] Types accessible from tests
- [ ] Mock utilities created (optional)
- [ ] Documentation added
- [ ] No TypeScript errors

**Testing Instructions:**
- Import store types in test file
- Verify types accessible
- Try creating mock store
- No runtime tests needed yet

**Commit Message Template:**
```
feat(types): export store types for testing

- Update storeTypes with actual store interfaces
- Export types from stores barrel export
- Create mock store utilities for testing
- Add documentation for test patterns
- Prepare stores for Phase 4 testing infrastructure
```

**Estimated Tokens:** ~4,000

---

### Task 15: Final Phase 2 Verification

**Goal:** Comprehensive testing and verification that Phase 2 is complete and successful.

**Files to Modify/Create:**
- None (verification only)

**Prerequisites:**
- ALL Phase 2 tasks complete

**Implementation Steps:**

1. Code review checklist:
   - No Context usage remains
   - All components use Zustand stores
   - All subscriptions are selective
   - State names follow explicit conventions
   - Action names follow conventions
   - DevTools working

2. TypeScript verification:
   - Run `npx tsc --noEmit`
   - Verify 0 errors
   - Check for any `any` types
   - Verify all store types correct

3. Build verification:
   - Run `npm run build`
   - Verify build succeeds
   - Check bundle size
   - Verify no warnings

4. Functional testing:
   - Test complete user journey:
     - Load application
     - Select theme
     - Scroll camera
     - Click interactions
     - Light interactions
     - Audio mute
     - Mobile navigation
     - Window resize
   - Verify all functionality works
   - Compare to Phase 1 behavior (should be identical)

5. Performance testing:
   - Use React DevTools Profiler
   - Verify selective re-renders
   - Check frame rate during interactions
   - Verify smooth performance

6. DevTools testing:
   - Open Redux DevTools
   - Verify all stores visible
   - Test time-travel debugging
   - Export/import state

7. Git verification:
   - Check all changes committed
   - Verify commit messages
   - Ensure branch up to date

**Verification Checklist:**
- [ ] No Context files remain
- [ ] All components use Zustand
- [ ] Selective subscriptions used
- [ ] `npx tsc --noEmit` passes
- [ ] Build succeeds
- [ ] All functionality works
- [ ] Performance improved
- [ ] DevTools working
- [ ] All commits clean
- [ ] Phase 2 criteria met

**Testing Instructions:**
- Run complete test suite
- Compare with Phase 1 functionality
- Verify no regressions
- Test on multiple browsers
- Test on mobile device

**Commit Message Template:**
```
test(phase-2): verify Phase 2 completion

- Verify Context completely removed
- Verify all components use Zustand
- Confirm selective subscriptions prevent over-rendering
- Test complete application functionality
- Verify performance improvements
- Test DevTools integration
- Confirm Phase 2 success criteria met
```

**Estimated Tokens:** ~4,000

---

## Phase 2 Verification

### Completion Criteria

Before marking Phase 2 complete, verify:

1. **State Management:**
   - All state in Zustand stores
   - No Context usage remains
   - Selective subscriptions used throughout

2. **Performance:**
   - Reduced re-renders confirmed
   - Smooth interactions
   - No performance regression

3. **Code Quality:**
   - All state names follow conventions
   - All actions follow conventions
   - DevTools configured

4. **Functionality:**
   - App functions identically to Phase 1
   - All interactions work
   - No bugs introduced

5. **Git State:**
   - All changes committed
   - Clean commit messages
   - Branch up to date

### Integration Points

**Interfaces for Phase 3 (Tailwind):**
- State management stable
- Component tree simplified (no Providers)
- Ready for styling changes

**Interfaces for Phase 4 (Testing):**
- Store types exported
- Mock utilities available
- Stores testable in isolation

### Known Limitations

1. **No Persist Middleware:** State resets on refresh (can add in future if needed)
2. **No Store Composition:** Stores are independent (acceptable for this app size)
3. **No Computed Values:** Using selectors in components (can optimize with computed stores if needed)

### Rollback Procedure

If Phase 2 needs rollback:

```bash
# Find commit before Phase 2
git log --oneline

# Reset to Phase 1 completion
git reset --hard <phase-1-completion-commit>

# Force push if necessary
git push -f origin claude/design-feature-naming-refactor-01SwsoFYJoanSP88r5nfjhMG
```

---

## Next Steps

After Phase 2 completion:

1. **Review stores:** Team review of store architecture
2. **Optimize if needed:** Add computed selectors if performance issues found
3. **Document patterns:** Update project docs with Zustand patterns
4. **Proceed to Phase 3:** Begin Tailwind CSS integration

**Continue to:** [Phase-3.md](./Phase-3.md) - Tailwind CSS Styling

---

**Phase 2 Token Estimate Total:** ~75,000 tokens

This phase establishes performant state management with Zustand, eliminating Context re-render issues and improving developer experience.
