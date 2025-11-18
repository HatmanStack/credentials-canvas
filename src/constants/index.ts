/**
 * Barrel exports for all configuration constants
 */

// Camera configuration
export {
  CAMERA_ROTATION_POSITION_ARRAY,
  CLOSE_UP_CAMERA_POSITION_ARRAY,
  CLOSE_UP_CAMERA_POSITION_ARRAY_SMALL_SCREEN,
  CLOSE_UP_CAMERA_ROTATION_ARRAY,
  MESH_NAME_TO_CAMERA_POSITION_INDEX_MAP,
  CAMERA_SCROLL_CONFIGURATION,
} from './cameraConfiguration';

// Lighting configuration
export {
  LIGHT_COLOR_WHEEL,
  LIGHT_INTENSITY_INITIAL_VALUE,
  POINT_LIGHT_POSITION_CONFIGURATIONS,
  THEME_TO_LIGHT_COLOR_CONFIGURATION_ARRAY,
} from './lightingConfiguration';

export type {
  PointLightPositionConfiguration,
  VibeLightColorConfiguration,
} from './lightingConfiguration';

// Mesh configuration
export {
  INTERACTIVE_LIGHT_MESH_NAMES,
  PHONE_VIDEO_CONFIGURATIONS,
  VIDEO_TEXTURE_MESH_NAMES,
  VIDEO_TEXTURE_FILE_PATHS,
  CLOSE_UP_CLICK_THRESHOLD_COUNT,
  GLTF_MODEL_FILE_PATH,
} from './meshConfiguration';

export type {
  PhoneVideoConfiguration,
} from './meshConfiguration';

// URL configuration
export {
  MESH_NAME_TO_URL_MAPPING,
  INTERACTIVE_PHONE_URL_CONFIGURATIONS,
} from './urlConfiguration';

export type {
  PhoneURLConfiguration,
} from './urlConfiguration';

// Animation configuration
export {
  INTERACTIVE_SLIDER_MESH_NAMES,
  INSTRUCTION_TEXT_MESH_NAMES,
  THEME_IFRAME_URL_CONFIGURATIONS,
  PHONE_TEXT_NODE_MESH_NAMES,
  PHONE_MESH_NAMES,
  SLIDER_ROTATION_VALUES,
  SLIDER_SCALE_VALUES,
  SLIDER_POSITION_ARRAY,
  TEXT_ELEMENT_POSITION_ARRAY,
  TEXT_ELEMENT_ROTATION_ARRAY,
} from './animationConfiguration';

export type {
  VibeIframeURLConfiguration,
} from './animationConfiguration';

// Theme configuration
export {
  THEME_COLOR_CONFIGURATION_MAP,
  AVAILABLE_THEME_CONFIGURATIONS,
  RESPONSIVE_BREAKPOINTS,
  ASSET_FILE_PATHS,
} from './themeConfiguration';
