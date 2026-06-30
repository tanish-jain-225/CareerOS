'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  CalendarDays,
  MessageSquare,
  Zap,
  TrendingUp,
  Target,
  Award,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { useCollection } from '@/hooks/useDatabase';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { motion } from 'framer-motion';

// Components
import StatCard from '@/components/features/dashboard/StatCard';
import SuccessAnalytics from '@/components/features/dashboard/SuccessAnalytics';
import ObjectiveList from '@/components/features/dashboard/ObjectiveList';

/**
 * DashboardPage - The mission command center for CareerOS.
 *
 * This page aggregates data across all tactical modules (Jobs, Outreach, Technical Readiness, Tasks)
 * to provide a high-fidelity overview of the user's career acquisition progress.
 *
 * Features:
 * - Real-time synchronization of application metrics.
 * - Technical readiness progression tracking (DSA and Stack Mastery).
 * - Outreach efficiency and synchronization rate analytics.
 * - Dynamic daily strategy list for task management.
 *
 * @returns {JSX.Element} The rendered dashboard interface.
 */
export default function DashboardPage() {
  const toast = useToast();
  const {
    jobs: { data: jobs },
    outreach: { data: outreach },
    profile: { data: profile },
  } = useData();
  const pf = profile || { name: 'Operator' };

  const { data: techTopics } = useCollection('techTopics', null);
  const { data: dsa } = useCollection('dsa', null);
  const {
    data: tasks,
    addData: addTask,
    updateData: updateTask,
    deleteData: deleteTask,
  } = useCollection('tasks', null);

  const [newTask, setNewTask] = useState('');
  const [greeting, setGreeting] = useState('Welcome');
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    setCurrentDate(new Date());
  }, []);

  const metrics = useMemo(() => {
    const activeApplications = jobs.filter(
      (j) => !['offer', 'sourced', 'rejected'].includes(j.status)
    ).length;
    const interviews = jobs.filter((j) => ['interview', 'offer'].includes(j.status)).length;
    const offers = jobs.filter((j) => j.status === 'offer').length;

    const dsaTotal = dsa.length;
    const dsaCompleted = dsa.filter((d) => d.completed).length;
    const dsaPercent = dsaTotal ? Math.round((dsaCompleted / dsaTotal) * 100) : 0;

    const techAverage = techTopics.length
      ? Math.round(techTopics.reduce((sum, t) => sum + (t.mastery || 0), 0) / techTopics.length)
      : 0;

    const overdueFollowUps = jobs.filter((j) => {
      if (!j.appliedDate || !['applied', 'followed_up'].includes(j.status) || !currentDate)
        return false;
      const daysSinceApplied = Math.floor((currentDate - new Date(j.appliedDate)) / 86400000);
      return daysSinceApplied >= 3;
    }).length;

    const weeklyApplications = jobs.filter((j) => {
      if (!j.createdAt || !currentDate) return false;
      const created = new Date(j.createdAt);
      const diff = (currentDate - created) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }).length;

    return {
      activeApplications,
      interviews,
      offers,
      dsaPercent,
      techAverage,
      overdueFollowUps,
      weeklyApplications,
      dsaCompleted,
      dsaTotal,
    };
  }, [dsa, jobs, techTopics, currentDate]);

  const recentOutreach = useMemo(() => {
    return [...outreach].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 3);
  }, [outreach]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await addTask({ text: newTask.trim(), completed: false, priority: 'standard' });
    setNewTask('');
    toast.success('Strategy Node Synchronized');
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-7xl space-y-12 px-6 py-10">
        {/* Dynamic Header */}
        <header className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
              <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">
                System Operational
              </span>
            </div>
            <h1 className="title-xl" data-testid="dashboard-title">
              {greeting},{' '}
              <span className="text-indigo-400">{pf.name?.split(' ')[0] || 'Operator'}</span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed font-medium text-white/40">
              Real-time synchronization of application pipelines, technical readiness modules, and
              engagement cadences.
            </p>
          </div>
          <div className="chip flex items-center gap-3 rounded-2xl border-white/5 bg-white/[0.03] px-5 py-2.5 backdrop-blur-xl">
            <CalendarDays size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black tracking-widest text-white/60">
              {currentDate
                ? currentDate.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Loading Date...'}
            </span>
          </div>
        </header>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Active Pipeline"
            value={metrics.activeApplications}
            hint={`${metrics.weeklyApplications} new applications this cycle`}
            tone="text-indigo-400"
            icon={Briefcase}
            delay={0.1}
          />
          <StatCard
            label="Pending Syncs"
            value={metrics.overdueFollowUps}
            hint="Applications requiring follow-up"
            tone={metrics.overdueFollowUps > 0 ? 'text-amber-400' : 'text-emerald-400'}
            icon={Target}
            delay={0.2}
          />
          <StatCard
            label="Active Interviews"
            value={metrics.interviews}
            hint="High-intensity engagement loops"
            tone="text-rose-400"
            icon={TrendingUp}
            delay={0.3}
          />
          <StatCard
            label="Offers Secured"
            value={metrics.offers}
            hint="Successful mission completions"
            tone="text-emerald-400"
            icon={Award}
            delay={0.4}
          />
        </div>

        {/* Analytics & Efficiency Rows */}
        <div className="flex flex-col gap-8 md:flex-row">
          <SuccessAnalytics jobs={jobs} metrics={metrics} />

          <div className="panel flex-1 space-y-8 border-white/5 bg-white/[0.01] p-8">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black tracking-[0.3em] text-emerald-400 uppercase">
                Response Metrics
              </h3>
              <h4 className="font-outfit text-xl font-black text-white">Engagement Efficiency</h4>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center py-4">
              <div className="relative h-40 w-40">
                <svg className="h-full w-full -rotate-90 transform">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={440}
                    initial={{ strokeDashoffset: 440 }}
                    animate={{
                      strokeDashoffset:
                        440 -
                        (440 *
                          (outreach.length
                            ? Math.round(
                                (outreach.filter((o) => o.status === 'Replied').length /
                                  outreach.length) *
                                  100
                              )
                            : 0)) /
                          100,
                    }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    className="text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-outfit text-3xl font-black text-white">
                    {outreach.length
                      ? Math.round(
                          (outreach.filter((o) => o.status === 'Replied').length /
                            outreach.length) *
                            100
                        )
                      : 0}
                    %
                  </span>
                  <span className="text-[8px] font-black tracking-widest text-white/20 uppercase">
                    Sync Rate
                  </span>
                </div>
              </div>
              <div className="mt-10 flex w-full gap-8">
                <div className="flex-1 text-center">
                  <p className="font-outfit text-xl font-black text-white">{outreach.length}</p>
                  <p className="text-[8px] font-black tracking-widest text-white/20 uppercase">
                    Total Transmissions
                  </p>
                </div>
                <div className="flex-1 text-center">
                  <p className="font-outfit text-xl font-black text-white">
                    {outreach.filter((o) => o.status === 'Replied').length}
                  </p>
                  <p className="text-[8px] font-black tracking-widest text-white/20 uppercase">
                    Acks Received
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progression & Queue Layout */}
        <div className="flex flex-col gap-8 lg:flex-row">
          <section className="flex-[2] space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
                  Performance Audit
                </h3>
                <h4 className="font-outfit text-xl font-black text-white">Technical Readiness</h4>
              </div>
              <Link
                href="/prep"
                className="group flex items-center gap-2 text-[10px] font-black tracking-widest text-indigo-400 uppercase transition-colors hover:text-indigo-300"
              >
                Full Module{' '}
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="panel group relative flex-1 overflow-hidden">
                <div className="mb-8 flex items-start justify-between">
                  <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-400">
                    <Clock size={24} />
                  </div>
                  <div className="text-right">
                    <span className="font-outfit text-3xl font-black text-white">
                      {metrics.dsaPercent}%
                    </span>
                    <p className="mt-1 text-[8px] font-black tracking-widest text-white/20 uppercase">
                      Patterns Mastered
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-white/40 uppercase">
                    <span>DSA Progression</span>{' '}
                    <span>
                      {metrics.dsaCompleted} / {metrics.dsaTotal}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.dsaPercent}%` }}
                      className="shadow-indigo h-full bg-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="panel group relative flex-1 overflow-hidden">
                <div className="mb-8 flex items-start justify-between">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
                    <Zap size={24} />
                  </div>
                  <div className="text-right">
                    <span className="font-outfit text-3xl font-black text-white">
                      {metrics.techAverage}%
                    </span>
                    <p className="mt-1 text-[8px] font-black tracking-widest text-white/20 uppercase">
                      Stack Proficiency
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-white/40 uppercase">
                    <span>System Knowledge</span> <span>{techTopics.length} Domains</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.techAverage}%` }}
                      className="shadow-emerald h-full bg-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
                  Recent Interactions
                </h3>
                <Link
                  href="/comms"
                  className="text-[10px] font-black tracking-widest text-white/20 uppercase transition-colors hover:text-white/40"
                >
                  View CRM →
                </Link>
              </div>
              <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
                {recentOutreach.length === 0 ? (
                  <div className="panel flex w-full flex-col items-center justify-center border-dashed border-white/5 py-12 text-center">
                    <MessageSquare size={32} className="mb-4 text-white/5" />
                    <p className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
                      No recent interactions logged
                    </p>
                  </div>
                ) : (
                  recentOutreach.map((contact, idx) => (
                    <motion.div
                      key={contact.id || idx}
                      whileHover={{ y: -4 }}
                      className="panel flex min-w-[240px] flex-1 cursor-pointer flex-col gap-4 border-white/5 p-5 transition-all hover:border-indigo-500/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] text-xs font-black text-indigo-400">
                          {contact.name?.[0] || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-black text-white">{contact.name}</p>
                          <p className="truncate text-[9px] font-bold tracking-widest text-white/20 uppercase">
                            {contact.role || 'Connection'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-auto flex items-center justify-between border-t border-white/[0.03] pt-4">
                        <span className="text-[8px] font-black tracking-widest text-white/20 uppercase">
                          {contact.company}
                        </span>
                        <span
                          className={`rounded-lg px-2 py-1 text-[7px] font-black tracking-tighter uppercase ${
                            contact.status === 'Replied'
                              ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                              : 'border border-white/5 bg-white/5 text-white/30'
                          }`}
                        >
                          {contact.status || 'Active'}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </section>

          <ObjectiveList
            tasks={tasks}
            newTask={newTask}
            setNewTask={setNewTask}
            onAdd={handleAddTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </div>

        {/* Global System Feed Footer */}
        <footer className="mt-12 border-t border-white/[0.03] pt-12">
          <div className="panel relative overflow-hidden border-dashed border-white/5 bg-white/[0.01] p-8">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
              <Zap size={120} />
            </div>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                  <h3 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">
                    Subsystem Feed
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-3 text-[11px] font-medium text-white/20">
                    <span className="text-indigo-500/40">[OK]</span> Pipeline Synchronized:{' '}
                    {jobs.length} nodes active
                  </p>
                  <p className="flex items-center gap-3 text-[11px] font-medium text-white/20">
                    <span className="text-indigo-500/40">[OK]</span> Readiness Mastered:{' '}
                    {metrics.dsaPercent}% achieved
                  </p>
                  <p className="flex items-center gap-3 text-[11px] font-medium text-white/20">
                    <span className="text-indigo-500/40">[OK]</span> Transmission Buffer:{' '}
                    {outreach.length} logged
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-4 text-[9px] font-black tracking-widest text-white/10 uppercase">
                  <span>Kernel v4.2.0-STABLE</span>{' '}
                  <div className="h-1 w-1 rounded-full bg-white/5" /> <span>Uptime: 24.7h</span>
                </div>
                <p className="text-[8px] font-bold tracking-[0.5em] text-indigo-500/20 uppercase">
                  CareerOS Operating System
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
