---
type: repo-health
date: 2026-03-25
goal: general-health-check
---

# Codebase Health Audit: credentials-canvas

## Configuration
- **Goal:** General health check, scan all 4 vectors equally
- **Scope:** Full repo, no constraints
- **Existing Tooling:** Full setup (linters, CI pipeline, pre-commit hooks, type checking)
- **Constraints:** None
- **Deployment Target:** Serverless (Lambda/Cloud Functions) / Static SPA

## Summary
- Overall health: FAIR
- Total findings: 2 critical, 5 high, 8 medium, 6 low

## Tech Debt Ledger

### CRITICAL

1. **[Structural Design Debt]** `frontend/src/components/three/SceneModel.tsx:133-162` + `frontend/src/components/three/InteractiveMeshElement.tsx:23-57`
   - **The Debt:** The mesh click-handling logic is fully duplicated across two files. Both implement the same URL-mapping lookup, light-name detection, and phone-URL iteration, but with divergent behavior: `SceneModel` tracks `clickThroughCount` via `useState` while `InteractiveMeshElement` uses `meshRef.current.userData.clickCount`. `SceneModel` excludes `Music_Control_Box` and `Cube009_2` from URL-opening; `InteractiveMeshElement` does not. Only `SceneModel` is wired into the scene via `<primitive onClick={handleClick}>`, so `InteractiveMeshElement` appears to be dead code that could silently diverge further.
   - **The Risk:** Two sources of truth for the same behavior. Bug fixes applied to one will be missed in the other. The divergent threshold logic means behavior would differ if `InteractiveMeshElement` were ever activated.

2. **[Operational Debt]** `frontend/src/main.tsx:6-10` + `frontend/src/components/ErrorBoundary.tsx`
   - **The Debt:** An `ErrorBoundary` component exists with proper error logging and retry UI, but it is never used anywhere in the component tree. `main.tsx` renders `<App />` without wrapping it. `App.tsx` wraps the Canvas in `<Suspense>` but not in `<ErrorBoundary>`. A Three.js/WebGL rendering crash will be unhandled.
   - **The Risk:** Any WebGL context loss, shader compilation failure, or GLTF parsing error propagates as an uncaught error, producing a white screen with no recovery path for the user.

### HIGH

3. **[Structural Design Debt]** `frontend/src/hooks/useLightingController.ts:1-80`
   - **The Debt:** This entire hook is dead code. It is not imported by any component. The lighting logic it encapsulates is instead duplicated inline in `SceneEnvironment.tsx:24-110`.
   - **The Risk:** 80 lines of maintained, tested code that executes in zero production paths. Developers may waste time updating it or assume it is the canonical lighting logic when it is not.

4. **[Structural Design Debt]** `frontend/src/types/brandedTypes.ts:1-55`
   - **The Debt:** The entire branded types module (`CameraPosition`, `ThemeId`, `HueValue`, `InteractiveMeshName`, and their factory functions) is exported from `types/index.ts` but never imported or used by any other source file. The actual codebase uses plain `[number, number, number]` tuples and string literals throughout.
   - **The Risk:** A parallel type system exists that is disconnected from the code. It creates a false sense of type safety and increases cognitive load for new contributors.

5. **[Code Hygiene Debt]** `frontend/src/components/three/SceneAnimations.tsx:100-103`
   - **The Debt:** `iframePosition` is wrapped in `useMemo` with `currentWindowWidth` as a dependency, but both branches of the ternary return the identical value `[-4.055, -2.7, -1.6]`. The conditional is meaningless.
   - **The Risk:** A broken responsive behavior that appears intentional. Developers cannot tell if this was a regression or dead logic.

6. **[Architectural Debt]** `frontend/src/components/three/SceneAnimations.tsx:1-315` (315 lines)
   - **The Debt:** This component is the largest in the codebase and combines five distinct concerns: slider drag interaction (lines 36-76), text spring animations (lines 126-135), YouTube API integration with global window mutation (lines 176-222), iframe visibility management (lines 150-159), and scene node traversal (lines 161-171). It also declares a `global` Window interface augmentation at the module level (lines 22-29).
   - **The Risk:** High coupling makes isolated testing difficult (coverage is only 60% on this file). The global `Window` augmentation leaks YouTube-specific types into the global scope.

