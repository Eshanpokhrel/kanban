import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { ClipboardList, Loader, CheckCircle2 } from 'lucide-react';

const columnMeta = {
  todo: { icon: ClipboardList, accent: 'var(--accent-blue)' },
  inProgress: { icon: Loader, accent: 'var(--accent-amber)' },
  done: { icon: CheckCircle2, accent: 'var(--accent-green)' },
};

export default function Column({ column, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const meta = columnMeta[column.id] || columnMeta.todo;
  const Icon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      className={`column ${isOver ? 'column-over' : ''}`}
      id={`column-${column.id}`}
    >
      <div className="column-header" style={{ '--col-accent': meta.accent }}>
        <div className="column-title-row">
          <Icon size={16} style={{ color: meta.accent }} />
          <h2 className="column-title">{column.title}</h2>
        </div>
        <span className="task-count">{column.tasks.length}</span>
      </div>
      <SortableContext
        items={column.tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="task-list">
          {column.tasks.length === 0 && (
            <div className="empty-state">
              <p>No tasks yet</p>
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
