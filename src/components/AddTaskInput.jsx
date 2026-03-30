import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';

export default function AddTaskInput({ onAdd }) {
  const [value, setValue] = useState('');
  const [priority, setPriority] = useState(false);
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value, priority);
    setValue('');
    setPriority(false);
    inputRef.current?.focus();
  }

  return (
    <form className="flex flex-col sm:flex-row items-center gap-2.5 max-w-[540px] mx-auto mb-10 w-full" onSubmit={handleSubmit} id="add-task-form">
      <div className="flex-1 relative w-full">
        <input
          ref={inputRef}
          id="task-input"
          type="text"
          placeholder="What needs to be done?"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          className="w-full py-3 pl-4 pr-[70px] text-[0.9rem] text-primary bg-elevated border border-border-subtle rounded-md outline-none transition-colors duration-150 shadow-sm focus:border-accent-blue focus:ring-[3px] focus:ring-accent-blue/15 placeholder:text-muted"
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <span className="text-[0.6rem] font-semibold text-muted mb-1 pointer-events-none leading-none">Priority</span>
          <button
            type="button"
            onClick={() => setPriority(!priority)}
            className={`relative inline-flex items-center h-5 w-11 rounded-full transition-all duration-200 focus:outline-none flex-shrink-0 ${
              priority 
                ? 'bg-green-500 shadow-[0_0_18px_orange] border border-accent-amber/50' 
                : 'bg-surface border border-border-subtle hover:bg-elevated'
            }`}
            aria-pressed={priority}
            role="switch"
            aria-label="Toggle Priority"
          >
            <span className={`absolute left-1.5 text-[0.45rem] font-bold text-white transition-opacity ${priority ? 'opacity-100' : 'opacity-0'}`}>ON</span>
            <span className={`absolute right-1 text-[0.45rem] font-bold text-muted transition-opacity ${priority ? 'opacity-0' : 'opacity-100'}`}>OFF</span>
            <span aria-hidden="true" className={`pointer-events-none absolute left-[2px] top-[1px] inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${priority ? 'translate-x-[22px]' : 'translate-x-0'}`}></span>
          </button>
        </div>
      </div>
      
      <button type="submit" id="add-task-btn" aria-label="Add task" className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 py-3 px-5 text-[0.875rem] font-semibold text-white bg-gradient-to-br from-accent-blue to-accent-blue-hover border-none rounded-md cursor-pointer transition-all duration-150 whitespace-nowrap hover:-translate-y-[1px] hover:shadow-glow-blue hover:brightness-110 active:translate-y-0">
        <Plus size={18} strokeWidth={2.5} />
        <span>Add Task</span>
      </button>
    </form>
  );
}
