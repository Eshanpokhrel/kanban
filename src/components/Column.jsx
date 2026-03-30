import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { ClipboardList, Loader, CheckCircle2 } from 'lucide-react';

// Maps each column ID to its icon component and accent color
const columnMeta = {
  todo: { icon: ClipboardList, accent: 'var(--color-accent-blue)' },
  inProgress: { icon: Loader, accent: 'var(--color-accent-amber)' },
  done: { icon: CheckCircle2, accent: 'var(--color-accent-green)' },
};

/**
 * A droppable column that holds task cards.
 * - useDroppable makes this a valid drop zone for dragged cards
 * - SortableContext enables reordering tasks within this column
 * - Shows an empty state placeholder when no tasks exist
 */
export default function Column({ column, onDelete }) {
  // isOver is true when a dragged card is hovering above this column
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const meta = columnMeta[column.id] || columnMeta.todo;
  const Icon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      className={`glass-effect bg-glass-bg border rounded-2xl flex flex-col min-h-[200px] md:min-h-[400px] transition-all duration-250 ease-out ${isOver ? 'border-border-hover shadow-md' : 'border-border-subtle'}`}
      id={`column-${column.id}`}
    >
      <div className="flex items-center justify-between py-4 px-4 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <Icon size={16} style={{ color: meta.accent }} />
          <h2 className="text-[0.85rem] font-bold uppercase tracking-[0.06em] text-secondary">{column.title}</h2>
        </div>
        <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-[0.7rem] font-bold text-secondary bg-base rounded-full">{column.tasks.length}</span>
      </div>

      <SortableContext
        items={column.tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
          {column.tasks.length === 0 && (
            <div className="flex-1 flex items-center justify-center py-10 px-4">
              <p className="text-[0.8rem] text-muted italic">No tasks yet</p>
            </div>
          )}
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              columnId={column.id}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
