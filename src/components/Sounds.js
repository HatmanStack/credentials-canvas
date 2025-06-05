/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import { useEffect } from "react";
import useSound from "use-sound";
import { useInteraction, useUI } from "../contexts";
import buttonClickSound from "../assets/click.mp3";
import segaSound from "../assets/sega.mp3";

export function Sounds() {
  const { clickLight, clickCount, clickPoint } = useInteraction();
  const { selectedVibe } = useUI();
  const [playButtonClick] = useSound(buttonClickSound, { volume: 0.25 });
  const [playSegaSound] = useSound(segaSound, { volume: 1});

  useEffect(() => {
    if (clickLight) {
      playButtonClick();
    }
  }, [clickLight, playButtonClick]);

  useEffect(() => {
    if (
      clickPoint &&
      clickPoint !== "Light_Control_Box" &&
      clickPoint !== "Music_Control_Box"
    ) {
      playButtonClick();
    }
    if (selectedVibe === "0" && clickPoint === "Cube009_2") {
      playSegaSound();
    }
  }, [clickPoint, selectedVibe, playButtonClick, playSegaSound]);

  return null;
}
