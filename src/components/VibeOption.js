import React, { useCallback } from "react";
import { Checkbox } from "./Checkbox";

export const VibeOption = React.memo(({ 
  theme, 
  selectedVibe, 
  onVibeSelect,
  textAnimationRef 
}) => {
  const handleClick = useCallback(() => {
    onVibeSelect(theme.id);
  }, [theme.id, onVibeSelect]);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "2em",
  };

  const svgStyle = {
    width: theme.svgWidth
  };

  return (
    <div style={containerStyle}>
      <svg
        className={`text-stroke-${theme.name}`}
        ref={textAnimationRef}
        style={svgStyle}
      >
        <text y="50%" dy=".3em">
          {theme.displayName}
        </text>
      </svg>
      <Checkbox
        color={theme.name}
        active={selectedVibe === theme.id}
        onClick={handleClick}
      />
    </div>
  );
});