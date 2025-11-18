# Phase 1: TypeScript Setup & File Structure Refactoring

## Phase Goal

Transform the JavaScript codebase into a fully-typed TypeScript application with modern project structure. This phase establishes the foundation for all subsequent phases by migrating to TypeScript, reorganizing files into a layer-based architecture, and implementing explicit naming conventions.

**Success Criteria:**
- All `.js` files converted to `.ts` or `.tsx`
- TypeScript compiles without errors (`tsc --noEmit` passes)
- All components organized by layer (three/, controls/, ui/)
- All files follow naming conventions (PascalCase components, camelCase utilities)
- Application runs and functions identically to pre-refactor state
- Build completes successfully

**Estimated Tokens:** ~85,000

---

## Prerequisites

### Must Be Complete Before Starting
- Read Phase-0.md completely
- Git branch `claude/design-feature-naming-refactor-01SwsoFYJoanSP88r5nfjhMG` checked out
- Clean git state (no uncommitted changes)
- Dependencies installed and working (`npm install` succeeded)
- Application runs successfully (`npm start` works)

### Verify Environment
```bash
# Check Node/npm versions
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0

# Verify clean state
git status  # Should show clean working directory

# Verify app works before changes
npm start  # Should compile and launch
```

---

## Tasks

### Task 1: Install TypeScript Dependencies

**Goal:** Install TypeScript compiler and type definitions for all dependencies.

**Files to Modify/Create:**
- `package.json` - Add devDependencies
- `package-lock.json` - Update dependency tree

**Prerequisites:**
- Clean npm state
- No running dev server

**Implementation Steps:**

1. Install TypeScript and core type definitions:
   - Install `typescript` as devDependency
   - Install `@types/react` and `@types/react-dom` for React types
   - Install `@types/node` for Node.js types
   - Install `@types/three` for Three.js types
   - Use exact versions compatible with your React version (18.2.0)

2. Install TypeScript ESLint plugins:
   - Install `@typescript-eslint/eslint-plugin`
   - Install `@typescript-eslint/parser`
   - These enable ESLint to understand TypeScript syntax

3. Verify installation:
   - Check that `typescript` appears in `package.json` devDependencies
   - Confirm type definition packages installed
   - Run `npx tsc --version` to verify TypeScript CLI works

**Verification Checklist:**
- [ ] `package.json` includes TypeScript dependencies
- [ ] `node_modules` contains `typescript` directory
- [ ] `npx tsc --version` outputs version number
- [ ] No installation errors in terminal
- [ ] `package-lock.json` updated

**Testing Instructions:**
- Run `npm install` to ensure clean install works
- Run `npx tsc --version` should output TypeScript version
- No unit tests needed for this task

**Commit Message Template:**
```
chore(deps): install TypeScript and type definitions

- Add typescript ^5.3.0 as devDependency
- Add @types/react, @types/react-dom, @types/node
- Add @types/three for Three.js type support
- Add @typescript-eslint plugins for code quality
```

**Estimated Tokens:** ~1,000

---

### Task 2: Create TypeScript Configuration

**Goal:** Configure TypeScript with strict settings optimized for React and Three.js development.

**Files to Modify/Create:**
- `tsconfig.json` - New file, TypeScript compiler configuration

**Prerequisites:**
- Task 1 complete (TypeScript installed)

**Implementation Steps:**

1. Create `tsconfig.json` in project root:
   - Set `target` to ES2020 for modern JavaScript features
   - Set `lib` to include DOM and ES2020 for browser compatibility
   - Set `jsx` to "react-jsx" for React 18 JSX transform
   - Set `module` to ESNext for modern module syntax
   - Set `moduleResolution` to "bundler" for modern bundler compatibility

2. Configure strict type checking:
   - Enable `strict` mode for maximum type safety
   - Enable `noUnusedLocals` to catch unused variables
   - Enable `noUnusedParameters` to catch unused function params
   - Enable `noFallthroughCasesInSwitch` to prevent switch bugs
   - Enable `noImplicitReturns` to ensure all code paths return

3. Configure module resolution:
   - Set `baseUrl` to "src" for absolute imports
   - Configure `paths` mapping for clean imports:
     - `components/*` → `src/components/*`
     - `hooks/*` → `src/hooks/*`
     - `stores/*` → `src/stores/*` (for future Zustand stores)
     - `types/*` → `src/types/*`
     - `constants/*` → `src/constants/*`
     - `utils/*` → `src/utils/*`

4. Configure compiler options:
   - Set `esModuleInterop` to true for better CommonJS interop
   - Set `skipLibCheck` to true to skip type checking of declaration files
   - Set `allowSyntheticDefaultImports` to true for default imports
   - Set `resolveJsonModule` to true to import JSON files
   - Set `isolatedModules` to true for better build tool compatibility

5. Configure include/exclude:
   - Include: `["src"]` to compile all source files
   - Exclude: `["node_modules", "build", "public"]` to skip non-source

