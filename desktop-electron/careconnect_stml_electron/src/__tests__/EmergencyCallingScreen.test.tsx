import { fireEvent, render, screen } from '@testing-library/react';
import EmergencyCallingScreen from '../screens/EmergencyCallingScreen';
import type { ScreenId } from '../screens';

type ShellMockProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

jest.mock('../screens/_ScreenShell', () => ({
  __esModule: true,
  default: ({ title, description, children }: ShellMockProps) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}), { virtual: true });

describe('EmergencyCallingScreen', () => {
  test('renders WCAG semantics and status content', () => {
    render(<EmergencyCallingScreen onGo={jest.fn<void, [ScreenId]>()} />);

    expect(screen.getAllByRole('heading', { name: /emergency calling/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/caregiver contact is in progress/i)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /emergency calling panel/i })).toBeInTheDocument();
    expect(screen.getByText(/^Status:/i)).toBeInTheDocument();
    expect(screen.getByText(/calling caregiver now/i)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /calling actions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /return to emergency screen/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /return to tasks after emergency/i })).toBeInTheDocument();
  });

  test('handles Return and Done navigation actions', () => {
    const onGo = jest.fn<void, [ScreenId]>();

    render(<EmergencyCallingScreen onGo={onGo} />);

    fireEvent.click(screen.getByRole('button', { name: /return to emergency screen/i }));
    fireEvent.click(screen.getByRole('button', { name: /return to tasks after emergency/i }));

    expect(onGo).toHaveBeenCalledTimes(2);
    expect(onGo).toHaveBeenNthCalledWith(1, 'emergency');
    expect(onGo).toHaveBeenNthCalledWith(2, 'task-list');
  });

  test('focus moves to the heading on mount for keyboard/screen reader users', () => {
    render(<EmergencyCallingScreen onGo={jest.fn<void, [ScreenId]>()} />);

    const heading = screen.getAllByRole('heading', { name: /emergency calling/i })[1];
    expect(document.activeElement).toBe(heading);
  });
});
