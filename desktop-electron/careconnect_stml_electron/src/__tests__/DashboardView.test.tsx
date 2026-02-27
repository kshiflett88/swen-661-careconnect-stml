import { fireEvent, render, screen, within } from '@testing-library/react';
import { DashboardView } from '../components/DashboardView';
import type { Task } from '../App';

function buildTask(overrides: Partial<Task>): Task {
  return {
    id: overrides.id ?? 'task-id',
    title: overrides.title ?? 'Default task',
    description: overrides.description ?? 'Task description',
    dueDateTime: overrides.dueDateTime ?? new Date('2026-03-01T09:00:00'),
    priority: overrides.priority ?? 'medium',
    status: overrides.status ?? 'pending',
    assignedTo: overrides.assignedTo,
  };
}

function findOrderedAncestor(element: HTMLElement, orderValue: string): HTMLElement | null {
  let current: HTMLElement | null = element;
  while (current) {
    if (current.style.order === orderValue) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

describe('DashboardView', () => {
  test('renders core dashboard sections with health log and tasks', () => {
    const tasks: Task[] = [
      buildTask({ id: 'next', title: 'Take medicine', dueDateTime: new Date('2026-03-01T08:00:00') }),
      buildTask({ id: 'later', title: 'Call caregiver', dueDateTime: new Date('2026-03-01T10:00:00') }),
    ];

    render(<DashboardView tasks={tasks} onOpenTasks={() => undefined} />);

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /how .*feeling/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Next Task' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Upcoming Tasks' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Quick Add Task' })).toBeInTheDocument();
  });

  test('uses ordering wrappers so tasks column is left and health log is right', () => {
    const tasks: Task[] = [buildTask({ id: 'a', title: 'Task A' })];

    render(<DashboardView tasks={tasks} onOpenTasks={() => undefined} />);

    const nextTaskHeading = screen.getByRole('heading', { name: 'Next Task' });
    const upcomingTasksHeading = screen.getByRole('heading', { name: 'Upcoming Tasks' });
    const moodHeading = screen.getByRole('heading', { name: /how .*feeling/i });

    const tasksColumnWrapper = findOrderedAncestor(nextTaskHeading, '1');
    const moodColumnWrapper = findOrderedAncestor(moodHeading, '2');

    expect(tasksColumnWrapper).toBeTruthy();
    expect(moodColumnWrapper).toBeTruthy();
    expect(within(tasksColumnWrapper as HTMLElement).getByRole('heading', { name: 'Next Task' })).toBeInTheDocument();
    expect(within(tasksColumnWrapper as HTMLElement).getByRole('heading', { name: 'Upcoming Tasks' })).toBeInTheDocument();
    expect(within(moodColumnWrapper as HTMLElement).getByRole('heading', { name: /how .*feeling/i })).toBeInTheDocument();
    expect(tasksColumnWrapper?.contains(upcomingTasksHeading)).toBe(true);
  });

  test('selects, saves, and clears mood check-in', () => {
    render(<DashboardView tasks={[]} onOpenTasks={() => undefined} />);

    const saveButton = screen.getByRole('button', { name: /save selected mood/i });
    const clearButton = screen.getByRole('button', { name: /clear mood check-in/i });

    expect(saveButton).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /select mood happy/i }));
    expect(saveButton).toBeEnabled();

    const noteInput = screen.getByLabelText('Optional Note');
    fireEvent.change(noteInput, { target: { value: 'Feeling steady today' } });
    expect(screen.getByText('20/200 characters')).toBeInTheDocument();

    fireEvent.click(saveButton);
    expect(screen.getByRole('status')).toHaveTextContent('Happy saved for today.');

    fireEvent.click(clearButton);
    expect((noteInput as HTMLTextAreaElement).value).toBe('');
    expect(saveButton).toBeDisabled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('shows next task from earliest pending and opens tasks from task actions', () => {
    const onOpenTasks = jest.fn();
    const tasks: Task[] = [
      buildTask({ id: 'complete-1', title: 'Completed task', dueDateTime: new Date('2026-03-01T06:00:00'), status: 'completed' }),
      buildTask({ id: 'pending-1', title: 'Earliest pending', dueDateTime: new Date('2026-03-01T07:00:00') }),
      buildTask({ id: 'pending-2', title: 'Second pending', dueDateTime: new Date('2026-03-01T08:00:00') }),
      buildTask({ id: 'pending-3', title: 'Third pending', dueDateTime: new Date('2026-03-01T09:00:00') }),
    ];

    render(<DashboardView tasks={tasks} onOpenTasks={onOpenTasks} />);

    expect(screen.getByText('Earliest pending')).toBeInTheDocument();
    expect(screen.getByText('Second pending')).toBeInTheDocument();
    expect(screen.getByText('Third pending')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /open tasks and mark next task complete/i }));
    fireEvent.click(screen.getByRole('button', { name: /open tasks and view second pending/i }));

    const addTaskButton = screen.getByRole('button', { name: /open tasks screen to add this task/i });
    expect(addTaskButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText('What do you need to remember?'), { target: { value: 'Buy groceries' } });
    expect(addTaskButton).toBeEnabled();
    fireEvent.click(addTaskButton);

    expect(onOpenTasks).toHaveBeenCalledTimes(3);
  });

  test('shows empty-state messaging when there are no pending tasks', () => {
    const tasks: Task[] = [
      buildTask({ id: 'done-1', title: 'Completed item', status: 'completed' }),
    ];

    render(<DashboardView tasks={tasks} onOpenTasks={() => undefined} />);

    expect(screen.getByText('No pending tasks for now.')).toBeInTheDocument();
    expect(screen.getByText('No additional upcoming tasks.')).toBeInTheDocument();
  });

  test('formats due time for today and tomorrow', () => {
    const now = new Date();
    const todayTaskTime = new Date(now);
    todayTaskTime.setHours(9, 0, 0, 0);

    const tomorrowTaskTime = new Date(now);
    tomorrowTaskTime.setDate(now.getDate() + 1);
    tomorrowTaskTime.setHours(10, 0, 0, 0);

    const tasks: Task[] = [
      buildTask({ id: 'today-1', title: 'Today task', dueDateTime: todayTaskTime }),
      buildTask({ id: 'tomorrow-1', title: 'Tomorrow task', dueDateTime: tomorrowTaskTime }),
    ];

    render(<DashboardView tasks={tasks} onOpenTasks={() => undefined} />);

    expect(screen.getByText(/Due: Today at/i)).toBeInTheDocument();
    expect(screen.getByText(/Tomorrow at/i)).toBeInTheDocument();
  });

  test('supports quick add due date/time inputs and clear resets all fields', () => {
    render(<DashboardView tasks={[]} onOpenTasks={() => undefined} />);

    const titleInput = screen.getByLabelText('What do you need to remember?') as HTMLInputElement;
    const dateInput = screen.getByLabelText('Due Date') as HTMLInputElement;
    const timeInput = screen.getByLabelText('Due Time') as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: 'Follow up with clinic' } });
    fireEvent.change(dateInput, { target: { value: '2026-03-15' } });
    fireEvent.change(timeInput, { target: { value: '13:30' } });

    expect(titleInput.value).toBe('Follow up with clinic');
    expect(dateInput.value).toBe('2026-03-15');
    expect(timeInput.value).toBe('13:30');

    fireEvent.click(screen.getByRole('button', { name: /clear quick add form/i }));

    expect(titleInput.value).toBe('');
    expect(dateInput.value).toBe('');
    expect(timeInput.value).toBe('');
  });
});
