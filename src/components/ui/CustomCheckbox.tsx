/**
 * Custom Checkbox Component
 *
 * Animated checkbox component with theme-specific styling.
 * Preserves custom CSS animations from checkbox.css.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import '../../css/checkbox.css';
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

  const handleClick = useCallback((): void => {
    onClick();
  }, [onClick]);

  return (
    <div className={`toggle-container ${color}`} onClick={handleClick}>
      <input
        ref={checkboxRef}
        id={`${color}-checkbox`}
        className="toggle-checkbox"
        type="checkbox"
        checked={active}
        onChange={() => {}} // Controlled component
      />
      <div className="toggle-track">
        <div className="toggle-thumb"></div>
      </div>
    </div>
  );
});
