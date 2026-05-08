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
          <h3 className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
            Strategic Queue
          </h3>
          <h4 className="font-outfit text-xl font-black text-white">Daily Objectives</h4>
        </div>
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-1">
          <span className="text-[9px] font-black tracking-widest text-indigo-400 uppercase">
            {tasks.filter((t) => !t.completed).length} Pending
          </span>
        </div>
      </div>

      <div className="panel flex min-h-[450px] flex-col border-white/5">
        <div className="relative mb-6">
          <input
            className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 pr-14 text-xs font-medium text-white transition-all placeholder:text-white/20 focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none"
            placeholder="Synchronize objective..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAdd()}
          />
          <button
            onClick={onAdd}
            className="absolute top-2 right-2 rounded-xl bg-indigo-500 p-2.5 text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-600"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="scrollbar-hide max-h-[350px] flex-1 space-y-3 overflow-y-auto pr-2">
          {tasks.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 p-8 text-center opacity-20">
              <ClipboardList size={48} strokeWidth={1} />
              <p className="text-[10px] font-black tracking-[0.3em] uppercase">
                No Active Objectives
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <motion.div
                layout
                key={task.id}
                className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.015] p-4 transition-all hover:border-white/10 hover:bg-white/[0.03]"
              >
                <button
                  onClick={() => onUpdate(task.id, { completed: !task.completed })}
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border transition-all ${
                    task.completed
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-white/10 hover:border-indigo-500/50'
                  }`}
                >
                  {task.completed && <CheckCircle2 size={14} className="text-white" />}
                </button>
                <span
                  className={`flex-1 text-xs font-bold transition-all ${task.completed ? 'text-white/15 line-through' : 'text-white/70'}`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => onDelete(task.id)}
                  className="rounded-xl p-2 text-white/10 transition-all hover:bg-rose-500/5 hover:text-rose-400"
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
