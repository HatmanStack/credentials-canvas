<div align="center">
<h1>Credentials Canvas</h1>

<div style="display: flex; justify-content: center; align-items: center;">
  <h4 style="margin: 0; display: flex;">
    <a href="https://www.apache.org/licenses/LICENSE-2.0.html">
      <img src="https://img.shields.io/badge/license-Apache%202.0-blue" alt="Apache 2.0 license" />
    </a>
    <a href="https://r3f.docs.pmnd.rs/getting-started/introduction">
      <img src="https://img.shields.io/badge/React%20Fiber-violet" alt="React Fiber" />
    </a>
    <a href="https://threejs.org/">
      <img src="https://img.shields.io/badge/Three.js-yellow" alt="Threejs" />
    </a>
    <a href="https://www.blender.org/">
      <img src="https://img.shields.io/badge/Blender%204.3-F69455" alt="Blender Version">
    </a>
  </h4>
</div>

<p><b>Interactive 3D Portfolio Experience</b></p>
<p><a href="https://production.dld9ll6ojjns2.amplifyapp.com/">Experience Credentials Canvas »</a></p>

<p align="center">
  <img src="https://github.com/HatmanStack/credentials-canvas/blob/main/public/ez.gif" alt="Interactive 3D Environment">
</p>
<p align="center">
  <img src="https://github.com/HatmanStack/credentials-canvas/blob/main/public/house.gif" alt="3D Scene Navigation">
</p>
</div>

## Overview

Credentials Canvas is an immersive 3D portfolio that showcases projects in an interactive virtual environment. Navigate through a detailed scene, click objects to discover projects, and explore different themed atmospheres.

## Structure

```text
credentials-canvas/
├── frontend/           # React + Three.js application
│   ├── src/
│   └── public/
├── tests/              # Test suite
└── docs/               # Documentation
```

## Prerequisites

- Node.js 24 LTS
- npm 10+

## Quick Start

```bash
git clone https://github.com/hatmanstack/credentials-canvas.git
cd credentials-canvas
npm install

# Download model
# Get from: https://production.dld9ll6ojjns2.amplifyapp.com/compressed_model.glb
# Place in: frontend/public/compressed_model.glb

npm run dev
```

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run test       # Run tests
npm run lint       # Run ESLint
npm run check      # Lint + tests
```

## Documentation

See [docs/README.md](docs/README.md) for full documentation including:
- Architecture overview
- Development guide
- Testing patterns
- Styling conventions

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Special Thanks

Thanks to [freepacman.org](https://freepacman.org) for their site contribution featured as an interactive iframe.
