'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, ClipboardList } from 'lucide-react';

/**
 * ObjectiveList component for managing daily tasks and goals.
 * 
 * @param {Object} props
 * @param {Array} props.tasks - List of task objects.
 * @param {string} props.newTask - Current value of the new task input.
 * @param {Function} props.setNewTask - Setter for the new task input.
 * @param {Function} props.onAdd - Callback to add a task.
 * @param {Function} props.onUpdate - Callback to update a task's status.
 * @param {Function} props.onDelete - Callback to delete a task.
 */
export default function ObjectiveList({ tasks, newTask, setNewTask, onAdd, onUpdate, onDelete }) {
  return (
    <section className="flex-1 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Strategic Queue</h3>
          <h4 className="text-xl font-black font-outfit text-white">Daily Objectives</h4>
        </div>
        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
            {tasks.filter(t => !t.completed).length} Pending
          </span>
        </div>
      </div>

      <div className="panel flex flex-col min-h-[450px] border-white/5">
        <div className="relative mb-6">
          <input
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-5 pr-14 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all font-medium"
            placeholder="Synchronize objective..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAdd()}
          />
          <button 
            onClick={onAdd}
            className="absolute right-2 top-2 p-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto max-h-[350px] pr-2 scrollbar-hide">
          {tasks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-20">
              <ClipboardList size={48} strokeWidth={1} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Active Objectives</p>
            </div>
          ) : (
            tasks.map((task) => (
              <motion.div 
                layout
                key={task.id} 
                className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.015] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all"
              >
                <button
                  onClick={() => onUpdate(task.id, { completed: !task.completed })}
                  className={`w-6 h-6 rounded-lg border transition-all flex items-center justify-center flex-shrink-0 ${
                    task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-white/10 hover:border-indigo-500/50'
                  }`}
                >
                  {task.completed && <CheckCircle2 size={14} className="text-white" />}
                </button>
                <span className={`text-xs font-bold flex-1 transition-all ${task.completed ? 'text-white/15 line-through' : 'text-white/70'}`}>
                  {task.text}
                </span>
                <button 
                  onClick={() => onDelete(task.id)}
                  className="p-2 text-white/10 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
