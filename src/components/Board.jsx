import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  rectIntersection,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState, useCallback } from 'react';
import Column from './Column';

/**
 * Board component — wraps all columns in a DndContext to enable drag-and-drop.
 * Handles three drag lifecycle events:
 *   1. dragStart — saves the active task for the drag overlay preview
 *   2. dragOver  — handles cross-column moves (fires continuously while dragging)
 *   3. dragEnd   — handles within-column reordering (fires once on drop)
 */
export default function Board({ columns, columnOrder, onEdit, onDelete, onMove }) {
  const [activeTask, setActiveTask] = useState(null); // Currently dragged task (for overlay)

  // PointerSensor: requires 5px drag distance to start (prevents accidental drags on click)
  // KeyboardSensor: allows drag via keyboard (Space to grab, arrows to move)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Custom collision detection strategy
  // Resolves issues where dragging into empty lists fails or sorting breaks
  const customCollisionDetection = useCallback(
    (args) => {
      // 1. Find droppables under the pointer (or intersection if pointer fails)
      const pointerCollisions = pointerWithin(args);
      
      const intersections = pointerCollisions.length > 0 
        ? pointerCollisions 
        : rectIntersection(args);
      
      if (intersections.length > 0) {
        // Extract collisions that are tasks (not columns)
        const taskCollisions = intersections.filter(
          (c) => !columnOrder.includes(c.id)
        );
        
        // If we're hovering over a task, prefer it (for sorting)
        if (taskCollisions.length > 0) {
          return taskCollisions;
        }
        
        // Otherwise, we are hovering over an empty column
        return intersections;
      }
      
      // 2. Fallback for keyboard drags or edge cases
      return closestCenter(args);
    },
    [columnOrder]
  );

  // Look up which column a task belongs to by checking each column's task list
  function findColumnOfTask(taskId) {
    for (const colId of columnOrder) {
      if (columns[colId].tasks.some((t) => t.id === taskId)) {
        return colId;
      }
    }
    return null;
  }

  // When drag begins: store the active task so DragOverlay can render a preview
  function handleDragStart(event) {
    const { active } = event;
    const colId = findColumnOfTask(active.id);
    if (colId) {
      const task = columns[colId].tasks.find((t) => t.id === active.id);
      setActiveTask(task || null);
    }
  }

  // Fires continuously while dragging — used for CROSS-COLUMN moves
  // Moves the task to the target column immediately for instant visual feedback
  function handleDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeColId = findColumnOfTask(active.id);
    if (!activeColId) return;

    // Determine target column — could be dropping on a column or on a task within it
    let overColId = null;
    if (columnOrder.includes(over.id)) {
      overColId = over.id; // Dropping directly on a column
    } else {
      overColId = findColumnOfTask(over.id); // Dropping on a task — find its column
    }

    // Only move if the task is entering a different column
    if (!overColId || activeColId === overColId) return;

    const overColumn = columns[overColId];
    const overIndex = overColumn.tasks.findIndex((t) => t.id === over.id);
    const newIndex = overIndex >= 0 ? overIndex : overColumn.tasks.length;

    onMove(active.id, activeColId, overColId, newIndex);
  }

  // Fires once when drag ends — used for WITHIN-COLUMN reordering
  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveTask(null); // Clear the overlay

    if (!over) return;

    const activeColId = findColumnOfTask(active.id);
    if (!activeColId) return;

    let overColId = null;
    if (columnOrder.includes(over.id)) {
      overColId = over.id;
    } else {
      overColId = findColumnOfTask(over.id);
    }

    if (!overColId) return;

    // Reorder within the same column if positions differ
    if (activeColId === overColId) {
      const col = columns[overColId];
      const activeIdx = col.tasks.findIndex((t) => t.id === active.id);
      
      let overIdx = col.tasks.findIndex((t) => t.id === over.id);
      // If dropping directly on the column (empty space below tasks), move to the end
      if (columnOrder.includes(over.id)) {
        overIdx = col.tasks.length - 1;
      }

      if (activeIdx !== -1 && overIdx !== -1 && activeIdx !== overIdx) {
        onMove(active.id, activeColId, overColId, overIdx);
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5" id="kanban-board">
        {columnOrder.map((colId) => (
          <Column
            key={colId}
            column={columns[colId]}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="flex items-start gap-2 p-3 bg-elevated border border-accent-blue rounded-sm shadow-lg shadow-[0_0_20px_rgba(91,141,239,0.15)] opacity-95">
            <p className="text-[0.85rem] font-medium text-primary leading-snug break-words">{activeTask.text}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
