import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'kanban-board-state';

const defaultColumns = {
  todo: { id: 'todo', title: 'To Do', tasks: [] },
  inProgress: { id: 'inProgress', title: 'In Progress', tasks: [] },
  done: { id: 'done', title: 'Done', tasks: [] },
};

const columnOrder = ['todo', 'inProgress', 'done'];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Validate structure
    if (parsed && parsed.columns && typeof parsed.columns === 'object') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function useKanban() {
  const [columns, setColumns] = useState(() => {
    const saved = loadState();
    return saved ? saved.columns : defaultColumns;
  });

  // Persist on every change
  useEffect(() => {
    saveState({ columns });
  }, [columns]);

  const addTask = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const task = {
      id: generateId(),
      text: trimmed,
      createdAt: Date.now(),
    };
    setColumns((prev) => ({
      ...prev,
      todo: {
        ...prev.todo,
        tasks: [task, ...prev.todo.tasks],
      },
    }));
  }, []);

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

  const moveTask = useCallback((taskId, fromColumnId, toColumnId, newIndex) => {
    setColumns((prev) => {
      // Find the task
      const fromCol = prev[fromColumnId];
      if (!fromCol) return prev;
      const taskIndex = fromCol.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const task = fromCol.tasks[taskIndex];

      if (fromColumnId === toColumnId) {
        // Reorder within the same column
        const newTasks = [...fromCol.tasks];
        newTasks.splice(taskIndex, 1);
        newTasks.splice(newIndex, 0, task);
        return {
          ...prev,
          [fromColumnId]: { ...fromCol, tasks: newTasks },
        };
      }

      // Move between columns
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
