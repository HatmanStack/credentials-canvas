import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomCheckbox } from '@/components/ui/CustomCheckbox';

describe('CustomCheckbox', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('rendering', () => {
    it('should render checkbox with correct id based on color', () => {
      render(<CustomCheckbox color="urban" active={false} onClick={mockOnClick} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'urban-checkbox');
    });

    it('should render label with correct htmlFor attribute', () => {
      const { container } = render(<CustomCheckbox color="rural" active={false} onClick={mockOnClick} />);

      const label = container.querySelector('label[for="rural-checkbox"]');
      expect(label).toBeInTheDocument();
    });

    it('should apply color class to container', () => {
      const { container } = render(
        <CustomCheckbox color="classy" active={false} onClick={mockOnClick} />
      );

      const label = container.querySelector('label');
      expect(label).toHaveClass('toggle-container', 'classy');
    });

    it('should render toggle track and thumb elements', () => {
      const { container } = render(
        <CustomCheckbox color="chill" active={false} onClick={mockOnClick} />
      );

      expect(container.querySelector('.toggle-track')).toBeInTheDocument();
      expect(container.querySelector('.toggle-thumb')).toBeInTheDocument();
    });
  });

  describe('checked state', () => {
    it('should be unchecked when active is false', () => {
      render(<CustomCheckbox color="urban" active={false} onClick={mockOnClick} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should be checked when active is true', () => {
      render(<CustomCheckbox color="urban" active={true} onClick={mockOnClick} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });

  describe('click interactions', () => {
    it('should call onClick when checkbox is clicked', () => {
      render(<CustomCheckbox color="urban" active={false} onClick={mockOnClick} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick on each click', () => {
      render(<CustomCheckbox color="rural" active={false} onClick={mockOnClick} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it('should add toggled-once class on first click', () => {
      render(<CustomCheckbox color="urban" active={false} onClick={mockOnClick} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(checkbox).toHaveClass('toggled-once');
    });
  });

  describe('theme variations', () => {
    const themes = ['urban', 'rural', 'classy', 'chill'] as const;

    themes.forEach(theme => {
      it(`should render correctly with ${theme} theme`, () => {
        const { container } = render(
          <CustomCheckbox color={theme} active={false} onClick={mockOnClick} />
        );

        const label = container.querySelector('label');
        expect(label).toHaveClass(theme);
        expect(screen.getByRole('checkbox')).toHaveAttribute('id', `${theme}-checkbox`);
      });
    });
  });

  describe('accessibility', () => {
    it('should be focusable', () => {
      render(<CustomCheckbox color="urban" active={false} onClick={mockOnClick} />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();

      expect(document.activeElement).toBe(checkbox);
    });

    it('should be toggleable via click after focus', () => {
      render(<CustomCheckbox color="urban" active={false} onClick={mockOnClick} />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      expect(document.activeElement).toBe(checkbox);

      // Click the focused checkbox
      fireEvent.click(checkbox);
      expect(mockOnClick).toHaveBeenCalled();
    });
  });
});
