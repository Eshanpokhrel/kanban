import { useKanban } from './hooks/useKanban';
import AddTaskInput from './components/AddTaskInput';
import Board from './components/Board';
import { LayoutDashboard } from 'lucide-react';

export default function App() {
  const { columns, columnOrder, addTask, editTask, deleteTask, moveTask } = useKanban();

  return (
    <div className="relative z-10 max-w-[1200px] mx-auto pt-10 px-6 pb-16">
      <header className="text-center mb-8" id="app-header">
        <div className="inline-flex items-center gap-2.5 text-primary">
          <LayoutDashboard size={22} className="text-accent-blue" />
          <h1 className="text-[1.75rem] font-extrabold tracking-[-0.03em] bg-gradient-to-br from-primary to-secondary clip-text-gradient">
            Kanban
          </h1>
        </div>
        <p className="text-muted text-sm mt-1 font-normal">Organize your work, one task at a time</p>
      </header>

      <AddTaskInput onAdd={addTask} />

      <Board
        columns={columns}
        columnOrder={columnOrder}
        onEdit={editTask}
        onDelete={deleteTask}
        onMove={moveTask}
      />
    </div>
  );
}
