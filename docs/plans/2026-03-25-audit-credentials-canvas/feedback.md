# Feedback: 2026-03-25-audit-credentials-canvas

## Active Feedback

### VERIFICATION PASS (2026-03-25)

**Test Suite:** 19 test files, 277 tests passed, 0 failures. Lint passes clean.

#### VERIFIED Findings (Fixed)

**CRITICAL findings from health-audit.md:**

1. **CRITICAL #1 (Structural Design Debt) - Duplicated click handler logic between SceneModel.tsx and InteractiveMeshElement.tsx**: VERIFIED. `InteractiveMeshElement.tsx` has been deleted (Glob returns no results). Click handling exists only in `SceneModel.tsx:141-172`.

2. **CRITICAL #2 (Operational Debt) - ErrorBoundary defined but never mounted**: VERIFIED. `main.tsx:4` imports `ErrorBoundary` and `main.tsx:12-14` wraps `<App />` with `<ErrorBoundary>`. Additionally, `main.tsx:7-8` guards the root element lookup with a runtime check (`if (!root) throw new Error(...)`) instead of the `!` non-null assertion.

**HIGH findings from health-audit.md:**

3. **HIGH #3 (Structural Design Debt) - useLightingController.ts is dead code**: VERIFIED. File deleted (Glob returns no results). No imports of `useLightingController` anywhere in `frontend/src/`. Test file also deleted.

4. **HIGH #4 (Structural Design Debt) - brandedTypes.ts unused**: VERIFIED. File deleted (Glob returns no results). No imports of `brandedTypes` anywhere in `frontend/src/`.

5. **HIGH #5 (Code Hygiene Debt) - iframePosition dead responsive ternary in SceneAnimations.tsx**: VERIFIED. `SceneAnimations.tsx` was refactored into smaller components. The `iframePosition` logic now lives in `ArcadeIframe.tsx:7` as a constant `IFRAME_POSITION` with no dead ternary. No references to `iframePosition` exist in the codebase.

6. **HIGH #6 (Architectural Debt) - SceneAnimations.tsx 315-line god component**: VERIFIED. `SceneAnimations.tsx` is now 119 lines and composes `SliderController`, `YouTubeMusicPlayer`, and `ArcadeIframe` as separate components. All three extracted files exist.

7. **HIGH #7 (Operational Debt) - Video elements not removed from DOM on cleanup**: VERIFIED. `SceneModel.tsx:126-133` now clears the video source (`removeAttribute('src')`, `load()`) and removes from DOM (`removeChild`) in the cleanup function.

**Eval.md remediation targets:**

8. **Architecture - CameraController usePrimaryCameraPosition typed Vector3 | boolean**: VERIFIED. `CameraController.tsx:42` now uses `useState<Vector3 | null>(new Vector3())`. The `boolean` type is gone, replaced with `null` for the unset case.

9. **Code Quality - as THREE.MeshStandardMaterial unsafe casts in SceneModel.tsx**: VERIFIED. `SceneModel.tsx:29,91,105-107` uses `instanceof THREE.MeshStandardMaterial` checks instead of `as` casts.

10. **Code Quality - NO_CLOSE_UP_INDEX = 9 sentinel**: VERIFIED. `cameraConfiguration.ts:35` now reads `NO_CLOSE_UP_INDEX = null`. The type throughout the codebase uses `number | null`.

11. **Code Quality - Shared scroll logic extraction in useCameraScrollBehavior.ts**: VERIFIED. `useCameraScrollBehavior.ts:44-75` defines a shared `interpolateScroll` function that both `handleMobileScroll` (line 118) and `handleDesktopScroll` (line 156) call, eliminating the duplication.

12. **Performance - Pre-allocate Vector3 instances in useCameraScrollBehavior**: VERIFIED. `useCameraScrollBehavior.ts:95-99` pre-allocates `ScrollVectorRefs` with `useRef`, and the shared `interpolateScroll` function uses these refs instead of creating new Vector3 objects per scroll event.

13. **Test Value - expect(true).toBe(true) placeholder**: VERIFIED. No occurrences of `expect(true).toBe(true)` found anywhere in `frontend/tests/`.

14. **Defensiveness - YouTube API script injection without idempotency guard**: VERIFIED. `YouTubeMusicPlayer.tsx:44-56` checks for `window.YT` and existing script tag (`querySelector('script[src*="youtube.com/iframe_api"]')`) before appending a new script.

15. **Defensiveness - Guard empty URL in SceneModel click handler**: VERIFIED. `SceneModel.tsx:162` checks `phoneUrl.url` is truthy before calling `window.open`.

16. **Pragmatism - Resize handler no debounce**: VERIFIED. `App.tsx:125-137` debounces the resize handler with a 150ms `setTimeout`.

17. **Code Quality - cn() missing explicit return type**: VERIFIED. `classNameUtils.ts:4` now reads `export function cn(...inputs: ClassValue[]): string`.

