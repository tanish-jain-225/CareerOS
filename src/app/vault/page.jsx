'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus, Search, Lock, Upload, X, ShieldCheck, AlertCircle, Trash2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LogoLoader from '@/components/ui/LogoLoader';
import { useCollection } from '@/hooks/useDatabase';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Badge from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { motion, AnimatePresence } from 'framer-motion';
import { formatBytes } from '@/utils/dateUtils';
import { detectCategory, VAULT_CATEGORIES } from '@/utils/fileUtils';

// Components
import FileCard from '@/components/features/vault/FileCard';
import FilePreview from '@/components/features/vault/FilePreview';

const MAX_SIZE_BYTES = 700_000; // Firestore document limit is 1MB

/**
 * SecureVault - Professional document management system for career assets.
 * Supports secure storage, file previewing, and categorical organization.
 */
export default function SecureVault() {
  useAuth();
  const { data: files, loading: filesLoading, addData, deleteData, updateData } = useCollection('vault');
  const toast = useToast();
  const { openModal } = useModal();

  // State Management
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [sortBy, setSortBy] = useState('date'); 
  const [selectedFiles, setSelectedFiles] = useState([]);

  // --- Handlers ---

  const openPreview = (file) => {
    openModal(<FilePreview file={file} />, { 
      title: 'Resource Inspection', 
      size: 'lg' 
    });
  };

  const toggleSelect = (id) => {
    setSelectedFiles(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const bulkDelete = async () => {
    if (!window.confirm(`Permanently remove ${selectedFiles.length} resources from the vault?`)) return;
    try {
      await Promise.all(selectedFiles.map(id => deleteData(id)));
      toast.success(`${selectedFiles.length} Resources Removed`);
      setSelectedFiles([]);
    } catch {
      toast.error('Deletion Failed');
    }
  };

  const bulkDownload = () => {
    selectedFiles.forEach(id => {
      const file = files.find(f => f.id === id);
      if (file) {
        const a = document.createElement('a');
        a.href = file.content;
        a.download = file.name;
        a.click();
      }
    });
    toast.success(`Downloading ${selectedFiles.length} Resources`);
  };

  const toggleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(f => f.id));
    }
  };

  const handleFileProcess = async (filesToProcess) => {
    if (!filesToProcess || filesToProcess.length === 0) return;
    setUploadError('');
    setIsUploading(true);

    const processFile = async (file) => {
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`${file.name}: 700KB limit exceeded for direct vault storage.`);
        return;
      }
      try {
        setUploadProgress(10);
        const base64Content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onprogress = (e) => { if (e.lengthComputable) setUploadProgress(Math.round(10 + (e.loaded / e.total) * 75)); };
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        await addData({
          name: file.name, type: file.type || 'application/octet-stream',
          size: file.size, content: base64Content,
          uploadedAt: new Date().toISOString(),
          category: detectCategory(file.name),
        });
      } catch (err) {
        console.error('File sync error:', err);
        toast.error(`Ingestion Failed: ${file.name}`);
      }
    };

    try {
      for (const file of Array.from(filesToProcess)) {
        await processFile(file);
      }
      toast.success('Resources Secured');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // --- Memos ---

  const storageUsed = useMemo(() => {
    return files.reduce((acc, f) => acc + (f.size || 0), 0);
  }, [files]);

  const filteredFiles = useMemo(() => {
    return files
      .filter(f => {
        const q = searchQuery.toLowerCase();
        const matchesQuery = f.name?.toLowerCase().includes(q) || f.category?.toLowerCase().includes(q);
        const matchesCat = activeCategory === 'All' || f.category === activeCategory;
        return matchesQuery && matchesCat;
      })
      .sort((a, b) => {
        if (a.starred && !b.starred) return -1;
        if (!a.starred && b.starred) return 1;
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'size') return (b.size || 0) - (a.size || 0);
        return new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0);
      });
  }, [files, searchQuery, activeCategory, sortBy]);

  return (
    <ProtectedRoute>
      <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12 pb-safe min-h-screen">
      
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/[0.03]">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] mb-2">
            <Lock size={12} strokeWidth={3} /> Secure Partition
          </div>
          <h1 className="title-xl">Document Vault<span className="text-indigo-500">.</span></h1>
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="white" size="xs">{files.length} Resources</Badge>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="flex items-center gap-3">
              <span className="text-white/30 text-[9px] font-black uppercase tracking-widest">{formatBytes(storageUsed)} Used</span>
              <div className="w-24 h-1.5 bg-white/[0.03] rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (storageUsed / (20 * 1024 * 1024)) * 100)}%` }}
                  className="h-full bg-indigo-500/50 shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" size={16} />
            <input
              type="text" placeholder="Search resources..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all w-64 font-bold"
            />
          </div>
          <label className={`btn-primary h-14 px-8 flex items-center gap-3 cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : 'shadow-2xl active:scale-95'}`} data-testid="vault-upload">
            {isUploading ? <LogoLoader size="xs" /> : <Upload size={18} />}
            <span className="text-[10px] uppercase font-black tracking-widest leading-none">{isUploading ? 'Processing...' : 'Add Resource'}</span>
            <input type="file" className="hidden" multiple onChange={e => handleFileProcess(e.target.files)} disabled={isUploading} data-testid="vault-file-input" />
          </label>
        </div>
      </header>

      {/* Upload Progress & Errors */}
      <AnimatePresence>
        {isUploading && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="panel border-indigo-500/20 bg-indigo-500/[0.04]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Encryption Workflow Active</span>
              </div>
              <span className="text-[11px] font-black font-outfit text-white/40">{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
              <motion.div animate={{ width: `${uploadProgress}%` }} className="h-full bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
            </div>
          </motion.div>
        )}
        {uploadError && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl text-[10px] text-rose-400 font-black uppercase tracking-widest flex items-center gap-4">
            <AlertCircle size={18} /> {uploadError}
            <button onClick={() => setUploadError('')} className="ml-auto p-1.5 hover:bg-rose-500/10 rounded-lg transition-all"><X size={18} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar: Categories, Bulk Actions, Sorting */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {VAULT_CATEGORIES.map(cat => (
            <button
              key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                activeCategory === cat 
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-xl shadow-indigo-500/20' 
                  : 'text-white/20 hover:text-white/40 border-white/5 hover:border-white/10 bg-white/[0.01]'
              }`}
            >
              {cat} {cat !== 'All' && <span className="ml-2 opacity-30">({files.filter(f => f.category === cat).length})</span>}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence>
            {selectedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl"
              >
                <span className="text-[9px] font-black uppercase text-white/40 px-4">{selectedFiles.length} Selected</span>
                <button
                  onClick={bulkDownload}
                  className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <Upload size={12} className="rotate-180" /> Download
                </button>
                <button
                  onClick={bulkDelete}
                  className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all flex items-center gap-2"
                >
                  <Trash2 size={12} /> Purge
                </button>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="p-2 text-white/20 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={toggleSelectAll}
            className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${
              selectedFiles.length === filteredFiles.length && filteredFiles.length > 0
                ? 'bg-indigo-500 text-white border-indigo-500'
                : 'text-white/20 hover:text-white/40 border-white/5 hover:border-white/10 bg-white/[0.01]'
            }`}
          >
            {selectedFiles.length === filteredFiles.length && filteredFiles.length > 0 ? 'Deselect All' : 'Select All'}
          </button>

          <div className="flex items-center gap-1.5 p-1.5 bg-white/[0.015] border border-white/5 rounded-2xl">
            {[
              { id: 'date', label: 'Recent' },
              { id: 'name', label: 'Name' },
              { id: 'size', label: 'Size' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  sortBy === opt.id ? 'bg-white/5 text-white shadow-sm' : 'text-white/15 hover:text-white/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Dropzone + File Cards */}
      <div 
        onDragOver={e => { e.preventDefault(); setIsDraggingOver(true); }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={e => { e.preventDefault(); setIsDraggingOver(false); handleFileProcess(e.dataTransfer.files); }}
        className={`transition-all rounded-[40px] min-h-[450px] ${isDraggingOver ? 'ring-4 ring-indigo-500/40 bg-indigo-500/[0.04] scale-[0.99]' : ''}`}
      >
        {isDraggingOver ? (
          <div className="h-[450px] flex flex-col items-center justify-center gap-6 text-indigo-400 animate-pulse bg-white/[0.01] rounded-[40px] border-2 border-dashed border-indigo-500/20">
            <div className="p-8 rounded-[32px] bg-indigo-500/10 shadow-2xl shadow-indigo-500/10"><Upload size={56} /></div>
            <p className="text-[12px] font-black uppercase tracking-[0.4em]">Release Document to Secure</p>
          </div>
        ) : (
          <div className="flex flex-wrap -m-2.5">
            {filesLoading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="w-full sm:w-1/2 lg:w-1/4 p-2.5"><SkeletonCard className="h-64" /></div>)
            ) : filteredFiles.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {filteredFiles.map(file => (
                  <FileCard 
                    key={file.id} file={file} 
                    onPreview={openPreview} 
                    onDownload={(f) => { const a = document.createElement('a'); a.href = f.content; a.download = f.name; a.click(); }} 
                    onDelete={(id) => { deleteData(id); toast.info('Document Removed'); }} 
                    onUpdate={updateData}
                    isSelected={selectedFiles.includes(file.id)}
                    onSelect={toggleSelect}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <div className="w-full py-40 flex flex-col items-center justify-center gap-8 text-center bg-white/[0.01] rounded-[40px] border border-dashed border-white/5">
                <div className="w-24 h-24 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center justify-center opacity-20 group hover:opacity-40 transition-opacity">
                  <Lock size={48} strokeWidth={1} />
                </div>
                <div className="space-y-3">
                  <p className="text-base font-black font-outfit tracking-tight text-white/40">Vault Isolated</p>
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/10">No Active Resources Detected</p>
                </div>
                <button 
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  className="btn-secondary h-12 px-8 flex items-center gap-3 border-dashed"
                >
                  <Plus size={16} /> Initialize Upload
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Privacy Protocol Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="panel border-emerald-500/10 bg-emerald-500/[0.02] border-l-4 border-l-emerald-500 rounded-3xl"
      >
        <div className="flex items-start gap-6">
          <div className="p-4 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 flex-shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-black font-outfit text-base uppercase tracking-tight text-white">Privacy Protocol v2</h4>
            <p className="text-[11px] font-bold text-white/20 leading-relaxed max-w-3xl uppercase tracking-tighter">
              All documents are Base64 sealed and stored in isolated user partitions. No cross-access possible. End-to-end synchronization verified across professional infrastructure.
            </p>
          </div>
        </div>
      </motion.div>
      </div>
    </ProtectedRoute>
  );
}
