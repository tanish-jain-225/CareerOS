'use client';

import React, { useState } from 'react';
import { Plus, Search, Zap, FileDown, LayoutGrid, Kanban } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AcquisitionSuccess from '@/components/features/jobs/AcquisitionSuccess';
import Confetti from '@/components/ui/Confetti';
import JobForm from '@/components/features/jobs/JobForm';
import ConversionFunnel from '@/components/features/dashboard/ConversionFunnel';
import JobCard from '@/components/features/jobs/JobCard';
import KanbanBoard from '@/components/features/jobs/KanbanBoard';

/**
 * PipelinePage (Infiltration Hub) - Comprehensive job application tracking node.
 *
 * This module allows users to:
 * - Manage a high-fidelity pipeline of job applications.
 * - Visualize acquisition efficiency via a conversion funnel.
 * - Perform tactical exports of application data to CSV.
 * - Filter and search targets in real-time.
 *
 * Integrated with:
 * - DataContext for real-time Firestore synchronization.
 * - ModalContext for high-stakes forms (JobForm).
 * - ToastContext for operation confirmation.
 *
 * @returns {JSX.Element} The rendered jobs pipeline interface.
 */
export default function PipelinePage() {
  const {
    data: jobs,
    loading: jobsLoading,
    error: jobsError,
    addData,
    updateData,
    deleteData,
  } = useData().jobs;

  const toast = useToast();
  const { openModal, closeModal } = useModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const sortedJobs = [...jobs].sort(
    (a, b) => new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0)
  );

  const filteredJobs = sortedJobs.filter(
    (j) =>
      (j.company?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (j.role?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => !['sourced', 'shortlisted'].includes(j.status)).length,
    interviewing: jobs.filter((j) => ['interview', 'offer'].includes(j.status)).length,
    offers: jobs.filter((j) => j.status === 'offer').length,
  };

  const responseRate =
    stats.applied > 0 ? Math.round((stats.interviewing / stats.applied) * 100) : 0;

  const funnelMetrics = [
    { label: 'Sourced', value: stats.total },
    { label: 'Applied', value: stats.applied },
    { label: 'Sync Loop', value: stats.interviewing },
    { label: 'Secured', value: stats.offers },
  ];

  return (
    <ProtectedRoute>
      <div className="pb-safe mx-auto flex min-h-screen w-full max-w-[1600px] flex-col space-y-8 px-4 py-6 sm:space-y-12 sm:px-6 sm:py-10">
        <Confetti active={confetti} />

        <header className="flex flex-shrink-0 flex-col gap-6 md:gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="shadow-emerald h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">
                Infiltration Hub Synchronized
              </span>
            </div>
            <h1 className="title-xl">
              Infiltration Hub<span className="text-emerald-500">.</span>
            </h1>
          </div>
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="group relative flex-1 sm:min-w-[300px]">
              <Search
                className="absolute top-1/2 left-4 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-emerald-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Search pipeline..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/5 bg-white/[0.02] py-3 pr-5 pl-11 text-xs font-bold text-white transition-all placeholder:text-white/20 focus:ring-4 focus:ring-emerald-500/5 focus:outline-none"
              />
            </div>
            <div className="flex w-full sm:w-28 rounded-2xl border border-white/5 bg-white/[0.02] p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 flex h-12 items-center justify-center rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'shadow-indigo bg-indigo-500 text-white'
                    : 'text-white/30 hover:text-white/60'
                }`}
                aria-label="Grid View"
                data-testid="view-toggle-grid"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex-1 flex h-12 items-center justify-center rounded-xl transition-all ${
                  viewMode === 'kanban'
                    ? 'shadow-indigo bg-indigo-500 text-white'
                    : 'text-white/30 hover:text-white/60'
                }`}
                aria-label="Kanban View"
                data-testid="view-toggle-kanban"
              >
                <Kanban size={16} />
              </button>
            </div>
            <button
              onClick={() => {
                const csv = ['Company,Role,Status,Source,Applied Date,Excitement,URL,Notes'];
                jobs.forEach((j) =>
                  csv.push(
                    [
                      j.company,
                      j.role,
                      j.status,
                      j.source,
                      j.appliedDate,
                      j.excitement,
                      j.jobUrl,
                      j.notes?.replace(/,/g, ';'),
                    ]
                      .map((v) => `"${v || ''}"`)
                      .join(',')
                  )
                );
                const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `careeros_jobs_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              className="btn-secondary flex h-14 items-center justify-center gap-3 px-6 w-full sm:w-auto"
            >
              <FileDown size={16} />
              <span className="text-[10px] font-black tracking-widest uppercase">Export</span>
            </button>
            <button
              onClick={() =>
                openModal(
                  <JobForm
                    onSave={async (f) => {
                      await addData(f);
                      setConfetti(true);
                      setTimeout(() => setConfetti(false), 5000);
                      openModal(<AcquisitionSuccess job={f} onContinue={closeModal} />, {
                        title: 'Strategic Update',
                        size: 'md',
                        hideClose: true,
                      });
                    }}
                    onClose={closeModal}
                  />,
                  { title: 'Acquire New Target', size: 'lg' }
                )
              }
              className="btn-primary flex h-14 items-center justify-center gap-3 px-8 shadow-2xl transition-all active:scale-95 w-full sm:w-auto"
              data-testid="jobs-new-target"
            >
              <Plus size={18} />
              <span className="text-[10px] font-black tracking-widest uppercase">New Target</span>
            </button>
          </div>
        </header>

        <div className="flex-shrink-0">
          <ConversionFunnel metrics={funnelMetrics} responseRate={responseRate} />
        </div>

        <div className="flex-1">
          {jobsError && (
            <div className="panel mb-8 flex items-center gap-4 border-rose-500/10 bg-rose-500/5 p-6">
              <Zap className="text-rose-500" size={24} />
              <div>
                <p className="text-xs font-black tracking-widest text-white uppercase">
                  System Error
                </p>
                <p className="mt-1 text-[10px] font-bold tracking-widest text-rose-500/60 uppercase">
                  {jobsError}
                </p>
              </div>
            </div>
          )}

          {jobsLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="panel h-48 animate-pulse border-white/5 bg-white/[0.01]" />
              ))}
            </div>
          ) : viewMode === 'kanban' ? (
            <KanbanBoard
              jobs={filteredJobs}
              onUpdate={updateData}
              onDelete={deleteData}
              onEdit={(job) =>
                openModal(
                  <JobForm
                    initial={job}
                    onSave={async (f) => {
                      await updateData(job.id, f);
                      toast.success('Target Updated');
                      closeModal();
                    }}
                    onClose={closeModal}
                  />,
                  { title: 'Edit Target Intel', size: 'lg' }
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredJobs.map((j) => (
                <JobCard
                  key={j.id}
                  job={j}
                  onUpdate={updateData}
                  onDelete={deleteData}
                  onEdit={(job) =>
                    openModal(
                      <JobForm
                        initial={job}
                        onSave={async (f) => {
                          await updateData(job.id, f);
                          toast.success('Target Updated');
                          closeModal();
                        }}
                        onClose={closeModal}
                      />,
                      { title: 'Edit Target Intel', size: 'lg' }
                    )
                  }
                />
              ))}
            </div>
          )}

          {filteredJobs.length === 0 && !jobsLoading && !jobsError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex w-full flex-col items-center justify-center gap-8 overflow-hidden rounded-[40px] border border-dashed border-white/5 bg-white/[0.01] py-40 text-center"
            >
              <div className="absolute inset-0 rounded-full bg-indigo-500/[0.02] blur-3xl" />
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[32px] border border-white/5 bg-white/[0.02] opacity-20 transition-transform hover:scale-105">
                <Zap size={48} strokeWidth={1} />
              </div>
              <div className="relative z-10 space-y-3">
                <p className="font-outfit text-xl font-black tracking-tight text-white/40">
                  Pipeline Neutralized
                </p>
                <p className="text-[10px] font-bold tracking-[0.3em] text-white/10 uppercase">
                  No Active Targets Detected in Sector
                </p>
              </div>
              <button
                onClick={() =>
                  openModal(
                    <JobForm
                      onSave={async (f) => {
                        await addData(f);
                        closeModal();
                      }}
                      onClose={closeModal}
                    />,
                    { title: 'Initial Acquisition', size: 'lg' }
                  )
                }
                className="btn-secondary relative z-10 px-8"
              >
                Deploy First Target
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
