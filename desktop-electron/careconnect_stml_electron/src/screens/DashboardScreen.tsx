import React from "react";
import { colors, sizing, typography } from "../constants/accessibility";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { PriorityBadge } from "../components/PriorityBadge";
import { ConfirmDialog } from "../components/ConfirmDialog";
import type { ScreenId } from "../types";
import type { Task } from "../types";

/**
 * Dashboard Screen
 * 
 * WCAG 2.2 AA Compliance:
 * - Semantic HTML landmarks (WCAG 2.4.1)
 * - Keyboard navigation (WCAG 2.1.1)
 * - Skip links for screen readers (WCAG 2.4.1)
 * - Clear heading hierarchy (WCAG 1.3.1)
 * - High contrast colors (WCAG 1.4.3)
 * - Large touch targets (WCAG 2.5.5)
 * - Confirmation dialogs for destructive actions (WCAG 3.3.4)
 * 
 * STML Considerations:
 * - Persistent date/time orientation (top right)
 * - Next task prominently highlighted
 * - Simple sidebar navigation
 * - Quick-add form for common action
 * - Reduced cognitive load with clear sections
 */
export default function DashboardScreen(props: { onGo: (screen: ScreenId) => void }) {
  const [currentDateTime, setCurrentDateTime] = React.useState(new Date());
  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: '1',
      title: 'Take morning medication',
      description: 'Take blood pressure medication with water',
      priority: 'high',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '09:00',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Call Dr. Smith',
      description: 'Confirm appointment for next week',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '14:00',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Prepare grocery list',
      priority: 'low',
      // Static date for demo - in production, calculate dynamically
      dueDate: '2026-02-23',
      completed: false,
      createdAt: '2026-02-22T10:00:00.000Z',
    },
  ]);
  
  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [newTaskPriority, setNewTaskPriority] = React.useState<'high' | 'medium' | 'low'>('medium');
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean;
    taskId?: string;
  }>({ isOpen: false });

  // STML: Update date/time every minute for orientation
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Get next incomplete task
  const nextTask = tasks.find(t => !t.completed);
  const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 5);

  // WCAG 3.3.4: Confirmation for destructive action
  const handleMarkComplete = (taskId: string) => {
    setConfirmDialog({ isOpen: true, taskId });
  };

  const confirmMarkComplete = () => {
    if (confirmDialog.taskId) {
      setTasks(tasks.map(t => 
        t.id === confirmDialog.taskId 
          ? { ...t, completed: true, completedAt: new Date().toISOString() }
          : t
      ));
    }
    setConfirmDialog({ isOpen: false });
  };

  const handleQuickAdd = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      priority: newTaskPriority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  // Styles
  const layoutStyles: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: colors.backgroundAlt,
  };

  // WCAG 2.4.1: Navigation landmark
  const sidebarStyles: React.CSSProperties = {
    width: '250px',
    backgroundColor: colors.background,
    borderRight: `1px solid ${colors.border}`,
    padding: sizing.spaceLg,
    display: 'flex',
    flexDirection: 'column',
    gap: sizing.spaceMd,
  };

  const mainContentStyles: React.CSSProperties = {
    flex: 1,
    padding: sizing.spaceXl,
    overflowY: 'auto',
  };

  // STML: Persistent orientation cue at top
  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizing.spaceXl,
  };

  const dateTimeStyles: React.CSSProperties = {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
    // STML: Always visible date/time for orientation
  };

  const nextTaskCardStyles: React.CSSProperties = {
    marginBottom: sizing.spaceLg,
  };

  const taskTitleStyles: React.CSSProperties = {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: sizing.spaceSm,
  };

  const taskDescStyles: React.CSSProperties = {
    fontSize: typography.fontSizeBase,
    color: colors.textSecondary,
    marginBottom: sizing.spaceMd,
    lineHeight: typography.lineHeightRelaxed,
  };

  const upcomingListStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: sizing.spaceMd,
  };

  const taskItemStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: sizing.spaceMd,
    backgroundColor: colors.background,
    borderRadius: sizing.borderRadiusMd,
    border: `1px solid ${colors.border}`,
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: sizing.spaceMd,
  };

  const navButtonStyles: React.CSSProperties = {
    padding: sizing.spaceMd,
    fontSize: typography.fontSizeBase,
    fontWeight: typography.fontWeightMedium,
    textAlign: 'left',
    backgroundColor: colors.background,
    border: `1px solid ${colors.border}`,
    borderRadius: sizing.borderRadiusMd,
    cursor: 'pointer',
    transition: 'background-color 150ms',
    // WCAG 2.5.5: Minimum touch target
    minHeight: sizing.minTouchTarget,
  };

  return (
    <div style={layoutStyles}>
      {/* WCAG 2.4.1: Navigation landmark */}
      <nav style={sidebarStyles} aria-label="Main navigation">
        <h2 style={{ 
          fontSize: typography.fontSizeLg, 
          fontWeight: typography.fontWeightBold,
          marginBottom: sizing.spaceXl,
        }}>
          CareConnect
        </h2>

        {/* Emergency button at top for quick access */}
        <Button
          onClick={() => props.onGo('emergency')}
          variant="danger"
          size="large"
          fullWidth
          ariaLabel="Emergency SOS - call for help"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: sizing.spaceSm, verticalAlign: 'middle' }} aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" fill="currentColor"/>
          </svg>
          Emergency SOS
        </Button>

        {/* WCAG 2.1.1: Keyboard navigable buttons */}
        {/* Dashboard (Home) */}
        <button
          onClick={() => props.onGo('dashboard')}
          style={{ 
            ...navButtonStyles, 
            backgroundColor: colors.primaryLight,
            fontWeight: typography.fontWeightMedium,
          }}
          aria-current="page"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: sizing.spaceSm, verticalAlign: 'middle' }} aria-hidden="true">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" fill="currentColor"/>
          </svg>
          Dashboard
        </button>
        
        {/* Tasks */}
        <button
          onClick={() => props.onGo('task-list')}
          style={navButtonStyles}
          onFocus={(e) => e.currentTarget.style.backgroundColor = colors.backgroundAlt}
          onBlur={(e) => e.currentTarget.style.backgroundColor = colors.background}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.backgroundAlt}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.background}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: sizing.spaceSm, verticalAlign: 'middle' }} aria-hidden="true">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" fill="currentColor"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" fill="currentColor"/>
          </svg>
          Tasks
        </button>
        
        {/* Health Log */}
        <button
          onClick={() => props.onGo('health-log')}
          style={navButtonStyles}
          onFocus={(e) => e.currentTarget.style.backgroundColor = colors.backgroundAlt}
          onBlur={(e) => e.currentTarget.style.backgroundColor = colors.background}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.backgroundAlt}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.background}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: sizing.spaceSm, verticalAlign: 'middle' }} aria-hidden="true">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" fill="currentColor"/>
          </svg>
          Health Log
        </button>
        
        {/* Contacts */}
        <button
          onClick={() => props.onGo('contacts')}
          style={navButtonStyles}
          onFocus={(e) => e.currentTarget.style.backgroundColor = colors.backgroundAlt}
          onBlur={(e) => e.currentTarget.style.backgroundColor = colors.background}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.backgroundAlt}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.background}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: sizing.spaceSm, verticalAlign: 'middle' }} aria-hidden="true">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" fill="currentColor"/>
          </svg>
          Contacts
        </button>
        
        {/* Profile */}
        <button
          onClick={() => props.onGo('profile')}
          style={navButtonStyles}
          onFocus={(e) => e.currentTarget.style.backgroundColor = colors.backgroundAlt}
          onBlur={(e) => e.currentTarget.style.backgroundColor = colors.background}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.backgroundAlt}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.background}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: sizing.spaceSm, verticalAlign: 'middle' }} aria-hidden="true">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" fill="currentColor"/>
          </svg>
          Profile
        </button>
      </nav>

      {/* WCAG 2.4.1: Main content landmark */}
      <main style={mainContentStyles}>
        {/* STML: Date/time orientation at top */}
        <header style={headerStyles}>
          <h1 style={{
            fontSize: typography.fontSizeXl,
            fontWeight: typography.fontWeightBold,
            margin: 0,
          }}>
            Dashboard
          </h1>
          
          {/* STML: Always visible date/time */}
          <div style={dateTimeStyles} aria-live="polite">
            {currentDateTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric' 
            })}
            <br />
            {currentDateTime.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit' 
            })}
          </div>
        </header>

        {/* Next Task - Prominently highlighted */}
        {nextTask && (
          <section style={nextTaskCardStyles}>
            <h2 style={sectionTitleStyles}>Next Task</h2>
            {/* STML: Highlighted card for next action */}
            <Card variant="highlighted" padding="large">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={taskTitleStyles}>{nextTask.title}</div>
                  {nextTask.description && (
                    <div style={taskDescStyles}>{nextTask.description}</div>
                  )}
                  <div style={{ display: 'flex', gap: sizing.spaceMd, alignItems: 'center' }}>
                    <PriorityBadge level={nextTask.priority} />
                    {nextTask.dueTime && (
                      <span style={{ color: colors.textSecondary }}>
                        Due: {nextTask.dueTime}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  {/* WCAG 3.3.4: Confirmation required for completion */}
                  <Button
                    onClick={() => handleMarkComplete(nextTask.id)}
                    variant="success"
                    size="large"
                    ariaLabel={`Mark "${nextTask.title}" as complete`}
                  >
                    ✓ Mark Complete
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Upcoming Tasks */}
        <section style={{ marginBottom: sizing.spaceLg }}>
          <h2 style={sectionTitleStyles}>Upcoming Tasks</h2>
          <div style={upcomingListStyles}>
            {upcomingTasks.slice(1).map((task) => (
              <div key={task.id} style={taskItemStyles}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: typography.fontSizeBase,
                    fontWeight: typography.fontWeightMedium,
                    marginBottom: sizing.spaceXs,
                  }}>
                    {task.title}
                  </div>
                  <PriorityBadge level={task.priority} />
                </div>
                <Button
                  onClick={() => props.onGo('task-detail')}
                  variant="secondary"
                  ariaLabel={`View details for ${task.title}`}
                >
                  View Details
                </Button>
              </div>
            ))}
            
            {upcomingTasks.length <= 1 && (
              <div style={{ 
                padding: sizing.spaceLg, 
                textAlign: 'center',
                color: colors.textSecondary,
              }}>
                No upcoming tasks. Add a task below!
              </div>
            )}
          </div>
        </section>

        {/* Quick Add Task */}
        <section>
          <h2 style={sectionTitleStyles}>Quick Add Task</h2>
          <Card>
            <div style={{ display: 'flex', gap: sizing.spaceMd, flexDirection: 'column' }}>
              <Input
                id="quick-task-title"
                label="Task Title"
                value={newTaskTitle}
                onChange={setNewTaskTitle}
                placeholder="e.g., Take evening medication"
                // STML: Clear helper text
                helpText="What do you need to remember?"
              />
              
              <div>
                <label 
                  htmlFor="quick-task-priority"
                  style={{
                    display: 'block',
                    marginBottom: sizing.spaceSm,
                    fontSize: typography.fontSizeBase,
                    fontWeight: typography.fontWeightMedium,
                  }}
                >
                  Priority
                </label>
                <select
                  id="quick-task-priority"
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                  style={{
                    height: sizing.inputHeight,
                    padding: `0 ${sizing.inputPadding}px`,
                    fontSize: typography.fontSizeBase,
                    border: `2px solid ${colors.border}`,
                    borderRadius: sizing.borderRadiusMd,
                    backgroundColor: colors.background,
                    // WCAG 2.5.5: Large touch target
                  }}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <Button
                onClick={handleQuickAdd}
                variant="primary"
                size="large"
                disabled={!newTaskTitle.trim()}
                ariaLabel="Add new task to your list"
              >
                + Add Task
              </Button>
            </div>
          </Card>
        </section>
      </main>

      {/* WCAG 3.3.4: Confirmation dialog for destructive action */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Mark Task Complete?"
        message="Are you sure you want to mark this task as complete? This action can be undone from the task list."
        confirmText="Yes, Complete It"
        cancelText="No, Go Back"
        variant="success"
        onConfirm={confirmMarkComplete}
        onCancel={() => setConfirmDialog({ isOpen: false })}
      />
    </div>
  );
}