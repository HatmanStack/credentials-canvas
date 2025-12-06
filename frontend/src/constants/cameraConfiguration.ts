import type { CameraPositionTuple, CameraScrollConfiguration, MeshNameToPositionIndexMap } from '@/types';

export const CAMERA_ROTATION_POSITION_ARRAY: CameraPositionTuple[] = [
  [5.1, 0.1, 2],
  [1.3, 0.4, 3.9],
  [0.1, 0.6, 3.36],
  [-12.1, 5.8, -6.1],
  [0, 0, 0],
];

export const CLOSE_UP_CAMERA_POSITION_ARRAY: CameraPositionTuple[] = [
  [0, 0.5, 4.07],
  [-0.6, 0.3, 4.1],
  [5.4, 0.2, 2.34],
  [4.76, 0.2, 1.72],
  [0.5, 0.3, 3.6],
  [4.53, 0.2, 2.7],
  [1.8, 0.9, 3.62],
  [0.93, 0.68, 4.55],
  [0.6, 0.3, 4.2],
];

export const CLOSE_UP_CAMERA_POSITION_ARRAY_SMALL_SCREEN: CameraPositionTuple[] = [
  [0, 0.5, 4.07],
  [-0.6, 0.6, 4.1],
  [5.4, 0.5, 2.34],
  [4.76, 0.5, 1.72],
  [0.5, 0.6, 3.6],
  [4.53, 0.5, 2.7],
  [1.8, 0.9, 3.62],
  [0.93, 0.68, 4.55],
  [0.6, 0.3, 4.2],
];

export const NO_CLOSE_UP_INDEX = 9;

export const CLOSE_UP_CAMERA_ROTATION_ARRAY: CameraPositionTuple[] = [
  [-0.2, 0.3, 3.4],
  [-0.6, -1, 4.1],
  [5.4, -1, 2.34],
  [4.76, -1, 1.72],
  [0.5, -1, 3.6],
  [4.53, -0.1, 2.7],
  [1.5, 0.6, 3.62],
  [0.93, 0.53, 3.95],
  [0.6, -1, 4.2],
  [0, 0, 0],
];

export const MESH_NAME_TO_CAMERA_POSITION_INDEX_MAP: MeshNameToPositionIndexMap = {
  Phone_Stocks: 0,
  Phone_Looper_5: 1,
  Phone_Looper_Text: 1,
  Phone_Vocabulary_5: 2,
  Phone_Vocabulary_Text: 2,
  Phone_Movies_5: 3,
  Phone_Movies_Text: 3,
  Phone_Trachtenberg_5: 4,
  Phone_Trachtenberg_Text: 4,
  Phone_Italian_5: 5,
  Phone_Italian_Text: 5,
  Cube009_2: 6,
  Light_Control_Box: 7,
  Music_Control_Box: 7,
  Phone_Stocks_5: 8,
  Phone_Stocks_Text: 8,
};

export const CAMERA_SCROLL_CONFIGURATION: CameraScrollConfiguration = {
  desktop: 0.3,
  mobile: 0.8,
};

// Main camera positions for orbital navigation
export const MAIN_CAMERA_POSITIONS: {
  primary: CameraPositionTuple;
  alternate: CameraPositionTuple;
  positions: CameraPositionTuple[];
} = {
  primary: [1, 1, 13],
  alternate: [10, 1, 13],
  positions: [
    [4, 1, 2],
    [3, 1, 3.75],
    [0, 1, 6.5],
    [-12, 6, 0],
  ],
};

// Iframe visibility thresholds based on camera position
export const IFRAME_VISIBILITY_THRESHOLDS = {
  arcade: {
    minX: 1.78,
    minY: 0,
    minZ: 0.25,
  },
  music: {
    minY: 0,
    minZ: 4.3,
    maxY: 3,
    hideWhen: {
      minY: 1.2,
      minX: -1.5,
      maxZ: 5.2,
    },
  },
};