18. **Reproducibility - Pre-commit hooks**: VERIFIED. `.husky/pre-commit` exists and runs `npm run lint`.

19. **Git Hygiene - Commitlint**: VERIFIED. `.husky/commit-msg` runs `npx commitlint --edit "$1"`, and `.commitlintrc.json` extends `@commitlint/config-conventional`.

20. **Config Drift - vitest.config.ts setupFiles path**: VERIFIED. `vitest.config.ts:26` now correctly reads `./frontend/tests/helpers/setup.ts`.

**Doc-audit.md findings:**

21. **DRIFT #1 - CLAUDE.md says "React 18"**: VERIFIED. `CLAUDE.md:28` now says "React 19".

22. **DRIFT #2 - CLAUDE.md claims DRACO decoder path in meshConfiguration.ts**: VERIFIED. `CLAUDE.md:57` now correctly states the model path is in `meshConfiguration.ts` and the DRACO decoder path is in `SceneModel.tsx`.

23. **DRIFT #3 - docs/README.md test directory structure incomplete**: VERIFIED. `docs/README.md:167-187` now includes `components/` with subtrees for `controls/`, `three/`, `ui/`, plus standalone test files for extracted components.

24. **DRIFT #4 - docs/README.md Tailwind color list incomplete**: VERIFIED. `docs/README.md:243-262` now lists all 15 colors including `graphics-theme` and all per-theme `*-active`/`*-rest` colors.

25. **DRIFT #5 - Model download URLs conflict between README.md and docs/README.md**: VERIFIED. `README.md:60` and `docs/README.md:141` both use `https://credentials.hatstack.fun/compressed_model.glb`.

26. **DRIFT #6 - Store descriptions have inaccuracies**: VERIFIED. `docs/README.md:80-95` now documents `mobileScrollTriggerCount`, `cameraInterpolationProgress`, `shouldShowArcadeIframe`, `shouldShowMusicIframe`, and `titleTextColorHue`.

27. **BROKEN LINK #1 and #2 - README.md gif paths wrong**: VERIFIED. `README.md:25,28` now reference `frontend/public/ez.gif` and `frontend/public/house.gif`.

28. **STALE CODE EXAMPLE #1 - docs/README.md test import path**: VERIFIED. `docs/README.md:198` uses `import { useSceneInteractionStore } from '@/stores';`.

29. **STALE CODE EXAMPLE #2 - docs/README.md styling import path**: VERIFIED. `docs/README.md:231` uses `import { cn } from '@/utils/classNameUtils';`.

30. **GAP #1 - logger.ts undocumented**: VERIFIED. `docs/README.md:106-108` documents the logger utility.

31. **Duplicate manifest link**: VERIFIED. `App.tsx` has `<link rel="manifest">` only at line 161 (in `AppContent`). The `LoadingScreen` component (lines 60-93) no longer contains a manifest link. No duplication.

32. **LoadingScreen defined inside useMemo**: VERIFIED. `App.tsx:60-93` defines `LoadingScreen` as a proper standalone component outside of `useMemo`.

#### UNVERIFIED Findings (Still Present)

33. **HIGH #7 partial - SceneModel.tsx Base check inside PHONE_VIDEO_CONFIGURATIONS loop**: UNVERIFIED. `SceneModel.tsx:100-111` still checks `node.name === 'Base'` inside the `for` loop iterating over `PHONE_VIDEO_CONFIGURATIONS`. This means the Base check runs once per video config per mesh node (6 times per Base node), when it only needs to run once outside the loop.

34. **urlConfiguration.ts:53 - Empty URL for Cube009_2**: Still present. `urlConfiguration.ts:53` reads `{ signName: ['Cube009_2'], url: '' }`. The `phoneUrl.url` truthy guard in `SceneModel.tsx:162` prevents `window.open('')`, so the runtime risk is mitigated, but the empty-URL entry remains as dead configuration.

35. **componentTypes.ts:28-37 - AssetConfiguration and BreakpointConfiguration**: NOT dead code, contrary to original finding. These types are imported and used in `constants/themeConfiguration.ts:4-5` for `RESPONSIVE_BREAKPOINTS` and `ASSET_FILE_PATHS`. The original health-audit finding was incorrect.

36. **Creativity - Camera arc animation still uses raw requestAnimationFrame**: UNVERIFIED. `useCameraPositionAnimation.ts:96-113` still uses `requestAnimationFrame` directly rather than R3F's `useFrame` with a time accumulator.

37. **Creativity - Particle shader color not exposed as theme-driven uniform**: UNVERIFIED. `fragment.glsl:4` still has hardcoded `vec3(0.34, 0.53, 0.96)`. No uniform for theme color.

38. **SceneModel.tsx:63-113 - Scene graph traversal checks mesh.name === 'Base' 6 times per mesh node**: Same as #33 above.

39. **lightingConfiguration.ts:15-24 - LIGHT_COLOR_WHEEL duplicated entries**: Not checked for remediation (LOW priority finding).