7. **[Operational Debt]** `frontend/src/components/three/SceneModel.tsx:61-131`
   - **The Debt:** Six `<video>` elements are eagerly created via `document.createElement('video')` inside a `useEffect` during scene traversal. The cleanup function pauses videos and disposes textures, but the `<video>` DOM elements themselves are never removed from the document. If the `gltf` dependency changes, all videos are recreated without checking if they already exist.
   - **The Risk:** On component re-render with a new GLTF reference, orphaned video decode contexts accumulate. On mobile devices with constrained media session limits, this could cause video playback failures.

### MEDIUM

8. **[Operational Debt]** `frontend/src/App.tsx:84-92`
   - **The Debt:** The `resize` event listener has no debounce or throttle. Every pixel of a browser resize fires `setCurrentWindowWidth`, triggering Zustand state updates and downstream re-renders.
   - **The Risk:** Performance degradation during window resize, especially on lower-end devices running the 3D scene.

9. **[Structural Design Debt]** `frontend/src/hooks/useCameraScrollBehavior.ts:48-85` vs `96-130`
   - **The Debt:** `handleMobileScroll` and `handleDesktopScroll` contain near-identical interpolation logic. The only differences are the scroll speed constant and the ref used for tracking progress.
   - **The Risk:** Changes to the scroll interpolation algorithm must be applied in two places.

10. **[Code Hygiene Debt]** `frontend/src/components/controls/CameraController.tsx:42`
    - **The Debt:** `usePrimaryCameraPosition` is typed as `useState<Vector3 | boolean>`, conflating two completely different types. It is set to `true` (initial), `false` (after scroll), and `camera.position.clone()` (a Vector3).
    - **The Risk:** A boolean-or-object union with no discriminator makes the code fragile.

11. **[Code Hygiene Debt]** `frontend/src/constants/cameraConfiguration.ts:35`
    - **The Debt:** `NO_CLOSE_UP_INDEX = 9` is a magic sentinel value that sits one beyond the last valid index of `CLOSE_UP_CAMERA_ROTATION_ARRAY`. The relationship between the constant and the array length is implicit.
    - **The Risk:** Adding or removing entries from the close-up arrays will silently break the sentinel logic.

12. **[Architectural Debt]** `frontend/src/components/three/SceneEnvironment.tsx:24-110`
    - **The Debt:** All lighting state management (color cycling, intensity normalization, theme-based color assignment) is implemented directly inside the render component. This is the same logic that `useLightingController` was meant to abstract but was abandoned.
    - **The Risk:** The component mixes rendering concerns with business logic. Testing the lighting algorithm requires rendering the full Three.js environment component.

13. **[Code Hygiene Debt]** `frontend/src/App.tsx:108-133`
    - **The Debt:** `LoadingScreen` is defined inside `useMemo` as a component constructor (`() => () => JSX`). This creates a new component type on every memo invalidation, losing any internal state.
    - **The Risk:** Visual flicker during loading as the component identity changes.

14. **[Operational Debt]** `frontend/src/App.tsx:143`
    - **The Debt:** The `<link rel="manifest">` tag is rendered twice: once inside `LoadingScreen` (line 110) and once in `AppContent` (line 143).
    - **The Risk:** Duplicate manifest links in the DOM.

15. **[Code Hygiene Debt]** Coverage below 70% threshold on key files
    - **The Debt:** Overall statement coverage is 69.25% (below the 70% threshold). `Lamp.tsx` is at 4.16% statement coverage. `SceneAnimations.tsx` is at 60.46% line coverage. `useCameraPositionAnimation` is at 62.5% branches.
    - **The Risk:** Critical rendering paths (particle system, animation sequences) are undertested.

