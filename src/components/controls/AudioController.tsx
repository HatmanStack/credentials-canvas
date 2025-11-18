/**
 * Audio Controller Component
 *
 * Manages sound effects for user interactions like clicks and theme-specific audio.
 */

import { useEffect } from 'react';
import useSound from 'use-sound';
import { useInteraction, useUI } from 'contexts';
import buttonClickSound from '../../assets/click.mp3';
import segaSound from '../../assets/sega.mp3';

/**
 * Audio controller component
 */
export function AudioController(): null {
  const { clickLight, clickPoint } = useInteraction();
  const { selectedVibe } = useUI();
  const [playButtonClick] = useSound(buttonClickSound, { volume: 0.25 });
  const [playSegaSound] = useSound(segaSound, { volume: 1 });

  // Play click sound when light is clicked
  useEffect(() => {
    if (clickLight) {
      playButtonClick();
    }
  }, [clickLight, playButtonClick]);

  // Play sounds for interactive element clicks
  useEffect(() => {
    if (
      clickPoint &&
      clickPoint !== 'Light_Control_Box' &&
      clickPoint !== 'Music_Control_Box'
    ) {
      playButtonClick();
    }
    // Play special sound for urban theme cube
    if (selectedVibe?.id === '0' && clickPoint === 'Cube009_2') {
      playSegaSound();
    }
  }, [clickPoint, selectedVibe, playButtonClick, playSegaSound]);

  return null;
}
