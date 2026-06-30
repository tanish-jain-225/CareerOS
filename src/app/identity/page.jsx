'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Plus,
  ShieldCheck,
  Zap,
  ExternalLink,
  Globe,
  RefreshCcw,
  X,
  Target,
  Sparkles,
} from 'lucide-react';
import { LinkedInIcon, GitHubIcon } from '@/components/ui/BrandIcons';
import { useAuth } from '@/context/AuthContext';
import { useCollection, useUserDoc } from '@/hooks/useDatabase';
import { useToast } from '@/context/ToastContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Components
import ProjectCard from '@/components/features/identity/ProjectCard';

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
    cloud: [],
  },
};

/**
 * IdentityModule - Professional identity management and portfolio builder.
 *
 * Features:
 * - Profile Dossier: Synchronization of personal branding data (Name, Title, Mission).
 * - Technical Arsenal: Managed technical stack partitions (Languages, Frontend, Backend, Cloud).
 * - Proof of Work: Verified project synchronization with GitHub and Live URL integration.
 * - Social Nodes: Centralized management of professional social platforms.
 * - Real-time Synchronization: Buffered form changes with high-fidelity "Floating Save Bar".
 *
 * @returns {JSX.Element} The rendered identity management interface.
 */
export default function IdentityModule() {
  const { user } = useAuth();
  const toast = useToast();
  const {
    data: projects,
    addData,
    deleteData,
    updateData,
    loading: projLoading,
  } = useCollection('projects');
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
    setForm((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ProtectedRoute>
      <div className="pb-safe mx-auto w-full max-w-7xl space-y-12 px-6 py-10">
        {/* Profile Branding Header */}
        <header className="flex flex-col items-center gap-10 border-b border-white/5 pb-12 md:flex-row">
          <div className="group relative">
            <div className="absolute -inset-1 rounded-[40px] bg-gradient-to-tr from-indigo-500 to-emerald-500 opacity-20 blur transition duration-1000 group-hover:opacity-40" />
            <div className="relative h-32 w-32 overflow-hidden rounded-[36px] border-2 border-white/10 bg-[#05070a] shadow-2xl">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={pf.name || 'User'}
                  width={128}
                  height={128}
                  priority
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="font-outfit flex h-full w-full items-center justify-center text-4xl font-black text-indigo-400">
                  {pf.name?.[0] || 'O'}
                </div>
              )}
            </div>
            <div className="absolute -right-2 -bottom-2 rounded-2xl border-4 border-[#05070a] bg-indigo-500 p-2 text-white shadow-xl">
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <input
                className="font-outfit w-full bg-transparent text-center text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white transition-all outline-none focus:text-indigo-400 md:text-left"
                value={currentForm.name || ''}
                onChange={(e) => updateForm({ name: e.target.value })}
                placeholder="OPERATOR NAME"
              />
              <input
                className="w-full bg-transparent text-center text-sm font-bold tracking-widest text-indigo-400/60 uppercase outline-none md:text-left"
                value={currentForm.title || ''}
                onChange={(e) => updateForm({ title: e.target.value })}
                placeholder="PROFESSIONAL TITLE"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:justify-start">
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-indigo-500" />
                <input
                  className="w-48 bg-transparent text-[10px] font-black tracking-widest text-white/40 uppercase transition-all outline-none focus:text-white"
                  value={currentForm.location || ''}
                  onChange={(e) => updateForm({ location: e.target.value })}
                  placeholder="Set Base Location"
                />
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-white/20 uppercase select-none">
                <Mail size={14} className="text-indigo-500" /> {user?.email}
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-indigo-500" />
                <input
                  className="w-32 bg-transparent text-[10px] font-black tracking-widest text-white/40 uppercase transition-all outline-none focus:text-white"
                  value={currentForm.phone || ''}
                  onChange={(e) => updateForm({ phone: e.target.value })}
                  placeholder="Set Comms Link"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Sidebar Section */}
          <aside className="w-full space-y-10 lg:w-[380px]">
            <section className="space-y-6">
              <h3 className="flex items-center gap-3 px-2 text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
                <Target size={14} /> Strategic Mission
              </h3>
              <div className="panel border-white/5 bg-white/[0.01] p-6">
                <textarea
                  className="h-32 w-full resize-none bg-transparent text-xs leading-relaxed font-medium text-white/50 transition-colors outline-none focus:text-white"
                  value={currentForm.mission || ''}
                  onChange={(e) => updateForm({ mission: e.target.value })}
                  placeholder="Define your core engineering mission..."
                />
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="flex items-center gap-3 px-2 text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
                <Zap size={14} /> Technical Arsenal
              </h3>
              <div className="flex flex-col gap-4">
                {Object.entries(currentForm.stack || {}).map(([category, items]) => (
                  <div
                    key={category}
                    className="panel space-y-4 border-white/5 bg-white/[0.01] p-5"
                  >
                    <p className="text-[9px] font-black tracking-widest text-indigo-400 uppercase">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <span
                          key={item}
                          className="group/skill flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-1.5 text-[9px] font-bold text-white/40 transition-all hover:border-indigo-500/20 hover:text-white"
                        >
                          {item}
                          <button
                            onClick={() => {
                              const newStack = { ...currentForm.stack };
                              newStack[category] = newStack[category].filter((i) => i !== item);
                              updateForm({ stack: newStack });
                            }}
                            className="text-rose-500 transition-all hover:text-rose-400"
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
                        className="rounded-xl border border-dashed border-white/5 px-3 py-1.5 text-[9px] font-black text-white/20 transition-all hover:border-indigo-500/30 hover:text-indigo-400"
                      >
                        + ADD
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="flex items-center gap-3 px-2 text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
                <Globe size={14} /> Social Nodes
              </h3>
              <div className="space-y-4">
                {[
                  { icon: LinkedInIcon, label: 'LinkedIn', field: 'linkedin' },
                  { icon: GitHubIcon, label: 'GitHub', field: 'github' },
                  { icon: Globe, label: 'Portfolio', field: 'portfolio' },
                ].map(({ icon: Icon, label, field }) => (
                  <div
                    key={field}
                    className="panel group flex items-center gap-4 border-white/5 bg-white/[0.01] p-4 transition-all hover:border-white/10"
                  >
                    <div className="rounded-xl bg-white/[0.02] p-2.5 text-white/20 transition-colors group-hover:text-indigo-400">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-[8px] font-black tracking-widest text-white/10 uppercase">
                        {label} Link
                      </p>
                      <input
                        className="w-full truncate bg-transparent text-[10px] font-bold text-white/40 transition-colors outline-none focus:text-white"
                        value={currentForm[field] || ''}
                        onChange={(e) => updateForm({ [field]: e.target.value })}
                        placeholder={`Enter ${label} URL...`}
                      />
                    </div>
                    {currentForm[field] && (
                      <a
                        href={currentForm[field]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-white/10 transition-colors hover:text-white"
                      >
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
                <h2 className="font-outfit text-2xl font-black tracking-tighter text-white">
                  Proof of Work
                </h2>
                <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">
                  Verified Multi-Module Deployments
                </p>
              </div>
              <button
                onClick={() =>
                  addData({
                    name: 'Intel Node',
                    desc: '',
                    tech: ['Next.js'],
                    liveUrl: '',
                    githubUrl: '',
                  })
                }
                className="rounded-2xl border border-white/5 p-3 text-white/20 transition-all hover:bg-white/5 hover:text-indigo-400"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-8">
              {projLoading ? (
                Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="panel h-64 min-w-full flex-1 animate-pulse bg-white/[0.01] lg:min-w-[450px]"
                    />
                  ))
              ) : (
                <AnimatePresence mode="popLayout">
                  {projects.map((project) => (
                    <div key={project.id} className="min-w-full flex-1 lg:min-w-[450px]">
                      <ProjectCard project={project} onUpdate={updateData} onDelete={deleteData} />
                    </div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <div className="panel mt-12 rounded-3xl border-l-4 border-indigo-500/10 border-l-indigo-500 bg-indigo-500/[0.02] p-8">
              <div className="flex items-start gap-8">
                <div className="rounded-2xl bg-indigo-500 p-5 text-white shadow-2xl shadow-indigo-500/20">
                  <Sparkles size={32} />
                </div>
                <div className="space-y-3">
                  <h4 className="font-outfit text-xl font-black tracking-tight text-white uppercase">
                    Identity Verification Protocol
                  </h4>
                  <p className="max-w-2xl text-sm leading-relaxed font-medium text-white/30">
                    This dossier represents a verified synchronization of your professional
                    capabilities. Every project entry maps to a live GitHub repository or verifiable
                    deployment. Maintain this integrity for high-stakes synchronization events.
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
              className="fixed right-4 bottom-6 left-4 z-[100] sm:right-8 sm:bottom-8 sm:left-auto"
            >
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="group relative flex w-full sm:w-auto items-center justify-center gap-4 overflow-hidden rounded-[24px] bg-indigo-500 px-8 py-5 text-[11px] font-black tracking-[0.2em] text-white uppercase shadow-[0_20px_50px_rgba(99,102,241,0.3)] transition-all hover:shadow-[0_20px_50px_rgba(99,102,241,0.5)] active:scale-95"
              >
                <div className="group-hover:animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
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
