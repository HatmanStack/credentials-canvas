# Phase 2: [IMPLEMENTER] Error Handling, Architecture, and Performance

## Phase Goal

Fix the critical error handling gaps, decompose the SceneAnimations god component, refactor problematic type patterns, and address performance issues. This phase addresses the lowest-scoring evaluation pillars: Defensiveness (5/10), Architecture (6/10), and Performance (7/10).

**Success criteria:**
- ErrorBoundary is mounted and catches rendering crashes
- SceneAnimations is split into 3+ focused components
- No unsafe type assertions (`as THREE.MeshStandardMaterial`) remain
- CameraController state no longer uses `Vector3 | boolean`
- YouTube script injection is idempotent
- Scroll handlers are deduplicated
- Vector3 allocations in hot paths use pre-allocated refs
- `npm run check` passes after all changes

**Estimated tokens:** ~25,000

## Prerequisites

- Phase 1 complete (dead code removed)
- `npm run check` passes

## Tasks

### Task 1: Mount ErrorBoundary in the component tree

**Goal:** The `ErrorBoundary` component exists but is never used. Mount it so WebGL crashes show a recovery UI instead of a white screen. Also remove the duplicate `<link rel="manifest">` tag.

**Findings addressed:** health-audit #2 (CRITICAL), health-audit #14 (MEDIUM), eval Defensiveness

**Files to modify/create:**
- `frontend/src/main.tsx` -- Wrap `<App />` with `<ErrorBoundary>`
- `frontend/src/App.tsx` -- Remove duplicate `<link rel="manifest">` from `LoadingScreen`

**Prerequisites:** Read `frontend/src/components/ErrorBoundary.tsx` to understand its props and behavior.

**Implementation steps:**
1. Read `frontend/src/main.tsx`. Currently it renders `<App />` directly into the root.
2. Import `ErrorBoundary` and wrap `<App />` with it: `<ErrorBoundary><App /></ErrorBoundary>`.
3. Read `frontend/src/App.tsx`. Find the two locations where `<link rel="manifest">` is rendered.
4. Remove the duplicate `<link rel="manifest">` from whichever location is inside `LoadingScreen` (the one that gets unmounted).
5. While in `main.tsx`, consider replacing the `document.getElementById('root')!` non-null assertion with a runtime guard that throws a descriptive error if the element is missing. For example:
   ```typescript
   const root = document.getElementById('root');
   if (!root) throw new Error('Root element not found');
   ```
6. Run `npm run check`.

**Verification checklist:**
- [x] `ErrorBoundary` is imported and wraps `<App />` in `main.tsx`
- [x] Only one `<link rel="manifest">` exists in the rendered tree
- [x] `main.tsx` does not use `!` non-null assertion on the root element
- [x] `npm run check` passes

**Commit message template:**
```
fix: mount ErrorBoundary and remove duplicate manifest link

- Wraps App with ErrorBoundary to catch WebGL rendering crashes
- Removes duplicate <link rel="manifest"> from LoadingScreen
- Replaces non-null assertion with runtime guard in main.tsx
```

---

### Task 2: Make YouTube script injection idempotent

**Goal:** Prevent multiple YouTube iframe API script tags from accumulating if SceneAnimations remounts.

