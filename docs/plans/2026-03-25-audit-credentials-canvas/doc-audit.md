---
type: doc-health
date: 2026-03-25
prevention_scope: markdown-linting-and-link-checking
language_stack: both
---

# Documentation Audit: credentials-canvas

## Configuration
- **Prevention Scope:** Markdown linting (markdownlint) + link checking (lychee)
- **Language Stack:** JS/TS and Python (both)
- **Constraints:** None

## Summary
- Docs scanned: 3 files (README.md, CLAUDE.md, docs/README.md)
- Code modules scanned: ~30 source files across 8 directories
- Findings: 6 drift, 1 gap, 0 stale, 2 broken links, 2 stale code examples, 1 config drift, 1 structure issue

## Findings

### DRIFT (doc exists, doesn't match code)

1. **`CLAUDE.md:28`** -- "React 18" claimed in stack description
   - Code says: `react: "19.2.4"` and `react-dom: "19.2.4"` in `frontend/package.json:22-23`
   - React was upgraded to 19 but CLAUDE.md was not updated

2. **`CLAUDE.md:57`** -- "The model path and DRACO decoder path are configured in `constants/meshConfiguration.ts`"
   - `constants/meshConfiguration.ts` contains only the model path (`GLTF_MODEL_FILE_PATH`), not the DRACO decoder path
   - DRACO decoder path is defined in `components/three/SceneModel.tsx:17` as `DRACO_DECODER_PATH`

3. **`docs/README.md:162-172`** -- Test directory structure is incomplete
   - Doc shows only `hooks/`, `stores/`, `utils/` under `frontend/tests/frontend/`
   - Code also has `components/` with tests for App, AudioController, CameraController, InteractiveMeshElement, SceneEnvironment, SceneModel, CustomCheckbox, ThemeSelectionOption, LaunchScreen

4. **`docs/README.md:233-242`** -- Tailwind color list is incomplete
   - Doc shows 7 colors
   - `frontend/tailwind.config.js:17-34` defines 15 colors (missing `graphics-theme`, all `*-active`/`*-rest` per-theme colors)

5. **`README.md:60`** vs **`docs/README.md:135`** -- Model download URLs conflict
   - README.md says: `https://production.dld9ll6ojjns2.amplifyapp.com/compressed_model.glb`
   - docs/README.md says: `https://credentials.hatstack.fun/compressed_model.glb`
   - `package.json:6` homepage is yet a third URL: `https://www.cg-portfolio.site`

6. **`docs/README.md:80-93`** -- Store descriptions have minor inaccuracies
   - SceneInteractionStore: doc says "View modes (close-up, dragging)" but store uses `isCloseUpViewActive` and `isUserCurrentlyDragging` plus undocumented `mobileScrollTriggerCount` and `cameraInterpolationProgress`
   - UserInterfaceStore: doc says "Window dimensions" (singular `currentWindowWidth`), "Light intensity controls" (singular config object), and omits `shouldShowArcadeIframe`, `shouldShowMusicIframe`, `titleTextColorHue`

### GAPS (code exists, no doc)

1. **`frontend/src/utils/logger.ts`** -- Utility module using `import.meta.env.DEV` for conditional logging. Not mentioned in any documentation. This is the only env-dependent code in the project.

### STALE (doc exists, code doesn't)

None found.

### BROKEN LINKS / IMAGES

1. **`README.md:25`** -- `https://github.com/HatmanStack/credentials-canvas/blob/main/public/ez.gif`
   - Image file exists at `frontend/public/ez.gif`, not `public/ez.gif`
   - GitHub raw URL path is wrong; should reference `frontend/public/ez.gif`

2. **`README.md:28`** -- `https://github.com/HatmanStack/credentials-canvas/blob/main/public/house.gif`
   - Same issue; file is at `frontend/public/house.gif`, not `public/house.gif`

### STALE CODE EXAMPLES

1. **`docs/README.md:187-188`** -- Test example import path
   - Doc shows: `import { useSceneInteractionStore } from 'stores/sceneInteractionStore';`
   - Actual test code uses: `import { useSceneInteractionStore } from '@/stores';`
   - The bare `stores/sceneInteractionStore` path would only resolve via vitest alias; actual tests use `@/stores` barrel export

2. **`docs/README.md:220`** -- Styling example import path
   - Doc shows: `import { cn } from 'utils/classNameUtils';`
   - Actual code uses: `import { cn } from '@/utils/classNameUtils';`
   - All source files use the `@/` prefix alias

### CONFIG DRIFT

1. **`vitest.config.ts:26`** -- `setupFiles: ['./tests/setup.ts']`
   - This file does not exist at the root level. The actual setup file is at `frontend/tests/helpers/setup.ts`
   - The root vitest config's setupFiles path is broken (would fail if tests are run from root)

### STRUCTURE ISSUES

1. **`docs/README.md:176-181`** -- Test coverage table with hardcoded percentages
   - Shows "Stores >90% / 100%", "Utils 100% / 100%", "Hooks >80% / 82%"
   - These are snapshot values that will drift as code changes
   - The table omits the `components/` test category entirely despite component tests existing

### ADDITIONAL OBSERVATIONS

- **Three conflicting site URLs**: `credentials.hatstack.fun` (README.md:22, docs/README.md:135), `production.dld9ll6ojjns2.amplifyapp.com` (README.md:60), `www.cg-portfolio.site` (package.json:6). It is unclear which is canonical.
- **Tailwind v4 upgrade**: `package.json` shows `tailwindcss: "^4.2.2"` but `tailwind.config.js` still uses v3 config format. Tailwind v4 uses CSS-based configuration. The docs do not mention this discrepancy.
