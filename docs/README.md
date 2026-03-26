# Credentials Canvas Documentation

Complete documentation for the Credentials Canvas interactive 3D portfolio.

## Table of Contents

- [Overview](#overview)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Development](#development)
- [Testing](#testing)
- [Styling](#styling)
- [Build & Deployment](#build--deployment)

## Overview

Credentials Canvas is an immersive 3D portfolio experience built with Three.js and React. Instead of a traditional portfolio website, visitors explore a fully realized 3D scene where each element provides access to different projects and achievements.

### Key Features

- **3D Navigation**: Smooth camera controls through a detailed environment
- **Interactive Elements**: Click on objects to discover projects, skills, and links
- **Dynamic Lighting**: Interactive lights that respond to user clicks
- **Theme System**: Multiple environment themes (Urban, Rural, Classy, Chill)
- **Video Displays**: Phone screens showing project demos
- **Responsive Design**: Desktop and mobile support

## Technologies

### Frontend Stack

- **React 18** - UI framework
- **Three.js** - 3D rendering engine
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Zustand** - State management
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety

### Build Tools

- **Vite** - Build tool and dev server
- **Vitest** - Unit testing framework
- **ESLint** - Code linting (flat config)
- **PostCSS** - CSS processing

## Architecture

### Directory Structure

```text
credentials-canvas/
├── frontend/
│   ├── src/
│   │   ├── assets/          # Media files (videos, images)
│   │   ├── components/
│   │   │   ├── controls/    # Camera, audio controllers
│   │   │   ├── three/       # 3D scene components
│   │   │   └── ui/          # UI components
│   │   ├── constants/       # Configuration data
│   │   ├── css/             # Custom CSS (animations)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── shaders/         # GLSL shader files
│   │   ├── stores/          # Zustand stores
│   │   ├── styles/          # Tailwind entry
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Utility functions
│   ├── tests/
│   │   ├── frontend/        # Test files
│   │   └── helpers/         # Test utilities
│   └── public/              # Static assets
└── docs/
    └── README.md               # Long Form README
```

### State Management

The app uses three Zustand stores:

1. **SceneInteractionStore** - User interactions with 3D scene
   - Mesh/light clicks (`clickedMeshPosition`, `clickedLightName`, `totalClickCount`)
   - Camera position and scroll state (`currentCameraPositionIndex`, `cameraInterpolationProgress`, `hasUserStartedScrolling`)
   - View modes (`isCloseUpViewActive`, `isUserCurrentlyDragging`)
   - Mobile navigation (`mobileScrollTriggerCount`)

2. **UserInterfaceStore** - UI state
   - Theme selection (`selectedThemeConfiguration`, `titleTextColorHue`)
   - Audio mute state (`isAudioCurrentlyMuted`)
   - Window dimensions (`currentWindowWidth`)
   - Light intensity controls (`currentLightIntensityConfiguration`)
   - Iframe visibility (`shouldShowArcadeIframe`, `shouldShowMusicIframe`)

3. **ThreeJSSceneStore** - Three.js object references
   - GLTF scene model (`threeJSSceneModel`)
   - Video player element (`htmlVideoPlayerElement`)

### Three.js Scene Structure

The 3D scene consists of:
- GLTF model loaded with DRACO compression
- Multiple interactive mesh elements
- Point lights with interactive controls
- Video textures on phone screens
- Particle effects for atmosphere

## Development

### Prerequisites

- Node.js 24 LTS
- npm 10+

### Quick Start

```bash
git clone https://github.com/hatmanstack/credentials-canvas.git
cd credentials-canvas/frontend
npm install
npm run dev
```

### Available Scripts

Run from `frontend/`:

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run preview    # Preview production build
npm run test       # Run tests
npm run lint       # ESLint + TypeScript check
```

### Model Setup

Download the GLTF model:
1. Get `.glb` file from [production deployment](https://credentials.hatstack.fun/compressed_model.glb)
2. Place in `frontend/public/compressed_model.glb`

### Model Optimization

If modifying the Blender model:
```bash
gltf-pipeline -i updated.glb -o compressed_model.glb --draco.compressionLevel=7 --keepUnusedElements --keepDefaultScene
```

## Testing

### Test Framework

Tests use **Vitest** with **React Testing Library**.

### Running Tests

```bash
npm run test             # Run in watch mode
npm run test -- --run    # Run once
npm run test -- --coverage  # With coverage report
```

### Test Structure

```text
frontend/tests/
├── frontend/
│   ├── components/      # Component tests
│   │   ├── controls/    # Camera, audio controller tests
│   │   ├── three/       # 3D scene component tests
│   │   ├── ui/          # UI component tests
│   │   ├── App.test.tsx
│   │   ├── ArcadeIframe.test.tsx
│   │   ├── Lamp.test.tsx
│   │   ├── SliderController.test.tsx
│   │   └── YouTubeMusicPlayer.test.tsx
│   ├── hooks/           # Custom hook tests
│   ├── stores/          # Zustand store tests
│   └── utils/           # Utility function tests
└── helpers/
    ├── storeMocks.ts    # Mock store factories
    ├── testUtils.tsx    # Test utilities
    ├── threeMocks.ts    # Three.js mocks
    └── setup.ts         # Global test setup
```

### Test Coverage

| Category | Target | Status |
|----------|--------|--------|
| Stores | >90% | ✅ 100% |
| Utils | 100% | ✅ 100% |
| Hooks | >80% | ✅ 82% |

### Writing Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSceneInteractionStore } from 'stores/sceneInteractionStore';

describe('sceneInteractionStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useSceneInteractionStore());
    act(() => {
      result.current.resetSceneInteractionState();
    });
  });

  it('should increment click count', () => {
    const { result } = renderHook(() => useSceneInteractionStore());

    act(() => {
      result.current.incrementClickCount();
    });

    expect(result.current.totalClickCount).toBe(1);
  });
});
```

## Styling

### Tailwind CSS

The project uses Tailwind CSS for utility-first styling.

#### Class Composition

Use the `cn()` utility for class composition:

```tsx
import { cn } from 'utils/classNameUtils';

<button className={cn(
  'w-12 h-12 rounded-full',
  'bg-rest-color',
  isActive && 'bg-active-color'
)} />
```

#### Theme Colors

Custom colors defined in `tailwind.config.js`:

```javascript
colors: {
  'background-primary': '#171519',
  'rest-color': '#9b9dad',
  'active-color': '#b68672',
  'urban-theme': '#e96929',
  'rural-theme': '#80c080',
  'classy-theme': '#ef5555',
  'chill-theme': '#9fa8da',
  'graphics-theme': '#000000',
  'urban-active': '#e96929',
  'urban-rest': '#b68672',
  'rural-active': '#80c080',
  'rural-rest': '#869582',
  'classy-active': '#ef5555',
  'classy-rest': '#f38484',
  'chill-active': '#9fa8da',
  'chill-rest': '#8f909d',
}
```

### Custom CSS

Complex animations are preserved in CSS files:

- `css/checkbox.css` - Toggle animations
- `css/launch.css` - Text stroke animations, reset button

## Build & Deployment

### Production Build

```bash
npm run build
```

Output is in `frontend/dist/`.

### Preview Build

```bash
npm run preview
```

### Deployment

The app is a static site that can be deployed to:
- AWS Amplify (current)
- Vercel
- Netlify
- GitHub Pages

### Environment Variables

No environment variables required for basic deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following existing patterns
4. Ensure tests pass: `npm run check`
5. Submit a pull request

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
