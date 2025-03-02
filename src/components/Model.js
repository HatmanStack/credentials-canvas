/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: "js" });
dracoLoader.setDecoderPath(process.env.PUBLIC_URL + "/draco/javascript/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const urlMap = {
  text_name: "https://www.gemenielabs.com/contact/",
  Sign_About: "https://www.gemenielabs.com/contact/",
  Sign_Articles: "https://medium.com/@HatmanStack",
  Sign_Github: "https://github.com/HatmanStack",
  Sign_HuggingFace: "https://huggingface.co/Hatman",
  Sign_Privacy: "https://www.gemenielabs.com/app-privacy-policy/",
  Sign_Old: "https://www.gemenielabs.com/projects",
  logo_writersalmanac: "https://d6d8ny9p8jhyg.cloudfront.net/",
  logo_nba: "https://hatmanstack-streamlit-nba-app-dz3nxx.streamlit.app",
  logo_hf: "https://hatman-instantstyle-flux-sdxl.hf.space/",
  logo_google_forms:
    "https://docs.google.com/forms/d/e/1FAIpQLSce94QihTjunjBvYzFdalz0mYGhVS6Ngy17uRrXkqLI_Da7nA/viewform",
  logo_float: "https://float-app.fun/",
  logo_pixel_prompt: "https://production.d2iujulgl0aoba.amplifyapp.com/",
  logo_nova_canvas: "https://huggingface.co/spaces/Hatman/AWS-Nova-Canvas",
  logo_savor_swipe:"https://savorswipe.fun/",
  Sign_Portfolio: "https://www.cg-portfolio.com",
};

const phoneUrls = [
  {
    signName: ["Phone_Stocks_5", "Phone_Stocks_Text"],
    url: "https://www.gemenielabs.com/#stocks",
  },
  {
    signName: ["Phone_Vocabulary_5", "Phone_Vocabulary_Text"],
    url: "https://www.gemenielabs.com/#vocabulary",
  },
  {
    signName: ["Phone_Movies_5", "Phone_Movies_Text"],
    url: "https://www.gemenielabs.com/#movies",
  },
  {
    signName: ["Phone_Trachtenberg_5", "Phone_Trachtenberg_Text"],
    url: "https://www.gemenielabs.com/#trachtenberg",
  },
  {
    signName: ["Phone_Italian_5", "Phone_Italian_Text"],
    url: "https://www.gemenielabs.com/#italian",
  },
  {
    signName: ["Phone_Looper_5", "Phone_Looper_Text"],
    url: "https://www.gemenielabs.com/#looper",
  },
  { signName: ["Cube009_2"], url: "" },
  {
    signName: ["Music_Control_Box", "Light_Control_Box"],
    url: "https://www.google.com",
  },
];

const lightNames = [
  "small_middle_left",
  "small_middle_right",
  "lamppost",
  "lamp_back",
  "lamp_front",
  "small_right",
  "small_left",
  "Button_Light_1",
  "Button_Light_2",
  "Button_Light_3",
  "Button_Light_4",
  "Button_Light_5",
  "Button_Light_6",
  "Button_Light_7",
  "Button_Music_Back",
  "Button_Music_Forward",
  "Button_Music_Pause",
];

const meshNames = [
  "Phone_Vocabulary_5",
  "Phone_Movies_5",
  "Phone_Looper_5",
  "Phone_Trachtenberg_5",
  "Phone_Italian_5",
  "Phone_Stocks_5",
];

const videoPaths = [
  require("../assets/Vocabulary.mp4"),
  require("../assets/Movies.mp4"),
  require("../assets/Looper.mp4"),
  require("../assets/Trachtenberg.mp4"),
  require("../assets/Italian.mp4"),
  require("../assets/Stocks.mp4"),
];

function useGLTFLoaderWithDRACO(path) {
  const { scene } = useThree();
  
  // Use the pre-configured loader
  const gltf = useGLTF(path, gltfLoader);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Only dispose of the specific model's resources
      if (gltf) {
        gltf.scenes?.forEach(scene => scene.traverse(object => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) object.material.dispose();
        }));
      }
    };
  }, [gltf]);

  return gltf;
}

export default function Model({
  graphics,
  setClickPoint,
  setClickLight,
  setClickCount,
  setGLTF,
  closeUp,
}) {
  const [count, setCount] = useState(true);
  
  const filePath = process.env.PUBLIC_URL + "compressed_model.glb";
  
  const gltf = useGLTFLoaderWithDRACO(filePath);

  const videoRefs = meshNames.reduce((acc, name) => {
    acc[name] = React.useRef();
    return acc;
  }, {});

  useEffect(() => {
    
    if (gltf) {
      if (!graphics) {
        
        gltf.scene.traverse((node) => {
          const interactiveNodes = [];
          if (node) {
            for (let i = 0; i < meshNames.length; i++) {
              if (node.isMesh && node.name === meshNames[i]) {
                const video = (videoRefs[meshNames[i]].current =
                  document.createElement("video"));
                video.src = videoPaths[i];
                video.loop = true;
                video.muted = true;
                video.stop = true;
                video.play();

                const videoTexture = new THREE.VideoTexture(video);
                videoTexture.wrapS = THREE.RepeatWrapping;
                videoTexture.repeat.x = -1;
                node.material.map = videoTexture;
                node.material.needsUpdate = true;
              }
              if (node.name == "Base") {
                const circle = node.children.find(
                  (child) => child.name === "Circle_1"
                );
                if (circle) {
                  const material = circle.material;
                  if (material && material.name === "Glass1.002") {
                    material.transparent = true;
                  }
                }
              }
            }
          }
        
        });
      }
      setGLTF(gltf);
    }
  }, [gltf]);

  const handleClick = (event) => {
    const signName = event.object.name;
    
    if (urlMap[signName]) {
      setClickCount((prevCount) => prevCount + 1);
      window.open(urlMap[signName], "_blank");
    } else if (lightNames.includes(signName)) {
      setClickLight(signName);
      setClickCount((prevCount) => prevCount + 1);
    } else {
      for (const phoneUrl of phoneUrls) {
        if (phoneUrl.signName.includes(signName)) {
          setClickPoint(signName);
          if (closeUp) {
            setCount((prevCount) => prevCount + 1);
            if (
              count >= closeUpClickThrough &&
              !phoneUrl.signName.includes("Music_Control_Box") &&
              !phoneUrl.signName.includes("Cube009_4")
            ) {
              window.open(phoneUrl.url, "_blank");
              setCount(0);
            }
          }
          break;
        }
      }
    }
  };

  return (
    <>
      <primitive
        onClick={handleClick}
        // eslint-disable-next-line react/no-unknown-property
        object={gltf.scene}
      />
    </>
  );
}

const closeUpClickThrough = 2; // How many times to click before opening the link