**Verification Checklist:**
- [ ] `tsconfig.json` exists in project root
- [ ] `npx tsc --noEmit` runs without errors (may have errors from untyped files, that's OK for now)
- [ ] Configuration includes all path mappings
- [ ] Strict mode enabled
- [ ] JSON is valid (no syntax errors)

**Testing Instructions:**
- Run `npx tsc --showConfig` to verify configuration loads
- Run `npx tsc --noEmit` (errors expected from JS files, but should parse config correctly)
- No unit tests needed for this task

**Commit Message Template:**
```
chore(config): add TypeScript configuration

- Create tsconfig.json with strict settings
- Enable ES2020 target with React JSX transform
- Configure path mappings for clean imports
- Enable strict type checking for better code quality
- Set up module resolution for bundler compatibility
```

**Estimated Tokens:** ~2,000

---

### Task 3: Update ESLint Configuration for TypeScript

**Goal:** Configure ESLint to work with TypeScript files and enforce TypeScript-specific rules.

**Files to Modify/Create:**
- `.eslintrc.json` or `.eslintrc.js` - Modify existing ESLint config
- Create if doesn't exist

**Prerequisites:**
- Task 1 complete (TypeScript ESLint plugins installed)
- Task 2 complete (tsconfig.json exists)

**Implementation Steps:**

1. Update ESLint parser:
   - Change `parser` to `@typescript-eslint/parser`
   - Add `parserOptions.project` pointing to `./tsconfig.json`
   - This allows ESLint to use TypeScript type information

2. Add TypeScript ESLint plugin:
   - Add `@typescript-eslint` to plugins array
   - Extend `plugin:@typescript-eslint/recommended`
   - This provides TypeScript-specific linting rules

3. Update ESLint settings:
   - Keep existing React rules
   - Add file extensions: `['.ts', '.tsx', '.js', '.jsx']`
   - Configure rules to work with TypeScript syntax

4. Disable conflicting rules:
   - Disable `no-undef` (TypeScript handles this)
   - Disable `no-unused-vars` (use TypeScript version instead)
   - Configure `@typescript-eslint/no-unused-vars` with appropriate settings

5. Keep existing rules:
   - Preserve Google ESLint config if it's being used
   - Preserve React-specific rules
   - Ensure no conflicts between TypeScript and existing rules

**Verification Checklist:**
- [ ] ESLint config file updated with TypeScript settings
- [ ] `npx eslint --ext .ts,.tsx src/` runs without crashing
- [ ] ESLint recognizes TypeScript syntax
- [ ] No configuration errors in terminal

**Testing Instructions:**
- Run `npx eslint --ext .ts,.tsx src/` (will have errors from untyped files, that's OK)
- Verify ESLint doesn't crash on parsing errors
- No unit tests needed for this task

**Commit Message Template:**
```
chore(config): configure ESLint for TypeScript

- Update parser to @typescript-eslint/parser
- Add TypeScript ESLint plugin and recommended rules
- Disable rules that conflict with TypeScript
- Extend configuration to support .ts and .tsx files
```

**Estimated Tokens:** ~2,000

---

### Task 4: Create Directory Structure

**Goal:** Create the new layer-based directory structure that will house refactored components.

**Files to Modify/Create:**
- `src/components/three/` - New directory
- `src/components/controls/` - New directory
- `src/components/ui/` - New directory
- `src/stores/` - New directory (for Phase 2)
- `src/types/` - New directory
- `src/constants/` - New directory
- `src/utils/` - New directory

**Prerequisites:**
- Task 2 complete (tsconfig.json with path mappings exists)

**Implementation Steps:**

1. Create component subdirectories:
   - Create `src/components/three/` for WebGL/Three.js components
   - Create `src/components/controls/` for interaction controllers
   - Create `src/components/ui/` for DOM-based UI components
   - These will house components organized by technical layer

2. Create supporting directories:
   - Create `src/stores/` for future Zustand stores (Phase 2)
   - Create `src/types/` for TypeScript type definitions
   - Create `src/constants/` for configuration constants
   - Create `src/utils/` for utility functions

3. Create placeholder index files:
   - Create `src/components/three/index.ts` (empty, for barrel exports)
   - Create `src/components/controls/index.ts` (empty, for barrel exports)
   - Create `src/components/ui/index.ts` (empty, for barrel exports)
   - These will export components as they're migrated

4. Verify directory structure:
   - Check all directories created successfully
   - Verify they're in correct locations under `src/`
   - Ensure Git recognizes new directories

**Verification Checklist:**
- [ ] All component subdirectories exist
- [ ] All supporting directories exist
- [ ] Placeholder index.ts files created
- [ ] `ls -la src/components/` shows three/, controls/, ui/ subdirectories
- [ ] `ls -la src/` shows stores/, types/, constants/, utils/ directories

**Testing Instructions:**
- Run `ls -R src/` to verify directory structure
- Verify Git sees new directories: `git status`
- No unit tests needed for this task

**Commit Message Template:**
```
refactor(structure): create layer-based directory structure

- Add src/components/three/ for Three.js components
- Add src/components/controls/ for interaction controllers
- Add src/components/ui/ for UI components
- Add src/stores/ for future state management
- Add src/types/, src/constants/, src/utils/ for supporting code
- Create barrel export index files for each directory
```

**Estimated Tokens:** ~1,500

---

### Task 5: Create Type Definition Files

**Goal:** Create centralized type definition files for common types used across the application.

**Files to Modify/Create:**
- `src/types/threeJSTypes.ts` - Three.js-related types
- `src/types/cameraTypes.ts` - Camera-related types
- `src/types/componentTypes.ts` - Component prop types
- `src/types/storeTypes.ts` - Store types (for Phase 2)
- `src/types/index.ts` - Barrel exports

**Prerequisites:**
- Task 4 complete (types/ directory exists)
- Understanding of Phase-0 naming conventions

**Implementation Steps:**

1. Create `threeJSTypes.ts`:
   - Import Three.js types: `import type * as THREE from 'three'`
   - Define custom Three.js-related types:
     - `ThreeJSSceneModel` (alias for THREE.Scene)
     - `ThreeJSVector3Position` (alias for THREE.Vector3)
     - Event types for Three.js interactions
   - Export all types

2. Create `cameraTypes.ts`:
   - Define camera position types (tuples or interfaces)
   - Define camera configuration interface with scroll constants
   - Define camera animation state interface
   - Define camera index types and position arrays
   - Export all types

3. Create `componentTypes.ts`:
   - Define common prop types used across components
   - Define theme/vibe configuration type
   - Define light intensity configuration type
   - Define URL mapping types
   - Export all types

4. Create `storeTypes.ts`:
   - Define store state interfaces (scaffolding for Phase 2)
   - Define action types
   - Define selector return types
   - Export all types

5. Create barrel export `index.ts`:
   - Re-export all types from individual files
   - Organize exports by category
   - Add JSDoc comments explaining type categories

6. Add JSDoc documentation:
   - Document each type with purpose and usage examples
   - Explain complex types (e.g., theme configurations)
   - Provide examples of proper usage

**Verification Checklist:**
- [ ] All type definition files created
- [ ] No TypeScript errors in type files (`tsc --noEmit`)
- [ ] All types exported from index.ts
- [ ] JSDoc comments present for complex types
- [ ] Types align with Phase-0 naming conventions

**Testing Instructions:**
- Run `npx tsc --noEmit` on types directory specifically
- Import types in a test file to verify exports work
- No unit tests needed for type definitions

**Commit Message Template:**
```
feat(types): create TypeScript type definitions

- Add threeJSTypes.ts for Three.js-related types
- Add cameraTypes.ts for camera configuration types
- Add componentTypes.ts for component prop types
- Add storeTypes.ts for future store types
- Create barrel exports in types/index.ts
- Document types with JSDoc comments
```

**Estimated Tokens:** ~4,000

---

### Task 6: Migrate Data Constants to TypeScript

**Goal:** Convert the `src/data/` directory to typed constants in `src/constants/`.

**Files to Modify/Create:**
- `src/constants/cameraConfiguration.ts` - From `src/data/camera.js`
- `src/constants/lightingConfiguration.ts` - From `src/data/lighting.js`
- `src/constants/meshConfiguration.ts` - From `src/data/meshes.js`
- `src/constants/urlConfiguration.ts` - From `src/data/urls.js`
- `src/constants/animationConfiguration.ts` - From `src/data/animations.js`
- `src/constants/themeConfiguration.ts` - From `src/data/ui.js`
- `src/constants/index.ts` - Barrel exports

**Prerequisites:**
- Task 5 complete (type definitions exist)
- Read current data files to understand structure

**Implementation Steps:**

1. Migrate camera.js → cameraConfiguration.ts:
   - Read existing `src/data/camera.js`
   - Create typed interfaces for camera positions and scroll constants
   - Rename exports following explicit naming convention:
     - `positions` → `CAMERA_POSITION_ARRAY`
     - `scrollConstants` → `CAMERA_SCROLL_CONFIGURATION`
   - Add explicit types to all constants
   - Export as const assertions where appropriate

2. Migrate lighting.js → lightingConfiguration.ts:
   - Read existing `src/data/lighting.js`
   - Create typed arrays for light names
   - Rename exports:
     - `lightNames` → `INTERACTIVE_LIGHT_MESH_NAMES`
   - Add JSDoc explaining light configuration
   - Export as const assertions for type narrowing

3. Migrate meshes.js → meshConfiguration.ts:
   - Read existing `src/data/meshes.js`
   - Create typed interfaces for mesh configuration
   - Rename exports:
     - `meshNames` → `VIDEO_TEXTURE_MESH_NAMES`
     - `videoPaths` → `VIDEO_TEXTURE_FILE_PATHS`
     - `closeUpClickThrough` → `CLOSE_UP_CLICK_THRESHOLD_COUNT`
     - `MODEL_PATH` → `GLTF_MODEL_FILE_PATH`
   - Add types for mesh-related constants

4. Migrate urls.js → urlConfiguration.ts:
   - Read existing `src/data/urls.js`
   - Create typed interfaces for URL mappings
   - Rename exports:
     - `urlMap` → `MESH_NAME_TO_URL_MAPPING`
     - `phoneUrls` → `INTERACTIVE_PHONE_URL_CONFIGURATIONS`
   - Add proper typing for URL configuration objects

5. Migrate animations.js → animationConfiguration.ts:
   - Read existing `src/data/animations.js`
   - Create typed animation configurations
   - Add proper types for animation parameters
   - Export with const assertions

6. Migrate ui.js → themeConfiguration.ts:
   - Read existing `src/data/ui.js`
   - Create typed theme/vibe configurations
   - Rename exports:
     - `colorMap` → `THEME_COLOR_CONFIGURATION_MAP`
   - Add union type for theme names
   - Export with const assertions

7. Create barrel export index.ts:
   - Export all constants from individual files
   - Organize by category
   - Add JSDoc explaining constant categories

8. Update existing imports:
   - Find all files importing from `src/data/`
   - Update import paths to `constants/`
   - Update imported names to new explicit names
   - Verify no import errors

**Verification Checklist:**
- [ ] All data files migrated to constants/
- [ ] All constants have explicit types
- [ ] Naming follows explicit convention (SCREAMING_SNAKE_CASE or descriptive camelCase)
- [ ] All existing imports updated
- [ ] `npx tsc --noEmit` passes for constants directory
- [ ] No runtime errors when running app

**Testing Instructions:**
- Run `npx tsc --noEmit` to verify types
- Run `npm start` and verify app still loads
- Verify 3D model loads correctly
- Verify clicking on interactive elements still works
- No unit tests needed yet (will be added in Phase 4)

**Commit Message Template:**
```
refactor(constants): migrate data files to typed constants

- Migrate camera.js to cameraConfiguration.ts with types
- Migrate lighting.js to lightingConfiguration.ts with types
- Migrate meshes.js to meshConfiguration.ts with types
- Migrate urls.js to urlConfiguration.ts with types
- Migrate animations.js to animationConfiguration.ts with types
- Migrate ui.js to themeConfiguration.ts with types
- Update all import paths to use constants/
- Apply explicit naming convention to all exports
```

**Estimated Tokens:** ~8,000

---

### Task 7: Migrate Custom Hooks to TypeScript

**Goal:** Convert custom hooks from JavaScript to TypeScript with proper types.

**Files to Modify/Create:**
- `src/hooks/useCameraScrollBehavior.ts` - From `useCameraScroll.js`
- `src/hooks/useCameraPositionAnimation.ts` - From `useCameraAnimation.js`
- `src/hooks/useLightingController.ts` - From `useLightController.js`

**Prerequisites:**
- Task 5 complete (types exist)
- Task 6 complete (constants migrated)
- Understanding of current hook implementations

**Implementation Steps:**

1. Migrate useCameraScroll.js → useCameraScrollBehavior.ts:
   - Rename file with explicit name
   - Create interface for hook parameters with explicit names
   - Create interface for hook return type
   - Add types to all variables and function parameters
   - Update imports from `data/` to `constants/`
   - Update Context hooks to typed versions (will be removed in Phase 2)
   - Add JSDoc with parameter descriptions and usage example
   - Ensure all Three.js objects properly typed

2. Migrate useCameraAnimation.js → useCameraPositionAnimation.ts:
   - Rename file with explicit name
   - Create parameter interface
   - Create return type interface
   - Add explicit types to all internal variables
   - Update constant imports
   - Add comprehensive JSDoc
   - Type all Three.js interactions

3. Migrate useLightController.js → useLightingController.ts:
   - Rename file with explicit name
   - Create parameter and return interfaces
   - Add types throughout implementation
   - Update imports to typed constants
   - Add JSDoc documentation
   - Ensure Three.js light objects properly typed

4. Update hook imports:
   - Find all files importing these hooks
   - Update import paths (if changed)
   - Update imported names to new explicit names
   - Verify no import errors

5. Handle Context dependencies:
   - Note that hooks still use Context (will migrate in Phase 2)
   - Add temporary type definitions for Context hooks
   - Mark with TODO comments for Phase 2 migration

**Verification Checklist:**
- [ ] All hooks converted to TypeScript
- [ ] No `any` types (except for Context temporarily)
- [ ] All parameters and return values typed
- [ ] JSDoc comments added
- [ ] Imports updated to constants/
- [ ] `npx tsc --noEmit` passes
- [ ] App runs without errors

**Testing Instructions:**
- Run `npx tsc --noEmit` to verify types
- Run `npm start` and test camera scroll functionality
- Test mobile navigation button
- Test light interaction
- No unit tests yet (Phase 4)

**Commit Message Template:**
```
refactor(hooks): migrate custom hooks to TypeScript

- Migrate useCameraScroll to useCameraScrollBehavior with types
- Migrate useCameraAnimation to useCameraPositionAnimation with types
- Migrate useLightController to useLightingController with types
- Add parameter and return type interfaces for all hooks
- Update imports to use typed constants
- Add JSDoc documentation with usage examples
- Apply explicit naming convention to hook names
```

**Estimated Tokens:** ~10,000

---

### Task 8: Create Temporary Typed Context Wrappers

**Goal:** Create TypeScript wrappers for existing Context hooks to enable typed usage until Phase 2 migration.

**Files to Modify/Create:**
- `src/contexts/UIContext.tsx` - Migrate from `.js` to `.tsx`
- `src/contexts/InteractionContext.tsx` - Migrate from `.js` to `.tsx`
- `src/contexts/index.ts` - Add types

**Prerequisites:**
- Task 5 complete (types exist)
- Understanding that these will be replaced in Phase 2

**Implementation Steps:**

1. Migrate UIContext.js → UIContext.tsx:
   - Rename file to `.tsx` extension
   - Create interface `UIContextState` with all state properties typed
   - Create interface `UIContextActions` with all action functions typed
   - Create combined type `UIContextValue = UIContextState & UIContextActions`
   - Type the context: `React.createContext<UIContextValue | undefined>(undefined)`
   - Type provider props: `{ children: React.ReactNode }`
   - Add explicit return types to all setter functions
   - Update all `useState` calls with explicit types
   - Add JSDoc comments
   - Mark with `// TODO: Phase 2 - Replace with Zustand`

2. Migrate InteractionContext.js → InteractionContext.tsx:
   - Same approach as UIContext
   - Create state and action interfaces
   - Type the context creation
   - Type all functions and state
   - Add JSDoc and TODO comments

3. Update contexts/index.ts:
   - Export types from both contexts
   - Add barrel exports
   - Ensure all types exportable

4. Update imports throughout codebase:
   - Find all files using `useUI` or `useInteraction`
   - Verify TypeScript recognizes types
   - Fix any type errors that arise

**Verification Checklist:**
- [ ] Both context files are `.tsx`
- [ ] All context values typed
- [ ] No `any` types in contexts
- [ ] All consumers have type information
- [ ] `npx tsc --noEmit` passes
- [ ] App runs without errors

**Testing Instructions:**
- Run `npx tsc --noEmit` to verify types
- Run `npm start` and verify all UI interactions work
- Test theme selection
- Test mute button
- No unit tests yet

**Commit Message Template:**
```
refactor(contexts): migrate React contexts to TypeScript

- Migrate UIContext to TypeScript with full typing
- Migrate InteractionContext to TypeScript with full typing
- Create state and action interfaces for both contexts
- Add JSDoc documentation
- Mark contexts for Phase 2 Zustand migration
- Ensure all context consumers have type information
```

**Estimated Tokens:** ~6,000

---

### Task 9: Migrate UI Components to TypeScript

**Goal:** Convert UI components to TypeScript and move to `components/ui/` with explicit names.

**Files to Modify/Create:**
- `src/components/ui/LaunchScreen.tsx` - From `LaunchScreen.js`
- `src/components/ui/ThemeSelectionOption.tsx` - From `VibeOption.js`
- `src/components/ui/CustomCheckbox.tsx` - From `Checkbox.js`

**Prerequisites:**
- Task 5 complete (types exist)
- Task 8 complete (typed contexts exist)
- UI components directory exists

**Implementation Steps:**

1. Migrate LaunchScreen.js → ui/LaunchScreen.tsx:
   - Move file to `src/components/ui/` directory
   - Rename file to `.tsx` extension
   - Create `LaunchScreenProps` interface (if props exist)
   - Add explicit types to all variables and functions
   - Type all React hooks (useState, useCallback, etc.)
   - Update imports to use typed contexts
   - Update imports from constants/
   - Add JSDoc component documentation
   - Ensure component follows Phase-0 structure pattern

2. Migrate VibeOption.js → ui/ThemeSelectionOption.tsx:
   - Move to `src/components/ui/`
   - Rename to explicit name `ThemeSelectionOption.tsx`
   - Create props interface with typed theme configuration
   - Add types throughout implementation
   - Update imports
   - Add JSDoc
   - Follow Phase-0 component pattern

3. Migrate Checkbox.js → ui/CustomCheckbox.tsx:
   - Move to `src/components/ui/`
   - Rename to `CustomCheckbox.tsx`
   - Create comprehensive props interface
   - Type checkbox state and handlers
   - Update imports
   - Add JSDoc with usage example
   - Preserve CSS classes (will migrate to Tailwind in Phase 3)

4. Update ui/index.ts:
   - Add barrel exports for all UI components
   - Export component types
   - Organize exports alphabetically

5. Update imports across codebase:
   - Find all files importing these components
   - Update paths to `components/ui/ComponentName`
   - Update component names to new explicit names
   - Verify no import errors

**Verification Checklist:**
- [ ] All UI components in `components/ui/`
- [ ] All components are `.tsx` files
- [ ] All props typed with interfaces
- [ ] No `any` types
- [ ] Imports updated throughout codebase
- [ ] `npx tsc --noEmit` passes
- [ ] App runs and UI functions correctly

**Testing Instructions:**
- Run `npx tsc --noEmit`
- Run `npm start`
- Test launch screen appears
- Test theme selection works
- Test checkbox interactions
- Verify styling preserved

**Commit Message Template:**
```
refactor(ui): migrate UI components to TypeScript

- Migrate LaunchScreen to TypeScript in components/ui/
- Migrate VibeOption to ThemeSelectionOption with types
- Migrate Checkbox to CustomCheckbox with types
- Create prop interfaces for all UI components
- Update all imports to new component locations
- Add JSDoc documentation for each component
- Follow Phase-0 component structure pattern
```

**Estimated Tokens:** ~9,000

---

### Task 10: Migrate Three.js Components to TypeScript

**Goal:** Convert Three.js components to TypeScript and move to `components/three/` with explicit names.

**Files to Modify/Create:**
- `src/components/three/SceneModel.tsx` - From `Model.js`
- `src/components/three/SceneEnvironment.tsx` - From `Environment.js`
- `src/components/three/VideoTextureMesh.tsx` - From `VideoMesh.js`
- `src/components/three/InteractiveLightMesh.tsx` - From `Lamp.js`
- `src/components/three/InteractiveMeshElement.tsx` - From `InteractiveElement.js`

**Prerequisites:**
- Task 5 complete (Three.js types exist)
- Task 6 complete (mesh/lighting constants exist)
- Task 8 complete (typed contexts exist)

**Implementation Steps:**

1. Migrate Model.js → three/SceneModel.tsx:
   - Move to `src/components/three/`
   - Rename to `SceneModel.tsx`
   - Create props interface (if needed)
   - Add explicit types to all Three.js objects:
     - Type `gltf` as `GLTF` from drei
     - Type `scene` as `THREE.Scene`
     - Type mesh references with proper types
   - Type all event handlers (ThreeEvent from r3f)
   - Type video element refs as `React.RefObject<HTMLVideoElement>`
   - Update imports from constants/
   - Update context usage to typed versions
   - Add JSDoc with usage example
   - Ensure proper cleanup in useEffect

2. Migrate Environment.js → three/SceneEnvironment.tsx:
   - Move to `src/components/three/`
   - Rename to `SceneEnvironment.tsx`
   - Type all Three.js lighting objects
   - Type props if any
   - Update imports
   - Add JSDoc

3. Migrate VideoMesh.js → three/VideoTextureMesh.tsx:
   - Move to `src/components/three/`
   - Rename to `VideoTextureMesh.tsx`
   - Type video texture props
   - Type Three.js material and texture objects
   - Update imports
   - Add JSDoc

4. Migrate Lamp.js → three/InteractiveLightMesh.tsx:
   - Move to `src/components/three/`
   - Rename to `InteractiveLightMesh.tsx`
   - Type light object props
   - Type interaction handlers
   - Update imports
   - Add JSDoc

5. Migrate InteractiveElement.js → three/InteractiveMeshElement.tsx:
   - Move to `src/components/three/`
   - Rename to `InteractiveMeshElement.tsx`
   - Type mesh interaction props
   - Type event handlers
   - Update imports
   - Add JSDoc

6. Update three/index.ts:
   - Add barrel exports for all Three.js components
   - Export component types
   - Organize exports

7. Update imports across codebase:
   - Find all files importing these components
   - Update paths to `components/three/ComponentName`
   - Update names to new explicit names
   - Verify no import errors

**Verification Checklist:**
- [ ] All Three.js components in `components/three/`
- [ ] All components are `.tsx` files
- [ ] All Three.js objects properly typed
- [ ] Event handlers typed with ThreeEvent
- [ ] No `any` types
- [ ] Imports updated throughout codebase
- [ ] `npx tsc --noEmit` passes
- [ ] 3D scene renders correctly
- [ ] Interactions work (clicks, hover)

**Testing Instructions:**
- Run `npx tsc --noEmit`
- Run `npm start`
- Verify 3D model loads
- Test clicking on interactive elements
- Test video textures playing
- Test light interactions
- Verify performance not degraded

**Commit Message Template:**
```
refactor(three): migrate Three.js components to TypeScript

- Migrate Model to SceneModel with Three.js types
- Migrate Environment to SceneEnvironment with types
- Migrate VideoMesh to VideoTextureMesh with types
- Migrate Lamp to InteractiveLightMesh with types
- Migrate InteractiveElement to InteractiveMeshElement with types
- Type all Three.js objects (Scene, Mesh, Material, etc.)
- Type all event handlers with ThreeEvent
- Update imports to new component locations
- Add JSDoc documentation for each component
```

**Estimated Tokens:** ~12,000

---

### Task 11: Migrate Control Components to TypeScript

**Goal:** Convert control components to TypeScript and move to `components/controls/` with explicit names.

**Files to Modify/Create:**
- `src/components/controls/CameraController.tsx` - From `CameraControls.js`
- `src/components/controls/SceneAnimationController.tsx` - From `Animations.js`
- `src/components/controls/AudioController.tsx` - From `Sounds.js`

**Prerequisites:**
- Task 7 complete (typed hooks exist)
- Task 8 complete (typed contexts exist)
- Controls directory exists

**Implementation Steps:**

1. Migrate CameraControls.js → controls/CameraController.tsx:
   - Move to `src/components/controls/`
   - Rename to `CameraController.tsx`
   - Create props interface if needed
   - Type all camera-related variables
   - Type Three.js camera objects
   - Type hook return values explicitly
   - Update hook imports to new names
   - Update context usage to typed versions
   - Add JSDoc

2. Migrate Animations.js → controls/SceneAnimationController.tsx:
   - Move to `src/components/controls/`
   - Rename to `SceneAnimationController.tsx`
   - Type animation state
   - Type Three.js animation objects
   - Type timing and interpolation values explicitly
   - Update imports
   - Add JSDoc

3. Migrate Sounds.js → controls/AudioController.tsx:
   - Move to `src/components/controls/`
   - Rename to `AudioController.tsx`
   - Type audio-related state
   - Type HTML audio elements
   - Type sound configuration
   - Update imports
   - Add JSDoc

4. Update controls/index.ts:
   - Add barrel exports
   - Export types
   - Organize exports

5. Update imports across codebase:
   - Find all files importing control components
   - Update paths to `components/controls/ComponentName`
   - Update names to new explicit names
   - Verify no import errors

**Verification Checklist:**
- [ ] All control components in `components/controls/`
- [ ] All components are `.tsx` files
- [ ] All props and state typed
- [ ] Camera controls work correctly
- [ ] Animations play correctly
- [ ] Audio controls function
- [ ] `npx tsc --noEmit` passes
- [ ] App runs without errors

**Testing Instructions:**
- Run `npx tsc --noEmit`
- Run `npm start`
- Test camera scroll (desktop wheel)
- Test mobile navigation button
- Test camera animations
- Test audio playback and mute
- Verify all interactions smooth

**Commit Message Template:**
```
refactor(controls): migrate control components to TypeScript

- Migrate CameraControls to CameraController with types
- Migrate Animations to SceneAnimationController with types
- Migrate Sounds to AudioController with types
- Type all camera and animation state
- Type all Three.js object interactions
- Update imports to new component locations
- Add JSDoc documentation for each controller
```

**Estimated Tokens:** ~10,000

---

### Task 12: Migrate Root App Component to TypeScript

**Goal:** Convert the main App component to TypeScript with proper typing.

**Files to Modify/Create:**
- `src/App.tsx` - From `App.js`
- `src/index.tsx` - From `index.js`

**Prerequisites:**
- All other components migrated (Tasks 9-11 complete)
- All hooks migrated (Task 7 complete)
- All contexts migrated (Task 8 complete)

**Implementation Steps:**

1. Migrate App.js → App.tsx:
   - Rename to `.tsx` extension
   - Update all component imports to new locations:
     - Import from `components/three/*`
     - Import from `components/controls/*`
     - Import from `components/ui/*`
   - Type all state variables explicitly
   - Type all refs (navigationButtonRef, muteButtonRef) with proper HTML element types
   - Type all event handlers with explicit parameters
   - Type all useEffect dependencies
   - Update context provider imports
   - Add JSDoc for main component
   - Ensure TitleEffect sub-component properly typed
   - Type LoadingScreen memoized component

2. Migrate index.js → index.tsx:
   - Rename to `.tsx` extension
   - Ensure React imports typed
   - Type the root element: `HTMLElement | null`
   - Add null check for root element
   - Update import path for App (if needed)
   - Add JSDoc

3. Update tsconfig.json if needed:
   - Verify `jsx: "react-jsx"` is set
   - Verify includes cover new `.tsx` files

4. Final verification:
   - Check all imports resolve correctly
   - Verify no circular dependencies
   - Ensure all TypeScript errors resolved

**Verification Checklist:**
- [ ] App.tsx compiles without errors
- [ ] index.tsx compiles without errors
- [ ] All component imports resolve
- [ ] No `any` types in App or index
- [ ] `npx tsc --noEmit` passes for entire project
- [ ] App runs and functions identically to before refactor
- [ ] All UI interactions work
- [ ] 3D scene loads and is interactive

**Testing Instructions:**
- Run `npx tsc --noEmit` for full type check
- Run `npm start` and verify full application
- Test complete user flow:
  - Load application
  - See loading screen
  - Select theme
  - Interact with 3D scene
  - Scroll camera
  - Click interactive elements
  - Toggle audio mute
  - Test on mobile viewport (Chrome DevTools)
- Verify no console errors
- Verify no TypeScript errors

**Commit Message Template:**
```
refactor(app): migrate root App component to TypeScript

- Migrate App.js to App.tsx with full typing
- Migrate index.js to index.tsx with types
- Update all component imports to new locations
- Type all state, refs, and event handlers
- Type sub-components (TitleEffect, LoadingScreen)
- Ensure entire application type-safe
- Verify all functionality preserved
```

**Estimated Tokens:** ~8,000

---

### Task 13: Remove Old JavaScript Files

**Goal:** Delete old JavaScript files and clean up deprecated data directory.

**Files to Modify/Create:**
- DELETE: `src/components/Animations.js`
- DELETE: `src/components/CameraControls.js`
- DELETE: `src/components/Checkbox.js`
- DELETE: `src/components/Environment.js`
- DELETE: `src/components/InteractiveElement.js`
- DELETE: `src/components/Lamp.js`
- DELETE: `src/components/LaunchScreen.js`
- DELETE: `src/components/Model.js`
- DELETE: `src/components/Sounds.js`
- DELETE: `src/components/VibeOption.js`
- DELETE: `src/components/VideoMesh.js`
- DELETE: `src/hooks/useCameraAnimation.js`
- DELETE: `src/hooks/useCameraScroll.js`
- DELETE: `src/hooks/useLightController.js`
- DELETE: `src/contexts/UIContext.js`
- DELETE: `src/contexts/InteractionContext.js`
- DELETE: `src/data/` directory (all files)

**Prerequisites:**
- ALL previous tasks complete
- Verified app runs with TypeScript files
- Git committed all TypeScript migrations

**Implementation Steps:**

1. Verify no files importing deleted files:
   - Search codebase for imports from old file paths
   - Use grep or IDE find: `grep -r "from.*components/Model" src/`
   - Ensure all imports updated to new locations
   - If any found, update them before deletion

2. Delete old component files:
   - Remove all old `.js` component files from `src/components/`
   - Verify TypeScript versions exist in new locations
   - Double-check no imports remain

3. Delete old hook files:
   - Remove old `.js` hook files from `src/hooks/`
   - Verify TypeScript versions exist
   - Check no imports remain

4. Delete old context files:
   - Remove old `.js` context files
   - Verify `.tsx` versions exist
   - Check no imports remain

5. Delete data directory:
   - Remove entire `src/data/` directory
   - Verify all constants migrated to `src/constants/`
   - Check no imports from `data/` remain

6. Verify application still works:
   - Run `npm start`
   - Test full functionality
   - Verify no runtime errors

**Verification Checklist:**
- [ ] No `.js` files remain in src/ (except config files if any)
- [ ] `src/data/` directory deleted
- [ ] App compiles successfully
- [ ] App runs without errors
- [ ] No "module not found" errors
- [ ] Git status shows deleted files

**Testing Instructions:**
- Run `find src -name "*.js" -type f` (should return no results)
- Run `npm start` and verify app loads
- Test all functionality once more
- Verify build: `npm run build` succeeds

**Commit Message Template:**
```
chore(cleanup): remove old JavaScript files

- Delete old component JavaScript files
- Delete old hook JavaScript files
- Delete old context JavaScript files
- Delete src/data/ directory (migrated to constants/)
- Verify all imports updated to TypeScript files
- Confirm application functions correctly
```

**Estimated Tokens:** ~2,000

---

### Task 14: Update Package.json Scripts

**Goal:** Add TypeScript-specific scripts to package.json for type checking and development.

**Files to Modify/Create:**
- `package.json` - Add new scripts

**Prerequisites:**
- All TypeScript migration complete
- App compiles and runs

**Implementation Steps:**

1. Add type checking script:
   - Add `"type-check": "tsc --noEmit"` to scripts
   - This allows running type check without compilation
   - Useful for CI/CD pipelines

2. Add type checking watch script:
   - Add `"type-check:watch": "tsc --noEmit --watch"` to scripts
   - Allows continuous type checking during development

3. Update build script (if needed):
   - Verify `build` script works with TypeScript
   - React Scripts should handle TypeScript automatically
   - Test build to ensure no issues

4. Add pre-commit type check (optional):
   - Consider adding `"precommit": "npm run type-check"`
   - Ensures TypeScript errors caught before commit
   - Optional: discuss with team before adding

5. Document scripts:
   - Update README.md (not in this phase, but note for later)
   - Ensure scripts are self-explanatory

**Verification Checklist:**
- [ ] `npm run type-check` succeeds
- [ ] `npm run type-check:watch` runs continuously
- [ ] `npm run build` succeeds
- [ ] All scripts documented in package.json

**Testing Instructions:**
- Run `npm run type-check` - should pass with 0 errors
- Run `npm run build` - should complete successfully
- Run `npm start` - should start dev server
- Verify build output in `build/` directory works

**Commit Message Template:**
```
chore(scripts): add TypeScript checking scripts

- Add type-check script for manual type checking
- Add type-check:watch script for continuous checking
- Verify build script works with TypeScript
- Document new scripts for team usage
```

**Estimated Tokens:** ~1,500

---

### Task 15: Final Phase 1 Verification

**Goal:** Comprehensive testing and verification that Phase 1 is complete and successful.

**Files to Modify/Create:**
- None (verification only)

**Prerequisites:**
- ALL Phase 1 tasks complete (Tasks 1-14)

**Implementation Steps:**

1. Run comprehensive type checking:
   - Run `npx tsc --noEmit`
   - Verify 0 errors
   - Fix any lingering type issues
   - Ensure strict mode enabled

2. Run ESLint:
   - Run `npx eslint --ext .ts,.tsx src/`
   - Fix any linting errors
   - Verify TypeScript rules enforced

3. Test build:
   - Run `npm run build`
   - Verify build succeeds
   - Check bundle size (should be similar or smaller)
   - Test built application in `build/` directory

4. Manual testing:
   - Run `npm start`
   - Test complete user journey:
     - Loading screen appears
     - Theme selection works
     - 3D model loads
     - Camera scroll works (desktop)
     - Mobile navigation works
     - Click interactions work
     - Light interactions work
     - Video textures play
     - Audio mute works
     - Responsive design works
   - Test in multiple browsers (Chrome, Firefox, Safari if available)
   - Test on mobile device or simulator

5. Code review checklist:
   - All files follow naming conventions
   - All components in correct directories
   - No `any` types used
   - All functions have return types
   - All parameters typed
   - JSDoc comments present
   - Imports organized and clean

6. Git verification:
   - Run `git status` - verify clean state
   - Run `git log --oneline` - verify all commits present
   - Check commit messages follow conventional format
   - Ensure all changes committed

7. Documentation check:
   - Verify tsconfig.json documented
   - Verify file structure documented (can update in Phase 4)
   - Note any gotchas or issues for documentation

**Verification Checklist:**
- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] `npx eslint --ext .ts,.tsx src/` passes
- [ ] `npm run build` succeeds
- [ ] Application runs identically to pre-refactor
- [ ] All manual tests pass
- [ ] No console errors or warnings
- [ ] Bundle size acceptable
- [ ] All files follow naming conventions
- [ ] All components in correct directories
- [ ] All commits have good messages
- [ ] Git state clean

**Testing Instructions:**
- Follow manual testing checklist above
- Compare behavior to original JavaScript version
- Verify no regressions
- Check performance (should be same or better)
- Test error scenarios (network failures, etc.)

**Commit Message Template:**
```
test(phase-1): verify Phase 1 completion

- Run comprehensive type checking (0 errors)
- Run ESLint verification
- Test production build
- Complete manual testing checklist
- Verify all naming conventions followed
- Verify all files in correct locations
- Confirm Phase 1 success criteria met
```

**Estimated Tokens:** ~3,000

---

## Phase 1 Verification

### Completion Criteria

Before marking Phase 1 complete, verify:

1. **TypeScript Compilation:**
   - `npx tsc --noEmit` passes with 0 errors
   - `npm run build` succeeds
   - No `any` types in codebase

2. **File Structure:**
   - All components in layer-based directories
   - All files follow naming conventions
   - Old JavaScript files deleted
   - No `src/data/` directory

3. **Functionality:**
   - Application runs identically to before refactor
   - All user interactions work
   - 3D scene renders correctly
   - No performance degradation

4. **Code Quality:**
   - All functions typed with return types
   - All parameters typed
   - JSDoc comments added
   - ESLint passes

5. **Git State:**
   - All changes committed
   - Commit messages follow conventional format
   - Branch up to date

### Integration Points

**Interfaces for Phase 2 (Zustand Migration):**
- Typed contexts exist but marked for replacement
- Store types created in `src/types/storeTypes.ts`
- `src/stores/` directory exists and ready

**Interfaces for Phase 3 (Tailwind):**
- CSS classes preserved in components
- Styling structure unchanged
- Ready for Tailwind class replacement

**Interfaces for Phase 4 (Testing):**
- Pure functions isolated and testable
- Hooks extracted and ready for testing
- Type system enables better test mocking

### Known Limitations

1. **Context Still Used:** React Context still in use, will migrate to Zustand in Phase 2
2. **Custom CSS:** All custom CSS still in place, will migrate to Tailwind in Phase 3
3. **No Tests:** No tests yet, will add in Phase 4
4. **Some Verbose Names:** Some names may feel overly explicit, can refine after team review

### Rollback Procedure

If Phase 1 needs to be rolled back:

```bash
# Find commit before Phase 1 started
git log --oneline

# Reset to that commit
git reset --hard <commit-hash>

# Force push if already pushed
git push -f origin claude/design-feature-naming-refactor-01SwsoFYJoanSP88r5nfjhMG
```

---

## Next Steps

After Phase 1 completion:

1. **Review with team:** Share TypeScript migration results
2. **Performance check:** Compare metrics with pre-refactor baseline
3. **Documentation:** Note any deviations or improvements for docs
4. **Proceed to Phase 2:** Begin Zustand state management migration

**Continue to:** [Phase-2.md](./Phase-2.md) - State Management with Zustand

---

**Phase 1 Token Estimate Total:** ~85,000 tokens

This phase establishes a solid TypeScript foundation with proper structure and naming, setting up success for Phases 2-4.
