import type { CameraPositionTuple } from '@/types';

export interface PointLightPositionConfiguration {
  position: CameraPositionTuple;
  signName: string[];
  sliderName?: string;
}

export interface VibeLightColorConfiguration {
  lightColor1: string;
  lightColor2: string;
  lightColor3: string;
}

export const LIGHT_COLOR_WHEEL: string[] = [
  '#FFD700', '#FDFD96', '#FFFF00', '#FFFFE0', '#FFFACD', '#FAFAD2', '#FFEFD5', '#FFE4B5', '#FFDAB9', '#EEE8AA',
  '#F0E68C', '#BDB76B', '#E6E6FA', '#D8BFD8', '#DDA0DD', '#EE82EE', '#FF00FF', '#DA70D6', '#FFC0CB', '#FFB6C1',
  '#FF69B4', '#FF1493', '#C71585', '#DB7093', '#FFA07A', '#FA8072', '#F08080', '#CD5C5C', '#DC143C', '#B22222',
  '#8B0000', '#FF0000', '#FF4500', '#FF6347', '#FF7F50', '#FF8C00', '#FFA500', '#FFD700', '#FFFF00', '#FFFFE0',
  '#FFFACD', '#FAFAD2', '#FFEFD5', '#FFE4B5', '#FFDAB9', '#EEE8AA', '#F0E68C', '#BDB76B', '#E6E6FA', '#D8BFD8',
  '#DDA0DD', '#EE82EE', '#FF00FF', '#DA70D6', '#FFC0CB', '#FFB6C1', '#FF69B4', '#FF1493', '#C71585', '#DB7093',
  '#FFA07A', '#FA8072', '#F08080', '#CD5C5C', '#DC143C', '#B22222', '#8B0000', '#FF0000', '#FF4500', '#FF6347',
  '#FF7F50', '#FF8C00', '#FFA500',
];

export const LIGHT_INTENSITY_INITIAL_VALUE: number = 30;

// Slider input range bounds for intensity normalization
export const SLIDER_INPUT_MIN_VALUE: number = 0.503;
export const SLIDER_INPUT_MAX_VALUE: number = 0.563;
export const SLIDER_INPUT_RANGE: number = SLIDER_INPUT_MAX_VALUE - SLIDER_INPUT_MIN_VALUE;

export const POINT_LIGHT_POSITION_CONFIGURATIONS: PointLightPositionConfiguration[] = [
  { position: [10.5, 2.8, 9.35], signName: ['lamppost'] },
  {
    position: [6.07, 0.57, 0.6],
    signName: ['small_right', 'Button_Light_6'],
    sliderName: 'Slider_6',
  },
  {
    position: [4.43, 0.57, 0.6],
    signName: ['small_middle_right', 'Button_Light_5'],
    sliderName: 'Slider_5',
  },
  {
    position: [1.36, 0.57, 1.25],
    signName: ['small_middle_left', 'Button_Light_4'],
    sliderName: 'Slider_4',
  },
  {
    position: [-1.26, 0.57, 1.25],
    signName: ['small_left', 'Button_Light_3'],
    sliderName: 'Slider_3',
  },
  {
    position: [-2, 0.57, 1.22],
    signName: ['lamp_back', 'Button_Light_2'],
    sliderName: 'Slider_2',
  },
  {
    position: [-2.1, 0.57, 5.05],
    signName: ['lamp_front', 'Button_Light_1'],
    sliderName: 'Slider_1',
  },
];

export const THEME_TO_LIGHT_COLOR_CONFIGURATION_ARRAY: VibeLightColorConfiguration[] = [
  { lightColor1: '#B68672', lightColor2: '#9E9149', lightColor3: '#E96929' },
  { lightColor1: '#869582', lightColor2: '#72979D', lightColor3: '#80C080' },
  { lightColor1: '#8F909D', lightColor2: '#A28A9B', lightColor3: '#f59b9b' },
  { lightColor1: '#BA827F', lightColor2: '#B38A3C', lightColor3: '#7a87cc' },
];
