'use client';

import React, { useState } from 'react';
import {
  Plus, Search, Zap, FileDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AcquisitionSuccess from '@/components/AcquisitionSuccess';
import Confetti from '@/components/Confetti';
import JobForm from '@/components/JobForm';
import ConversionFunnel from '@/components/ConversionFunnel';
import { useAuth } from '@/context/AuthContext';
import JobCard from '@/components/JobCard';

export default function PipelinePage() {
  const { data: jobs, loading: jobsLoading, error: jobsError, addData, updateData, deleteData } = useData().jobs;
  const { user } = useAuth();
  
  const toast = useToast();
  const { openModal, closeModal } = useModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [confetti, setConfetti] = useState(false);

  const sortedJobs = [...jobs].sort((a, b) => new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0));

  const filteredJobs = sortedJobs.filter(j => 
    (j.company?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (j.role?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: jobs.length,
    applied: jobs.filter(j => !['sourced', 'shortlisted'].includes(j.status)).length,
    interviewing: jobs.filter(j => ['interview', 'offer'].includes(j.status)).length,
    offers: jobs.filter(j => j.status === 'offer').length
  };

  const responseRate = stats.applied > 0 ? Math.round((stats.interviewing / stats.applied) * 100) : 0;

  const funnelMetrics = [
    { label: 'Sourced', value: stats.total },
    { label: 'Applied', value: stats.applied },
    { label: 'Sync Loop', value: stats.interviewing },
    { label: 'Secured', value: stats.offers },
  ];

  return (
    <ProtectedRoute>
      <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12 pb-safe flex flex-col min-h-screen">
      <Confetti active={confetti} />
      
      <header className="flex-shrink-0 flex flex-col gap-6 md:gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-emerald animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Infiltration Hub Synchronized</span>
          </div>
          <h1 className="title-xl">Infiltration Hub<span className="text-emerald-500">.</span></h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
          <div className="relative group flex-1 sm:min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors" size={16} />
            <input
              type="text" placeholder="Search pipeline..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="bg-white/[0.02] border border-white/5 rounded-2xl py-3 pl-11 pr-5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all w-full font-bold"
            />
          </div>
          <button
            onClick={() => {
              const csv = ['Company,Role,Status,Source,Applied Date,Excitement,URL,Notes'];
              jobs.forEach(j => csv.push([j.company, j.role, j.status, j.source, j.appliedDate, j.excitement, j.jobUrl, j.notes?.replace(/,/g, ';')].map(v => `"${v || ''}"`).join(',')));
              const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
              const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `careeros_jobs_${new Date().toISOString().split('T')[0]}.csv`; a.click();
            }}
            className="btn-secondary h-14 px-6 flex items-center gap-3"
          >
            <FileDown size={16} />
            <span className="text-[10px] uppercase font-black tracking-widest">Export</span>
          </button>
          <button 
            onClick={() => openModal(
              <JobForm 
                onSave={async f => { 
                  await addData(f); 
                  setConfetti(true);
                  setTimeout(() => setConfetti(false), 5000);
                  openModal(<AcquisitionSuccess job={f} onContinue={closeModal} />, { 
                    title: 'Strategic Update', 
                    size: 'md',
                    hideClose: true
                  });
                }} 
                onClose={closeModal} 
              />, 
              { title: 'Acquire New Target', size: 'lg' }
            )}
            className="btn-primary h-14 px-8 flex items-center gap-3 shadow-2xl"
            data-testid="jobs-new-target"
          >
            <Plus size={20} />
            <span className="text-[10px] uppercase font-black tracking-widest">New Target</span>
          </button>

        </div>
      </header>

      <div className="flex-shrink-0">
        <ConversionFunnel metrics={funnelMetrics} responseRate={responseRate} />
      </div>

      <div className="flex-1">
        {jobsError && (
          <div className="panel bg-rose-500/5 border-rose-500/10 p-6 mb-8 flex items-center gap-4">
            <Zap className="text-rose-500" size={24} />
            <div>
              <p className="text-xs font-black text-white uppercase tracking-widest">System Error</p>
              <p className="text-[10px] font-bold text-rose-500/60 uppercase tracking-widest mt-1">{jobsError}</p>
            </div>
          </div>
        )}

        {jobsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="panel h-48 bg-white/[0.01] border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJobs.map((j) => (
              <JobCard 
                key={j.id}
                job={j} 
                onUpdate={updateData} 
                onDelete={deleteData} 
                onEdit={(job) => openModal(
                  <JobForm 
                    initial={job} 
                    onSave={async f => { 
                      await updateData(job.id, f); 
                      toast.success('Target Updated'); 
                      closeModal(); 
                    }} 
                    onClose={closeModal} 
                  />, 
                  { title: 'Edit Target Intel', size: 'lg' }
                )} 
              />
            ))}
          </div>
        )}
        
        {filteredJobs.length === 0 && !jobsLoading && !jobsError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full py-40 flex flex-col items-center justify-center gap-8 text-center bg-white/[0.01] rounded-[40px] border border-dashed border-white/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-indigo-500/[0.02] blur-3xl rounded-full" />
            <div className="w-24 h-24 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center justify-center opacity-20 relative z-10 transition-transform hover:scale-105">
              <Zap size={48} strokeWidth={1} />
            </div>
            <div className="space-y-3 relative z-10">
              <p className="text-xl font-black font-outfit tracking-tight text-white/40">Pipeline Neutralized</p>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/10">No Active Targets Detected in Sector</p>
            </div>
            <button 
              onClick={() => openModal(
                <JobForm onSave={async f => { await addData(f); closeModal(); }} onClose={closeModal} />,
                { title: 'Initial Acquisition', size: 'lg' }
              )}
              className="btn-secondary px-8 relative z-10"
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
