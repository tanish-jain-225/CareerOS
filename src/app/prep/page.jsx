'use client';

import React, { useMemo } from 'react';
import {
  Zap, Plus, Terminal
} from 'lucide-react';
import { useCollection } from '@/hooks/useDatabase';
import ProgressRing from '@/components/ProgressRing';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';
import TechDomainCard from '@/components/TechDomainCard';
import DSATaskRow from '@/components/DSATaskRow';
import StarStoryCard from '@/components/StarStoryCard';

export default function PrepHub() {
  const { data: dsaTasks, addData: addDsa, updateData: updateDsa, deleteData: deleteDsa, loading: dsaLoading } = useCollection('dsa');
  const { data: starStories, addData: addStar, deleteData: deleteStar, updateData: updateStar, loading: starLoading } = useCollection('starStories');
  const { data: techTopics, addData: addTech, updateData: updateTech, deleteData: deleteTech, loading: techLoading } = useCollection('techTopics');

  const metrics = useMemo(() => {
    const dsaDone = dsaTasks.filter(t => t.completed).length;
    const dsaRate = dsaTasks.length ? Math.round((dsaDone / dsaTasks.length) * 100) : 0;
    const avgMastery = techTopics.length 
      ? Math.round(techTopics.reduce((acc, t) => acc + (t.mastery || 0), 0) / techTopics.length)
      : 0;
    return { dsaRate, avgMastery, totalStars: starStories.length };
  }, [dsaTasks, techTopics, starStories]);

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto w-full px-6 py-10 space-y-12 pb-safe">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Readiness Protocols Active</span>
          </div>
          <h1 className="title-xl">Tactical Preparation<span className="text-amber-500">.</span></h1>
          <p className="text-sm font-medium text-white/40 max-w-2xl leading-relaxed">
            High-fidelity technical mastery and behavioral intelligence vault. 
            Optimized for zero-fault interview execution.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <ProgressRing percentage={metrics.avgMastery} size={72} color="#6366f1" label="Mastery" />
          <ProgressRing percentage={metrics.dsaRate} size={72} color="#10b981" label="DSA" />
        </div>
      </header>

      <div className="flex flex-col xl:flex-row gap-10">
        <section className="flex-1 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black font-outfit tracking-tighter text-white">Stack Mastery</h2>
            <button 
              onClick={() => addTech({ topic: 'New Domain', mastery: 20 })}
              className="p-2.5 hover:bg-white/5 rounded-2xl text-white/20 hover:text-indigo-400 transition-all border border-white/5"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-6">
            {techLoading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="flex-1 min-w-[280px] panel h-48 animate-pulse bg-white/[0.01]" />)
            ) : techTopics.map(topic => (
              <div key={topic.id} className="flex-1 min-w-[280px]">
                <TechDomainCard topic={topic} onUpdate={updateTech} onDelete={deleteTech} />
              </div>
            ))}
          </div>
        </section>

        <section className="flex-1 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black font-outfit tracking-tighter text-white">DSA Sprint Log</h2>
            <button 
              onClick={() => addDsa({ title: 'New Problem', completed: false, difficulty: 'medium' })}
              className="p-2.5 hover:bg-white/5 rounded-2xl text-white/20 hover:text-emerald-400 transition-all border border-white/5"
              data-testid="dsa-add"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="panel border-white/5 bg-[#05070a]/50 p-6 space-y-4 min-h-[400px]">
            {dsaLoading ? (
              Array(6).fill(0).map((_, i) => <div key={i} className="h-14 animate-pulse bg-white/[0.01] rounded-2xl" />)
            ) : dsaTasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-20 opacity-10">
                <Terminal size={48} className="mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Queue Neutralized</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {dsaTasks.map(task => (
                  <DSATaskRow key={task.id} task={task} onUpdate={updateDsa} onDelete={deleteDsa} />
                ))}
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>

      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="space-y-1">
            <h2 className="text-2xl font-black font-outfit tracking-tighter text-white">Behavioral Intel (STAR)</h2>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Manifesting professional narrative nodes</p>
          </div>
          <button 
            onClick={() => addStar({ title: 'New Event', situation: '', task_: '', action: '', result: '' })}
            className="btn-primary h-12 px-6 flex items-center gap-3 active:scale-95 transition-all shadow-xl"
          >
            <Plus size={18} />
            <span className="text-[10px] uppercase font-black tracking-widest">Manifest Node</span>
          </button>
        </div>
        <div className="flex flex-col gap-8">
          {starLoading ? (
            Array(2).fill(0).map((_, i) => <div key={i} className="panel h-80 animate-pulse bg-white/[0.01]" />)
          ) : starStories.map(story => (
            <StarStoryCard key={story.id} story={story} onUpdate={updateStar} onDelete={deleteStar} />
          ))}
        </div>
      </section>

      <div className="panel border-amber-500/10 bg-amber-500/[0.02] border-l-4 border-l-amber-500 rounded-3xl p-8">
        <div className="flex items-start gap-8">
          <div className="p-5 rounded-2xl bg-amber-500 text-white shadow-2xl shadow-amber-500/20">
            <Zap size={32} />
          </div>
          <div className="space-y-3">
            <h4 className="font-black font-outfit text-xl uppercase tracking-tight text-white">Preparation Performance Protocol</h4>
            <p className="text-sm font-medium text-white/30 leading-relaxed max-w-4xl">
              Target thresholds require maintaining &ge; 80% mastery across core domains and &ge; 50 solved problems per sprint cycle. STAR nodes should be refreshed weekly to ensure maximum narrative fluidity during high-stakes synchronization events.
            </p>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
