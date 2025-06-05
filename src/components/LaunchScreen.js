/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { VibeOption } from "./VibeOption";
import { vibeThemes } from '../data/ui';
import { useUI } from '../contexts';
import "../css/launch.css";

export const LaunchScreen = React.memo(() => {
  const { graphics, setVibe, setGraphics } = useUI();
  const textAnimationRef = useRef(null);
  const [selectedVibe, setSelectedVibe] = useState(null);
  const resetButtonRef = useRef(null);

  useEffect(() => {
    if (selectedVibe !== null && resetButtonRef.current) {
      const selectedTheme = vibeThemes.find(theme => theme.id === selectedVibe);
      const hoverColor = selectedTheme ? selectedTheme.color : "#B68672";
      resetButtonRef.current.style.setProperty("--hover-color", hoverColor);
    }
  }, [selectedVibe]);

  const setAnimationName = useCallback((animationName) => {
    const element = textAnimationRef.current;
    if (element) {
      element.style.animationName = animationName;
    }
  }, []);

  const handleVibeSelect = useCallback((vibeId) => {
    setSelectedVibe(vibeId);
  }, []);

  const handleLaunchClick = useCallback(() => {
    setVibe(selectedVibe);
    setAnimationName("none");
    requestAnimationFrame(() =>
      setTimeout(() => setAnimationName("textStrokeAnim"), 0)
    );
  }, [selectedVibe, setVibe, setAnimationName]);


  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "2em",
        }}
      >
        <svg
          className="title-stroke"
          ref={textAnimationRef}
          style={{ width: 265 }}
        >
          <text y="50%" dy=".3em">
            VIBE
          </text>
        </svg>
        <div
          className="checkbox-container"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {vibeThemes.map((theme) => (
            <VibeOption
              key={theme.id}
              theme={theme}
              selectedVibe={selectedVibe}
              onVibeSelect={handleVibeSelect}
              textAnimationRef={textAnimationRef}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: 0,
          }}
        >
          <button
            className="reset"
            ref={resetButtonRef}
            onClick={handleLaunchClick}
          >
            LAUNCH
          </button>
          <svg
            className="text-stroke-graphics"
            ref={textAnimationRef}
            style={{ width: 620 }}
            display="None"
          >
            <text y="50%" dy=".6em" style={{ marginTop: 0 }}>
              LOW GRAPHICS
            </text>
          </svg>
          <a
            href="https://www.cg-portfolio.com"
            style={{
              color: "white",
              textDecoration: "none",
              marginTop: 100,
              marginBottom: 50,
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(2)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Traditional Portfolio
          </a>
        </div>
      </div>
    </>
  );
});
