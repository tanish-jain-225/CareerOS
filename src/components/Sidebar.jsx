'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  UserCircle,
  MessageSquare,
  HardDrive,
  LogOut,
  Search,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCommandPalette } from '@/context/CommandPaletteContext';
import { useData } from '@/context/DataContext';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Applications', icon: Briefcase, countKey: 'jobs' },
  { href: '/prep', label: 'Preparation', icon: BookOpen },
  { href: '/identity', label: 'Identity', icon: UserCircle },
  { href: '/comms', label: 'Interactions', icon: MessageSquare, countKey: 'comms' },
  { href: '/vault', label: 'Vault', icon: HardDrive },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { open } = useCommandPalette();

  // Shared data from DataContext
  const { jobs: { data: jobs }, outreach: { data: outreach }, profile: { data: profile } } = useData();

  const counts = {
    jobs: jobs.filter(j => !['offer', 'rejected'].includes(j.status)).length,
    comms: outreach.length,
  };

  const pf = profile || { name: 'Operator', title: 'Professional Node' };
  const name = pf.name || user?.displayName || user?.email?.split('@')[0] || 'Operator';
  const title = pf.title || 'Mission Command';

  return (
    <aside className="hidden md:flex md:w-[280px] md:flex-col h-screen sticky top-0 bg-[#05070a] border-r border-white/[0.03] p-4">
      {/* Branding Section - Fixed at top */}
      <div className="flex-shrink-0 flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shadow-2xl overflow-hidden relative">
          <Image src="/logo.png" alt="CareerOS Logo" width={28} height={28} className="object-contain" />
        </div>
        <span className="text-lg font-black font-outfit tracking-tighter text-white">Career<span className="text-indigo-500">OS</span></span>
      </div>

      <button
        onClick={open}
        className="flex-shrink-0 w-full flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all mb-6 group"
      >
        <Search size={16} className="group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest flex-1 text-left">Global Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/10 text-[8px] font-black text-white/30 uppercase tracking-tighter">
          Ctrl+K
        </kbd>
      </button>


      {/* Navigation Section - Scrollable if height is restricted */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide pr-2 -mr-2">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          const count = item.countKey ? counts[item.countKey] : null;
          return (
            <Link key={item.href} href={item.href} className="block relative group">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-indigo"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span
                className={`relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                  active
                    ? 'text-white translate-x-1'
                    : 'text-white/20 hover:text-white/60'
                }`}
              >
                <div className={`transition-all duration-300 ${active ? 'text-indigo-400' : 'group-hover:scale-110'}`}>
                  <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                {count > 0 && (
                  <span className="ml-auto text-[8px] font-black bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-full leading-none">
                    {count}
                  </span>
                )}
                {active && !count && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-1 h-4 bg-indigo-500 rounded-full shadow-indigo"
                  />
                )}
              </span>
            </Link>
          );
        })}
      </nav>



      {/* Profile Section - Fixed at bottom */}
      <div className="flex-shrink-0 mt-auto pt-4 border-t border-white/[0.03] space-y-4">
        <div className="flex items-center gap-4 px-2 group cursor-pointer" onClick={() => router.push('/identity')}>
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center overflow-hidden group-hover:border-indigo-500/30 transition-all relative">
              {user?.photoURL ? (
                <Image src={user.photoURL} alt={name} width={44} height={44} className="object-cover" />
              ) : (
                <UserCircle size={24} className="text-white/20" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#05070a] rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[10px] font-black text-white uppercase tracking-wider group-hover:text-indigo-400 transition-colors">{name}</p>
            <p className="truncate text-[8px] font-bold text-white/20 uppercase tracking-widest mt-0.5">{title}</p>
          </div>
        </div>
        {user && (
          <button 
            onClick={logout} 
            aria-label="Terminate Session"
            className="w-full flex items-center justify-center gap-2 bg-rose-500/5 border border-rose-500/10 text-rose-500/50 rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-400 transition-all active:scale-[0.98]"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        )}
      </div>
    </aside>
  );
}
