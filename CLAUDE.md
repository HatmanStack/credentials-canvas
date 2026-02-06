# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands can be run from the repo root or from `frontend/`:

```bash
# From root (delegates to frontend/)
npm run dev          # Vite dev server
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint + tsc --noEmit
npm run test         # Vitest in watch mode
npm run check        # Lint + tests (single run, CI equivalent)

# Run a single test file
cd frontend && npx vitest --run tests/frontend/stores/sceneInteractionStore.test.ts

# Run tests with coverage
cd frontend && npx vitest --run --coverage
```

Coverage thresholds are 70% for branches, functions, lines, and statements (configured in root `vitest.config.ts`).

## Architecture

**Stack:** React 18 + TypeScript + Three.js (via React Three Fiber/Drei) + Zustand + Vite + Tailwind CSS

This is an interactive 3D portfolio. A GLTF model (DRACO-compressed) renders a scene with clickable objects that link to projects. Users select a theme on a launch screen, then navigate the 3D scene via scroll/orbit controls.

### Key architectural layers

- **3D Scene** (`components/three/`): `SceneModel` loads the GLTF and registers click handlers on meshes. `SceneEnvironment` manages lights/fog/background. `SceneAnimations` handles particle effects. `InteractiveMeshElement` wraps individual clickable meshes. `Lamp` controls interactive light objects.
- **Camera System** (`components/controls/CameraController` + `hooks/useCameraScrollBehavior` + `hooks/useCameraPositionAnimation`): Scroll-driven camera navigation through predefined positions with interpolation. The hook chain is: scroll events → position index updates → smooth camera animation.
- **State** (`stores/`): Three Zustand stores with devtools middleware:
  - `sceneInteractionStore` — camera position, click tracking, drag/scroll state
  - `userInterfaceStore` — theme selection, audio, window size, iframe modals
  - `threeJSSceneStore` — Three.js scene reference and video player element
- **Configuration** (`constants/`): Camera positions, light intensities, mesh-to-URL mappings, theme colors, and animation parameters are all defined as typed constants.
- **Theming**: Four themes (Urban, Rural, Classy, Chill) configured in `themeConfiguration.ts` with corresponding Tailwind custom colors in `tailwind.config.js`.

### Path aliases

TypeScript and Vite both resolve: `@`, `@components`, `@hooks`, `@stores`, `@constants`, `@types`, `@utils` → `frontend/src/...`

### Test structure

Tests live in `frontend/tests/frontend/` mirroring the `src/` directory structure. Test helpers (mocks, setup, utilities) are in `frontend/tests/helpers/`. The test environment is jsdom with polyfills for `matchMedia` and HTML media elements. There is also a root-level `vitest.config.ts` with path aliases for running tests from the repo root.

### ESLint

Uses flat config (`eslint.config.js`). Custom rules allow Three.js-specific JSX properties (`object`, `position`, `intensity`, `castShadow`, `args`, `attach`) as unknown DOM properties. Max line length is 120 characters.

## Model Setup

The 3D model (`compressed_model.glb`) is not in the repo (`.gitignore`d). For local dev, download it and place in `frontend/public/compressed_model.glb`. The model path and DRACO decoder path are configured in `constants/meshConfiguration.ts`.
