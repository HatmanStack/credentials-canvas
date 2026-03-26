# Feedback: 2026-03-25-audit-credentials-canvas

## Active Feedback

(none)

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
