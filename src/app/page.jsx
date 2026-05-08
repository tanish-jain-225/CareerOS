'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, CalendarDays, MessageSquare, Zap, TrendingUp, 
  Target, Award, ArrowUpRight, Clock
} from 'lucide-react';
import { useCollection } from '@/hooks/useDatabase';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';

// Components
import StatCard from '@/components/StatCard';
import SuccessAnalytics from '@/components/SuccessAnalytics';
import ObjectiveList from '@/components/ObjectiveList';

/**
 * DashboardPage - Mission Command center for CareerOS.
 * Aggregates data from all modules to provide a high-level tactical overview.
 */
export default function DashboardPage() {
  const toast = useToast();
  const { jobs: { data: jobs }, outreach: { data: outreach }, profile: { data: profile } } = useData();
  const pf = profile || { name: 'Operator' };
  
  const { data: techTopics } = useCollection('techTopics', null);
  const { data: dsa } = useCollection('dsa', null);
  const { data: tasks, addData: addTask, updateData: updateTask, deleteData: deleteTask } = useCollection('tasks', null);

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
    const activeApplications = jobs.filter((j) => !['offer', 'sourced', 'rejected'].includes(j.status)).length;
    const interviews = jobs.filter((j) => ['interview', 'offer'].includes(j.status)).length;
    const offers = jobs.filter((j) => j.status === 'offer').length;
    
    const dsaTotal = dsa.length;
    const dsaCompleted = dsa.filter((d) => d.completed).length;
    const dsaPercent = dsaTotal ? Math.round((dsaCompleted / dsaTotal) * 100) : 0;
    
    const techAverage = techTopics.length
      ? Math.round(techTopics.reduce((sum, t) => sum + (t.mastery || 0), 0) / techTopics.length)
      : 0;

    const overdueFollowUps = jobs.filter((j) => {
      if (!j.appliedDate || !['applied', 'followed_up'].includes(j.status) || !currentDate) return false;
      const daysSinceApplied = Math.floor((currentDate - new Date(j.appliedDate)) / 86400000);
      return daysSinceApplied >= 3;
    }).length;

    const weeklyApplications = jobs.filter(j => {
      if (!j.createdAt || !currentDate) return false;
      const created = new Date(j.createdAt);
      const diff = (currentDate - created) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }).length;

    return {
      activeApplications, interviews, offers, dsaPercent, 
      techAverage, overdueFollowUps, weeklyApplications, dsaCompleted, dsaTotal
    };
  }, [dsa, jobs, techTopics, currentDate]);

  const recentOutreach = useMemo(() => {
    return [...outreach]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 3);
  }, [outreach]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await addTask({ text: newTask.trim(), completed: false, priority: 'standard' });
    setNewTask('');
    toast.success('Strategy Node Synchronized');
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto w-full px-6 py-10 space-y-12">
        
        {/* Dynamic Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">System Operational</span>
            </div>
            <h1 className="title-xl" data-testid="dashboard-title">
              {greeting}, <span className="text-indigo-400">{pf.name?.split(' ')[0] || 'Operator'}</span>
            </h1>
            <p className="text-sm font-medium text-white/40 max-w-2xl leading-relaxed">
              Real-time synchronization of application pipelines, technical readiness modules, and engagement cadences.
            </p>
          </div>
          <div className="chip py-2.5 px-5 bg-white/[0.03] backdrop-blur-xl border-white/5 rounded-2xl flex items-center gap-3">
            <CalendarDays size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black text-white/60 tracking-widest">
              {currentDate ? currentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Loading Date...'}
            </span>
          </div>
        </header>

        {/* Global Stats Grid */}
        <div className="flex flex-wrap gap-6">
          <StatCard label="Active Pipeline" value={metrics.activeApplications} hint={`${metrics.weeklyApplications} new applications this cycle`} tone="text-indigo-400" icon={Briefcase} delay={0.1} />
          <StatCard label="Pending Syncs" value={metrics.overdueFollowUps} hint="Applications requiring follow-up" tone={metrics.overdueFollowUps > 0 ? "text-amber-400" : "text-emerald-400"} icon={Target} delay={0.2} />
          <StatCard label="Active Interviews" value={metrics.interviews} hint="High-intensity engagement loops" tone="text-rose-400" icon={TrendingUp} delay={0.3} />
          <StatCard label="Offers Secured" value={metrics.offers} hint="Successful mission completions" tone="text-emerald-400" icon={Award} delay={0.4} />
        </div>

        {/* Analytics & Efficiency Rows */}
        <div className="flex flex-col md:flex-row gap-8">
          <SuccessAnalytics jobs={jobs} metrics={metrics} />

          <div className="flex-1 panel border-white/5 bg-white/[0.01] p-8 space-y-8">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Response Metrics</h3>
              <h4 className="text-xl font-black font-outfit text-white">Engagement Efficiency</h4>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center py-4">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <motion.circle 
                    cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={440}
                    initial={{ strokeDashoffset: 440 }}
                    animate={{ strokeDashoffset: 440 - (440 * (outreach.length ? Math.round((outreach.filter(o => o.status === 'Replied').length / outreach.length) * 100) : 0)) / 100 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black font-outfit text-white">
                    {outreach.length ? Math.round((outreach.filter(o => o.status === 'Replied').length / outreach.length) * 100) : 0}%
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Sync Rate</span>
                </div>
              </div>
              <div className="mt-10 flex gap-8 w-full">
                <div className="flex-1 text-center">
                  <p className="text-xl font-black font-outfit text-white">{outreach.length}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Total Transmissions</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-xl font-black font-outfit text-white">{outreach.filter(o => o.status === 'Replied').length}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Acks Received</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progression & Queue Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          <section className="flex-[2] space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Performance Audit</h3>
                <h4 className="text-xl font-black font-outfit text-white">Technical Readiness</h4>
              </div>
              <Link href="/prep" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">
                Full Module <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 panel group relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><Clock size={24} /></div>
                  <div className="text-right">
                    <span className="text-3xl font-black font-outfit text-white">{metrics.dsaPercent}%</span>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Patterns Mastered</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                    <span>DSA Progression</span> <span>{metrics.dsaCompleted} / {metrics.dsaTotal}</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${metrics.dsaPercent}%` }} className="h-full bg-indigo-500 shadow-indigo" />
                  </div>
                </div>
              </div>

              <div className="flex-1 panel group relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Zap size={24} /></div>
                  <div className="text-right">
                    <span className="text-3xl font-black font-outfit text-white">{metrics.techAverage}%</span>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Stack Proficiency</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                    <span>System Knowledge</span> <span>{techTopics.length} Domains</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${metrics.techAverage}%` }} className="h-full bg-emerald-500 shadow-emerald" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Recent Interactions</h3>
                <Link href="/comms" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors">View CRM →</Link>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                {recentOutreach.length === 0 ? (
                  <div className="w-full panel py-12 flex flex-col items-center justify-center text-center border-dashed border-white/5">
                    <MessageSquare size={32} className="text-white/5 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">No recent interactions logged</p>
                  </div>
                ) : (
                  recentOutreach.map((contact, idx) => (
                    <motion.div key={contact.id || idx} whileHover={{ y: -4 }} className="flex-1 min-w-[240px] panel p-5 flex flex-col gap-4 border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-xs font-black text-indigo-400">
                          {contact.name?.[0] || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-white truncate">{contact.name}</p>
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest truncate">{contact.role || 'Connection'}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.03]">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{contact.company}</span>
                        <span className={`text-[7px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter ${
                          contact.status === 'Replied' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white/30 border border-white/5'
                        }`}>
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
            tasks={tasks} newTask={newTask} setNewTask={setNewTask}
            onAdd={handleAddTask} onUpdate={updateTask} onDelete={deleteTask}
          />
        </div>

        {/* Global System Feed Footer */}
        <footer className="mt-12 pt-12 border-t border-white/[0.03]">
          <div className="panel bg-white/[0.01] border-dashed border-white/5 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02]"><Zap size={120} /></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Subsystem Feed</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-medium text-white/20 flex items-center gap-3"><span className="text-indigo-500/40">[OK]</span> Pipeline Synchronized: {jobs.length} nodes active</p>
                  <p className="text-[11px] font-medium text-white/20 flex items-center gap-3"><span className="text-indigo-500/40">[OK]</span> Readiness Mastered: {metrics.dsaPercent}% achieved</p>
                  <p className="text-[11px] font-medium text-white/20 flex items-center gap-3"><span className="text-indigo-500/40">[OK]</span> Transmission Buffer: {outreach.length} logged</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/10">
                  <span>Kernel v4.2.0-STABLE</span> <div className="w-1 h-1 rounded-full bg-white/5" /> <span>Uptime: 24.7h</span>
                </div>
                <p className="text-[8px] font-bold text-indigo-500/20 uppercase tracking-[0.5em]">CareerOS Operating System</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
