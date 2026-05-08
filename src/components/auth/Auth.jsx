'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import LogoLoader from '@/components/ui/LogoLoader';

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

    const result = isLogin ? await login(email, password) : await signup(email, password, name);

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
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] shadow-2xl">
              <Image
                src="/logo.png"
                alt="CareerOS Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="shadow-indigo h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
              <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
                Secure Transmission
              </p>
            </div>
          </div>
          <h1 className="font-outfit text-3xl font-black tracking-tighter text-white">
            Access <span className="text-indigo-500">CareerOS.</span>
          </h1>
          <p className="text-[11px] leading-relaxed font-medium text-white/30">
            Synchronize your job pipeline and professional identity across all nodes.
          </p>
        </div>

        <div className="flex rounded-2xl border border-white/5 bg-white/[0.02] p-1.5">
          <button
            className={`flex-1 rounded-xl py-3 text-[10px] font-black tracking-widest uppercase transition-all ${isLogin ? 'shadow-indigo bg-indigo-500 text-white' : 'text-white/30 hover:text-white/60'}`}
            onClick={() => setIsLogin(true)}
            data-testid="auth-toggle-login"
          >
            Sign In
          </button>
          <button
            className={`flex-1 rounded-xl py-3 text-[10px] font-black tracking-widest uppercase transition-all ${!isLogin ? 'shadow-indigo bg-indigo-500 text-white' : 'text-white/30 hover:text-white/60'}`}
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
                <label className="ml-1 text-[9px] font-black tracking-widest text-white/20 uppercase">
                  Operator Alias
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-white/20"
                  />
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
            <label className="ml-1 text-[9px] font-black tracking-widest text-white/20 uppercase">
              Secure Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute top-1/2 left-4 -translate-y-1/2 text-white/20" />
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
            <label className="ml-1 text-[9px] font-black tracking-widest text-white/20 uppercase">
              Access Key
            </label>
            <div className="relative">
              <Lock size={16} className="absolute top-1/2 left-4 -translate-y-1/2 text-white/20" />
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
              className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-[10px] font-black tracking-widest text-rose-500 uppercase"
            >
              <div className="shadow-rose h-1.5 w-1.5 rounded-full bg-rose-500" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex h-14 w-full items-center justify-center gap-3"
            data-testid="auth-submit"
          >
            {isSubmitting ? (
              <LogoLoader size="xs" />
            ) : (
              <>
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                  {isLogin ? 'Initiate Sync' : 'Provision Account'}
                </span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-[8px] font-black tracking-[0.4em] text-white/10 uppercase">
            OR External Auth
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <button
          onClick={loginWithGoogle}
          className="group flex h-14 w-full items-center justify-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] transition-all hover:border-white/10 hover:bg-white/[0.05] active:scale-95"
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="grayscale transition-all group-hover:grayscale-0"
          />
          <span className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase group-hover:text-white">
            Authenticate with Google
          </span>
        </button>
      </motion.div>
    </div>
  );
}
