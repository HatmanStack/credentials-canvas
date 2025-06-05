/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useEffect, useRef, useCallback } from "react";
import "../css/checkbox.css";

export const Checkbox = React.memo(({ color, active, onClick }) => {
  const checkboxRef = useRef(null);

  useEffect(() => {
    const detectToggleOnce = (e) => {
      e.target.classList.add("toggled-once");
    };

    const checkbox = checkboxRef.current;
    if (checkbox) {
      checkbox.addEventListener("click", detectToggleOnce, { once: true });

      return () => {
        checkbox.removeEventListener("click", detectToggleOnce);
      };
    }
  }, []);

  const handleClick = useCallback(() => {
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
