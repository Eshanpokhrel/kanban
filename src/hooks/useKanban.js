import { useState, useCallback, useEffect } from 'react';

// Key used to store/retrieve board state from localStorage
const STORAGE_KEY = 'kanban-board-state';

// Default empty board structure — used when no saved state exists
const defaultColumns = {
  todo: { id: 'todo', title: 'To Do', tasks: [] },
  inProgress: { id: 'inProgress', title: 'In Progress', tasks: [] },
  done: { id: 'done', title: 'Done', tasks: [] },
};

// Controls the display order of columns on the board
const columnOrder = ['todo', 'inProgress', 'done'];

// Safely load board state from localStorage, returns null if missing or corrupted
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Validate that the saved data has the expected structure before using it
    if (parsed && parsed.columns && typeof parsed.columns === 'object') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

// Persist board state to localStorage as JSON
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — app still works, just won't persist
  }
}

// Generate a short unique ID using timestamp + random string (avoids needing a UUID library)
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Custom hook that manages all Kanban board state.
 * Returns the columns data and action functions (add, delete, move).
 * Automatically persists every state change to localStorage.
 */
export function useKanban() {
  // Lazy initialization: loadState() only runs on first render, not every re-render
  const [columns, setColumns] = useState(() => {
    const saved = loadState();
    return saved ? saved.columns : defaultColumns;
  });

  // Auto-save to localStorage whenever columns state changes
  useEffect(() => {
    saveState({ columns });
  }, [columns]);

  // Add a new task to the 'To Do' column respecting priority order
  const addTask = useCallback((text, priority) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const task = {
      id: generateId(),
      text: trimmed,
      createdAt: Date.now(),
      priority: priority,
    };
    
    setColumns((prev) => {
      const todoTasks = [...prev.todo.tasks];
      
      if (priority) {
        // High priority tasks go to the very top
        todoTasks.unshift(task);
      } else {
        // Normal priority tasks go just below the high priority ones
        const firstNonPriorityIndex = todoTasks.findIndex(t => !t.priority);
        if (firstNonPriorityIndex === -1) {
          // All existing tasks are high priority
          todoTasks.push(task);
        } else {
          // Insert right before the first non-priority task
          todoTasks.splice(firstNonPriorityIndex, 0, task);
        }
      }

      return {
        ...prev,
        todo: {
          ...prev.todo,
          tasks: todoTasks,
        },
      };
    });
  }, []);

  // Remove a task by ID — filters it out from whichever column it's in
  const deleteTask = useCallback((taskId) => {
    setColumns((prev) => {
      const next = {};
      for (const key of columnOrder) {
        next[key] = {
          ...prev[key],
          tasks: prev[key].tasks.filter((t) => t.id !== taskId),
        };
      }
      return next;
    });
  }, []);

  // Move a task: either reorder within a column, or transfer between columns
  const moveTask = useCallback((taskId, fromColumnId, toColumnId, newIndex) => {
    setColumns((prev) => {
      const fromCol = prev[fromColumnId];
      if (!fromCol) return prev;
      const taskIndex = fromCol.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const task = fromCol.tasks[taskIndex];

      if (fromColumnId === toColumnId) {
        // Reorder within the same column: remove from old position, insert at new
        const newTasks = [...fromCol.tasks];
        newTasks.splice(taskIndex, 1);
        newTasks.splice(newIndex, 0, task);
        return {
          ...prev,
          [fromColumnId]: { ...fromCol, tasks: newTasks },
        };
      }

      // Transfer between columns: remove from source, insert into target
      const toCol = prev[toColumnId];
      if (!toCol) return prev;

      const fromTasks = fromCol.tasks.filter((t) => t.id !== taskId);
      const toTasks = [...toCol.tasks];
      toTasks.splice(newIndex, 0, task);

      return {
        ...prev,
        [fromColumnId]: { ...fromCol, tasks: fromTasks },
        [toColumnId]: { ...toCol, tasks: toTasks },
      };
    });
  }, []);

  return { columns, columnOrder, addTask, deleteTask, moveTask };
}