40. **Knip configuration missing**: Not checked for remediation (LOW priority finding).

41. **@types/three version mismatch**: Not checked for remediation (LOW priority finding).

#### Summary

- **Verified:** 32 findings fixed
- **Unverified (still present):** 3 findings remain (#33 Base check in loop, #36 raw rAF, #37 hardcoded shader color)
- **Corrected:** 1 finding from original audit was incorrect (#35 AssetConfiguration/BreakpointConfiguration are used)
- **Not checked (LOW priority):** 3 findings (#39, #40, #41)
- **Tests:** All 277 pass. Lint clean. Coverage improved significantly (Lamp.tsx from 4% to 95%, SceneAnimations.tsx to 100%, useCameraPositionAnimation.ts branches to 80%)

## Resolved Feedback

### PLAN_REVIEW (2026-03-25)

#### Critical Issues (Must Fix)

1. **Hallucinated File (Phase 2, Task 7, Step 2)**: The plan says to move `declare global` into `frontend/src/types/youtubeTypes.ts` and lists that path as a target. However, the instruction in the files list is embedded in the parent component extraction task, which says to CREATE `YouTubeMusicPlayer.tsx`, `ArcadeIframe.tsx`, and `SliderController.tsx`. The `youtubeTypes.ts` file already exists at `frontend/src/types/youtubeTypes.ts` (it contains the `YouTubePlayer` interface). Step 2 should say "Modify `frontend/src/types/youtubeTypes.ts`" and add the file to the "Files to modify/create" list explicitly, since the implementer needs to know it already exists and should be edited, not created.

   **Resolution:** Updated Phase 2, Task 7. Added `frontend/src/types/youtubeTypes.ts` to the "Files to modify/create" list with "MODIFY (already exists)" annotation. Updated Step 2 to explicitly state the file already exists and should be modified, not created.

2. **Incomplete Fix (Phase 4, Task 4)**: The task fixes the `setupFiles` path in root `vitest.config.ts` but ignores the `include` path, which is `['tests/**/*.test.{ts,tsx}']`. No `tests/` directory exists at the repo root; actual tests live in `frontend/tests/`. The fix must also change `include` to `['frontend/tests/**/*.test.{ts,tsx}']`, and the `test-helpers` alias (`resolve(__dirname, 'tests/helpers')`) must become `resolve(__dirname, 'frontend/tests/helpers')`. Without this, the root vitest config will find zero test files even after the setupFiles fix.

   **Resolution:** Rewrote Phase 4, Task 4 to fix all three broken paths: `setupFiles`, `include` glob, and `test-helpers` alias. Updated the goal, implementation steps, verification checklist, and commit message to cover all three fixes.

3. **Ambiguous Husky Install Location (Phase 4, Task 1)**: Step 1 says `cd frontend && npm install --save-dev husky`, installing Husky in `frontend/package.json`. But Step 2 says to run `npx husky init` from the repo root, and Step 6 says to add `"prepare": "husky"` to the root `package.json`. Husky must be installed where the `.git` directory lives (repo root). The root `package.json` currently has no `devDependencies`. The task should install Husky in the root `package.json`, not `frontend/package.json`. Similarly, Phase 4 Task 2 installs commitlint in `frontend/package.json` but the commit-msg hook runs from the root. Both should be root-level dev dependencies.

   **Resolution:** Updated Phase 4, Task 1 to install Husky in root `package.json` (not `frontend/package.json`). Added explicit note that Husky must be at repo root where `.git/` lives and that root currently has no `devDependencies`. Updated Phase 4, Task 2 similarly to install commitlint in root `package.json` with explicit note about why.

#### Minor Issues

4. **Non-existent Barrel File (Phase 1, Tasks 1/2/3)**: Tasks 1, 2, and 3 reference `frontend/src/hooks/index.ts` for removing re-exports. This file does not exist (Glob returns no results). The tasks do say "if present", so this is not blocking, but the plan should note explicitly that no hooks barrel file exists to avoid the implementer searching for it.

   **Resolution:** Updated Phase 1, Task 1 to explicitly note that `frontend/src/hooks/index.ts` does not exist in this repo. Changed the files list annotation and implementation step 4 to tell the implementer to skip this step. Tasks 2 and 3 reference different barrel files (`components/three/index.ts` and `types/index.ts`) which do exist, so no change needed there.

5. **Phase 0 Tech Stack Section**: States "React 19" which is correct per `package.json`, but the repo's own `CLAUDE.md` (which the implementer will read first) says "React 18". Phase 5 Task 1 fixes this, but the implementer working Phases 1-4 will see conflicting information. Consider adding a note in Phase 0 acknowledging the CLAUDE.md discrepancy so implementers are not confused.

   **Resolution:** Added a note in Phase 0's Tech Stack section stating that CLAUDE.md says "React 18" but the actual installed version is React 19, and that the discrepancy is corrected in Phase 5, Task 1.
