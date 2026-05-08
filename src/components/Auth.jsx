'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import LogoLoader from '@/components/LogoLoader';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = isLogin
      ? await login(email, password)
      : await signup(email, password, name);

    if (result && !result.success) {
      setError(result.error || 'Authentication failed.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel w-full max-w-[440px] space-y-8"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shadow-2xl overflow-hidden relative">
              <Image src="/logo.png" alt="CareerOS Logo" width={32} height={32} className="object-contain" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-indigo animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Secure Transmission</p>
            </div>
          </div>
          <h1 className="text-3xl font-black font-outfit tracking-tighter text-white">
            Access <span className="text-indigo-500">CareerOS.</span>
          </h1>
          <p className="text-[11px] font-medium text-white/30 leading-relaxed">
            Synchronize your job pipeline and professional identity across all nodes.
          </p>
        </div>

        <div className="flex p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl">
          <button
            className={`flex-1 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-indigo-500 text-white shadow-indigo' : 'text-white/30 hover:text-white/60'}`}
            onClick={() => setIsLogin(true)}
            data-testid="auth-toggle-login"
          >
            Sign In
          </button>
          <button
            className={`flex-1 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-indigo-500 text-white shadow-indigo' : 'text-white/30 hover:text-white/60'}`}
            onClick={() => setIsLogin(false)}
            data-testid="auth-toggle-signup"
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Operator Alias</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    className="input-field pl-12" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter full name" 
                    data-testid="auth-name"
                    autoComplete="name"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Secure Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input 
                className="input-field pl-12" 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="operator@network.com" 
                data-testid="auth-email"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Access Key</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input 
                className="input-field pl-12" 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                data-testid="auth-password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-rose" />
              {error}
            </motion.div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full h-14 flex items-center justify-center gap-3" data-testid="auth-submit">
            {isSubmitting ? (
              <LogoLoader size="xs" />
            ) : (
              <>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {isLogin ? 'Initiate Sync' : 'Provision Account'}
                </span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">OR External Auth</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <button 
          onClick={loginWithGoogle} 
          className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center gap-4 hover:bg-white/[0.05] hover:border-white/10 active:scale-95 transition-all group"
        >
          <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={20} height={20} className="grayscale group-hover:grayscale-0 transition-all" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white">Authenticate with Google</span>
        </button>
      </motion.div>
    </div>
  );
}
