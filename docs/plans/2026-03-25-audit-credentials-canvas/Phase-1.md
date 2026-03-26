# Phase 1: [HYGIENIST] Dead Code Removal and Simplification

## Phase Goal

Remove all confirmed dead code, unused files, and unnecessary complexity identified across the three audits. This is purely subtractive work: delete files, remove unused exports, simplify dead logic. No new functionality is added.

**Success criteria:**
- All confirmed dead code files are deleted
- All confirmed unused type exports are removed
- Dead conditional logic is simplified
- Knip configuration is added so dead code detection produces actionable output
- `npm run check` passes after all changes

**Estimated tokens:** ~12,000

## Prerequisites

- Phase 0 read and understood
- `npm ci` run in both root and `frontend/`
- `npm run check` passes on the current main branch

## Tasks

### Task 1: Delete dead hook and its test

**Goal:** Remove `useLightingController.ts`, which is never imported by any component. Its logic lives inline in `SceneEnvironment.tsx`.

**Findings addressed:** health-audit #3 (HIGH), eval Architecture, eval Pragmatism

**Files to modify/create:**
- `frontend/src/hooks/useLightingController.ts` -- DELETE
- `frontend/tests/frontend/hooks/useLightingController.test.ts` -- DELETE (if exists; search for it)
- `frontend/src/hooks/index.ts` -- Remove the re-export of `useLightingController` if present (**Note:** this file does not currently exist; skip this step)

**Implementation steps:**
1. Search for any imports of `useLightingController` across the codebase to confirm it is truly unused. If any import exists, stop and flag it.
2. Delete the hook file.
3. Search for and delete its test file.
4. There is no `frontend/src/hooks/index.ts` barrel file in this repo, so no re-export removal is needed. Skip this step.
5. Run `npm run check` to confirm nothing breaks.

**Verification checklist:**
- [ ] No file in `src/` imports `useLightingController`
- [ ] The hook file and its test file are deleted
- [ ] `npm run check` passes

**Commit message template:**
```
refactor(hooks): delete unused useLightingController hook

- Hook was never imported; lighting logic lives in SceneEnvironment
- Removes dead code and its test file
```

---

### Task 2: Delete dead InteractiveMeshElement component

**Goal:** Remove `InteractiveMeshElement.tsx`, which exports a component never rendered in the component tree. Click handling is done in `SceneModel.tsx` via `<primitive onClick={handleClick}>`.

**Findings addressed:** health-audit #1 (CRITICAL, partial), eval Architecture

**Files to modify/create:**
- `frontend/src/components/three/InteractiveMeshElement.tsx` -- DELETE
- `frontend/tests/frontend/components/InteractiveMeshElement.test.tsx` -- DELETE (if exists; search for it)
- `frontend/src/components/three/index.ts` -- Remove re-export if present

**Implementation steps:**
1. Search the entire `src/` directory for imports of `InteractiveMeshElement` to confirm it is unused. If any import exists, stop and flag it.
2. Delete the component file.
3. Search for and delete its test file under `frontend/tests/`.
4. Remove any re-export from the barrel file if present.
5. Run `npm run check`.

**Verification checklist:**
- [ ] No file in `src/` imports `InteractiveMeshElement`
- [ ] The component file and its test file are deleted
- [ ] `npm run check` passes

**Commit message template:**
```
refactor(three): delete unused InteractiveMeshElement component

- Component was never rendered; click handling lives in SceneModel
- Removes duplicate click logic that could silently diverge
```

---

### Task 3: Delete dead branded types module

**Goal:** Remove `brandedTypes.ts`, which exports types and factory functions that are never used anywhere in the codebase. See ADR-3 in Phase 0.

**Findings addressed:** health-audit #4 (HIGH), eval Architecture

**Files to modify/create:**
- `frontend/src/types/brandedTypes.ts` -- DELETE
- `frontend/tests/frontend/types/brandedTypes.test.ts` -- DELETE (if exists; search for it)
- `frontend/src/types/index.ts` -- Remove re-exports of branded types

**Implementation steps:**
1. Search for imports of anything from `brandedTypes` across `src/` and `tests/`. If any import exists outside the barrel re-export, stop and flag it.
2. Delete the branded types file.
3. Search for and delete its test file.
4. Edit `frontend/src/types/index.ts` to remove any re-exports from `brandedTypes`.
5. Run `npm run check`. If other files break because they imported branded types via the barrel, those imports need to be removed too.

**Verification checklist:**
- [ ] No file imports from `brandedTypes` directly or via barrel
- [ ] The file and its test are deleted
- [ ] `npm run check` passes

**Commit message template:**
```
refactor(types): delete unused branded types module

- Types and factory functions were never consumed by any source file
- Type safety improvements will use standard TS patterns per ADR-3
```

---

### Task 4: Remove unused type exports from componentTypes.ts

**Goal:** Remove the `AssetConfiguration` and `BreakpointConfiguration` interfaces that are exported but never used.

**Findings addressed:** health-audit #18 (LOW)

**Files to modify/create:**
- `frontend/src/types/componentTypes.ts` -- Remove the two unused interfaces

**Implementation steps:**
1. Search for `AssetConfiguration` and `BreakpointConfiguration` across the codebase. Confirm they are not used.
2. Remove both interface definitions from `componentTypes.ts`.
3. If they are re-exported from `index.ts`, remove those re-exports.
4. Run `npm run check`.

**Verification checklist:**
- [x] SKIPPED: Both interfaces ARE used in `frontend/src/constants/themeConfiguration.ts`. Not dead code.
- [x] `npm run check` passes

**Commit message template:**
```
refactor(types): remove unused AssetConfiguration and BreakpointConfiguration interfaces
```

---

### Task 5: Remove unused DRACO JavaScript files

