import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type * as THREE from 'three';
import type { YouTubePlayer } from '@/types/youtubeTypes';

export interface ThreeJSSceneState {
  threeJSSceneModel: THREE.Group | THREE.Scene | null;
  htmlVideoPlayerElement: YouTubePlayer | null;

  setThreeJSSceneModel: (scene: THREE.Group | THREE.Scene | null) => void;
  setHTMLVideoPlayerElement: (player: YouTubePlayer | null) => void;
  resetThreeJSSceneState: () => void;
}

export const useThreeJSSceneStore = create<ThreeJSSceneState>()(
  devtools(
    set => ({
      threeJSSceneModel: null,
      htmlVideoPlayerElement: null,

      setThreeJSSceneModel: scene =>
        set({ threeJSSceneModel: scene }, false, 'setThreeJSSceneModel'),

      setHTMLVideoPlayerElement: player =>
        set({ htmlVideoPlayerElement: player }, false, 'setHTMLVideoPlayerElement'),

      resetThreeJSSceneState: () =>
        set(
          {
            threeJSSceneModel: null,
            htmlVideoPlayerElement: null,
          },
          false,
          'resetThreeJSSceneState'
        ),
    }),
    { name: 'ThreeJSSceneStore' }
  )
);
