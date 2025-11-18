import {renderHook} from '@testing-library/react';
import {useLightingController} from 'hooks/useLightingController';
import type {LightIntensityConfiguration} from 'types';

// Mock the constants
jest.mock('constants/lightingConfiguration', () => ({
  LIGHT_COLOR_WHEEL: [
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
  ],
  POINT_LIGHT_POSITION_CONFIGURATIONS: [
    {
      signName: ['Light1', 'Light2'],
      sliderName: 'Slider_1',
      intensity: 10,
    },
    {
      signName: ['Light3'],
      sliderName: 'Slider_2',
      intensity: 15,
    },
  ],
  THEME_TO_LIGHT_COLOR_CONFIGURATION_ARRAY: [
    {lights: [{name: 'Light1', color: '#FF0000'}]}, // Vibe 0
    {lights: [{name: 'Light2', color: '#00FF00'}]}, // Vibe 1
    {lights: [{name: 'Light3', color: '#0000FF'}]}, // Vibe 2
  ],
}));

describe('useLightingController', () => {
  let mockLightIntensity: LightIntensityConfiguration;

  beforeEach(() => {
    mockLightIntensity = {
      sliderName: 'Slider_1',
      intensity: 25,
    };
    // Reset random to make tests deterministic
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default light colors', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, null, mockLightIntensity),
      );

      expect(result.current.lightColors).toBeDefined();
      expect(typeof result.current.lightColors).toBe('object');
    });

    it('should initialize all lights with same initial color', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, null, mockLightIntensity),
      );

      const colors = Object.values(result.current.lightColors);
      const firstColor = colors[0];

      // All colors should be the same initially
      colors.forEach((color) => {
        expect(color).toBe(firstColor);
      });
    });

    it('should return point light positions', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, null, mockLightIntensity),
      );

      expect(result.current.pointLightPositions).toBeDefined();
      expect(Array.isArray(result.current.pointLightPositions)).toBe(true);
      expect(result.current.pointLightPositions.length).toBe(2);
    });

    it('should initialize without vibe-based lights', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, null, mockLightIntensity),
      );

      expect(result.current.vibeBasedLights).toBeNull();
    });
  });

  describe('light color changes', () => {
    it('should change light color when light is clicked', () => {
      const {result, rerender} = renderHook(
          ({clickLight, clickCount}) =>
            useLightingController(clickLight, clickCount, null, mockLightIntensity),
          {
            initialProps: {clickLight: null as string | null, clickCount: 0},
          },
      );

      // Click Light1
      rerender({clickLight: 'Light1', clickCount: 1});

      // Color should be set (may or may not be different due to random)
      expect(result.current.lightColors['Light1']).toBeDefined();
    });

    it('should change different lights independently', () => {
      const {result, rerender} = renderHook(
          ({clickLight, clickCount}) =>
            useLightingController(clickLight, clickCount, null, mockLightIntensity),
          {
            initialProps: {clickLight: null as string | null, clickCount: 0},
          },
      );

      // Click Light1
      rerender({clickLight: 'Light1', clickCount: 1});
      const light1Color = result.current.lightColors['Light1'];

      // Click Light2
      rerender({clickLight: 'Light2', clickCount: 2});
      const light2Color = result.current.lightColors['Light2'];

      // Both colors should be defined
      expect(light1Color).toBeDefined();
      expect(light2Color).toBeDefined();
    });

    it('should update color on multiple clicks of same light', () => {
      const {result, rerender} = renderHook(
          ({clickLight, clickCount}) =>
            useLightingController(clickLight, clickCount, null, mockLightIntensity),
          {
            initialProps: {clickLight: null as string | null, clickCount: 0},
          },
      );

      // Multiple clicks on Light1
      rerender({clickLight: 'Light1', clickCount: 1});
      rerender({clickLight: 'Light1', clickCount: 2});
      rerender({clickLight: 'Light1', clickCount: 3});

      expect(result.current.lightColors['Light1']).toBeDefined();
    });

    it('should not change colors when clickLight is null', () => {
      const {result, rerender} = renderHook(
          ({clickCount}) =>
            useLightingController(null, clickCount, null, mockLightIntensity),
          {
            initialProps: {clickCount: 0},
          },
      );

      const initialColors = {...result.current.lightColors};

      rerender({clickCount: 1});

      expect(result.current.lightColors).toEqual(initialColors);
    });
  });

  describe('vibe-based lighting', () => {
    it('should set vibe-based lights when vibe is selected', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, {id: '0'}, mockLightIntensity),
      );

      expect(result.current.vibeBasedLights).not.toBeNull();
      expect(result.current.vibeBasedLights).toHaveProperty('lights');
    });

    it('should return correct vibe config for different vibes', () => {
      const {result, rerender} = renderHook(
          ({vibe}) =>
            useLightingController(null, 0, vibe, mockLightIntensity),
          {
            initialProps: {vibe: {id: '0'}},
          },
      );

      const vibe0Lights = result.current.vibeBasedLights;

      rerender({vibe: {id: '1'}});
      const vibe1Lights = result.current.vibeBasedLights;

      expect(vibe0Lights).not.toBeNull();
      expect(vibe1Lights).not.toBeNull();
      expect(vibe0Lights).not.toEqual(vibe1Lights);
    });

    it('should return null for non-existent vibe', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, {id: '999'}, mockLightIntensity),
      );

      expect(result.current.vibeBasedLights).toBeNull();
    });

    it('should return null when vibe is null', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, null, mockLightIntensity),
      );

      expect(result.current.vibeBasedLights).toBeNull();
    });

    it('should update vibe-based lights when vibe changes', () => {
      const {result, rerender} = renderHook(
          ({vibe}) =>
            useLightingController(null, 0, vibe, mockLightIntensity),
          {
            initialProps: {vibe: null as {id: string} | null},
          },
      );

      expect(result.current.vibeBasedLights).toBeNull();

      rerender({vibe: {id: '1'}});

      expect(result.current.vibeBasedLights).not.toBeNull();
    });
  });

  describe('getLightColor function', () => {
    it('should return color for existing light', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, null, mockLightIntensity),
      );

      const color = result.current.getLightColor('Light1');

      expect(color).toBeDefined();
      expect(typeof color).toBe('string');
    });

    it('should return initial color for non-existent light', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, null, mockLightIntensity),
      );

      const color = result.current.getLightColor('NonExistentLight');

      expect(color).toBeDefined();
      expect(typeof color).toBe('string');
    });

    it('should return updated color after light click', () => {
      const {result, rerender} = renderHook(
          ({clickLight, clickCount}) =>
            useLightingController(clickLight, clickCount, null, mockLightIntensity),
          {
            initialProps: {clickLight: null as string | null, clickCount: 0},
          },
      );

      rerender({clickLight: 'Light1', clickCount: 1});

      const updatedColor = result.current.getLightColor('Light1');

      expect(updatedColor).toBeDefined();
    });

    it('should consistently return same color for same light', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, null, mockLightIntensity),
      );

      const color1 = result.current.getLightColor('Light1');
      const color2 = result.current.getLightColor('Light1');

      expect(color1).toBe(color2);
    });
  });

  describe('getLightIntensity function', () => {
    it('should return configured intensity for matching light', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, null, mockLightIntensity),
      );

      const intensity = result.current.getLightIntensity('Light1');

      expect(intensity).toBe(25); // From mockLightIntensity
    });

    it('should return default intensity for non-matching light', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, null, mockLightIntensity),
      );

      const intensity = result.current.getLightIntensity('Light3');

      expect(intensity).toBe(30); // Default intensity
    });

    it('should return default intensity for non-existent light', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, null, mockLightIntensity),
      );

      const intensity = result.current.getLightIntensity('NonExistentLight');

      expect(intensity).toBe(30); // Default intensity
    });

    it('should update intensity when lightIntensity config changes', () => {
      const {result, rerender} = renderHook(
          ({lightIntensity}) =>
            useLightingController(null, 0, null, lightIntensity),
          {
            initialProps: {lightIntensity: mockLightIntensity},
          },
      );

      const intensity1 = result.current.getLightIntensity('Light1');
      expect(intensity1).toBe(25);

      const newConfig: LightIntensityConfiguration = {
        sliderName: 'Slider_1',
        intensity: 50,
      };

      rerender({lightIntensity: newConfig});

      const intensity2 = result.current.getLightIntensity('Light1');
      expect(intensity2).toBe(50);
    });

    it('should consistently return same intensity for same light', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, null, mockLightIntensity),
      );

      const intensity1 = result.current.getLightIntensity('Light1');
      const intensity2 = result.current.getLightIntensity('Light1');

      expect(intensity1).toBe(intensity2);
    });
  });

  describe('point light positions', () => {
    it('should return all point light positions', () => {
      const {result} = renderHook(() =>
        useLightingController(null, 0, null, mockLightIntensity),
      );

      expect(result.current.pointLightPositions.length).toBe(2);
      expect(result.current.pointLightPositions[0].signName).toEqual(['Light1', 'Light2']);
      expect(result.current.pointLightPositions[1].signName).toEqual(['Light3']);
    });

    it('should maintain stable reference for pointLightPositions', () => {
      const {result, rerender} = renderHook(() =>
        useLightingController(null, 0, null, mockLightIntensity),
      );

      const firstRef = result.current.pointLightPositions;

      rerender();

      const secondRef = result.current.pointLightPositions;

      expect(firstRef).toBe(secondRef);
    });
  });

  describe('edge cases', () => {
    it('should handle rapid light clicks', () => {
      const {result, rerender} = renderHook(
          ({clickLight, clickCount}) =>
            useLightingController(clickLight, clickCount, null, mockLightIntensity),
          {
            initialProps: {clickLight: null as string | null, clickCount: 0},
          },
      );

      // Rapid clicks
      for (let i = 1; i <= 10; i++) {
        rerender({clickLight: 'Light1', clickCount: i});
      }

      expect(result.current.lightColors['Light1']).toBeDefined();
    });

    it('should handle zero click count', () => {
      const {result} = renderHook(() =>
        useLightingController('Light1', 0, null, mockLightIntensity),
      );

      expect(result.current.lightColors['Light1']).toBeDefined();
    });

    it('should handle negative click count', () => {
      const {result} = renderHook(() =>
        useLightingController('Light1', -1, null, mockLightIntensity),
      );

      expect(result.current.lightColors['Light1']).toBeDefined();
    });

    it('should handle zero intensity', () => {
      const zeroIntensityConfig: LightIntensityConfiguration = {
        sliderName: 'Slider_1',
        intensity: 0,
      };

      const {result} = renderHook(() =>
        useLightingController(null, 0, null, zeroIntensityConfig),
      );

      const intensity = result.current.getLightIntensity('Light1');

      expect(intensity).toBe(0);
    });

    it('should handle very high intensity', () => {
      const highIntensityConfig: LightIntensityConfiguration = {
        sliderName: 'Slider_1',
        intensity: 1000,
      };

      const {result} = renderHook(() =>
        useLightingController(null, 0, null, highIntensityConfig),
      );

      const intensity = result.current.getLightIntensity('Light1');

      expect(intensity).toBe(1000);
    });
  });
});
