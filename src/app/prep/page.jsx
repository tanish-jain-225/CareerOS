'use client';

import React, { useMemo } from 'react';
import { Zap, Plus, Terminal } from 'lucide-react';
import { useCollection } from '@/hooks/useDatabase';
import ProgressRing from '@/components/ui/ProgressRing';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';
import TechDomainCard from '@/components/features/identity/TechDomainCard';
import DSATaskRow from '@/components/features/prep/DSATaskRow';
import StarStoryCard from '@/components/ui/StarStoryCard';

/**
 * PrepHub (Tactical Preparation) - High-intensity technical readiness node.
 *
 * Features:
 * - Stack Mastery: Domain-specific proficiency tracking with mastery sliders.
 * - DSA Sprint Log: Pattern-based problem solving tracker with difficulty levels.
 * - Behavioral Intel: High-fidelity STAR (Situation, Task, Action, Result) narrative vault.
 * - Performance Protocols: Real-time calibration rings for overall readiness metrics.
 *
 * @returns {JSX.Element} The rendered preparation hub interface.
 */
export default function PrepHub() {
  const {
    data: dsaTasks,
    addData: addDsa,
    updateData: updateDsa,
    deleteData: deleteDsa,
    loading: dsaLoading,
  } = useCollection('dsa');
  const {
    data: starStories,
    addData: addStar,
    deleteData: deleteStar,
    updateData: updateStar,
    loading: starLoading,
  } = useCollection('starStories');
  const {
    data: techTopics,
    addData: addTech,
    updateData: updateTech,
    deleteData: deleteTech,
    loading: techLoading,
  } = useCollection('techTopics');

  const metrics = useMemo(() => {
    const dsaDone = dsaTasks.filter((t) => t.completed).length;
    const dsaRate = dsaTasks.length ? Math.round((dsaDone / dsaTasks.length) * 100) : 0;
    const avgMastery = techTopics.length
      ? Math.round(techTopics.reduce((acc, t) => acc + (t.mastery || 0), 0) / techTopics.length)
      : 0;
    return { dsaRate, avgMastery, totalStars: starStories.length };
  }, [dsaTasks, techTopics, starStories]);

  return (
    <ProtectedRoute>
      <div className="pb-safe mx-auto w-full max-w-7xl space-y-12 px-6 py-10">
        <header className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
              <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">
                Readiness Protocols Active
              </span>
            </div>
            <h1 className="title-xl">
              Tactical Preparation<span className="text-amber-500">.</span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed font-medium text-white/40">
              High-fidelity technical mastery and behavioral intelligence vault. Optimized for
              zero-fault interview execution.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <ProgressRing
              percentage={metrics.avgMastery}
              size={72}
              color="#6366f1"
              label="Mastery"
            />
            <ProgressRing percentage={metrics.dsaRate} size={72} color="#10b981" label="DSA" />
          </div>
        </header>

        <div className="flex flex-col gap-10 xl:flex-row">
          <section className="flex-1 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-outfit text-2xl font-black tracking-tighter text-white">
                Stack Mastery
              </h2>
              <button
                onClick={() => addTech({ topic: 'New Domain', mastery: 20 })}
                className="rounded-2xl border border-white/5 p-2.5 text-white/20 transition-all hover:bg-white/5 hover:text-indigo-400"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-col flex-wrap gap-6 sm:flex-row">
              {techLoading
                ? Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="panel h-48 min-w-[240px] flex-1 animate-pulse bg-white/[0.01]"
                      />
                    ))
                : techTopics.map((topic) => (
                    <div key={topic.id} className="min-w-[240px] flex-1">
                      <TechDomainCard topic={topic} onUpdate={updateTech} onDelete={deleteTech} />
                    </div>
                  ))}
            </div>
          </section>

          <section className="flex-1 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-outfit text-2xl font-black tracking-tighter text-white">
                DSA Sprint Log
              </h2>
              <button
                onClick={() =>
                  addDsa({ title: 'New Problem', completed: false, difficulty: 'medium' })
                }
                className="rounded-2xl border border-white/5 p-2.5 text-white/20 transition-all hover:bg-white/5 hover:text-emerald-400"
                data-testid="dsa-add"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="panel min-h-[400px] space-y-4 border-white/5 bg-[#05070a]/50 p-6">
              {dsaLoading ? (
                Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-14 animate-pulse rounded-2xl bg-white/[0.01]" />
                  ))
              ) : dsaTasks.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-20 opacity-10">
                  <Terminal size={48} className="mb-4" />
                  <p className="text-[10px] font-black tracking-widest uppercase">
                    Queue Neutralized
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {dsaTasks.map((task) => (
                    <DSATaskRow
                      key={task.id}
                      task={task}
                      onUpdate={updateDsa}
                      onDelete={deleteDsa}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </section>
        </div>

        <section className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
            <div className="space-y-1">
              <h2 className="font-outfit text-2xl font-black tracking-tighter text-white">
                Behavioral Intel (STAR)
              </h2>
              <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">
                Manifesting professional narrative nodes
              </p>
            </div>
            <button
              onClick={() =>
                addStar({ title: 'New Event', situation: '', task_: '', action: '', result: '' })
              }
              className="btn-primary flex h-12 items-center justify-center gap-3 px-6 shadow-xl transition-all active:scale-95 w-full sm:w-auto"
            >
              <Plus size={18} />
              <span className="text-[10px] font-black tracking-widest uppercase">
                Manifest Node
              </span>
            </button>
          </div>
          <div className="flex flex-col gap-8">
            {starLoading
              ? Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="panel h-80 animate-pulse bg-white/[0.01]" />
                  ))
              : starStories.map((story) => (
                  <StarStoryCard
                    key={story.id}
                    story={story}
                    onUpdate={updateStar}
                    onDelete={deleteStar}
                  />
                ))}
          </div>
        </section>

        <div className="panel rounded-3xl border-l-4 border-amber-500/10 border-l-amber-500 bg-amber-500/[0.02] p-8">
          <div className="flex items-start gap-8">
            <div className="rounded-2xl bg-amber-500 p-5 text-white shadow-2xl shadow-amber-500/20">
              <Zap size={32} />
            </div>
            <div className="space-y-3">
              <h4 className="font-outfit text-xl font-black tracking-tight text-white uppercase">
                Preparation Performance Protocol
              </h4>
              <p className="max-w-4xl text-sm leading-relaxed font-medium text-white/30">
                Target thresholds require maintaining &ge; 80% mastery across core domains and &ge;
                50 solved problems per sprint cycle. STAR nodes should be refreshed weekly to ensure
                maximum narrative fluidity during high-stakes synchronization events.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
