/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useRef, useState, useEffect } from "react";
import { Checkbox } from "./Checkbox";
import "../css/launch.css";

export function LaunchScreen({ setVibe, graphics, setGraphics }) {
  const textAnimationRef = useRef(null);
  const [selectedVibe, setSelectedVibe] = useState(null);
  const resetButtonRef = useRef(null);

  useEffect(() => {
    if (selectedVibe !== null && resetButtonRef.current) {
      switch (selectedVibe) {
        case "0":
          resetButtonRef.current.style.setProperty("--hover-color", "#E96929");
          break;
        case "1":
          resetButtonRef.current.style.setProperty("--hover-color", "#80C080");
          break;
        case "2":
          resetButtonRef.current.style.setProperty("--hover-color", "#EF5555");
          break;
        case "3":
          resetButtonRef.current.style.setProperty("--hover-color", "#9FA8DA");
          break;
        default:
          resetButtonRef.current.style.setProperty("--hover-color", "#B68672");
          break;
      }
    }
  }, [selectedVibe]);

  const setAnimationName = (animationName) => {
    const element = textAnimationRef.current;
    if (element) {
      element.style.animationName = animationName;
    }
  };

  const handleClick = (color) => {
    setSelectedVibe(color);
  };

  const handleLaunchClick = () => {
    setVibe(selectedVibe);
    setAnimationName("none");
    requestAnimationFrame(() =>
      setTimeout(() => setAnimationName("textStrokeAnim"), 0)
    );
  };

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
              className="text-stroke-urban"
              ref={textAnimationRef}
              style={{ width: 280 }}
            >
              <text y="50%" dy=".3em">
                URBAN
              </text>
            </svg>
            <Checkbox
              color="urban"
              active={selectedVibe === "0"}
              onClick={() => handleClick("0")}
            />
          </div>
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
              className="text-stroke-rural"
              ref={textAnimationRef}
              style={{ width: 275 }}
            >
              <text y="50%" dy=".3em">
                RURAL
              </text>
            </svg>
            <Checkbox
              color="rural"
              active={selectedVibe === "1"}
              onClick={() => handleClick("1")}
            />
          </div>
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
              className="text-stroke-classy"
              ref={textAnimationRef}
              style={{ width: 320 }}
            >
              <text y="50%" dy=".3em">
                CLASSY
              </text>
            </svg>
            <Checkbox
              color="classy"
              active={selectedVibe === "2"}
              onClick={() => handleClick("2")}
            />
          </div>
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
              className="text-stroke-chill"
              ref={textAnimationRef}
              style={{ width: 240 }}
            >
              <text y="50%" dy=".3em">
                CHILL
              </text>
            </svg>

            <Checkbox
              color="chill"
              active={selectedVibe === "3"}
              onClick={() => handleClick("3")}
            />
          </div>
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
            style={{ width: 420 }}
          >
            <text y="50%" dy=".6em" style={{ marginTop: 0 }}>
              GRAPHICS
            </text>
          </svg>
          <Checkbox color="graphics" onClick={() => setGraphics(!graphics)} />
          <a
            href="https://gemenielabs.com"
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
            Gemenie Labs
          </a>
        </div>
      </div>
    </>
  );
}
