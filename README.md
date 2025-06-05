<div align="center" style="display: block;margin-left: auto;margin-right: auto;width: 50%;">
<h1>Credentials Canvas</h1>

<div style="display: flex; justify-content: center; align-items: center;">
  <h4 style="margin: 0; display: flex;">
    <a href="https://www.apache.org/licenses/LICENSE-2.0.html">
      <img src="https://img.shields.io/badge/license-Apache%202.0-blue" alt="Apache 2.0 liscense" />
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

  <p><b>Interactive 3D Portfolio Experience<br> <a href="https://production.dld9ll6ojjns2.amplifyapp.com/"> Experience Credentials Canvas » </a> </b> </p>
  <h1 >
 <p align="center">
    <td><img src="https://github.com/HatmanStack/credentials-canvas/blob/main/public/ez.gif" alt="Interactive 3D Environment"></td></p>
     <p align="center">
    <td><img src="https://github.com/HatmanStack/credentials-canvas/blob/main/public/house.gif" alt="3D Scene Navigation"></td></p>
</h1>
</div>

## What is Credentials Canvas?

**Credentials Canvas** is an immersive 3D portfolio experience that showcases personal projects in an interactive virtual environment. Instead of a traditional portfolio website, visitors explore a fully realized 3D scene where each element tells a story and provides access to different projects and achievements.

### 🎮 Interactive Experience
- **Navigate** through a detailed 3D environment with smooth camera controls
- **Click** on various objects to discover projects, skills, and accomplishments  
- **Explore** different themed "vibes" that transform the lighting and atmosphere
- **Engage** with interactive elements like control panels, phones, and signposts

### 🏗️ 3D Environment Features
- **Dynamic Lighting System** - Interactive lights that respond to user clicks
- **Video Displays** - Phone screens showing project demos and presentations
- **Atmospheric Controls** - Multiple environment themes (Urban, Rural, Classy, Chill)
- **Particle Effects** - Visual enhancements that bring the scene to life
- **Sound Design** - Audio feedback for interactions and ambiance

### 📱 Project Showcase
The 3D environment serves as a unique portfolio platform featuring:
- **Web Applications** - Interactive demos accessible through in-scene displays
- **Technical Projects** - Links to GitHub repositories and live deployments
- **Professional Links** - Direct access to LinkedIn, articles, and contact information
- **Skills Demonstration** - 3D modeling, web development, and interactive design capabilities

### 🎨 Creative Approach
Rather than listing projects in a traditional format, Credentials Canvas presents them as part of a cohesive 3D narrative where:
- Each interactive element has purpose and meaning
- Projects are contextualized within a virtual space
- The portfolio itself demonstrates technical and artistic skills
- Visitors have a memorable, engaging experience

## Tech Stack
- Three.js for 3D rendering
- React Three Fiber for React integration
- Node.js backend

## Setup
1. Installation:
```bash
git clone https://github.com/hatmanstack/credentials-camvas.git
cd credentials-camvas
npm install --global yarn
yarn
npm start
```

2. Download the custom model:
- Get `.glb` file from [here](https://production.dld9ll6ojjns2.amplifyapp.com/compressed_model.glb)
- Place in public folder

## Model Optimization (if altering in Blender):
```bash
gltf-pipeline -i updated.glb -o compressed_model.glb --draco.compressionLevel=7 --keepUnusedElements --keepDefaultScene
```

## Special Thanks  
A big thank you to [freepacman.org](https://freepacman.org) for their site contribution, which is featured as an interactive iframe within this portfolio.

## License

This project is licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).
