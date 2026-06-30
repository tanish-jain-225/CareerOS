'use client';

import React, { useMemo, useState } from 'react';
import {
  Plus,
  FileDown,
  Search,
  Target,
  TrendingUp,
  Zap,
  Clock,
  Users,
  History,
  Trash2,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useCollection } from '@/hooks/useDatabase';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContext';
import LogoLoader from '@/components/ui/LogoLoader';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { motion } from 'framer-motion';
import { getCadenceStatus } from '@/utils/dateUtils';

// Components
import TemplateCard from '@/components/features/comms/TemplateCard';
import ContactForm from '@/components/features/comms/ContactForm';
import TemplateForm from '@/components/features/comms/TemplateForm';
import { InteractionRow, InteractionCard } from '@/components/features/comms/InteractionNode';

const SYSTEM_TEMPLATES = [
  {
    title: 'Professional Introduction',
    body: `Hi [Name], I've been following your work on [Topic] and was impressed by your recent insights. I'm a [Your Title] focused on [Field]. I'd love to connect and learn more about your experience at [Company].`,
  },
  {
    title: 'Referral Request',
    body: `Hi [Name], I noticed a [Role] opening at [Company] that aligns perfectly with my background in [Skillset]. I've previously built [Project] which addresses similar challenges. Would you be open to a brief chat or referral?`,
  },
  {
    title: 'Strategic Follow-up',
    body: `Hi [Name], just checking if you had a moment to see my previous message regarding [Topic]. I'm still very interested in [Company]'s mission and would love to discuss how my skills could contribute.`,
  },
];

/**
 * CommunicationHub (Engagement CRM) - Strategic node for professional correspondence.
 *
 * Features:
 * - Transmission Log: Real-time tracking of outreach loops across multiple platforms (LinkedIn, Email, Referral).
 * - Cadence Engine: Intelligent follow-up urgency tracking (Stable, Urgent, Critical).
 * - Template Library: Management of user-defined and system-inspired transmission nodes.
 * - Bulk Operations: High-intensity batch purging and CSV synchronization.
 * - Responsive Layout: Optimized table/card views for desktop and mobile tactical operations.
 *
 * @returns {JSX.Element} The rendered communication hub interface.
 */
