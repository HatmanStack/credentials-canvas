/**
 * Branded types for domain-specific type safety
 *
 * Branded types add compile-time safety by making structurally-identical
 * types incompatible. This prevents mixing up values like camera positions
 * and rotation arrays, or passing arbitrary strings where theme IDs are expected.
 */

declare const __brand: unique symbol;
type Brand<T, B> = T & { [__brand]: B };

// Camera position as 3D coordinate tuple
export type CameraPosition = Brand<[number, number, number], 'CameraPosition'>;

// Theme identifiers are constrained to valid values
export type ThemeId = '0' | '1' | '2' | '3';

// HSL hue values must be in valid range
export type HueValue = Brand<number, 'HueValue'>;

// Interactive mesh names for type-safe mesh identification
export type InteractiveMeshName = Brand<string, 'InteractiveMeshName'>;

/**
 * Create a type-safe camera position tuple
 */
export function createCameraPosition(x: number, y: number, z: number): CameraPosition {
  return [x, y, z] as CameraPosition;
}

/**
 * Create a type-safe HSL hue value (0-360)
 * @throws {RangeError} if value is outside valid range
 */
export function createHueValue(value: number): HueValue {
  if (value < 0 || value > 360) {
    throw new RangeError(`Hue must be 0-360, got ${value}`);
  }
  return value as HueValue;
}

/**
 * Type guard to check if a string is a valid ThemeId
 */
export function isThemeId(value: string): value is ThemeId {
  return value === '0' || value === '1' || value === '2' || value === '3';
}

/**
 * Create a type-safe interactive mesh name
 */
export function createInteractiveMeshName(name: string): InteractiveMeshName {
  return name as InteractiveMeshName;
}
