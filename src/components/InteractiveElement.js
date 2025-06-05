import React from 'react';
import { useInteraction } from '../contexts';
import { urlMap, phoneUrls } from '../data/urls';
import { lightNames, closeUpClickThrough } from '../data/meshes';

export const InteractiveElement = ({ children, meshRef, ...props }) => {
  const { closeUp, setClickPoint, setClickLight, setClickCount } = useInteraction();

  const handleClick = (event) => {
    const signName = event.object.name;
    
    // Direct URL links (external sites)
    if (urlMap[signName]) {
      setClickCount((prevCount) => prevCount + 1);
      window.open(urlMap[signName], "_blank");
      return;
    }
    
    // Light controls
    if (lightNames.includes(signName)) {
      setClickLight(signName);
      setClickCount((prevCount) => prevCount + 1);
      return;
    }
    
    // Phone/interactive elements with camera positioning
    for (const phoneUrl of phoneUrls) {
      if (phoneUrl.signName.includes(signName)) {
        setClickPoint(signName);
        
        if (closeUp) {
          // Handle multiple clicks in close-up mode
          const currentCount = meshRef?.current?.userData?.clickCount || 0;
          const newCount = currentCount + 1;
          
          if (meshRef?.current) {
            meshRef.current.userData.clickCount = newCount;
          }
          
          if (newCount >= closeUpClickThrough && phoneUrl.url) {
            window.open(phoneUrl.url, "_blank");
          }
        }
        break;
      }
    }
  };

  return (
    <mesh ref={meshRef} onClick={handleClick} {...props}>
      {children}
    </mesh>
  );
};