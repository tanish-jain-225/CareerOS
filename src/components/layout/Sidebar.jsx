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

/**
 * Sidebar - Primary desktop navigation and identity status center.
 *
 * Features:
 * - Persistent navigation with spring-animated active states.
 * - Global search trigger (Ctrl+K integration).
 * - Real-time activity counts (Jobs/Comms) via DataContext.
 * - Profile synchronization with Identity Partition.
 * - Tactical session termination (Sign Out).
 *
 * @returns {JSX.Element} The rendered sidebar interface.
 */
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { open } = useCommandPalette();

  // Shared data from DataContext
  const {
    jobs: { data: jobs },
    outreach: { data: outreach },
    profile: { data: profile },
  } = useData();

  const counts = {
    jobs: jobs.filter((j) => !['offer', 'rejected'].includes(j.status)).length,
    comms: outreach.length,
  };

  const pf = profile || { name: 'Operator', title: 'Professional Node' };
  const name = pf.name || user?.displayName || user?.email?.split('@')[0] || 'Operator';
  const title = pf.title || 'Mission Command';

  return (
    <aside className="sticky top-0 hidden h-screen border-r border-white/[0.03] bg-[#05070a] p-4 md:flex md:w-[280px] md:flex-col">
      {/* Branding Section - Fixed at top */}
      <div className="mb-8 flex flex-shrink-0 items-center gap-3 px-2">
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] shadow-2xl">
          <Image
            src="/logo.png"
            alt="CareerOS Logo"
            width={28}
            height={28}
            className="object-contain"
          />
        </div>
        <span className="font-outfit text-lg font-black tracking-tighter text-white">
          Career<span className="text-indigo-500">OS</span>
        </span>
      </div>

      <button
        onClick={open}
        className="group mb-6 flex w-full flex-shrink-0 items-center gap-2 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/60"
      >
        <Search size={16} className="transition-transform group-hover:scale-110" />
        <span className="flex-1 text-left text-[10px] font-black tracking-widest uppercase">
          Global Search
        </span>
        <kbd className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[8px] font-black tracking-tighter text-white/30 uppercase lg:inline-flex">
          Ctrl+K
        </kbd>
      </button>

      {/* Navigation Section - Scrollable if height is restricted */}
      <nav className="scrollbar-hide -mr-2 flex-1 space-y-1.5 overflow-y-auto pr-2">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          const count = item.countKey ? counts[item.countKey] : null;
          return (
            <Link key={item.href} href={item.href} className="group relative block">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="shadow-indigo absolute inset-0 rounded-2xl border border-indigo-500/20 bg-indigo-500/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span
                className={`relative flex items-center gap-4 rounded-2xl px-4 py-4 transition-all ${
                  active ? 'translate-x-1 text-white' : 'text-white/20 hover:text-white/60'
                }`}
              >
                <div
                  className={`transition-all duration-300 ${active ? 'text-indigo-400' : 'group-hover:scale-110'}`}
                >
                  <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                  {item.label}
                </span>
                {count > 0 && (
                  <span className="ml-auto rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] leading-none font-black text-white/40">
                    {count}
                  </span>
                )}
                {active && !count && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="shadow-indigo ml-auto h-4 w-1 rounded-full bg-indigo-500"
                  />
                )}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Profile Section - Fixed at bottom */}
      <div className="mt-auto flex-shrink-0 space-y-4 border-t border-white/[0.03] pt-4">
        <div
          className="group flex cursor-pointer items-center gap-4 px-2"
          onClick={() => router.push('/identity')}
        >
          <div className="relative">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.03] transition-all group-hover:border-indigo-500/30">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={name}
                  width={44}
                  height={44}
                  className="object-cover"
                />
              ) : (
                <UserCircle size={24} className="text-white/20" />
              )}
            </div>
            <div className="absolute -right-1 -bottom-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#05070a]">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-black tracking-wider text-white uppercase transition-colors group-hover:text-indigo-400">
              {name}
            </p>
            <p className="mt-0.5 truncate text-[8px] font-bold tracking-widest text-white/20 uppercase">
              {title}
            </p>
          </div>
        </div>
        {user && (
          <button
            onClick={logout}
            aria-label="Terminate Session"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/10 bg-rose-500/5 py-4 text-[10px] font-black tracking-widest text-rose-500/50 uppercase transition-all hover:bg-rose-500/10 hover:text-rose-400 active:scale-[0.98]"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        )}
      </div>
    </aside>
  );
}
