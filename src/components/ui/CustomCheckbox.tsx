/**
 * Custom Checkbox Component
 *
 * Animated checkbox component with theme-specific styling.
 * Preserves custom CSS animations from checkbox.css.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import type { ThemeName } from 'types';

/**
 * Props for CustomCheckbox component
 */
export interface CustomCheckboxProps {
  color: ThemeName;
  active: boolean;
  onClick: () => void;
}

/**
 * Custom checkbox component with animated toggle
 *
 * @example
 * <CustomCheckbox
 *   color="urban"
 *   active={isSelected}
 *   onClick={handleSelect}
 * />
 */
export const CustomCheckbox: React.FC<CustomCheckboxProps> = React.memo(({ color, active, onClick }) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const detectToggleOnce = (e: Event): void => {
      (e.target as HTMLInputElement).classList.add('toggled-once');
    };

    const checkbox = checkboxRef.current;
    if (checkbox) {
      checkbox.addEventListener('click', detectToggleOnce, { once: true });

      return () => {
        if (checkbox) {
          checkbox.removeEventListener('click', detectToggleOnce);
        }
      };
    }
    return undefined;
  }, []);

  const handleChange = useCallback((): void => {
    onClick();
  }, [onClick]);

  return (
    <label htmlFor={`${color}-checkbox`} className={`toggle-container ${color}`}>
      <input
        ref={checkboxRef}
        id={`${color}-checkbox`}
        className="toggle-checkbox"
        type="checkbox"
        checked={active}
        onChange={handleChange} // Wire to onClick for keyboard accessibility
      />
      <div className="toggle-track">
        <div className="toggle-thumb"></div>
      </div>
    </label>
  );
});