export default function CommunicationHub() {
  const {
    data: outreach,
    loading: dataLoading,
    addData,
    deleteData,
    updateData,
  } = useCollection('outreach');
  const {
    data: userTemplates,
    addData: addTemplate,
    deleteData: deleteTemplate,
    loading: templatesLoading,
  } = useCollection('customTemplates');
  const toast = useToast();
  const { openModal, closeModal } = useModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTargets, setSelectedTargets] = useState([]);

  // --- Metrics ---
  const metrics = useMemo(() => {
    const total = outreach.length;
    const replied = outreach.filter((o) => o.status === 'Replied').length;
    const responseRate = total ? Math.round((replied / total) * 100) : 0;
    const overdue = outreach.filter((row) => getCadenceStatus(row.createdAt).overdue).length;
    return { total, responseRate, overdue };
  }, [outreach]);

  // --- Handlers ---
  const handleExportCSV = () => {
    const csv = ['Name,Role,Company,Platform,Status,Email,Action,Notes'];
    outreach.forEach((r) =>
      csv.push(
        [
          r.name,
          r.role,
          r.company,
          r.platform,
          r.status,
          r.email,
          r.action,
          r.notes?.replace(/,/g, ';'),
        ]
          .map((v) => `"${v || ''}"`)
          .join(',')
      )
    );
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `careeros_contacts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('CSV Export Complete');
  };

  const handleOpenContactModal = (initial = null) => {
    openModal(
      <ContactForm
        initial={initial}
        onSave={async (f) => {
          if (initial) await updateData(initial.id, f);
          else await addData(f);
          toast.success(initial ? 'Contact Updated' : 'Contact Synchronized');
          closeModal();
        }}
        onClose={closeModal}
      />,
      { title: initial ? 'Edit Contact' : 'Add New Contact', size: 'lg' }
    );
  };

  const handleBatchPurge = () => {
    openModal(
      <ConfirmDialog
        message={`Permanently purge ${selectedTargets.length} contact${selectedTargets.length !== 1 ? 's' : ''}? This cannot be undone.`}
        confirmLabel="Purge"
        variant="danger"
        onConfirm={async () => {
          closeModal();
          await Promise.all(selectedTargets.map((id) => deleteData(id)));
          setSelectedTargets([]);
          toast.success('Batch Purge Complete');
        }}
        onCancel={closeModal}
      />,
      { title: 'Confirm Batch Purge', size: 'sm' }
    );
  };

  const filteredOutreach = outreach
    .filter(
      (r) =>
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.role?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));

  return (
    <ProtectedRoute>
      <div className="pb-safe mx-auto w-full max-w-7xl space-y-12 px-6 py-10">
        {/* Header Section */}
        <header className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
              <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">
                Engagement CRM Active
              </span>
            </div>
            <h1 className="title-xl">
              Interaction History<span className="text-indigo-500">.</span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed font-medium text-white/40">
              Strategic tracking of network engagements, recruiter correspondence, and referral
              loops.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
            <button
              onClick={handleExportCSV}
              className="btn-secondary flex h-14 items-center justify-center gap-3 px-6 w-full sm:w-auto"
            >
              <FileDown size={16} />
              <span className="text-[10px] font-black tracking-widest uppercase">Export CSV</span>
            </button>
            <button
              onClick={() => handleOpenContactModal()}
              className="btn-primary flex h-14 items-center justify-center gap-3 px-8 shadow-2xl transition-all active:scale-95 w-full sm:w-auto"
              data-testid="comms-new-contact"
            >
              <Plus size={18} />
              <span className="text-[10px] font-black tracking-widest uppercase">New Contact</span>
            </button>
            {selectedTargets.length > 0 && (
              <button
                onClick={handleBatchPurge}
                className="flex items-center justify-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-6 py-3.5 text-[10px] font-black tracking-widest text-rose-500 uppercase transition-all hover:bg-rose-500/20 active:scale-95 w-full sm:w-auto"
              >
                <Trash2 size={16} /> Batch Purge
              </button>
            )}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="flex flex-wrap gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel group relative min-w-[240px] flex-1 overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] transition-opacity group-hover:opacity-[0.05]">
              <Users size={120} strokeWidth={1} />
            </div>
            <p className="mb-4 text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">
              Total Network Nodes
            </p>
            <p className="font-outfit text-4xl font-black text-white">{metrics.total}</p>
            <div className="mt-6 flex items-center gap-2 text-emerald-500">
              <TrendingUp size={14} />{' '}
              <span className="text-[10px] font-black tracking-widest uppercase">
                Scaling Efficiently
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="panel group relative min-w-[240px] flex-1 overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] transition-opacity group-hover:opacity-[0.05]">
              <Zap size={120} strokeWidth={1} />
            </div>
            <p className="mb-4 text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">
              Response Efficiency
            </p>
            <p className="font-outfit text-4xl font-black text-indigo-400">
              {metrics.responseRate}%
            </p>
            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics.responseRate}%` }}
                className="h-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="panel group relative min-w-[240px] flex-1 overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] transition-opacity group-hover:opacity-[0.05]">
              <Clock size={120} strokeWidth={1} />
            </div>
            <p className="mb-4 text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">
              Critical Follow-ups
            </p>
            <p className="font-outfit text-4xl font-black text-rose-400">{metrics.overdue}</p>
            <p className="mt-6 text-[10px] font-bold tracking-widest text-white/20 uppercase">
              Engagement threshold breached
            </p>
          </motion.div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Transmission Log (Table/Cards) */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-outfit text-2xl font-black tracking-tighter text-white">
                Transmission Log
              </h2>
              <div className="group relative">
                <Search
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-indigo-400"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 rounded-2xl border border-white/5 bg-white/[0.02] py-3 pr-5 pl-11 text-[11px] font-bold text-white transition-all placeholder:text-white/20 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none"
                />
              </div>
            </div>

            <div className="panel overflow-hidden border-white/5 bg-[#05070a]/50 p-0">
              {/* Desktop Table */}
              <div className="scrollbar-hide hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                      <th className="px-6 py-5 text-[9px] font-black tracking-[0.2em] text-white/20 uppercase">
                        Target Node
                      </th>
                      <th className="px-6 py-5 text-[9px] font-black tracking-[0.2em] text-white/20 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-5 text-[9px] font-black tracking-[0.2em] text-white/20 uppercase">
                        Sync Cadence
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {dataLoading ? (
                      <tr>
                        <td colSpan={3} className="py-24 text-center">
                          <LogoLoader size="sm" className="mx-auto opacity-40" />
                        </td>
                      </tr>
                    ) : filteredOutreach.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-40 text-center opacity-10 grayscale">
                          <Target size={64} className="mx-auto mb-6" />
                          <p className="text-[11px] font-black tracking-[0.4em] uppercase">
                            No Active Transmissions
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredOutreach.map((row) => (
                        <InteractionRow
                          key={row.id}
                          row={row}
                          onUpdate={updateData}
                          isSelected={selectedTargets.includes(row.id)}
                          onDelete={(id) => {
                            deleteData(id);
                            toast.info('Log entry purged');
                          }}
                          onSelect={(id) =>
                            setSelectedTargets((p) =>
                              p.includes(id) ? p.filter((i) => i !== id) : [...p, id]
                            )
                          }
                          onEdit={handleOpenContactModal}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="divide-y divide-white/[0.03] md:hidden">
                {dataLoading ? (
                  <div className="py-24 text-center">
                    <LogoLoader size="sm" className="mx-auto opacity-40" />
                  </div>
                ) : filteredOutreach.length === 0 ? (
                  <div className="py-40 text-center opacity-10 grayscale">
                    <Target size={64} className="mx-auto mb-6" />
                    <p className="text-[11px] font-black tracking-[0.4em] uppercase">
                      No Active Transmissions
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 p-4">
                    {filteredOutreach.map((row) => (
                      <InteractionCard
                        key={row.id}
                        row={row}
                        onUpdate={updateData}
                        isSelected={selectedTargets.includes(row.id)}
                        onDelete={(id) => {
                          deleteData(id);
                          toast.info('Log entry purged');
                        }}
                        onSelect={(id) =>
                          setSelectedTargets((p) =>
                            p.includes(id) ? p.filter((i) => i !== id) : [...p, id]
                          )
                        }
                        onEdit={handleOpenContactModal}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Templates & Specs */}
          <aside className="w-full space-y-10 lg:w-[380px]">
            <section className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                  <h2 className="font-outfit text-2xl font-black tracking-tighter text-white">
                    Templates
                  </h2>
                  <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">
                    User-defined transmission nodes
                  </p>
                </div>
                <button
                  onClick={() =>
                    openModal(
                      <TemplateForm
                        onSave={async (t) => {
                          await addTemplate(t);
                          toast.success('Template Created');
                          closeModal();
                        }}
                        onClose={closeModal}
                      />,
                      { title: 'Create Template', size: 'lg' }
                    )
                  }
                  className="rounded-2xl border border-white/5 p-2.5 text-white/20 transition-all hover:bg-white/5 hover:text-amber-400"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {templatesLoading ? (
                  <div className="py-12 text-center opacity-20">
                    <LogoLoader size="sm" className="mx-auto" />
                  </div>
                ) : userTemplates.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-white/5 p-8 text-center opacity-20 grayscale">
                    <p className="text-[9px] font-black tracking-widest uppercase">Empty Library</p>
                  </div>
                ) : (
                  userTemplates.map((t) => (
                    <TemplateCard
                      key={t.id}
                      title={t.title}
                      body={t.body}
                      isCustom
                      onDelete={() => deleteTemplate(t.id)}
                    />
                  ))
                )}
              </div>

              <div className="border-t border-white/[0.03] pt-6">
                <p className="mb-6 ml-2 text-[9px] font-black tracking-[0.4em] text-white/10 uppercase">
                  System Inspiration
                </p>
                <div className="space-y-4">
                  {SYSTEM_TEMPLATES.map((t, i) => (
                    <TemplateCard key={i} title={t.title} body={t.body} />
                  ))}
                </div>
              </div>
            </section>

            {/* Cadence Specifications Panel */}
            <div className="panel rounded-3xl border-l-4 border-indigo-500/10 border-l-indigo-500 bg-indigo-500/[0.02] p-6">
              <h4 className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-white/70 uppercase">
                <History size={14} /> Cadence Specs
              </h4>
              <div className="space-y-5">
                {[
                  { label: 'Follow-up Loop', value: '3 → 10 → 21 Days' },
                  { label: 'Network Target', value: '15 Active Threads' },
                  { label: 'Success KPI', value: '≥ 20% Sync Rate' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between border-b border-white/[0.03] pb-4 last:border-0 last:pb-0"
                  >
                    <span className="text-[9px] font-black tracking-widest text-white/20 uppercase">
                      {item.label}
                    </span>
                    <span className="font-outfit text-[10px] font-black tracking-tight text-white/50 uppercase">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </ProtectedRoute>
  );
}
