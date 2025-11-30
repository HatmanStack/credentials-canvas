export type ThemeIdentifier = '0' | '1' | '2' | '3';

export type ThemeName = 'urban' | 'rural' | 'classy' | 'chill';

export interface ThemeColorConfiguration {
  active: string;
  rest: string;
  title: number;
}

export type ThemeColorConfigurationMap = Record<ThemeIdentifier | 'default', ThemeColorConfiguration>;

export interface VibeThemeConfiguration {
  id: ThemeIdentifier;
  name: ThemeName;
  color: string;
  displayName: string;
  svgWidth: number;
}

export interface LightIntensityConfiguration {
  sliderName: string;
  intensity: number;
}

export type MeshNameToURLMapping = Record<string, string>;

export interface AssetConfiguration {
  handGif: string;
  volumeUp: string;
  volumeMute: string;
}

export interface BreakpointConfiguration {
  mobile: number;
  tablet: number;
}