### LOW

16. **[Code Hygiene Debt]** `frontend/public/draco/javascript/` (entire directory)
    - **The Debt:** 25+ unused JavaScript files in the DRACO decoder public directory. Only the WASM GLTF decoder is needed at runtime.
    - **The Risk:** Unnecessary deployment size and attack surface.

17. **[Code Hygiene Debt]** `frontend/src/constants/lightingConfiguration.ts:15-24`
    - **The Debt:** The `LIGHT_COLOR_WHEEL` array contains 73 color entries with extensive duplication (the second half is a copy of the first half).
    - **The Risk:** Random selection from this array is biased toward certain colors.

18. **[Code Hygiene Debt]** `frontend/src/types/componentTypes.ts:28-37`
    - **The Debt:** `AssetConfiguration` and `BreakpointConfiguration` interfaces are exported but never used anywhere.
    - **The Risk:** Dead type definitions that add noise.

19. **[Structural Design Debt]** `frontend/src/components/three/SceneAnimations.tsx:66-68`
    - **The Debt:** In `useSliderSpring`, `basePositionRef.current` is updated inside the `down` branch of the drag handler, creating a potential snap-back inconsistency.
    - **The Risk:** Subtle drag behavior bug where releasing a slider may not return to the expected resting position.

20. **[Code Hygiene Debt]** Knip configuration missing
    - **The Debt:** Knip reports 90 "unused files" because no `knip.json` configuration exists. All source files appear as unused.
    - **The Risk:** Dead code detection tool produces so much noise that genuine dead code is buried in false positives.

21. **[Code Hygiene Debt]** `@types/three` version mismatch with `three`
    - **The Debt:** `three` is pinned at `^0.183.2` but `@types/three` is at `^0.159.0`, a 24-minor-version gap.
    - **The Risk:** Type definitions do not match the runtime API, causing ongoing `@ts-expect-error` suppressions.

## Quick Wins

1. `frontend/src/main.tsx:6-10` -- Wrap `<App />` with `<ErrorBoundary>` (estimated effort: < 15 minutes)
2. `frontend/src/hooks/useLightingController.ts` -- Delete entire file and its test, as it is unused dead code (estimated effort: < 15 minutes)
3. `frontend/src/components/three/SceneAnimations.tsx:100-103` -- Remove the dead ternary in `iframePosition` or add the correct alternate value (estimated effort: < 15 minutes)
4. Add a `knip.json` configuration to the root so dead code detection produces actionable results (estimated effort: < 30 minutes)
5. `frontend/src/App.tsx:110` -- Remove the duplicate `<link rel="manifest">` from `LoadingScreen` (estimated effort: < 5 minutes)

## Automated Scan Results

- **Vulnerability scan (`npm audit`):** 0 vulnerabilities found. Clean bill of health.
- **Dead code scan (`npx knip`):** 90 files reported as unused due to missing Knip configuration. Genuine dead code confirmed through manual analysis:
  - `frontend/src/hooks/useLightingController.ts` -- never imported by any component
  - `frontend/src/components/three/InteractiveMeshElement.tsx` -- exports a component never rendered in the tree
  - `frontend/src/types/brandedTypes.ts` -- exports types and functions never consumed
  - `frontend/src/types/componentTypes.ts:28-37` -- `AssetConfiguration` and `BreakpointConfiguration` interfaces unused
  - 25+ DRACO JavaScript files in `frontend/public/draco/javascript/` are unnecessary
- **Secrets scan:** No hardcoded secrets, API keys, or high-entropy strings found.
- **Test coverage:** 69.25% statements, 57.27% branches, 66.12% functions, 69.45% lines. Below the configured 70% threshold. Key gaps in `Lamp.tsx` (4%), `SceneAnimations.tsx` (60%), and `useCameraPositionAnimation.ts` (62.5% branches).
- **Git hygiene:** Clean working tree, conventional commit messages, `.gitignore` covers `node_modules`, build outputs, coverage, and `.glb` model files.
