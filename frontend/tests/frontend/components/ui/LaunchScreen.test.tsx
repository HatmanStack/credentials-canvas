import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LaunchScreen } from '@/components/ui/LaunchScreen';
import { useUserInterfaceStore } from '@/stores';

vi.mock('@/css/launch.css', () => ({}));

vi.mock('@/stores', () => ({
  useUserInterfaceStore: vi.fn(),
}));

describe('LaunchScreen', () => {
  const mockSetSelectedThemeConfiguration = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useUserInterfaceStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (state: { setSelectedThemeConfiguration: typeof mockSetSelectedThemeConfiguration }) => unknown) =>
        selector({ setSelectedThemeConfiguration: mockSetSelectedThemeConfiguration })
    );
  });

  describe('rendering', () => {
    it('should render VIBE title', () => {
      render(<LaunchScreen />);

      expect(screen.getByText('VIBE')).toBeInTheDocument();
    });

    it('should render LAUNCH button', () => {
      render(<LaunchScreen />);

      expect(screen.getByRole('button', { name: /launch/i })).toBeInTheDocument();
    });

    it('should render all four theme options', () => {
      render(<LaunchScreen />);

      expect(screen.getByText('URBAN')).toBeInTheDocument();
      expect(screen.getByText('RURAL')).toBeInTheDocument();
      expect(screen.getByText('CLASSY')).toBeInTheDocument();
      expect(screen.getByText('CHILL')).toBeInTheDocument();
    });

    it('should render Traditional Portfolio link', () => {
      render(<LaunchScreen />);

      const link = screen.getByRole('link', { name: /traditional portfolio/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://portfolio.hatstack.fun');
    });

    it('should render LOW GRAPHICS text (hidden)', () => {
      render(<LaunchScreen />);

      expect(screen.getByText('LOW GRAPHICS')).toBeInTheDocument();
    });
  });

  describe('theme selection', () => {
    it('should have no theme selected initially', () => {
      render(<LaunchScreen />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).not.toBeChecked();
      });
    });

    it('should select a theme when checkbox is clicked', () => {
      const { container } = render(<LaunchScreen />);

      const urbanCheckbox = container.querySelector('#urban-checkbox') as HTMLInputElement;
      fireEvent.click(urbanCheckbox);

      expect(urbanCheckbox).toBeChecked();
    });

    it('should deselect previous theme when new theme is selected', () => {
      const { container } = render(<LaunchScreen />);

      const urbanCheckbox = container.querySelector('#urban-checkbox') as HTMLInputElement;
      const ruralCheckbox = container.querySelector('#rural-checkbox') as HTMLInputElement;

      fireEvent.click(urbanCheckbox);
      expect(urbanCheckbox).toBeChecked();

      fireEvent.click(ruralCheckbox);
      expect(ruralCheckbox).toBeChecked();
      expect(urbanCheckbox).not.toBeChecked();
    });

    it('should update button hover color when theme is selected', () => {
      const { container } = render(<LaunchScreen />);

      const urbanCheckbox = container.querySelector('#urban-checkbox') as HTMLInputElement;
      fireEvent.click(urbanCheckbox);

      const launchButton = screen.getByRole('button', { name: /launch/i });
      expect(launchButton.style.getPropertyValue('--hover-color')).toBe('#E96929');
    });
  });

  describe('launch functionality', () => {
    it('should call setSelectedThemeConfiguration when LAUNCH is clicked with a theme selected', () => {
      const { container } = render(<LaunchScreen />);

      const urbanCheckbox = container.querySelector('#urban-checkbox') as HTMLInputElement;
      fireEvent.click(urbanCheckbox);

      const launchButton = screen.getByRole('button', { name: /launch/i });
      fireEvent.click(launchButton);

      expect(mockSetSelectedThemeConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '0',
          name: 'urban',
        })
      );
    });

    it('should call setSelectedThemeConfiguration with null when no theme selected', () => {
      render(<LaunchScreen />);

      const launchButton = screen.getByRole('button', { name: /launch/i });
      fireEvent.click(launchButton);

      expect(mockSetSelectedThemeConfiguration).toHaveBeenCalledWith(null);
    });

    it('should launch with rural theme when selected', () => {
      const { container } = render(<LaunchScreen />);

      const ruralCheckbox = container.querySelector('#rural-checkbox') as HTMLInputElement;
      fireEvent.click(ruralCheckbox);

      const launchButton = screen.getByRole('button', { name: /launch/i });
      fireEvent.click(launchButton);

      expect(mockSetSelectedThemeConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          name: 'rural',
        })
      );
    });

    it('should launch with classy theme when selected', () => {
      const { container } = render(<LaunchScreen />);

      const classyCheckbox = container.querySelector('#classy-checkbox') as HTMLInputElement;
      fireEvent.click(classyCheckbox);

      const launchButton = screen.getByRole('button', { name: /launch/i });
      fireEvent.click(launchButton);

      expect(mockSetSelectedThemeConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '2',
          name: 'classy',
        })
      );
    });

    it('should launch with chill theme when selected', () => {
      const { container } = render(<LaunchScreen />);

      const chillCheckbox = container.querySelector('#chill-checkbox') as HTMLInputElement;
      fireEvent.click(chillCheckbox);

      const launchButton = screen.getByRole('button', { name: /launch/i });
      fireEvent.click(launchButton);

      expect(mockSetSelectedThemeConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '3',
          name: 'chill',
        })
      );
    });
  });

  describe('accessibility', () => {
    it('should have accessible theme option labels', () => {
      render(<LaunchScreen />);

      expect(screen.getByRole('img', { name: /urban theme option/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /rural theme option/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /classy theme option/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /chill theme option/i })).toBeInTheDocument();
    });

    it('should have focusable launch button', () => {
      render(<LaunchScreen />);

      const launchButton = screen.getByRole('button', { name: /launch/i });
      launchButton.focus();

      expect(document.activeElement).toBe(launchButton);
    });
  });
});
