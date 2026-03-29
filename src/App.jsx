import { useKanban } from './hooks/useKanban';
import AddTaskInput from './components/AddTaskInput';
import Board from './components/Board';
import { LayoutDashboard } from 'lucide-react';

export default function App() {
  const { columns, columnOrder, addTask, deleteTask, moveTask } = useKanban();

  return (
    <div className="app">
      <header className="app-header" id="app-header">
        <div className="logo">
          <LayoutDashboard size={22} />
          <h1>Kanban</h1>
        </div>
        <p className="subtitle">Organize your work, one task at a time</p>
      </header>
      <AddTaskInput onAdd={addTask} />
      <Board
        columns={columns}
        columnOrder={columnOrder}
        onDelete={deleteTask}
        onMove={moveTask}
      />
    </div>
  );
}
