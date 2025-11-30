/**
 * Component-related type definitions
 */

/**
 * Theme/Vibe identifier union type
 */
export type ThemeIdentifier = '0' | '1' | '2' | '3';

/**
 * Theme name union type
 */
export type ThemeName = 'urban' | 'rural' | 'classy' | 'chill';

/**
 * Theme color configuration
 */
export interface ThemeColorConfiguration {
  active: string;
  rest: string;
  title: number;
}

/**
 * Color map configuration for all themes
 */
export type ThemeColorConfigurationMap = Record<ThemeIdentifier | 'default', ThemeColorConfiguration>;

/**
 * Vibe theme display configuration
 */
export interface VibeThemeConfiguration {
  id: ThemeIdentifier;
  name: ThemeName;
  color: string;
  displayName: string;
  svgWidth: number;
}

/**
 * Light intensity configuration for sliders
 */
export interface LightIntensityConfiguration {
  sliderName: string;
  intensity: number;
}

/**
 * URL mapping for interactive elements
 */
export type MeshNameToURLMapping = Record<string, string>;

/**
 * Asset imports configuration
 */
export interface AssetConfiguration {
  handGif: string;
  volumeUp: string;
  volumeMute: string;
}

/**
 * Responsive breakpoint configuration
 */
export interface BreakpointConfiguration {
  mobile: number;
  tablet: number;
}
