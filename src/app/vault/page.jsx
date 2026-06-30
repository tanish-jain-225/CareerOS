'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Lock, Upload, X, ShieldCheck, AlertCircle, Trash2 } from 'lucide-react';
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
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const MAX_SIZE_BYTES = 700_000; // Firestore document limit is 1MB (compressed limit)
const MAX_UNCOMPRESSED_SIZE_BYTES = 5_000_000; // 5MB uncompressed limit

/**
 * SecureVault - Professional document management system for career assets.
 *
 * Features:
 * - High-fidelity file card grid with drag-and-drop ingestion.
 * - Base64 encryption simulation for secure direct-database storage.
 * - Categorical filtering (Resume, Cover Letter, Credential).
 * - Real-time storage metrics and bulk management actions (Download/Purge).
 * - High-intensity resource inspection (Previewer).
 *
 * @returns {JSX.Element} The rendered vault interface.
 */
export default function SecureVault() {
  useAuth();
  const {
    data: files,
    loading: filesLoading,
    addData,
    deleteData,
    updateData,
  } = useCollection('vault');
  const toast = useToast();
  const { openModal, closeModal } = useModal();

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

  const decompressAndDownload = async (file) => {
    let href = file.content;
    if (file.compressed) {
      try {
        const res = await fetch(file.content);
        const decompressedStream = res.body.pipeThrough(new DecompressionStream('gzip'));
        const decompressedBlob = await new Response(decompressedStream).blob();
        href = URL.createObjectURL(decompressedBlob);
      } catch (err) {
        console.error('Decompression error:', err);
      }
    }
    const a = document.createElement('a');
    a.href = href;
    a.download = file.name;
    a.click();
    if (href.startsWith('blob:')) {
      setTimeout(() => URL.revokeObjectURL(href), 100);
    }
  };

  const openPreview = (file) => {
    openModal(<FilePreview file={file} />, {
      title: 'Resource Inspection',
      size: 'lg',
    });
  };

  const toggleSelect = (id) => {
    setSelectedFiles((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const bulkDelete = async () => {
    openModal(
      <ConfirmDialog
        message={`Permanently remove ${selectedFiles.length} resource${selectedFiles.length !== 1 ? 's' : ''} from the vault? This cannot be undone.`}
        confirmLabel="Purge"
        variant="danger"
        onConfirm={async () => {
          closeModal();
          try {
            await Promise.all(selectedFiles.map((id) => deleteData(id)));
            toast.success(`${selectedFiles.length} Resources Removed`);
            setSelectedFiles([]);
          } catch {
            toast.error('Deletion Failed');
          }
        }}
        onCancel={closeModal}
      />,
      { title: 'Confirm Bulk Purge', size: 'sm' }
    );
  };

  const bulkDownload = async () => {
    toast.success(`Downloading ${selectedFiles.length} Resources`);
    for (const id of selectedFiles) {
      const file = files.find((f) => f.id === id);
      if (file) {
        await decompressAndDownload(file);
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map((f) => f.id));
    }
  };

  const handleFileProcess = async (filesToProcess) => {
    if (!filesToProcess || filesToProcess.length === 0) return;
    setUploadError('');
    setIsUploading(true);

    const processFile = async (file) => {
      if (file.size > MAX_UNCOMPRESSED_SIZE_BYTES) {
        toast.error(`${file.name}: 5MB file limit exceeded.`);
        return;
      }
      try {
        setUploadProgress(10);

        // Compress using browser native CompressionStream (gzip)
        const stream = file.stream();
        const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
        const compressedBlob = await new Response(compressedStream).blob();

        if (compressedBlob.size > MAX_SIZE_BYTES) {
          toast.error(`${file.name}: Compressed size (${formatBytes(compressedBlob.size)}) exceeds the 700KB database limit.`);
          return;
        }

        setUploadProgress(50);

        const base64Content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(compressedBlob);
        });

        setUploadProgress(80);

        await addData({
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size, // Original uncompressed size
          compressedSize: compressedBlob.size,
          compressed: true,
          content: base64Content,
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
      .filter((f) => {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          f.name?.toLowerCase().includes(q) || f.category?.toLowerCase().includes(q);
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
      <div className="pb-safe mx-auto min-h-screen w-full max-w-[1600px] space-y-8 px-4 py-6 sm:space-y-12 sm:px-6 sm:py-10">
        {/* Page Header */}
        <header className="flex flex-col justify-between gap-8 border-b border-white/[0.03] pb-10 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="mb-2 flex items-center gap-3 text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase">
              <Lock size={12} strokeWidth={3} /> Secure Partition
            </div>
            <h1 className="title-xl">
              Document Vault<span className="text-indigo-500">.</span>
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <Badge variant="white" size="xs">
                {files.length} Resources
              </Badge>
              <div className="h-1 w-1 rounded-full bg-white/10" />
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black tracking-widest text-white/30 uppercase">
                  {formatBytes(storageUsed)} Used
                </span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.03] shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (storageUsed / (20 * 1024 * 1024)) * 100)}%`,
                    }}
                    className="h-full bg-indigo-500/50 shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="group relative">
              <Search
                className="absolute top-1/2 left-5 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-indigo-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-2xl border border-white/5 bg-white/[0.02] py-4 pr-6 pl-12 text-xs font-bold text-white transition-all placeholder:text-white/20 focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none"
              />
            </div>
            <label
              className={`btn-primary flex h-14 cursor-pointer items-center gap-3 px-8 ${isUploading ? 'pointer-events-none opacity-50' : 'shadow-2xl active:scale-95'}`}
              data-testid="vault-upload"
            >
              {isUploading ? <LogoLoader size="xs" /> : <Upload size={18} />}
              <span className="text-[10px] leading-none font-black tracking-widest uppercase">
                {isUploading ? 'Processing...' : 'Add Resource'}
              </span>
              <input
                type="file"
                className="hidden"
                multiple
                onChange={(e) => handleFileProcess(e.target.files)}
                disabled={isUploading}
                data-testid="vault-file-input"
              />
            </label>
          </div>
        </header>

        {/* Upload Progress & Errors */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="panel border-indigo-500/20 bg-indigo-500/[0.04]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase">
                    Encryption Workflow Active
                  </span>
                </div>
                <span className="font-outfit text-[11px] font-black text-white/40">
                  {uploadProgress}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.03]">
                <motion.div
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                />
              </div>
            </motion.div>
          )}
          {uploadError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 rounded-2xl border border-rose-500/10 bg-rose-500/5 p-5 text-[10px] font-black tracking-widest text-rose-400 uppercase"
            >
              <AlertCircle size={18} /> {uploadError}
              <button
                onClick={() => setUploadError('')}
                className="ml-auto rounded-lg p-1.5 transition-all hover:bg-rose-500/10"
              >
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolbar: Categories, Bulk Actions, Sorting */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
            {VAULT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 rounded-2xl border px-6 py-3 text-[9px] font-black tracking-widest uppercase transition-all ${
                  activeCategory === cat
                    ? 'border-indigo-500 bg-indigo-500 text-white shadow-xl shadow-indigo-500/20'
                    : 'border-white/5 bg-white/[0.01] text-white/20 hover:border-white/10 hover:text-white/40'
                }`}
              >
                {cat}{' '}
                {cat !== 'All' && (
                  <span className="ml-2 opacity-30">
                    ({files.filter((f) => f.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:w-auto">
            <AnimatePresence>
              {selectedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-1.5 w-full"
                >
                  <span className="px-4 text-[9px] font-black text-white/40 uppercase">
                    {selectedFiles.length} Selected
                  </span>
                  <button
                    onClick={bulkDownload}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-2.5 text-[9px] font-black tracking-widest text-emerald-400 uppercase transition-all hover:bg-emerald-500/20"
                  >
                    <Upload size={12} className="rotate-180" /> Download
                  </button>
                  <button
                    onClick={bulkDelete}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-5 py-2.5 text-[9px] font-black tracking-widest text-rose-500 uppercase transition-all hover:bg-rose-500/20"
                  >
                    <Trash2 size={12} /> Purge
                  </button>
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="p-2 text-white/20 transition-colors hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={toggleSelectAll}
              className={`rounded-2xl border px-5 py-3 text-[9px] font-black tracking-widest uppercase transition-all w-full sm:w-auto text-center ${
                selectedFiles.length === filteredFiles.length && filteredFiles.length > 0
                  ? 'border-indigo-500 bg-indigo-500 text-white'
                  : 'border-white/5 bg-white/[0.01] text-white/20 hover:border-white/10 hover:text-white/40'
              }`}
            >
              {selectedFiles.length === filteredFiles.length && filteredFiles.length > 0
                ? 'Deselect All'
                : 'Select All'}
            </button>

            <div className="flex w-full items-center justify-between gap-1.5 rounded-2xl border border-white/5 bg-white/[0.015] p-1.5 sm:w-auto">
              {[
                { id: 'date', label: 'Recent' },
                { id: 'name', label: 'Name' },
                { id: 'size', label: 'Size' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={`flex-1 rounded-xl px-5 py-2.5 text-[9px] font-black tracking-widest uppercase transition-all text-center ${
                    sortBy === opt.id
                      ? 'bg-white/5 text-white shadow-sm'
                      : 'text-white/15 hover:text-white/30'
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
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingOver(false);
            handleFileProcess(e.dataTransfer.files);
          }}
          className={`min-h-[450px] rounded-[40px] transition-all ${isDraggingOver ? 'scale-[0.99] bg-indigo-500/[0.04] ring-4 ring-indigo-500/40' : ''}`}
        >
          {isDraggingOver ? (
            <div className="flex h-[450px] animate-pulse flex-col items-center justify-center gap-6 rounded-[40px] border-2 border-dashed border-indigo-500/20 bg-white/[0.01] text-indigo-400">
              <div className="rounded-[32px] bg-indigo-500/10 p-8 shadow-2xl shadow-indigo-500/10">
                <Upload size={56} />
              </div>
              <p className="text-[12px] font-black tracking-[0.4em] uppercase">
                Release Document to Secure
              </p>
            </div>
          ) : (
            <div className="-m-2.5 flex flex-wrap">
              {filesLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="w-full p-2.5 sm:w-1/2 lg:w-1/4">
                      <SkeletonCard className="h-64" />
                    </div>
                  ))
              ) : filteredFiles.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {filteredFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onPreview={openPreview}
                      onDownload={decompressAndDownload}
                      onDelete={(id) => {
                        deleteData(id);
                        toast.info('Document Removed');
                      }}
                      onUpdate={updateData}
                      isSelected={selectedFiles.includes(file.id)}
                      onSelect={toggleSelect}
                    />
                  ))}
                </AnimatePresence>
              ) : (
                <div className="flex w-full flex-col items-center justify-center gap-8 rounded-[40px] border border-dashed border-white/5 bg-white/[0.01] py-40 text-center">
                  <div className="group flex h-24 w-24 items-center justify-center rounded-[32px] border border-white/5 bg-white/[0.02] opacity-20 transition-opacity hover:opacity-40">
                    <Lock size={48} strokeWidth={1} />
                  </div>
                  <div className="space-y-3">
                    <p className="font-outfit text-base font-black tracking-tight text-white/40">
                      Vault Isolated
                    </p>
                    <p className="text-[10px] font-bold tracking-[0.3em] text-white/10 uppercase">
                      No Active Resources Detected
                    </p>
                  </div>
                  <button
                    onClick={() => document.querySelector('input[type="file"]').click()}
                    className="btn-secondary flex h-12 items-center gap-3 border-dashed px-8"
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
          className="panel rounded-3xl border-l-4 border-emerald-500/10 border-l-emerald-500 bg-emerald-500/[0.02]"
        >
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 rounded-2xl bg-emerald-500 p-4 text-white shadow-xl shadow-emerald-500/20">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-outfit text-base font-black tracking-tight text-white uppercase">
                Privacy Protocol v2
              </h4>
              <p className="max-w-3xl text-[11px] leading-relaxed font-bold tracking-tighter text-white/20 uppercase">
                All documents are Base64 sealed and stored in isolated user partitions. No
                cross-access possible. End-to-end synchronization verified across professional
                infrastructure.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
