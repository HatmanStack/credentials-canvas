/**
 * Launch Screen Component
 *
 * Displays the initial theme selection interface where users choose their
 * "vibe" (theme) before entering the 3D scene.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ThemeSelectionOption } from './ThemeSelectionOption';
import { AVAILABLE_THEME_CONFIGURATIONS } from 'constants/themeConfiguration';
import { useUserInterfaceStore } from 'stores';
import { cn } from 'utils/classNameUtils';
import '../../css/launch.css';

/**
 * Launch Screen component for theme selection
 */
export const LaunchScreen: React.FC = React.memo(() => {
  // User interface store - selective subscription
  const setSelectedThemeConfiguration = useUserInterfaceStore(state => state.setSelectedThemeConfiguration);

  const textAnimationRef = useRef<SVGSVGElement>(null);
  const [selectedVibeOption, setSelectedVibeOption] = useState<string | null>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  // Update CSS custom property for hover color based on selected theme
  useEffect(() => {
    if (selectedVibeOption !== null && resetButtonRef.current) {
      const selectedTheme = AVAILABLE_THEME_CONFIGURATIONS.find(theme => theme.id === selectedVibeOption);
      const hoverColor = selectedTheme ? selectedTheme.color : '#B68672';
      resetButtonRef.current.style.setProperty('--hover-color', hoverColor);
    }
  }, [selectedVibeOption]);

  const setAnimationName = useCallback((animationName: string): void => {
    const element = textAnimationRef.current;
    if (element) {
      element.style.animationName = animationName;
    }
  }, []);

  const handleVibeSelect = useCallback((vibeId: string): void => {
    setSelectedVibeOption(vibeId);
  }, []);

  const handleLaunchClick = useCallback((): void => {
    const selectedTheme = AVAILABLE_THEME_CONFIGURATIONS.find(theme => theme.id === selectedVibeOption);
    setSelectedThemeConfiguration(selectedTheme || null);
    setAnimationName('none');
    requestAnimationFrame(() =>
      setTimeout(() => setAnimationName('textStrokeAnim'), 0)
    );
  }, [selectedVibeOption, setSelectedThemeConfiguration, setAnimationName]);

  return (
    <div className={cn(
      'flex flex-col justify-center items-center',
      'm-8'
    )}>
        <svg
          className="title-stroke"
          ref={textAnimationRef}
          style={{ width: 265 }}
        >
          <text y="50%" dy=".3em">
            VIBE
          </text>
        </svg>
        <div className={cn(
          'checkbox-container',
          'flex flex-row justify-center'
        )}>
          {AVAILABLE_THEME_CONFIGURATIONS.map(theme => (
            <ThemeSelectionOption
              key={theme.id}
              theme={theme}
              selectedVibe={selectedVibeOption}
              onVibeSelect={handleVibeSelect}
              textAnimationRef={textAnimationRef}
            />
          ))}
        </div>
        <div className={cn(
          'flex flex-col justify-center items-center',
          'm-0'
        )}>
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
            className={cn(
              'text-white no-underline',
              'mt-24 mb-12',
              'transition-transform duration-300 ease-in-out',
              'hover:scale-200'
            )}
          >
            Traditional Portfolio
          </a>
        </div>
      </div>
  );
});
