/**
 * Audio Controller Component
 *
 * Manages sound effects for user interactions like clicks and theme-specific audio.
 */

import { useEffect } from 'react';
import useSound from 'use-sound';
import { useSceneInteractionStore, useUserInterfaceStore } from 'stores';
import buttonClickSound from '../../assets/click.mp3';
import segaSound from '../../assets/sega.mp3';

/**
 * Audio controller component
 */
export function AudioController(): null {
  // Scene interaction store - selective subscriptions
  const clickedLightName = useSceneInteractionStore(state => state.clickedLightName);
  const clickedMeshPosition = useSceneInteractionStore(state => state.clickedMeshPosition);

  // User interface store - selective subscription
  const selectedThemeConfiguration = useUserInterfaceStore(state => state.selectedThemeConfiguration);

  const [playButtonClick] = useSound(buttonClickSound, { volume: 0.25 });
  const [playSegaSound] = useSound(segaSound, { volume: 1 });

  // Play click sound when light is clicked
  useEffect(() => {
    if (clickedLightName) {
      playButtonClick();
    }
  }, [clickedLightName, playButtonClick]);

  // Play sounds for interactive element clicks
  useEffect(() => {
    if (
      clickedMeshPosition &&
      clickedMeshPosition !== 'Light_Control_Box' &&
      clickedMeshPosition !== 'Music_Control_Box'
    ) {
      playButtonClick();
    }
    // Play special sound for urban theme cube
    if (selectedThemeConfiguration?.id === '0' && clickedMeshPosition === 'Cube009_2') {
      playSegaSound();
    }
  }, [clickedMeshPosition, selectedThemeConfiguration, playButtonClick, playSegaSound]);

  return null;
}
