/**
 * Animation and UI element configuration data
 */

import type { CameraPositionTuple } from '@/types';

/**
 * Vibe-specific iframe URL configuration
 */
export interface VibeIframeURLConfiguration {
  iframe1: string;
  iframe2: string;
  srcID: string;
}

/**
 * Interactive slider mesh names
 */
export const INTERACTIVE_SLIDER_MESH_NAMES: string[] = [
  'Slider_4',
];

/**
 * Instruction text mesh names
 */
export const INSTRUCTION_TEXT_MESH_NAMES: string[] = [
  'text_navigate',
  'text_rotate',
  'text_scroll',
  'text_middle',
  'text_click',
];

/**
 * Theme-specific iframe URL configurations
 * Index corresponds to theme ID (0: urban, 1: rural, 2: classy, 3: chill)
 */
export const THEME_IFRAME_URL_CONFIGURATIONS: VibeIframeURLConfiguration[] = [
  {
    iframe1: 'https://freepacman.org/',
    iframe2:
      'https://www.youtube.com/embed/pCx5Std7mCo?enablejsapi=1&autoplay=1&loop=1&mute=0',
    srcID: 'pCx5Std7mCo',
  },
  {
    iframe1: 'https://freepacman.org/',
    iframe2:
      'https://www.youtube.com/embed/A3svABDnmio?enablejsapi=1&autoplay=1&loop=1&mute=0',
    srcID: 'A3svABDnmio',
  },
  {
    iframe1: 'https://freepacman.org/',
    iframe2:
      'https://www.youtube.com/embed/JvNQLJ1_HQ0?enablejsapi=1&autoplay=1&loop=1&mute=0',
    srcID: 'JvNQLJ1_HQ0',
  },
  {
    iframe1: 'https://freepacman.org/',
    iframe2:
      'https://www.youtube.com/embed/6HbrymTIbyg?enablejsapi=1&autoplay=1&loop=1&mute=0',
    srcID: '6HbrymTIbyg',
  },
];

/**
 * Phone text node mesh names
 */
export const PHONE_TEXT_NODE_MESH_NAMES: string[] = [
  'Phone_Looper_Text',
  'Phone_Vocabulary_Text',
  'Phone_Italian_Text',
  'Phone_Trachtenberg_Text',
  'Phone_Movies_Text',
  'Phone_Stocks_Text',
];

/**
 * Phone mesh names (main phone objects)
 */
export const PHONE_MESH_NAMES: string[] = [
  'Phone_Looper_5',
  'Phone_Vocabulary_5',
  'Phone_Italian_5',
  'Phone_Trachtenberg_5',
  'Phone_Movies_5',
  'Phone_Stocks_5',
];

/**
 * Slider rotation values
 */
export const SLIDER_ROTATION_VALUES: CameraPositionTuple = [7.36, 0, 0];

/**
 * Slider scale values
 */
export const SLIDER_SCALE_VALUES: CameraPositionTuple = [0.4, 0.4, 0.4];

/**
 * Slider position array
 */
export const SLIDER_POSITION_ARRAY: CameraPositionTuple[] = [
  [0.9305, 0.538, 3.986],
];

/**
 * Text element position array
 */
export const TEXT_ELEMENT_POSITION_ARRAY: CameraPositionTuple[] = [
  [-0.668423, 0.008689, 4.06791],
  [5.53658, -0.1, 2.3211],
  [4.66377, -0.1, 2.61365],
  [0.71, 0.03, 3.79],
  [4.73, -0.1, 1.83],
  [0.77, 0.015, 4.1],
];

/**
 * Text element rotation array
 */
export const TEXT_ELEMENT_ROTATION_ARRAY: CameraPositionTuple[] = [
  [0, 44.7, 0],
  [0, 44.612, 0],
  [0, 44.145, 0],
  [0, -9.97, 0],
  [0, 35.17, 0],
  [0, 12.38, 0],
];
