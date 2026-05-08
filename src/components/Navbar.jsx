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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { open: openSearch } = useCommandPalette();
  const { profile: { data: profile } } = useData();

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
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const pf = profile || { name: 'Operator' };
  const name = pf.name || user?.displayName || user?.email?.split('@')[0] || 'Operator';

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-[#05070a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 md:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shadow-lg overflow-hidden relative">
            <Image src="/logo.png" alt="Logo" width={20} height={20} className="object-contain" />
          </div>
          <span className="text-xs font-black tracking-tight text-white uppercase font-outfit">Career<span className="text-indigo-500">OS</span></span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={openSearch}
            className="p-2 text-white/30 hover:text-white transition-colors"
          >
            <Search size={20} />
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white/60 hover:text-white transition-colors"
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
            transition={{ duration: 0.3, ease: "circOut" }}
            className="fixed inset-0 z-40 bg-[#05070a] pt-24 px-8 md:hidden overflow-y-auto"
          >
            <div className="space-y-8 pb-12">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Navigation</p>
                <div className="flex flex-col gap-2">
                  {ITEMS.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href}>
                        <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                          active ? 'bg-indigo-500/10 border border-indigo-500/20 text-white' : 'bg-white/[0.02] border border-white/5 text-white/30'
                        }`}>
                          <item.icon size={20} className={active ? 'text-indigo-400' : ''} />
                          <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                          {active && <div className="ml-auto w-1 h-4 bg-indigo-500 rounded-full shadow-indigo" />}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Identity Partition</p>
                <div className="panel bg-white/[0.02] border-white/5 p-5 flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center overflow-hidden relative">
                      {user?.photoURL ? (
                        <Image src={user.photoURL} alt={name} width={48} height={48} className="object-cover" />
                      ) : (
                        <UserCircle size={24} className="text-white/20" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#05070a] rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-emerald" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-black text-white uppercase tracking-wider">{name}</p>
                    <p className="truncate text-[9px] font-bold text-white/20 uppercase tracking-widest mt-0.5">
                      {user ? 'Professional Node' : 'Awaiting Auth'}
                    </p>
                  </div>
                </div>
                {user && (
                  <button 
                    onClick={logout}
                    className="w-full py-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-500/60 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3"
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
