import React, { useEffect, useRef, useCallback } from 'react';
import type { ThemeName } from '@/types';

export interface CustomCheckboxProps {
  color: ThemeName;
  active: boolean;
  onClick: () => void;
}

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
        onChange={handleChange}
      />
      <div className="toggle-track">
        <div className="toggle-thumb"></div>
      </div>
    </label>
  );
});
