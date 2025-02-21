<div align="center" style="display: block;margin-left: auto;margin-right: auto;width: 50%;">
<h1>Credentials Canvas</h1>

<div style="display: flex; justify-content: center; align-items: center;">
  <h4 style="margin: 0; display: flex;">
    <a href="https://www.apache.org/licenses/LICENSE-2.0.html">
      <img src="https://img.shields.io/badge/license-Apache%202.0-blue" alt="float is under the Apache 2.0 liscense" />
    </a>
    <a href="https://r3f.docs.pmnd.rs/getting-started/introduction">
      <img src="https://img.shields.io/badge/React%20Fiber-violet" alt="Expo Version" />
    </a>
    <a href="https://threejs.org/">
      <img src="https://img.shields.io/badge/Three.js-yellow" alt="Google Text-To-Speech" />
    </a>
    <a href="https://www.python.org/downloads/">
    <img src="https://img.shields.io/badge/Blender%204.3-green">
    </a>
  </h4>
</div>

  <p><b>3D Design Portfolio <br> <a href="https://cg-portfolio.com"> Credentials Canvas » </a> </b> </p>
  <h1 >
 <p align="center">
    <td><img src="https://github.com/HatmanStack/credentials-canvas/blob/main/public/ez.gif" alt="Image 1"></td></p>
     <p align="center">
    <td><img src="https://github.com/HatmanStack/credentials-canvas/blob/main/public/house.gif" alt="Image 1"></td></p>
</h1>
</div>

## Features
- Interactive 3D scenes and animations
- Custom artistic elements and immersive layout
- Portfolio display of professional and experimental projects

## Tech Stack
- Three.js for 3D rendering
- React Three Fiber for React integration
- Node.js backend

## Setup

1. Download the custom model:
- Get `.glb` file from [here](https://production.dld9ll6ojjns2.amplifyapp.com/compressed_model.glb)
- Update `filePath` in `Model.js` with absolute path

2. Installation:
```bash
git clone https://github.com/hatmanstack/credentials-camvas.git
cd credentials-camvas
npm install --global yarn
yarn
npm start
```

3. Model Optimization:
```bash
gltf-pipeline -i updated.glb -o compressed_model.glb --draco.compressionLevel=7 --keepUnusedElements --keepDefaultScene
```

**Prerequisites**: Node.js installation required

## License

This project is licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).
