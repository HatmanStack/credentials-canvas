import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ThreeJSSceneState } from '@/types/storeTypes';

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
