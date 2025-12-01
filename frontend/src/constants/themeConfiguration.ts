import type {
  ThemeColorConfigurationMap,
  VibeThemeConfiguration,
  BreakpointConfiguration,
  AssetConfiguration
} from '@/types';
import handGif from '@/assets/hand.gif';
import volumeUp from '@/assets/volume_up.svg';
import volumeMute from '@/assets/volume_mute.svg';

export const THEME_COLOR_CONFIGURATION_MAP: ThemeColorConfigurationMap = {
  '0': { active: '#E96929', rest: '#B68672', title: 20 },
  '1': { active: '#80C080', rest: '#869582', title: 120 },
  '2': { active: '#EF5555', rest: '#f38484', title: 0 },
  '3': { active: '#9FA8DA', rest: '#8F909D', title: 235 },
  'default': { active: '#B68672', rest: '#E96929', title: 20 },
};

export const AVAILABLE_THEME_CONFIGURATIONS: VibeThemeConfiguration[] = [
  { id: '0', name: 'urban', color: '#E96929', displayName: 'URBAN', svgWidth: 280 },
  { id: '1', name: 'rural', color: '#80C080', displayName: 'RURAL', svgWidth: 275 },
  { id: '2', name: 'classy', color: '#EF5555', displayName: 'CLASSY', svgWidth: 320 },
  { id: '3', name: 'chill', color: '#9FA8DA', displayName: 'CHILL', svgWidth: 240 },
];

export const RESPONSIVE_BREAKPOINTS: BreakpointConfiguration = {
  mobile: 800,
  tablet: 1200,
};

export const ASSET_FILE_PATHS: AssetConfiguration = {
  handGif,
  volumeUp,
  volumeMute,
};
