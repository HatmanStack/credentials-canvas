import { useEffect } from 'react';
import useSound from 'use-sound';
import { useSceneInteractionStore, useUserInterfaceStore } from '@/stores';
import buttonClickSound from '@/assets/click.mp3';
import segaSound from '@/assets/sega.mp3';

export function AudioController(): null {
  const clickedLightName = useSceneInteractionStore(state => state.clickedLightName);
  const clickedMeshPosition = useSceneInteractionStore(state => state.clickedMeshPosition);

  const selectedThemeConfiguration = useUserInterfaceStore(state => state.selectedThemeConfiguration);

  const [playButtonClick] = useSound(buttonClickSound, { volume: 0.25 });
  const [playSegaSound] = useSound(segaSound, { volume: 1 });

  useEffect(() => {
    if (clickedLightName) {
      playButtonClick();
    }
  }, [clickedLightName, playButtonClick]);

  useEffect(() => {
    if (
      clickedMeshPosition &&
      clickedMeshPosition !== 'Light_Control_Box' &&
      clickedMeshPosition !== 'Music_Control_Box'
    ) {
      playButtonClick();
    }
    if (selectedThemeConfiguration?.id === '0' && clickedMeshPosition === 'Cube009_2') {
      playSegaSound();
    }
  }, [clickedMeshPosition, selectedThemeConfiguration, playButtonClick, playSegaSound]);

  return null;
}
