# Phase 5: [DOC-ENGINEER] Documentation Fixes

## Phase Goal

Fix all documentation drift, broken links, stale code examples, and gaps identified in the doc audit. This phase runs last because earlier phases changed file structure and component names; documenting before those changes would create new drift.

**Success criteria:**
- All 6 drift findings resolved
- All 2 broken links fixed
- All 2 stale code examples updated
- The documentation gap (logger.ts) is addressed
- Hardcoded coverage percentages removed from docs
- Conflicting URLs consolidated
- `CLAUDE.md` reflects actual codebase state after Phases 1-4

**Estimated tokens:** ~10,000

## Prerequisites

- Phases 1-4 complete (codebase is in its final state)
- `npm run check` passes

## Tasks

### Task 1: Fix CLAUDE.md drift

**Goal:** Update CLAUDE.md to reflect the current state of the codebase after all code changes.

**Findings addressed:** doc-audit Drift #1, Drift #2

**Files to modify/create:**
- `CLAUDE.md` (repo root) -- Fix inaccuracies

**Implementation steps:**
1. Read the current `CLAUDE.md`.
2. Fix Drift #1: Change "React 18" to "React 19" in the Architecture section (line ~28 area that says "React 18 + TypeScript + Three.js").
3. Fix Drift #2: Update the Model Setup section. The DRACO decoder path is NOT in `constants/meshConfiguration.ts`. It is defined in `components/three/SceneModel.tsx`. Update the text to say: "The model path is configured in `constants/meshConfiguration.ts`. The DRACO decoder path is defined in `components/three/SceneModel.tsx`."
4. Update the Architecture section to reflect the SceneAnimations decomposition done in Phase 2. The `SceneAnimations` description should mention that it composes `YouTubeMusicPlayer`, `ArcadeIframe`, and `SliderController`.
5. Note: After Phase 1, `useLightingController.ts`, `InteractiveMeshElement.tsx`, and `brandedTypes.ts` no longer exist. If CLAUDE.md mentions any of them, remove the references.
6. Run `npm run check` to make sure nothing else broke.

**Verification checklist:**
- [ ] "React 18" is replaced with "React 19"
- [ ] DRACO decoder path documentation is accurate
- [ ] SceneAnimations description reflects the decomposition
- [ ] No references to deleted files
- [ ] `npm run check` passes

**Commit message template:**
```
docs: update CLAUDE.md for React 19, DRACO path, and component changes
```

---

### Task 2: Fix broken image links in README.md

**Goal:** Fix the two broken GitHub image links that reference `public/` instead of `frontend/public/`.

**Findings addressed:** doc-audit Broken Links #1, #2

**Files to modify/create:**
- `README.md` (repo root) -- Fix image paths

**Implementation steps:**
1. Read README.md and find the two image references (around lines 25 and 28).
2. Change `public/ez.gif` to `frontend/public/ez.gif` in the GitHub blob URL.
3. Change `public/house.gif` to `frontend/public/house.gif` in the GitHub blob URL.
4. Verify the files exist at the corrected paths.

**Verification checklist:**
- [ ] Both image URLs reference `frontend/public/` instead of `public/`
- [ ] The referenced files exist at the corrected paths

**Commit message template:**
```
docs: fix broken image links in README

- Correct paths from public/ to frontend/public/
```

---

### Task 3: Consolidate conflicting site URLs

**Goal:** Three different URLs appear across documentation. Pick the canonical one and use it consistently.

**Findings addressed:** doc-audit Drift #5, Additional Observations

**Files to modify/create:**
- `README.md` -- Update model download URL if needed
- `docs/README.md` -- Update model download URL to match

**Implementation steps:**
1. Read README.md and docs/README.md to find all URL references.
2. The `package.json` homepage (`https://www.cg-portfolio.site`) is likely the canonical production URL. The model download URL should use whichever domain actually serves the file.
3. Pick ONE model download URL and use it in both README.md and docs/README.md. If `https://www.cg-portfolio.site/compressed_model.glb` works, use that. If not, use whichever URL is currently live. Add a comment noting the canonical URL.
4. If uncertain which URL works, note all three in a comment and pick the one from `package.json` as the canonical reference.

**Verification checklist:**
- [ ] README.md and docs/README.md use the same model download URL
- [ ] The canonical site URL is consistent

**Commit message template:**
```
docs: consolidate model download and site URLs

- Use consistent canonical URL across all documentation
```

---

### Task 4: Fix docs/README.md test directory structure

**Goal:** Update the test directory tree in docs/README.md to include the `components/` test directory.

**Findings addressed:** doc-audit Drift #3

**Files to modify/create:**
- `docs/README.md` -- Update test directory listing

**Implementation steps:**
1. Read docs/README.md around lines 162-172 where the test directory structure is shown.
2. Add `components/` to the listing with the test files that exist there.
3. List the actual test files under `components/`: check `frontend/tests/frontend/components/` for the current files (including the new ones from Phase 3).

**Verification checklist:**
- [ ] `components/` appears in the test directory tree
- [ ] The listed test files match what actually exists

**Commit message template:**
```
docs: add components test directory to docs/README.md structure
```

---

### Task 5: Fix stale Tailwind color list in docs/README.md

**Goal:** Update the Tailwind color documentation to include all 15 colors defined in `tailwind.config.js`.

