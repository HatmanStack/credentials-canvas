# Project Roadmap

Items identified during the March 2026 audit that were not addressed during remediation. Organized by category, with source references back to the original audit findings.

## Performance

### Move Base check outside video config loop
`frontend/src/components/three/SceneModel.tsx:100-111` checks `node.name === 'Base'` inside the `PHONE_VIDEO_CONFIGURATIONS` loop, running 6 times per Base node instead of once. Move the check outside the loop.

**Source:** health-audit.md finding #7 (partial), eval.md Performance remediation target
**Effort:** LOW

### Convert camera arc animation to useFrame
`frontend/src/hooks/useCameraPositionAnimation.ts:96-113` uses raw `requestAnimationFrame` outside R3F's render loop. Converting to `useFrame` with a time accumulator would avoid potential double-update timing issues and is more idiomatic for R3F.

**Source:** eval.md Creativity remediation target
**Effort:** MEDIUM

## Visual / Theming

### Expose particle shader color as theme uniform
`frontend/src/shaders/fragment.glsl:4` has a hardcoded color `vec3(0.34, 0.53, 0.96)`. Exposing this as a uniform tied to the selected theme would connect the particle system to the theming architecture. Requires changes to `fragment.glsl`, `Lamp.tsx`, and the theme configuration.

**Source:** eval.md Creativity remediation target
**Effort:** MEDIUM

## Configuration Cleanup

### Remove empty URL entry for Cube009_2
`frontend/src/constants/urlConfiguration.ts:53` has `{ signName: ['Cube009_2'], url: '' }`. The truthy guard in `SceneModel.tsx:162` prevents opening a blank tab, so there is no runtime risk, but the entry is dead configuration that should either get a real URL or be removed.

**Source:** verification feedback finding #34
**Effort:** LOW

### Resolve Tailwind v4 config mismatch
`package.json` has `tailwindcss: "^4.2.2"` but `tailwind.config.js` still uses the v3 config format. Tailwind v4 uses CSS-based configuration. The build currently fails (`npm run build`) due to this mismatch. Either migrate to Tailwind v4's CSS config format or pin Tailwind to v3.

**Source:** doc-audit.md additional observations
**Effort:** MEDIUM

### Consolidate site URLs
Three different URLs reference the deployed site: `credentials.hatstack.fun`, `production.dld9ll6ojjns2.amplifyapp.com`, and `www.cg-portfolio.site` (in `package.json:6` homepage). Decide which is canonical and update `package.json` homepage accordingly.

**Source:** doc-audit.md additional observations
**Effort:** LOW

## Testing

### Rewrite SceneModel.test.tsx for component behavior
The current `SceneModel.test.tsx` mocks away all Three.js/R3F rendering and only tests Zustand store interactions, which are already covered by store tests. Rewriting to test actual component behavior (click handlers, GLTF loading, mesh traversal) would provide real coverage.

**Source:** eval.md Test Value remediation target
**Effort:** MEDIUM

### Add integration tests for camera pipeline
No end-to-end test covers the camera scroll -> position index -> animation pipeline through the hook chain (`useCameraScrollBehavior` -> `useCameraPositionAnimation` -> `CameraController`). This is the most complex subsystem and would benefit from integration-style testing.

**Source:** eval.md Test Value remediation target
**Effort:** MEDIUM

## Onboarding

### Add CONTRIBUTING.md
Document branch strategy, PR process, commit conventions, and how the pre-commit/commitlint hooks work. Useful for anyone contributing to the project.

**Source:** eval.md Onboarding remediation target
**Effort:** LOW

### Add model download script
The 3D model must be manually downloaded from an external URL. A setup script (`npm run setup`) that checks for the model and downloads it if missing would reduce time-to-hello-world to a single command.

**Source:** eval.md Reproducibility remediation target
**Effort:** LOW

### Add inline comments to camera hook chain
The data flow through `useCameraScrollBehavior` -> `useCameraPositionAnimation` -> `CameraController` is the most complex subsystem. Inline comments explaining the data flow would help anyone new to the codebase.

**Source:** eval.md Onboarding remediation target
**Effort:** LOW

## Code Quality

### Slider snap-back inconsistency
In `SliderController.tsx` (originally `SceneAnimations.tsx:66-68`), `basePositionRef.current` is updated inside the `down` branch of the drag handler, which could cause a subtle snap-back inconsistency when releasing the slider.

**Source:** health-audit.md finding #19
**Effort:** LOW
