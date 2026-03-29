import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function TaskCard({ task, onDelete, columnId }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${isDragging ? 'is-dragging' : ''}`}
      id={`task-${task.id}`}
    >
      <button
        className="drag-handle"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>
      <div className="task-content">
        <p className="task-text">{task.text}</p>
        <span className="task-time">{timeAgo(task.createdAt)}</span>
      </div>
      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task: ${task.text}`}
        id={`delete-${task.id}`}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