**Findings addressed:** doc-audit Drift #4

**Files to modify/create:**
- `docs/README.md` -- Update Tailwind color list

**Implementation steps:**
1. Read `frontend/tailwind.config.js` to get the full list of custom colors (lines 17-34).
2. Read docs/README.md around lines 233-242 where the color list is documented.
3. Update the documentation to list all 15 colors.

**Verification checklist:**
- [ ] All custom Tailwind colors from `tailwind.config.js` appear in the documentation
- [ ] No colors are listed that do not exist in the config

**Commit message template:**
```
docs: update Tailwind color list to include all 15 custom colors
```

---

### Task 6: Fix store descriptions in docs/README.md

**Goal:** Update store documentation to accurately reflect all state fields.

**Findings addressed:** doc-audit Drift #6

**Files to modify/create:**
- `docs/README.md` -- Update store descriptions

**Implementation steps:**
1. Read the three store files:
   - `frontend/src/stores/sceneInteractionStore.ts`
   - `frontend/src/stores/userInterfaceStore.ts`
   - `frontend/src/stores/threeJSSceneStore.ts`
2. Read the store descriptions in docs/README.md (around lines 80-93).
3. Update each store description to include the missing fields noted in the audit:
   - SceneInteractionStore: add `mobileScrollTriggerCount` and `cameraInterpolationProgress`
   - UserInterfaceStore: add `shouldShowArcadeIframe`, `shouldShowMusicIframe`, `titleTextColorHue`
4. Keep descriptions concise; just list the fields and their purpose.

**Verification checklist:**
- [ ] All state fields in each store are mentioned in the documentation
- [ ] No fields are listed that do not exist

**Commit message template:**
```
docs: update store descriptions with missing state fields
```

---

### Task 7: Fix stale code examples in docs/README.md

**Goal:** Update import paths in code examples to match actual codebase conventions.

**Findings addressed:** doc-audit Stale Code Examples #1, #2

**Files to modify/create:**
- `docs/README.md` -- Fix import paths in examples

**Implementation steps:**
1. Read docs/README.md around lines 187-188 and 220 where import examples appear.
2. Change `import { useSceneInteractionStore } from 'stores/sceneInteractionStore';` to `import { useSceneInteractionStore } from '@/stores';`
3. Change `import { cn } from 'utils/classNameUtils';` to `import { cn } from '@/utils/classNameUtils';`

**Verification checklist:**
- [ ] All import paths in code examples use the `@/` prefix alias
- [ ] Examples match actual usage patterns in the codebase

**Commit message template:**
```
docs: fix import paths in code examples to use @ alias
```

---

### Task 8: Remove hardcoded coverage percentages

**Goal:** Replace hardcoded coverage percentages in docs/README.md with a note to run the coverage command, since percentages change as code evolves.

**Findings addressed:** doc-audit Structure Issue #1

**Files to modify/create:**
- `docs/README.md` -- Replace coverage table

**Implementation steps:**
1. Read docs/README.md around lines 176-181 where coverage percentages are listed.
2. Replace the hardcoded percentage table with a brief note like: "Run `npm run check` to see current coverage. Thresholds are configured at 70% for branches, functions, lines, and statements in `vitest.config.ts`."
3. Remove the per-category percentage columns.

**Verification checklist:**
- [ ] No hardcoded coverage percentages in documentation
- [ ] A pointer to the coverage command exists

**Commit message template:**
```
docs: replace hardcoded coverage percentages with command reference

- Prevents coverage numbers from drifting as code changes
```

---

### Task 9: Document logger.ts utility

**Goal:** Add a brief mention of the logger utility to the project documentation, since it is the only env-dependent code.

**Findings addressed:** doc-audit Gap #1

**Files to modify/create:**
- `docs/README.md` -- Add logger utility documentation

**Implementation steps:**
1. Read `frontend/src/utils/logger.ts` to understand its API.
2. Add a brief section in docs/README.md under the appropriate heading (likely near the utilities section) describing:
   - That a structured logger exists at `utils/logger.ts`
   - It uses `import.meta.env.DEV` for conditional output (dev-only logging)
   - It has a ring buffer to prevent unbounded memory growth
3. Keep it to 2-3 sentences.

**Verification checklist:**
- [ ] `logger.ts` is mentioned in documentation
- [ ] The documentation accurately describes its behavior

**Commit message template:**
```
docs: document logger utility and its dev-only behavior
```

## Phase Verification

After all tasks are complete:

1. Run `npm run check` from repo root. It must pass.
2. Read through CLAUDE.md and verify:
   - React version says 19
   - DRACO path documentation is accurate
   - No references to deleted files
3. Read through README.md and verify:
   - Image links reference `frontend/public/`
   - Model download URL is consistent
4. Read through docs/README.md and verify:
   - Test directory includes `components/`
   - All 15 Tailwind colors listed
   - Store descriptions match actual fields
   - Import paths use `@/` alias
   - No hardcoded coverage percentages
   - Logger utility is documented

**Known limitations:**
- The Tailwind v4 configuration migration (v3 config format with v4 runtime) is out of scope. It is mentioned in the doc audit as an observation but is a code migration, not a documentation fix.
- CONTRIBUTING.md creation is out of scope for this audit. The eval suggests it but it is additive documentation, not remediation.
