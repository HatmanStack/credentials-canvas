/**
 * Theme Selection Option Component
 *
 * Displays a single theme option with its name and checkbox for selection.
 */

import React, { useCallback } from 'react';
import { CustomCheckbox } from './CustomCheckbox';
import {cn} from 'utils/classNameUtils';
import type { VibeThemeConfiguration } from 'types';

/**
 * Props for ThemeSelectionOption component
 */
export interface ThemeSelectionOptionProps {
  theme: VibeThemeConfiguration;
  selectedVibe: string | null;
  onVibeSelect: (vibeId: string) => void;
  textAnimationRef: React.RefObject<SVGSVGElement>;
}

/**
 * Theme selection option component
 */
export const ThemeSelectionOption: React.FC<ThemeSelectionOptionProps> = React.memo(({
  theme,
  selectedVibe,
  onVibeSelect,
  textAnimationRef
}) => {
  const handleClick = useCallback((): void => {
    onVibeSelect(theme.id);
  }, [theme.id, onVibeSelect]);

  return (
    <div className={cn(
      "flex flex-col justify-center items-center",
      "m-8"
    )}>
      <svg
        className={`text-stroke-${theme.name}`}
        ref={textAnimationRef}
        style={{ width: theme.svgWidth }}
      >
        <text y="50%" dy=".3em">
          {theme.displayName}
        </text>
      </svg>
      <CustomCheckbox
        color={theme.name}
        active={selectedVibe === theme.id}
        onClick={handleClick}
      />
    </div>
  );
});
