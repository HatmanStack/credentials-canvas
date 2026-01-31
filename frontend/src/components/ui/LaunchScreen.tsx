import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ThemeSelectionOption } from './ThemeSelectionOption';
import { AVAILABLE_THEME_CONFIGURATIONS } from '@/constants/themeConfiguration';
import { useUserInterfaceStore } from '@/stores';
import { cn } from '@/utils/classNameUtils';
import '@/css/launch.css';

export const LaunchScreen: React.FC = React.memo(() => {
  const setSelectedThemeConfiguration = useUserInterfaceStore(state => state.setSelectedThemeConfiguration);

  const vibeTextRef = useRef<SVGSVGElement>(null);
  const [selectedVibeOption, setSelectedVibeOption] = useState<string | null>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedVibeOption !== null && resetButtonRef.current) {
      const selectedTheme = AVAILABLE_THEME_CONFIGURATIONS.find(theme => theme.id === selectedVibeOption);
      const hoverColor = selectedTheme ? selectedTheme.color : '#B68672';
      resetButtonRef.current.style.setProperty('--hover-color', hoverColor);
    }
  }, [selectedVibeOption]);

  const setAnimationName = useCallback((animationName: string): void => {
    if (vibeTextRef.current) {
      vibeTextRef.current.style.animationName = animationName;
    }
  }, []);

  const handleVibeSelect = useCallback((vibeId: string): void => {
    setSelectedVibeOption(vibeId);
  }, []);

  const handleLaunchClick = useCallback((): void => {
    const selectedTheme = AVAILABLE_THEME_CONFIGURATIONS.find(theme => theme.id === selectedVibeOption);
    setSelectedThemeConfiguration(selectedTheme || null);
    setAnimationName('none');
    requestAnimationFrame(() => {
      setAnimationName('textStrokeAnim');
    });
  }, [selectedVibeOption, setSelectedThemeConfiguration, setAnimationName]);

  return (
    <div className={cn(
      'flex flex-col justify-center items-center',
      'm-8'
    )}>
      <svg
        className="title-stroke"
        ref={vibeTextRef}
        style={{ width: 265 }}
      >
        <text y="50%" dy=".3em">
            VIBE
        </text>
      </svg>
      <div className={cn(
        'checkbox-container',
        'flex flex-row flex-wrap justify-center'
      )}>
        {AVAILABLE_THEME_CONFIGURATIONS.map(theme => (
          <ThemeSelectionOption
            key={theme.id}
            theme={theme}
            selectedVibe={selectedVibeOption}
            onVibeSelect={handleVibeSelect}
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
        <a
          href="https://portfolio.hatstack.fun"
          className={cn(
            'text-white no-underline',
            'mt-24 mb-12',
            'transition-transform duration-300 ease-in-out',
            'hover:scale-105'
          )}
        >
            Traditional Portfolio
        </a>
      </div>
    </div>
  );
});
