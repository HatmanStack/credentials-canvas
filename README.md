# Credentials Canvas

A site written in React to showcase work from recent projects in 3D design with relevant links and art.  You can see the project [here](https://cg-portfolio.site/).

 <p align="center">
    <td><img src="https://github.com/HatmanStack/credentials-canvas/blob/main/public/ez.gif" alt="Image 1"></td></p>
     <p align="center">
    <td><img src="https://github.com/HatmanStack/credentials-canvas/blob/main/public/house.gif" alt="Image 1"></td></p>

## Features

    - Showcases work and side projects from Gemenie Labs
    - Custom art and layout with threejs as a driver
    - Interactive features throughout site

## Technology

    - Threejs
    - React Fiber
    - Node
    
## Getting Started

    - Working Node install

Download the custom .glb from [here](https://production.dld9ll6ojjns2.amplifyapp.com/compressed_model.glb) and include it's absolute path in Model.js in filePath
    
```
git clone https://github.com/hatmanstack/credentials-camvas.git
cd credentials-camvas
npm install --global yarn
yarn
npm start
```

    - ReEncode with Draco

```
gltf-pipeline -i updated.glb -o compressed_model.glb --draco.compressionLevel=7 --keepUnusedElements --keepDefaultScene
```

## License

This project is licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).
