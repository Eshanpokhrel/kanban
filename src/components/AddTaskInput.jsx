import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';

export default function AddTaskInput({ onAdd }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue('');
    inputRef.current?.focus();
  }

  return (
    <form className="add-task-bar" onSubmit={handleSubmit} id="add-task-form">
      <div className="input-wrapper">
        <input
          ref={inputRef}
          id="task-input"
          type="text"
          placeholder="What needs to be done?"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
        />
      </div>
      <button type="submit" id="add-task-btn" aria-label="Add task">
        <Plus size={18} strokeWidth={2.5} />
        <span>Add Task</span>
      </button>
    </form>
  );
}