**Findings addressed:** eval Defensiveness (critical failure point #2)

**Files to modify/create:**
- `frontend/src/components/three/SceneAnimations.tsx` -- Add idempotency guard to YouTube script injection

**Prerequisites:** Read SceneAnimations.tsx lines 170-225 to understand the YouTube API setup.

**Implementation steps:**
1. Read the YouTube API injection code in SceneAnimations.tsx.
2. Before appending the `<script>` tag, check if `window.YT` already exists or if a script tag with the YouTube iframe API src already exists in the document. If either condition is true, skip injection.
3. Consider also checking `document.querySelector('script[src*="youtube.com/iframe_api"]')` as a guard.
4. Run `npm run check`.

**Verification checklist:**
- [x] YouTube script tag is only appended once even if the component remounts
- [x] `npm run check` passes

**Commit message template:**
```
fix(three): make YouTube iframe API script injection idempotent

- Check for existing script tag before appending
- Prevents duplicate scripts on component remount
```

---

### Task 3: Guard empty URL in click handler

**Goal:** Prevent `window.open('', '_blank')` from opening a blank tab when a mesh has an empty URL configured.

**Findings addressed:** eval Defensiveness (urlConfiguration concern)

**Files to modify/create:**
- `frontend/src/components/three/SceneModel.tsx` -- Add truthy check before `window.open`

**Implementation steps:**
1. Read the click handler in SceneModel.tsx (around line 133-162).
2. Find the `window.open` call that opens URLs from the phone URL configuration.
3. Add a guard: only call `window.open` if the URL string is truthy and non-empty.
4. Run `npm run check`.

**Verification checklist:**
- [x] `window.open` is not called with an empty string URL
- [x] `npm run check` passes

**Commit message template:**
```
fix(three): guard against opening blank tab for empty mesh URLs

- Check URL is truthy before calling window.open
```

---

### Task 4: Replace unsafe type assertions with type guards

**Goal:** Replace `as THREE.MeshStandardMaterial` casts in SceneModel.tsx with runtime `instanceof` checks.

**Findings addressed:** health-audit #10 (MEDIUM, partial), eval Type Rigor

**Files to modify/create:**
- `frontend/src/components/three/SceneModel.tsx` -- Replace `as` casts with `instanceof` guards

**Implementation steps:**
1. Read SceneModel.tsx and find all `as THREE.MeshStandardMaterial` casts.
2. Replace each with an `instanceof THREE.MeshStandardMaterial` check. Where the cast is used to access material properties, wrap the access in an `if (material instanceof THREE.MeshStandardMaterial)` block.
3. Consider creating a small helper function like `isMeshStandardMaterial(material): material is THREE.MeshStandardMaterial` if the check appears 3+ times.
4. Run `npm run check`.

**Verification checklist:**
- [x] No `as THREE.MeshStandardMaterial` casts remain in the file
- [x] Runtime instanceof checks guard all material property access
- [x] `npm run check` passes

**Commit message template:**
```
refactor(three): replace unsafe material type casts with instanceof guards

- Adds runtime type checking instead of compile-time assertions
```

---

### Task 5: Refactor CameraController state type

**Goal:** Replace `useState<Vector3 | boolean>` with a proper type. The state holds either `null` (initial/reset) or a `Vector3` (camera position). The boolean values serve as flags that can be replaced with `null`.

**Findings addressed:** health-audit #10 (MEDIUM), eval Architecture, eval Type Rigor

**Files to modify/create:**
- `frontend/src/components/controls/CameraController.tsx` -- Refactor `usePrimaryCameraPosition` state

**Prerequisites:** Read CameraController.tsx to understand how the boolean and Vector3 values are used.

**Implementation steps:**
1. Read the full CameraController.tsx file.
2. Identify all places where `usePrimaryCameraPosition` is set to `true`, `false`, or a `Vector3`.
3. Design the replacement:
   - `null` replaces the initial `true` value (meaning "no position recorded yet")
   - `null` replaces the `false` value (meaning "reset / no active position")
   - `Vector3` remains for the actual camera position
   - The type becomes `useState<Vector3 | null>(null)`
4. Update all conditionals that check for `=== true` or `=== false` to check for `=== null` or `!== null` as appropriate.
5. Run `npm run check`.

**Verification checklist:**
- [x] `usePrimaryCameraPosition` type is `Vector3 | null`, not `Vector3 | boolean`
- [x] No boolean values are assigned to the state variable
- [x] All conditionals are updated to use null checks
- [x] `npm run check` passes

**Commit message template:**
```
refactor(camera): replace Vector3 | boolean state with Vector3 | null

- Eliminates confusing boolean-or-object union type
- null represents "no position recorded", Vector3 represents actual position
```

---

### Task 6: Replace magic sentinel NO_CLOSE_UP_INDEX with null

**Goal:** Replace `NO_CLOSE_UP_INDEX = 9` (a magic number sentinel) with `null` to indicate "no close-up active". Derive the value from the array length if a numeric sentinel is still needed, but prefer `null`.

**Findings addressed:** health-audit #11 (MEDIUM)

**Files to modify/create:**
- `frontend/src/constants/cameraConfiguration.ts` -- Replace or derive the sentinel
- Any files that reference `NO_CLOSE_UP_INDEX` -- Update comparisons

**Implementation steps:**
1. Read `cameraConfiguration.ts` to understand the constant and how `CLOSE_UP_CAMERA_ROTATION_ARRAY` is structured.
2. Search the codebase for all uses of `NO_CLOSE_UP_INDEX`.
3. If possible, change the close-up index state to `number | null` where `null` means "no close-up". Update `NO_CLOSE_UP_INDEX` to be `null` or remove it entirely.
4. If the index is used in array bounds checking, `null` is cleaner than a magic number.
5. Update all comparison sites.
6. Run `npm run check`.

**Verification checklist:**
- [x] No magic sentinel value exists that implicitly depends on array length
- [x] All comparison sites are updated
- [x] `npm run check` passes

**Commit message template:**
```
refactor(camera): replace NO_CLOSE_UP_INDEX sentinel with null

- Eliminates implicit dependency between constant and array length
```

---

### Task 7: Extract SceneAnimations into focused components

**Goal:** Split the 315-line SceneAnimations.tsx into three focused components: one for YouTube/music player logic, one for the arcade iframe, and one for the slider controller. The parent SceneAnimations component becomes a thin composition layer.

**Findings addressed:** health-audit #6 (HIGH), eval Architecture

**Files to modify/create:**
- `frontend/src/components/three/SceneAnimations.tsx` -- Reduce to composition of child components
- `frontend/src/components/three/YouTubeMusicPlayer.tsx` -- CREATE: YouTube API lifecycle, player controls
- `frontend/src/components/three/ArcadeIframe.tsx` -- CREATE: Arcade iframe visibility, positioning
- `frontend/src/components/three/SliderController.tsx` -- CREATE: Slider drag interaction, spring physics
- `frontend/src/types/youtubeTypes.ts` -- MODIFY (already exists): Add `declare global` Window interface augmentation moved from SceneAnimations

**Prerequisites:**
- Read the full SceneAnimations.tsx file (315 lines) to understand all five concerns
- Read existing tests in `frontend/tests/frontend/components/` to understand testing patterns

**Implementation steps:**
1. Read all of SceneAnimations.tsx carefully. Identify the boundaries between concerns:
   - **SliderController**: The `useSliderSpring` hook and slider-related JSX (drag handler, spring animations for slider meshes). Roughly lines 36-76 and the slider JSX in the render.
   - **YouTubeMusicPlayer**: The YouTube API injection, `useEffect` for script loading, player creation/destruction, `onYouTubeIframeAPIReady` callback. Roughly lines 176-222 and music-related JSX.
   - **ArcadeIframe**: The iframe visibility management, Html component rendering for the arcade iframe. Related to `shouldShowArcadeIframe` store state.
   - **Remaining in SceneAnimations**: Text spring animations, particle rendering, scene node traversal, and composition of the three extracted components.
2. Move the `declare global` Window interface augmentation into the existing type file `frontend/src/types/youtubeTypes.ts` (this file already exists and contains the `YouTubePlayer` interface; modify it, do not create a new file).
3. Create `SliderController.tsx`. Move the slider drag logic, `useSliderSpring`, and slider JSX. Import needed constants and store hooks. The component should accept props for any data it needs from the parent (or access stores directly if that is the existing pattern).
4. Create `YouTubeMusicPlayer.tsx`. Move the YouTube script injection, player lifecycle, and music-related JSX. Apply the idempotency guard from Task 2 during this extraction.
5. Create `ArcadeIframe.tsx`. Move the arcade iframe Html component and its visibility logic.
6. Update `SceneAnimations.tsx` to import and compose the three new components. Keep text spring animations, particle rendering, and scene traversal in SceneAnimations since they are tightly coupled to the scene graph.
7. Update `frontend/src/components/three/index.ts` barrel file to export the new components if needed.
8. Run `npm run check`.

**Verification checklist:**
- [x] SceneAnimations.tsx is under 150 lines
- [x] Each extracted component is self-contained with its own imports
- [x] No `declare global` in SceneAnimations.tsx (moved to types file)
- [x] All three extracted components are rendered by SceneAnimations
- [x] `npm run check` passes
- [x] Existing SceneAnimations tests still pass (they may need import path updates)

**Commit message template:**
```
refactor(three): extract SceneAnimations into focused components

- YouTubeMusicPlayer: YouTube API lifecycle and music controls
- ArcadeIframe: iframe visibility and positioning
- SliderController: drag interaction and spring physics
- SceneAnimations is now a thin composition layer
```

---

### Task 8: Extract shared scroll interpolation logic

**Goal:** Deduplicate the near-identical scroll interpolation logic between `handleMobileScroll` and `handleDesktopScroll` in `useCameraScrollBehavior.ts`.

**Findings addressed:** health-audit #9 (MEDIUM), eval Code Quality

**Files to modify/create:**
- `frontend/src/hooks/useCameraScrollBehavior.ts` -- Extract shared logic into private function

**Implementation steps:**
1. Read `useCameraScrollBehavior.ts` in full.
2. Identify the shared interpolation logic between the mobile (lines ~48-85) and desktop (lines ~96-130) handlers.
3. Extract the shared logic into a private helper function within the same file. The function should accept the differing parameters (scroll speed constant, progress ref) as arguments.
4. Rewrite both handlers to call the shared function.
5. Run `npm run check`.

**Verification checklist:**
- [x] No duplicated interpolation logic between mobile and desktop handlers
- [x] Both handlers delegate to a shared function
- [x] `npm run check` passes
- [x] Existing tests for this hook still pass

**Commit message template:**
```
refactor(camera): extract shared scroll interpolation logic

- Deduplicates near-identical code between mobile and desktop handlers
- Changes to interpolation algorithm now apply in one place
```

---

### Task 9: Pre-allocate Vector3 instances in scroll handler

**Goal:** Avoid creating new Vector3 objects on every scroll event by using pre-allocated refs.

**Findings addressed:** eval Performance

**Files to modify/create:**
- `frontend/src/hooks/useCameraScrollBehavior.ts` -- Use useRef for reusable Vector3 instances

**Implementation steps:**
1. In the scroll handler, find where `new THREE.Vector3(...)` is called per scroll event.
2. Create `useRef` instances for these Vector3 objects at the hook level.
3. Reuse the ref values by calling `.set(x, y, z)` instead of constructing new objects.
4. Run `npm run check`.

**Verification checklist:**
- [x] No `new THREE.Vector3` calls inside scroll event handlers
- [x] Vector3 instances are pre-allocated via useRef
- [x] `npm run check` passes

**Commit message template:**
```
perf(camera): pre-allocate Vector3 instances in scroll handler

- Eliminates per-scroll-event object allocation
- Uses useRef for reusable Vector3 instances
```

---

### Task 10: Fix LoadingScreen component identity issue

**Goal:** The `LoadingScreen` is defined inside `useMemo` as a component constructor (`() => () => JSX`), which creates a new component type on memo invalidation, losing internal state.

**Findings addressed:** health-audit #13 (MEDIUM)

**Files to modify/create:**
- `frontend/src/App.tsx` -- Refactor LoadingScreen definition

**Prerequisites:** Read `App.tsx` lines 108-133 to understand the current pattern.

**Implementation steps:**
1. Read the LoadingScreen definition in App.tsx.
2. Extract it as a proper named component defined outside the parent component, or as a stable reference that does not create a new component type. The simplest fix is to define `LoadingScreen` as a standalone component (either in the same file or a separate file) and pass any dynamic data as props.
3. Run `npm run check`.

**Verification checklist:**
- [x] `LoadingScreen` is not defined inside `useMemo`
- [x] The component identity is stable across re-renders
- [x] `npm run check` passes

**Commit message template:**
```
fix: stabilize LoadingScreen component identity

- Define as standalone component instead of inside useMemo
- Prevents state loss on memo invalidation
```

---

### Task 11: Add resize event debouncing

**Goal:** Debounce the window resize event handler to prevent excessive Zustand state updates during resize.

**Findings addressed:** health-audit #8 (MEDIUM)

**Files to modify/create:**
- `frontend/src/App.tsx` -- Add debounce to resize handler

**Implementation steps:**
1. Read App.tsx lines 84-92 where the resize listener is set up.
2. Add a simple debounce (150-200ms) to the `setCurrentWindowWidth` call. You can implement a minimal debounce inline using `setTimeout`/`clearTimeout` in the useEffect, or use a ref-based approach. Do not add a new dependency for this.
3. Run `npm run check`.

**Verification checklist:**
- [x] Resize handler is debounced
- [x] The debounce timer is cleaned up in the useEffect cleanup function
- [x] `npm run check` passes

**Commit message template:**
```
perf: debounce window resize handler

- Prevents excessive state updates during browser resize
- Uses 150ms debounce with proper cleanup
```

---

### Task 12: Fix video element cleanup in SceneModel

**Goal:** Ensure video DOM elements created during scene traversal are properly removed on cleanup, preventing orphaned decode contexts.

**Findings addressed:** health-audit #7 (HIGH)

**Files to modify/create:**
- `frontend/src/components/three/SceneModel.tsx` -- Fix useEffect cleanup for video elements

**Implementation steps:**
1. Read SceneModel.tsx lines 61-131 to understand the video creation and cleanup logic.
2. In the cleanup function of the useEffect that creates video elements, add code to remove the video elements from the DOM (not just pause them).
3. Track created video elements in a local array or ref so the cleanup function can iterate and remove them.
4. Run `npm run check`.

**Verification checklist:**
- [x] Video elements are removed from the DOM in the useEffect cleanup
- [x] No orphaned video elements accumulate on re-render
- [x] `npm run check` passes

**Commit message template:**
```
fix(three): properly remove video DOM elements on cleanup

- Track created video elements and remove from DOM on unmount
- Prevents orphaned media decode contexts on re-render
```

## Phase Verification

After all tasks are complete:

1. Run `npm run check` from repo root. It must pass.
2. Verify `ErrorBoundary` wraps `<App />` in `main.tsx`.
3. Verify SceneAnimations.tsx is under 150 lines and composes three child components.
4. Verify no `as THREE.MeshStandardMaterial` casts remain in SceneModel.tsx.
5. Verify `usePrimaryCameraPosition` type is `Vector3 | null`.
6. Verify no `new THREE.Vector3` inside scroll handlers.
7. Verify YouTube script injection checks for existing script before appending.

**Known limitations:**
- Test coverage for the newly extracted components (YouTubeMusicPlayer, ArcadeIframe, SliderController) is addressed in Phase 3.
- The `SceneModel.test.tsx` rewrite is in Phase 3.
- The `@ts-expect-error` on animated.primitive in the extracted components may persist until `@types/three` is updated (Phase 4).
