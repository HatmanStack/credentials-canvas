import { useEffect } from 'react';
import useSound from 'use-sound';
import { useSceneInteractionStore, useUserInterfaceStore } from '@/stores';
import buttonClickSound from '@/assets/click.mp3';
import segaSound from '@/assets/sega.mp3';

export function AudioController(): null {
  const clickedLightName = useSceneInteractionStore(state => state.clickedLightName);
  const totalClickCount = useSceneInteractionStore(state => state.totalClickCount);
  const clickedMeshPosition = useSceneInteractionStore(state => state.clickedMeshPosition);

  const selectedThemeConfiguration = useUserInterfaceStore(state => state.selectedThemeConfiguration);

  const [playButtonClick] = useSound(buttonClickSound, { volume: 0.25 });
  const [playSegaSound] = useSound(segaSound, { volume: 1 });

  // totalClickCount is in the dep list alongside clickedLightName so that
  // repeat clicks on the same light (e.g. Button_Light_4 — the "change all
  // lights" button) keep replaying the click sound. Without the counter
  // dep, clicking the same button twice in a row leaves clickedLightName
  // unchanged, so this effect wouldn't re-run and the second+ clicks would
  // be silent. SceneEnvironment's color-randomizer effect has the same
  // pairing for the same reason — keep the two deps lists in sync.
  useEffect(() => {
    if (clickedLightName) {
      playButtonClick();
    }
  }, [clickedLightName, totalClickCount, playButtonClick]);

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
