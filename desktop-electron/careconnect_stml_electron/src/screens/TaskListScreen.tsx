import React from "react";
import { colors, sizing, typography } from "../constants/accessibility";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PriorityBadge } from "../components/PriorityBadge";
import { ConfirmDialog } from "../components/ConfirmDialog";
import type { ScreenId } from "../types";
import type { Task } from "../types";

/**
 * Task List Screen
 * 
 * WCAG 2.2 AA Compliance:
 * - Semantic HTML structure (WCAG 1.3.1)
 * - Keyboard navigation through list (WCAG 2.1.1)
 * - ARIA labels for screen readers (WCAG 4.1.2)
 * - High contrast colors (WCAG 1.4.3)
 * - Large touch targets (WCAG 2.5.5)
 * - Confirmation dialogs for destructive actions (WCAG 3.3.4)
 * - Non-color priority indicators (WCAG 1.4.1)
 * 
 * STML Considerations:
 * - Simple list view with clear visual hierarchy
 * - Selected task shown in detail panel
 * - Persistent back navigation
 * - Confirmation for task completion and deletion
 * - Clear priority indicators with text + symbols
 */
export default function TaskListScreen(props: { onGo: (screen: ScreenId) => void }) {
  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: '1',
      title: 'Take morning medication',
      description: 'Take blood pressure medication with water. Remember to take it with food.',
      priority: 'high',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '09:00',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Call Dr. Smith',
      description: 'Confirm appointment for next Tuesday at 2 PM. Phone number: (555) 123-4567',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '14:00',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Prepare grocery list',
      description: 'Make a list for weekly shopping. Don\'t forget milk and bread.',
      priority: 'low',
      // Static date for demo - in production, calculate dynamically
      dueDate: '2026-02-23',
      completed: false,
      createdAt: '2026-02-22T10:00:00.000Z',
    },
    {
      id: '4',
      title: 'Water plants',
      priority: 'low',
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(tasks[0]?.id || null);
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean;
    type: 'complete' | 'delete' | null;
    taskId?: string;
  }>({ isOpen: false, type: null });

  const selectedTask = tasks.find(t => t.id === selectedTaskId);
  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // WCAG 3.3.4: Confirmation for marking complete
  const handleMarkComplete = (taskId: string) => {
    setConfirmDialog({ isOpen: true, type: 'complete', taskId });
  };

  // WCAG 3.3.4: Confirmation for deletion
  const handleDelete = (taskId: string) => {
    setConfirmDialog({ isOpen: true, type: 'delete', taskId });
  };

  const confirmAction = () => {
    if (!confirmDialog.taskId) return;

    if (confirmDialog.type === 'complete') {
      setTasks(tasks.map(t => 
        t.id === confirmDialog.taskId 
          ? { ...t, completed: true, completedAt: new Date().toISOString() }
          : t
      ));
      // Select next incomplete task after completion
      const remainingIncomplete = tasks.filter(t => t.id !== confirmDialog.taskId && !t.completed);
      if (remainingIncomplete.length > 0) {
        setSelectedTaskId(remainingIncomplete[0].id);
      }
    } else if (confirmDialog.type === 'delete') {
      setTasks(tasks.filter(t => t.id !== confirmDialog.taskId));
      // Select first task after deletion
      const remaining = tasks.filter(t => t.id !== confirmDialog.taskId);
      if (remaining.length > 0) {
        setSelectedTaskId(remaining[0].id);
      } else {
        setSelectedTaskId(null);
      }
    }

    setConfirmDialog({ isOpen: false, type: null });
  };

  // Styles
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: colors.backgroundAlt,
  };

  const headerStyles: React.CSSProperties = {
    backgroundColor: colors.background,
    borderBottom: `1px solid ${colors.border}`,
    padding: sizing.spaceLg,
    display: 'flex',
    alignItems: 'center',
    gap: sizing.spaceMd,
  };

  const contentStyles: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  };

  const listPanelStyles: React.CSSProperties = {
    width: '400px',
    backgroundColor: colors.background,
    borderRight: `1px solid ${colors.border}`,
    overflowY: 'auto',
    padding: sizing.spaceMd,
  };

  const detailPanelStyles: React.CSSProperties = {
    flex: 1,
    padding: sizing.spaceXl,
    overflowY: 'auto',
  };

  const taskItemStyles = (isSelected: boolean): React.CSSProperties => ({
    padding: sizing.spaceMd,
    marginBottom: sizing.spaceSm,
    borderRadius: sizing.borderRadiusMd,
    border: isSelected ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
    backgroundColor: isSelected ? colors.primaryLight : colors.background,
    cursor: 'pointer',
    transition: 'all 150ms',
    // WCAG 2.5.5: Adequate touch target
    minHeight: sizing.minTouchTarget,
  });

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: sizing.spaceSm,
    marginTop: sizing.spaceMd,
  };

  return (
    <div style={containerStyles}>
      {/* Header with back button */}
      <header style={headerStyles}>
        {/* STML: Always visible back navigation */}
        <Button
          onClick={() => props.onGo('dashboard')}
          variant="secondary"
          ariaLabel="Go back to dashboard"
        >
          ← Back
        </Button>
        
        <h1 style={{
          fontSize: typography.fontSizeXl,
          fontWeight: typography.fontWeightBold,
          margin: 0,
        }}>
          My Tasks
        </h1>

        <div style={{ marginLeft: 'auto' }}>
          <Button
            onClick={() => alert('Add task feature coming soon!')}
            variant="primary"
            ariaLabel="Create a new task"
          >
            + New Task
          </Button>
        </div>
      </header>

      <div style={contentStyles}>
        {/* Task List Panel */}
        {/* WCAG 2.4.1: Navigation landmark for task list */}
        <nav style={listPanelStyles} aria-label="Task list">
          {/* Incomplete tasks */}
          <h2 style={sectionTitleStyles}>
            Active Tasks ({incompleteTasks.length})
          </h2>
          
          {incompleteTasks.map((task) => (
            <div
              key={task.id}
              style={taskItemStyles(task.id === selectedTaskId)}
              onClick={() => setSelectedTaskId(task.id)}
              onKeyDown={(e) => {
                // WCAG 2.1.1: Keyboard selection
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedTaskId(task.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Select task: ${task.title}`}
              aria-pressed={task.id === selectedTaskId}
              // WCAG 2.4.7: Focus indicator
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.focus}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: typography.fontSizeBase,
                fontWeight: typography.fontWeightMedium,
                marginBottom: sizing.spaceXs,
                color: colors.text,
              }}>
                {task.title}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: sizing.spaceSm }}>
                {/* WCAG 1.4.1: Priority badge uses text + color + symbols */}
                <PriorityBadge level={task.priority} />
                
                {task.dueTime && (
                  <span style={{ 
                    fontSize: typography.fontSizeSm,
                    color: colors.textSecondary,
                  }}>
                    {task.dueTime}
                  </span>
                )}
              </div>
            </div>
          ))}

          {incompleteTasks.length === 0 && (
            <div style={{ 
              padding: sizing.spaceLg, 
              textAlign: 'center',
              color: colors.textSecondary,
            }}>
              No active tasks. Great job! 🎉
            </div>
          )}

          {/* Completed tasks */}
          {completedTasks.length > 0 && (
            <>
              <h2 style={sectionTitleStyles}>
                Completed ({completedTasks.length})
              </h2>
              
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    ...taskItemStyles(task.id === selectedTaskId),
                    opacity: 0.6,
                  }}
                  onClick={() => setSelectedTaskId(task.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select completed task: ${task.title}`}
                >
                  <div style={{
                    fontSize: typography.fontSizeBase,
                    textDecoration: 'line-through',
                  }}>
                    ✓ {task.title}
                  </div>
                </div>
              ))}
            </>
          )}
        </nav>

        {/* Task Detail Panel */}
        {/* WCAG 2.4.1: Main content landmark */}
        <main style={detailPanelStyles}>
          {selectedTask ? (
            <Card padding="large">
              <div style={{ marginBottom: sizing.spaceLg }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: sizing.spaceMd,
                }}>
                  <h2 style={{
                    fontSize: typography.fontSizeXl,
                    fontWeight: typography.fontWeightBold,
                    margin: 0,
                    flex: 1,
                  }}>
                    {selectedTask.title}
                  </h2>
                  
                  {/* WCAG 1.4.1: Priority badge (not color-only) */}
                  <PriorityBadge level={selectedTask.priority} />
                </div>

                {/* Due date/time */}
                {(selectedTask.dueDate || selectedTask.dueTime) && (
                  <div style={{
                    fontSize: typography.fontSizeBase,
                    color: colors.textSecondary,
                    marginBottom: sizing.spaceMd,
                  }}>
                    {selectedTask.dueDate && (
                      <>
                        📅 {new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </>
                    )}
                    {selectedTask.dueTime && (
                      <> at {selectedTask.dueTime}</>
                    )}
                  </div>
                )}

                {/* Description */}
                {selectedTask.description && (
                  <div style={{
                    fontSize: typography.fontSizeBase,
                    lineHeight: typography.lineHeightRelaxed,
                    color: colors.text,
                    marginBottom: sizing.spaceLg,
                    padding: sizing.spaceMd,
                    backgroundColor: colors.backgroundAlt,
                    borderRadius: sizing.borderRadiusMd,
                  }}>
                    {selectedTask.description}
                  </div>
                )}

                {/* Task status */}
                <div style={{
                  fontSize: typography.fontSizeSm,
                  color: colors.textSecondary,
                  marginBottom: sizing.spaceLg,
                }}>
                  {selectedTask.completed ? (
                    <>
                      ✓ Completed {selectedTask.completedAt && 
                        `on ${new Date(selectedTask.completedAt).toLocaleDateString()}`}
                    </>
                  ) : (
                    <>Status: Active</>
                  )}
                </div>

                {/* Actions */}
                {!selectedTask.completed && (
                  <div style={{
                    display: 'flex',
                    gap: sizing.spaceMd,
                    flexWrap: 'wrap',
                  }}>
                    {/* WCAG 3.3.4: Primary action with confirmation */}
                    <Button
                      onClick={() => handleMarkComplete(selectedTask.id)}
                      variant="success"
                      size="large"
                      ariaLabel={`Mark "${selectedTask.title}" as complete`}
                    >
                      ✓ Mark Complete
                    </Button>

                    <Button
                      onClick={() => alert('Edit feature coming soon!')}
                      variant="secondary"
                      size="large"
                      ariaLabel={`Edit "${selectedTask.title}"`}
                    >
                      ✏️ Edit
                    </Button>

                    {/* WCAG 3.3.4: Destructive action with confirmation */}
                    <Button
                      onClick={() => handleDelete(selectedTask.id)}
                      variant="danger"
                      size="large"
                      ariaLabel={`Delete "${selectedTask.title}"`}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                )}

                {selectedTask.completed && (
                  <Button
                    onClick={() => {
                      setTasks(tasks.map(t => 
                        t.id === selectedTask.id 
                          ? { ...t, completed: false, completedAt: undefined }
                          : t
                      ));
                    }}
                    variant="secondary"
                    size="large"
                    ariaLabel={`Mark "${selectedTask.title}" as incomplete`}
                  >
                    ↺ Mark Incomplete
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: colors.textSecondary,
              fontSize: typography.fontSizeLg,
            }}>
              Select a task to view details
            </div>
          )}
        </main>
      </div>

      {/* WCAG 3.3.4: Confirmation dialogs for destructive actions */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen && confirmDialog.type === 'complete'}
        title="Mark Task Complete?"
        message={`Are you sure you want to mark "${selectedTask?.title}" as complete?`}
        confirmText="Yes, Complete It"
        cancelText="No, Go Back"
        variant="success"
        onConfirm={confirmAction}
        onCancel={() => setConfirmDialog({ isOpen: false, type: null })}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen && confirmDialog.type === 'delete'}
        title="Delete Task?"
        message={`Are you sure you want to permanently delete "${selectedTask?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete It"
        cancelText="No, Go Back"
        variant="danger"
        onConfirm={confirmAction}
        onCancel={() => setConfirmDialog({ isOpen: false, type: null })}
      />
    </div>
  );
}