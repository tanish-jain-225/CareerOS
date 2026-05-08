'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  UserCircle,
  MessageSquare,
  HardDrive,
  Menu,
  X,
  Search,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCommandPalette } from '@/context/CommandPaletteContext';
import { useData } from '@/context/DataContext';

const ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Applications', icon: Briefcase },
  { href: '/prep', label: 'Preparation', icon: BookOpen },
  { href: '/identity', label: 'Identity', icon: UserCircle },
  { href: '/comms', label: 'Interactions', icon: MessageSquare },
  { href: '/vault', label: 'Vault', icon: HardDrive },
];

/**
 * Navbar - Responsive mobile navigation system for CareerOS.
 *
 * Provides:
 * - Mobile-optimized menu with glassmorphic transitions.
 * - Quick access to global tactical modules.
 * - Global search trigger integration.
 * - Real-time identity status display.
 *
 * @returns {JSX.Element} The rendered mobile navigation interface.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { open: openSearch } = useCommandPalette();
  const {
    profile: { data: profile },
  } = useData();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const pf = profile || { name: 'Operator' };
  const name = pf.name || user?.displayName || user?.email?.split('@')[0] || 'Operator';

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-[#05070a]/80 px-6 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] shadow-lg">
            <Image src="/logo.png" alt="Logo" width={20} height={20} className="object-contain" />
          </div>
          <span className="font-outfit text-xs font-black tracking-tight text-white uppercase">
            Career<span className="text-indigo-500">OS</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={openSearch}
            className="p-2 text-white/30 transition-colors hover:text-white"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white/60 transition-colors hover:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
            className="fixed inset-0 z-40 overflow-y-auto bg-[#05070a] px-8 pt-24 md:hidden"
          >
            <div className="space-y-8 pb-12">
              <div className="space-y-2">
                <p className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">
                  Navigation
                </p>
                <div className="flex flex-col gap-2">
                  {ITEMS.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href}>
                        <div
                          className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition-all ${
                            active
                              ? 'border border-indigo-500/20 bg-indigo-500/10 text-white'
                              : 'border border-white/5 bg-white/[0.02] text-white/30'
                          }`}
                        >
                          <item.icon size={20} className={active ? 'text-indigo-400' : ''} />
                          <span className="text-[11px] font-black tracking-widest uppercase">
                            {item.label}
                          </span>
                          {active && (
                            <div className="shadow-indigo ml-auto h-4 w-1 rounded-full bg-indigo-500" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">
                  Identity Partition
                </p>
                <div className="panel flex items-center gap-4 border-white/5 bg-white/[0.02] p-5">
                  <div className="relative">
                    <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03]">
                      {user?.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <UserCircle size={24} className="text-white/20" />
                      )}
                    </div>
                    <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#05070a]">
                      <div className="shadow-emerald h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black tracking-wider text-white uppercase">
                      {name}
                    </p>
                    <p className="mt-0.5 truncate text-[9px] font-bold tracking-widest text-white/20 uppercase">
                      {user ? 'Professional Node' : 'Awaiting Auth'}
                    </p>
                  </div>
                </div>
                {user && (
                  <button
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-rose-500/10 bg-rose-500/5 py-4 text-[10px] font-black tracking-widest text-rose-500/60 uppercase"
                  >
                    <LogOut size={16} /> Sign Out Terminal
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
