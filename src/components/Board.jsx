import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';
import Column from './Column';

export default function Board({ columns, columnOrder, onDelete, onMove }) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function findColumnOfTask(taskId) {
    for (const colId of columnOrder) {
      if (columns[colId].tasks.some((t) => t.id === taskId)) {
        return colId;
      }
    }
    return null;
  }

  function handleDragStart(event) {
    const { active } = event;
    const colId = findColumnOfTask(active.id);
    if (colId) {
      const task = columns[colId].tasks.find((t) => t.id === active.id);
      setActiveTask(task || null);
    }
  }

  function handleDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeColId = findColumnOfTask(active.id);
    if (!activeColId) return;

    // Determine the target column
    let overColId = null;

    // Check if dropping over a column directly
    if (columnOrder.includes(over.id)) {
      overColId = over.id;
    } else {
      // Dropping over a task — find which column it belongs to
      overColId = findColumnOfTask(over.id);
    }

    if (!overColId || activeColId === overColId) return;

    // Move to the end of the target column when dragging over it
    const overColumn = columns[overColId];
    const overIndex = overColumn.tasks.findIndex((t) => t.id === over.id);
    const newIndex = overIndex >= 0 ? overIndex : overColumn.tasks.length;

    onMove(active.id, activeColId, overColId, newIndex);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveTask(null);

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

    if (activeColId === overColId) {
      // Reorder within same column
      const col = columns[overColId];
      const activeIdx = col.tasks.findIndex((t) => t.id === active.id);
      const overIdx = col.tasks.findIndex((t) => t.id === over.id);
      if (activeIdx !== -1 && overIdx !== -1 && activeIdx !== overIdx) {
        onMove(active.id, activeColId, overColId, overIdx);
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="board" id="kanban-board">
        {columnOrder.map((colId) => (
          <Column
            key={colId}
            column={columns[colId]}
            onDelete={onDelete}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="task-card drag-overlay">
            <p className="task-text">{activeTask.text}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