**Goal:** Remove the JavaScript-only DRACO decoder files from the public directory. Only the WASM GLTF decoder files are needed at runtime.

**Findings addressed:** health-audit #16 (LOW)

**Files to modify/create:**
- `frontend/public/draco/javascript/` -- Delete unnecessary files, keep only what is needed

**Implementation steps:**
1. Read `frontend/src/components/three/SceneModel.tsx` to find the DRACO decoder path constant and understand which files are loaded at runtime.
2. Check if the DRACO path points to the `javascript/` subdirectory or a different path.
3. The WASM GLTF decoder needs these files: `draco_decoder_gltf.wasm` and `draco_wasm_wrapper_gltf.js`. Everything else in the `javascript/` directory can be deleted.
4. Delete: `draco_decoder.js`, `draco_decoder.wasm`, `draco_encoder.js`, `draco_encoder.wasm`, `draco_encoder_wrapper.js`, `draco_wasm_wrapper.js`, `time_draco_decode.html`, and the `example/` and `npm/` and `with_asserts/` subdirectories.
5. Run `npm run build` (from root) to confirm the build succeeds. If the dev server can be started and tested with the model file present, do that too.

**Verification checklist:**
- [ ] Only `draco_decoder_gltf.js` (if needed by the wasm loader), `draco_decoder_gltf.wasm`, and `draco_wasm_wrapper_gltf.js` remain
- [ ] `npm run build` succeeds
- [ ] No runtime errors loading the DRACO decoder (verify by checking the decoder path in code matches remaining files)

**Commit message template:**
```
chore(three): remove unused DRACO decoder files

- Keep only WASM GLTF decoder files needed at runtime
- Removes ~25 unnecessary files from public directory
```

---

### Task 6: Deduplicate LIGHT_COLOR_WHEEL array

**Goal:** Remove the duplicated second half of the color wheel array in `lightingConfiguration.ts`.

**Findings addressed:** health-audit #17 (LOW)

**Files to modify/create:**
- `frontend/src/constants/lightingConfiguration.ts` -- Remove duplicate entries from `LIGHT_COLOR_WHEEL`

**Implementation steps:**
1. Read the full `LIGHT_COLOR_WHEEL` array in `lightingConfiguration.ts`.
2. Identify the duplicated segment (the second half is reportedly a copy of the first half).
3. Remove the duplicate entries, keeping only unique color values.
4. Run `npm run check`.

**Verification checklist:**
- [ ] `LIGHT_COLOR_WHEEL` contains no duplicate color entries
- [ ] `npm run check` passes

**Commit message template:**
```
fix(config): deduplicate LIGHT_COLOR_WHEEL color array

- Second half was a copy of the first half, biasing random selection
```

---

### Task 7: Fix dead responsive ternary in iframePosition

**Goal:** The `iframePosition` useMemo in SceneAnimations.tsx returns the same value `[-4.055, -2.7, -1.6]` regardless of the `currentWindowWidth` condition. Remove the dead ternary and use the value directly.

**Findings addressed:** health-audit #5 (HIGH), eval Code Quality

**Files to modify/create:**
- `frontend/src/components/three/SceneAnimations.tsx` -- Simplify `iframePosition` useMemo

**Implementation steps:**
1. Read lines ~95-105 of `SceneAnimations.tsx` to see the `iframePosition` useMemo.
2. Replace the ternary with just the constant value. If the value is used only once, consider inlining it. If it is a `useMemo`, either simplify it to a plain constant or keep the memo with no dependency array if the value is truly static.
3. Run `npm run check`.

**Verification checklist:**
- [ ] `iframePosition` no longer contains a dead conditional
- [ ] `npm run check` passes

**Commit message template:**
```
fix(three): remove dead responsive ternary in iframePosition

- Both branches returned identical values; simplified to a constant
```

---

### Task 8: Add Knip configuration

**Goal:** Add a `knip.json` configuration file so the dead code detection tool produces actionable results instead of 90 false positives.

**Findings addressed:** health-audit #20 (LOW)

**Files to modify/create:**
- `knip.json` -- CREATE at repository root

**Implementation steps:**
1. Read `package.json` (root) and `frontend/package.json` to understand the project structure.
2. Create a `knip.json` that:
   - Points to `frontend/src/` as the source root
   - Configures entry points (likely `frontend/src/main.tsx`)
   - Excludes test files, type declaration files, and config files from unused file detection
   - Accounts for the Vite plugin and Vitest config
3. Run `npx knip` from the repo root and verify the output is reasonable (should report zero or very few false positives). Adjust configuration as needed.
4. Run `npm run check` to make sure nothing else broke.

**Verification checklist:**
- [ ] `knip.json` exists at repo root
- [ ] `npx knip` produces actionable output (no flood of false positives)
- [ ] After completing Tasks 1-7, knip reports minimal unused code
- [ ] `npm run check` passes

**Commit message template:**
```
chore: add knip configuration for dead code detection

- Configures entry points and project structure
- Produces actionable results instead of 90 false positives
```

## Phase Verification

After all tasks are complete:

1. Run `npm run check` from repo root. It must pass.
2. Run `npx knip` from repo root. It should report no dead code that was covered by Tasks 1-6.
3. Verify these files no longer exist:
   - `frontend/src/hooks/useLightingController.ts`
   - `frontend/src/components/three/InteractiveMeshElement.tsx`
   - `frontend/src/types/brandedTypes.ts`
4. Verify `LIGHT_COLOR_WHEEL` has no duplicates.
5. Verify `iframePosition` has no dead ternary.

**Known limitations:** The `SceneAnimations.tsx` component is still a 315-line god component at this point. Decomposition happens in Phase 2. This phase only fixes the dead ternary within it.
