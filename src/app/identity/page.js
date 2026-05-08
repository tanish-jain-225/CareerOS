'use client';

import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Plus,
  ShieldCheck, Zap, ExternalLink, Globe, RefreshCcw, X,
  Target, Sparkles
} from 'lucide-react';
import { LinkedInIcon, GitHubIcon } from '@/components/BrandIcons';
import { useAuth } from '@/context/AuthContext';
import { useCollection, useUserDoc } from '@/hooks/useDatabase';
import { useToast } from '@/context/ToastContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Components
import ProjectCard from '@/components/ProjectCard';

const PROFILE_DEFAULT = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  portfolio: '',
  mission: '',
  stack: {
    languages: [],
    frontend: [],
    backend: [],
    cloud: []
  }
};

/**
 * IdentityModule - Professional identity management and portfolio builder.
 * Synchronizes personal branding, technical stack, and verified projects.
 */
export default function IdentityModule() {
  const { user } = useAuth();
  const toast = useToast();
  const { data: projects, addData, deleteData, updateData, loading: projLoading } = useCollection('projects');
  const { data: profile, updateDoc: updateProfile } = useUserDoc('profiles', PROFILE_DEFAULT);
  const pf = profile || PROFILE_DEFAULT;
  
  // Local state for buffered form changes
  const [form, setForm] = useState(PROFILE_DEFAULT);
  const [isSaving, setIsSaving] = useState(false);

  // Sync local form with profile data when it loads or changes remotely
  React.useEffect(() => {
    if (profile) {
      setForm(profile);
    }
  }, [profile]);

  const currentForm = form || PROFILE_DEFAULT;
  const hasChanges = JSON.stringify(currentForm) !== JSON.stringify(pf);

  // --- Handlers ---

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateProfile(currentForm);
    if (result.success) {
      toast.success('Dossier Synchronized');
    } else {
      toast.error('Sync Breach: ' + result.error);
    }
    setIsSaving(false);
  };


  const updateForm = (updates) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto w-full px-6 py-10 space-y-12 pb-safe">
        
        {/* Profile Branding Header */}
        <header className="flex flex-col md:flex-row items-center gap-10 pb-12 border-b border-white/5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
            <div className="relative w-32 h-32 rounded-[36px] bg-[#05070a] border-2 border-white/10 overflow-hidden shadow-2xl">
              {user?.photoURL ? (
                <Image src={user.photoURL} alt={pf.name || 'User'} width={128} height={128} priority className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-indigo-400 font-outfit">
                  {pf.name?.[0] || 'O'}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-indigo-500 rounded-2xl border-4 border-[#05070a] text-white shadow-xl">
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <input
                className="bg-transparent text-5xl font-black font-outfit tracking-tighter text-white outline-none w-full focus:text-indigo-400 transition-all text-center md:text-left"
                value={currentForm.name || ''}
                onChange={e => updateForm({ name: e.target.value })}
                placeholder="OPERATOR NAME"
              />
              <input
                className="bg-transparent text-sm font-bold text-indigo-400/60 uppercase tracking-widest w-full outline-none text-center md:text-left"
                value={currentForm.title || ''}
                onChange={e => updateForm({ title: e.target.value })}
                placeholder="PROFESSIONAL TITLE"
              />
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-indigo-500" />
                <input
                  className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white/40 outline-none w-48 focus:text-white transition-all"
                  value={currentForm.location || ''}
                  onChange={e => updateForm({ location: e.target.value })}
                  placeholder="Set Base Location"
                />
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20 select-none">
                <Mail size={14} className="text-indigo-500" /> {user?.email}
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-indigo-500" />
                <input
                  className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white/40 outline-none w-32 focus:text-white transition-all"
                  value={currentForm.phone || ''}
                  onChange={e => updateForm({ phone: e.target.value })}
                  placeholder="Set Comms Link"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Section */}
          <aside className="w-full lg:w-[380px] space-y-10">
            <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 px-2 flex items-center gap-3">
                <Target size={14} /> Strategic Mission
              </h3>
              <div className="panel bg-white/[0.01] border-white/5 p-6">
                <textarea
                  className="bg-transparent text-xs font-medium text-white/50 leading-relaxed w-full outline-none resize-none h-32 focus:text-white transition-colors"
                  value={currentForm.mission || ''}
                  onChange={e => updateForm({ mission: e.target.value })}
                  placeholder="Define your core engineering mission..."
                />
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 px-2 flex items-center gap-3">
                <Zap size={14} /> Technical Arsenal
              </h3>
              <div className="flex flex-col gap-4">
                {Object.entries(currentForm.stack || {}).map(([category, items]) => (
                  <div key={category} className="panel p-5 bg-white/[0.01] border-white/5 space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">{category}</p>
                    <div className="flex flex-wrap gap-2">
                      {items.map(item => (
                        <span key={item} className="group/skill px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-xl text-[9px] font-bold text-white/40 hover:text-white hover:border-indigo-500/20 transition-all flex items-center gap-2">
                          {item}
                          <button 
                            onClick={() => {
                              const newStack = { ...currentForm.stack };
                              newStack[category] = newStack[category].filter(i => i !== item);
                              updateForm({ stack: newStack });
                            }}
                            className="text-rose-500 hover:text-rose-400 transition-all"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                      <button
                        onClick={() => {
                          const skill = window.prompt(`Add new ${category} skill:`);
                          if (skill && !items.includes(skill)) {
                            const newStack = { ...currentForm.stack };
                            newStack[category] = [...items, skill];
                            updateForm({ stack: newStack });
                          }
                        }}
                        className="px-3 py-1.5 border border-white/5 border-dashed rounded-xl text-[9px] font-black text-white/20 hover:text-indigo-400 hover:border-indigo-500/30 transition-all"
                      >
                        + ADD
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 px-2 flex items-center gap-3">
                <Globe size={14} /> Social Nodes
              </h3>
              <div className="space-y-4">
                {[
                  { icon: LinkedInIcon, label: 'LinkedIn', field: 'linkedin' },
                  { icon: GitHubIcon, label: 'GitHub', field: 'github' },
                  { icon: Globe, label: 'Portfolio', field: 'portfolio' },
                ].map(({ icon: Icon, label, field }) => (
                  <div key={field} className="panel p-4 bg-white/[0.01] border-white/5 flex items-center gap-4 group hover:border-white/10 transition-all">
                    <div className="p-2.5 rounded-xl bg-white/[0.02] text-white/20 group-hover:text-indigo-400 transition-colors">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-black text-white/10 uppercase tracking-widest mb-1">{label} Link</p>
                      <input
                        className="bg-transparent text-[10px] font-bold text-white/40 w-full outline-none focus:text-white transition-colors truncate"
                        value={currentForm[field] || ''}
                        onChange={e => updateForm({ [field]: e.target.value })}
                        placeholder={`Enter ${label} URL...`}
                      />
                    </div>
                    {currentForm[field] && (
                      <a href={currentForm[field]} target="_blank" rel="noopener noreferrer" className="p-2 text-white/10 hover:text-white transition-colors">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </aside>

          {/* Main Section: Proof of Work */}
          <main className="flex-1 space-y-10">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-outfit tracking-tighter text-white">Proof of Work</h2>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Verified Multi-Module Deployments</p>
              </div>
              <button 
                onClick={() => addData({ name: 'Intel Node', desc: '', tech: ['Next.js'], liveUrl: '', githubUrl: '' })}
                className="p-3 hover:bg-white/5 rounded-2xl text-white/20 hover:text-indigo-400 transition-all border border-white/5"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-8">
              {projLoading ? (
                Array(2).fill(0).map((_, i) => <div key={i} className="flex-1 min-w-full lg:min-w-[450px] panel h-64 animate-pulse bg-white/[0.01]" />)
              ) : (
                <AnimatePresence mode="popLayout">
                  {projects.map(project => (
                    <div key={project.id} className="flex-1 min-w-full lg:min-w-[450px]">
                      <ProjectCard 
                        project={project} 
                        onUpdate={updateData} 
                        onDelete={deleteData} 
                      />
                    </div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <div className="panel border-indigo-500/10 bg-indigo-500/[0.02] border-l-4 border-l-indigo-500 rounded-3xl p-8 mt-12">
              <div className="flex items-start gap-8">
                <div className="p-5 rounded-2xl bg-indigo-500 text-white shadow-2xl shadow-indigo-500/20">
                  <Sparkles size={32} />
                </div>
                <div className="space-y-3">
                  <h4 className="font-black font-outfit text-xl uppercase tracking-tight text-white">Identity Verification Protocol</h4>
                  <p className="text-sm font-medium text-white/30 leading-relaxed max-w-2xl">
                    This dossier represents a verified synchronization of your professional capabilities. Every project entry maps to a live GitHub repository or verifiable deployment. Maintain this integrity for high-stakes synchronization events.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Floating Save Bar */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-8 right-8 z-[100]"
            >
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="group relative flex items-center gap-4 bg-indigo-500 text-white px-8 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_20px_50px_rgba(99,102,241,0.3)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.5)] active:scale-95 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                {isSaving ? (
                  <>
                    <RefreshCcw size={18} className="animate-spin" />
                    Synchronizing...
                  </>
                ) : (
                  <>
                    <RefreshCcw size={18} />
                    Save Identity Changes
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
