/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import { useEffect } from "react";

import useSound from "use-sound";
import buttonClickSound from "../assets/click.mp3";
import segaSound from "../assets/sega.mp3";

export function Sounds({ vibe, clickLight, clickCount, clickPoint }) {
  const [playActive] = useSound(buttonClickSound, { volume: 0.25 });
  const [playSega] = useSound(segaSound, { volume: 1 });

  useEffect(() => {
    playActive();
  }, [clickLight, clickCount]);

  useEffect(() => {
    if (
      clickPoint &&
      clickPoint !== "Light_Control_Box" &&
      clickPoint !== "Music_Control_Box"
    ) {
      playActive();
    }
    if (vibe == 0 && clickPoint == "Cube009_2") {
      playSega();
    }
  }, [clickPoint]);

  return null;
}
