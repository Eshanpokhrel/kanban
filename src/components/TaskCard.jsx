import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';

// Converts a timestamp to a human-readable relative time string
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

/**
 * A single draggable task card.
 * - useSortable makes it both draggable AND a drop target for ordering
 * - Drag listeners are attached only to the grip handle (not the whole card)
 * - Delete button is hidden by default and revealed on hover (via CSS)
 */
export default function TaskCard({ task, onDelete, columnId }) {
  const {
    attributes,  // ARIA attributes for accessibility
    listeners,   // Drag event handlers (pointer/keyboard)
    setNodeRef,  // Ref callback — registers this element with @dnd-kit
    transform,   // Current drag position offset { x, y }
    transition,  // CSS transition for smooth snap-back animation
    isDragging,
  } = useSortable({
    id: task.id,
    data: { columnId }, // Custom data so drag handlers know which column this card is in
  });

  // Convert transform object to CSS string, reduce opacity while dragging
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex items-center gap-2 p-3 bg-card border rounded-sm overflow-hidden group cursor-default transition-all duration-150 ease-out hover:-translate-y-[1px] ${
        isDragging ? 'shadow-lg z-50' : 'hover:shadow-sm'
      } ${
        task.priority 
          ? 'border-accent-amber/20 bg-gradient-to-r from-accent-amber/5 to-card hover:border-accent-amber/40 hover:shadow-[0_0_20px_rgba(240,168,88,0.15)]' 
          : 'border-border-subtle hover:border-border-hover'
      }`}
      id={`task-${task.id}`}
    >
      {/* priority vertical bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-colors duration-150 ${task.priority ? 'bg-accent-amber' : 'bg-transparent'}`} />

      {/* Drag handle */}
      <button
        className="flex items-center justify-center p-0.5 mt-[1px] text-muted bg-transparent border-none cursor-grab rounded flex-shrink-0 transition-colors duration-150 hover:text-secondary hover:bg-base active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-[0.85rem] font-medium text-primary leading-snug break-words">{task.text}</p>
        <div className="flex items-center gap-2 mt-1.5">
          {task.priority && <span className="text-[0.65rem] font-bold uppercase tracking-[0.05em] text-accent-amber bg-accent-amber/15 px-1.5 py-0.5 rounded">High Priority</span>}
          <span className="text-[0.7rem] text-muted">{timeAgo(task.createdAt)}</span>
        </div>
      </div>

      {/* Delete button (revealed on card hover) */}
      <button
        className="flex items-center justify-center p-1.5 text-muted bg-transparent border-none rounded-md cursor-pointer flex-shrink-0 opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 hover:!text-red-500 hover:!bg-red-500/10"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task: ${task.text}`}
        id={`delete-${task.id}`}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
