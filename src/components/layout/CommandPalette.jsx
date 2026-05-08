'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, Briefcase, BookOpen, UserCircle, MessageSquare, HardDrive, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCommandPalette } from '@/context/CommandPaletteContext';
import { useCollection } from '@/hooks/useDatabase';

const ROUTES = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Jobs', href: '/jobs', icon: Briefcase },
  { label: 'Prep', href: '/prep', icon: BookOpen },
  { label: 'Identity', href: '/identity', icon: UserCircle },
  { label: 'Communication', href: '/comms', icon: MessageSquare },
  { label: 'Vault', href: '/vault', icon: HardDrive },
];

/**
 * CommandPalette component providing a centralized, keyboard-driven navigation 
 * and search interface across all system modules and data records.
 * Triggered via Ctrl+K or Global Search button.
 */
export default function CommandPalette() {
  const { isOpen, close, inputRef } = useCommandPalette();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const router = useRouter();
  
  const { data: jobs } = useCollection('jobs');
  const { data: vault } = useCollection('vault');
  const { data: projects } = useCollection('projects');

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setCursor(0);
    }
  }, [isOpen]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    const routeMatches = ROUTES.filter((r) => !q || r.label.toLowerCase().includes(q)).map((r) => ({
      ...r,
      subtitle: 'System Module',
    }));

    const jobMatches = q.length > 1
      ? jobs
          .filter((j) => j.company?.toLowerCase().includes(q) || j.role?.toLowerCase().includes(q))
          .slice(0, 5)
          .map((j) => ({
            label: `${j.company} · ${j.role}`,
            href: '/jobs',
            icon: Briefcase,
            subtitle: 'Application Record',
          }))
      : [];

    const vaultMatches = q.length > 1
      ? vault
          .filter((f) => f.name?.toLowerCase().includes(q))
          .slice(0, 3)
          .map((f) => ({
            label: f.name,
            href: '/vault',
            icon: HardDrive,
            subtitle: 'Secured Resource',
          }))
      : [];

    const projectMatches = q.length > 1
      ? projects
          .filter((p) => p.name?.toLowerCase().includes(q))
          .slice(0, 3)
          .map((p) => ({
            label: p.name,
            href: '/identity',
            icon: UserCircle,
            subtitle: 'Proof of Work',
          }))
      : [];

    return [...routeMatches, ...jobMatches, ...vaultMatches, ...projectMatches];
  }, [jobs, vault, projects, query]);

  const onSelect = useCallback((item) => {
    router.push(item.href);
    close();
  }, [close, router]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, Math.max(items.length - 1, 0)));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    }
    if (e.key === 'Enter' && items[cursor]) {
      onSelect(items[cursor]);
    }
    if (e.key === 'Escape') close();
  };

  if (typeof window === 'undefined' || !isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-md" onClick={close} />
      <div className="fixed inset-0 z-[9991] flex items-start justify-center p-4 pt-[15vh]">
        <div className="w-full max-w-2xl glass-card overflow-hidden border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4 border-b border-white/[0.05] px-6 py-5">
            <Search size={20} className="text-white/20" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Execute global command..."
              className="w-full bg-transparent text-lg font-black font-outfit text-white placeholder:text-white/10 focus:outline-none"
              aria-label="Command palette search"
            />
            <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">ESC</span>
            </div>
          </div>

          <div className="max-h-[50vh] overflow-y-auto p-3 scrollbar-hide">
            {items.length === 0 && (
              <div className="p-8 text-center space-y-2">
                <Search size={32} className="mx-auto text-white/5" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">No matching nodes found</p>
              </div>
            )}

            <div className="space-y-1">
              {items.map((item, index) => {
                const active = index === cursor;
                return (
                  <button
                    key={`${item.label}-${index}`}
                    onClick={() => onSelect(item)}
                    onMouseEnter={() => setCursor(index)}
                    className={`flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition-all ${
                      active 
                        ? 'bg-indigo-500/10 border border-indigo-500/20 translate-x-1' 
                        : 'hover:bg-white/[0.02] border border-transparent'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl transition-colors ${
                      active ? 'bg-indigo-500 text-white' : 'bg-white/[0.03] text-white/20'
                    }`}>
                      <item.icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`block truncate text-[11px] font-black uppercase tracking-widest ${
                        active ? 'text-white' : 'text-white/60'
                      }`}>
                        {item.label}
                      </div>
                      <div className="block text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">
                        {item.subtitle}
                      </div>
                    </div>
                    {active && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-indigo-500/20 rounded-lg text-indigo-400 text-[8px] font-black uppercase tracking-tighter">
                        Enter
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="px-6 py-4 bg-white/[0.01] border-t border-white/[0.03]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[8px] font-black text-white/20 uppercase tracking-widest">
                  <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 text-white/40 font-mono">↑↓</kbd> 
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2 text-[8px] font-black text-white/20 uppercase tracking-widest">
                  <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 text-white/40 font-mono">↵</kbd> 
                  <span>Execute</span>
                </div>
                <div className="flex items-center gap-2 text-[8px] font-black text-white/20 uppercase tracking-widest">
                  <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 text-white/40 font-mono">ESC</kbd> 
                  <span>Abort</span>
                </div>
              </div>
              <div className="text-[8px] font-black text-indigo-500/40 uppercase tracking-[0.3em]">Kernel v4.2.0-STABLE</div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
