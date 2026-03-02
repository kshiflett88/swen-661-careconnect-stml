import { fireEvent, render, screen, within } from '@testing-library/react';
import SettingsView from '../components/SettingsView';

describe('SettingsView', () => {
  test('renders core Figma sections and helper text', () => {
    render(<SettingsView />);

    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Display & Simplicity' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Reminder Support' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Support' })).toBeInTheDocument();
    expect(screen.getByText(/settings are saved automatically/i)).toBeInTheDocument();
  });

  test('supports text size radio selection', () => {
    render(<SettingsView />);

    const medium = screen.getByRole('radio', { name: 'Medium' });
    const large = screen.getByRole('radio', { name: 'Large' });

    expect(medium).toHaveAttribute('aria-checked', 'true');
    expect(large).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(large);
    expect(large).toHaveAttribute('aria-checked', 'true');
    expect(medium).toHaveAttribute('aria-checked', 'false');
  });

  test('toggles switch controls', () => {
    render(<SettingsView />);

    const highContrast = screen.getByRole('switch', { name: /high contrast mode/i });
    const simplified = screen.getByRole('switch', { name: /simplified layout mode/i });

    expect(highContrast).toHaveAttribute('aria-checked', 'false');
    expect(simplified).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(highContrast);
    fireEvent.click(simplified);

    expect(highContrast).toHaveAttribute('aria-checked', 'true');
    expect(simplified).toHaveAttribute('aria-checked', 'true');
  });

  test('allows editing caregiver info and saving back to view mode', () => {
    render(<SettingsView />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    const nameInput = screen.getByLabelText('Name');
    const phoneInput = screen.getByLabelText('Phone Number');

    fireEvent.change(nameInput, { target: { value: 'Alex Carter' } });
    fireEvent.change(phoneInput, { target: { value: '(555) 999-8888' } });

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Alex Carter')).toBeInTheDocument();
    expect(screen.getByText('(555) 999-8888')).toBeInTheDocument();
  });

  test('reset to defaults sets medium text size and turns all toggles off', () => {
    render(<SettingsView />);

    fireEvent.click(screen.getByRole('radio', { name: 'Large' }));
    fireEvent.click(screen.getByRole('switch', { name: /simplified layout mode/i }));

    fireEvent.click(screen.getByRole('button', { name: /reset to defaults/i }));
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('This will reset all settings to their default values. Continue?')).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /reset to defaults/i }));

    expect(screen.getByRole('radio', { name: 'Medium' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('switch', { name: /high contrast mode/i })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('switch', { name: /simplified layout mode/i })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('switch', { name: /show confirmation after completing task/i })).toHaveAttribute(
      'aria-checked',
      'false'
    );
  });
});
