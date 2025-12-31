import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeSelectionOption } from '@/components/ui/ThemeSelectionOption';
import type { VibeThemeConfiguration } from '@/types';

describe('ThemeSelectionOption', () => {
  const mockOnVibeSelect = vi.fn();

  const createMockTheme = (overrides?: Partial<VibeThemeConfiguration>): VibeThemeConfiguration => ({
    id: '0',
    name: 'urban',
    color: '#B68672',
    displayName: 'URBAN',
    svgWidth: 200,
    ...overrides,
  });

  beforeEach(() => {
    mockOnVibeSelect.mockClear();
  });

  describe('rendering', () => {
    it('should render theme display name in SVG text', () => {
      const theme = createMockTheme({ displayName: 'URBAN' });
      render(
        <ThemeSelectionOption
          theme={theme}
          selectedVibe={null}
          onVibeSelect={mockOnVibeSelect}
        />
      );

      expect(screen.getByText('URBAN')).toBeInTheDocument();
    });

    it('should apply correct SVG width from theme config', () => {
      const theme = createMockTheme({ svgWidth: 250 });
      const { container } = render(
        <ThemeSelectionOption
          theme={theme}
          selectedVibe={null}
          onVibeSelect={mockOnVibeSelect}
        />
      );

      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle({ width: '250px' });
    });

    it('should apply theme-specific class to SVG', () => {
      const theme = createMockTheme({ name: 'classy' });
      const { container } = render(
        <ThemeSelectionOption
          theme={theme}
          selectedVibe={null}
          onVibeSelect={mockOnVibeSelect}
        />
      );

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-stroke-classy');
    });

    it('should render CustomCheckbox with correct props', () => {
      const theme = createMockTheme({ name: 'rural', id: '1' });
      render(
        <ThemeSelectionOption
          theme={theme}
          selectedVibe="1"
          onVibeSelect={mockOnVibeSelect}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });

  describe('selection state', () => {
    it('should show checkbox as inactive when not selected', () => {
      const theme = createMockTheme({ id: '0' });
      render(
        <ThemeSelectionOption
          theme={theme}
          selectedVibe="1"
          onVibeSelect={mockOnVibeSelect}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should show checkbox as active when selected', () => {
      const theme = createMockTheme({ id: '2' });
      render(
        <ThemeSelectionOption
          theme={theme}
          selectedVibe="2"
          onVibeSelect={mockOnVibeSelect}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should show checkbox as inactive when selectedVibe is null', () => {
      const theme = createMockTheme();
      render(
        <ThemeSelectionOption
          theme={theme}
          selectedVibe={null}
          onVibeSelect={mockOnVibeSelect}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('click interactions', () => {
    it('should call onVibeSelect with theme id when clicked', () => {
      const theme = createMockTheme({ id: '3' });
      render(
        <ThemeSelectionOption
          theme={theme}
          selectedVibe={null}
          onVibeSelect={mockOnVibeSelect}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockOnVibeSelect).toHaveBeenCalledWith('3');
    });

    it('should call onVibeSelect even when already selected', () => {
      const theme = createMockTheme({ id: '1' });
      render(
        <ThemeSelectionOption
          theme={theme}
          selectedVibe="1"
          onVibeSelect={mockOnVibeSelect}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockOnVibeSelect).toHaveBeenCalledWith('1');
    });
  });

  describe('accessibility', () => {
    it('should have accessible SVG with role and aria-label', () => {
      const theme = createMockTheme({ displayName: 'CHILL' });
      render(
        <ThemeSelectionOption
          theme={theme}
          selectedVibe={null}
          onVibeSelect={mockOnVibeSelect}
        />
      );

      const svg = screen.getByRole('img', { name: /chill theme option/i });
      expect(svg).toBeInTheDocument();
    });
  });

  describe('all theme variations', () => {
    const themeConfigs: VibeThemeConfiguration[] = [
      { id: '0', name: 'urban', color: '#B68672', displayName: 'URBAN', svgWidth: 200 },
      { id: '1', name: 'rural', color: '#869582', displayName: 'RURAL', svgWidth: 180 },
      { id: '2', name: 'classy', color: '#8F909D', displayName: 'CLASSY', svgWidth: 220 },
      { id: '3', name: 'chill', color: '#BA827F', displayName: 'CHILL', svgWidth: 160 },
    ];

    themeConfigs.forEach(theme => {
      it(`should render ${theme.name} theme correctly`, () => {
        const { container } = render(
          <ThemeSelectionOption
            theme={theme}
            selectedVibe={null}
            onVibeSelect={mockOnVibeSelect}
          />
        );

        expect(screen.getByText(theme.displayName)).toBeInTheDocument();
        expect(container.querySelector('svg')).toHaveClass(`text-stroke-${theme.name}`);
      });
    });
  });
});
