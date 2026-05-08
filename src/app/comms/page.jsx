'use client';

import React, { useMemo, useState } from 'react';
import { 
  Plus, FileDown, Search, Target, TrendingUp, Zap, Clock, Users, History, Trash2
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useCollection } from '@/hooks/useDatabase';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContext';
import LogoLoader from '@/components/ui/LogoLoader';
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
    body: `Hi [Name], I've been following your work on [Topic] and was impressed by your recent insights. I'm a [Your Title] focused on [Field]. I'd love to connect and learn more about your experience at [Company].`
  },
  {
    title: 'Referral Request',
    body: `Hi [Name], I noticed a [Role] opening at [Company] that aligns perfectly with my background in [Skillset]. I've previously built [Project] which addresses similar challenges. Would you be open to a brief chat or referral?`
  },
  {
    title: 'Strategic Follow-up',
    body: `Hi [Name], just checking if you had a moment to see my previous message regarding [Topic]. I'm still very interested in [Company]'s mission and would love to discuss how my skills could contribute.`
  },
];

/**
 * CommunicationHub - Strategic CRM for professional network engagement.
 * Manages outreach cadence, message templates, and transmission logs.
 */
export default function CommunicationHub() {
  const { data: outreach, loading: dataLoading, addData, deleteData, updateData } = useCollection('outreach');
  const { data: userTemplates, addData: addTemplate, deleteData: deleteTemplate, loading: templatesLoading } = useCollection('customTemplates');
  const toast = useToast();
  const { openModal, closeModal } = useModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTargets, setSelectedTargets] = useState([]);

  // --- Metrics ---
  const metrics = useMemo(() => {
    const total = outreach.length;
    const replied = outreach.filter(o => o.status === 'Replied').length;
    const responseRate = total ? Math.round((replied / total) * 100) : 0;
    const overdue = outreach.filter(row => getCadenceStatus(row.createdAt).overdue).length;
    return { total, responseRate, overdue };
  }, [outreach]);

  // --- Handlers ---
  const handleExportCSV = () => {
    const csv = ['Name,Role,Company,Platform,Status,Email,Action,Notes'];
    outreach.forEach(r => csv.push([r.name, r.role, r.company, r.platform, r.status, r.email, r.action, r.notes?.replace(/,/g, ';')].map(v => `"${v || ''}"`).join(',')));
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

  const handleBatchPurge = async () => {
    if (!window.confirm(`Purge ${selectedTargets.length} contacts?`)) return;
    await Promise.all(selectedTargets.map(id => deleteData(id)));
    setSelectedTargets([]);
    toast.success('Batch Purge Complete');
  };

  const filteredOutreach = outreach
    .filter(r => r.name?.toLowerCase().includes(searchQuery.toLowerCase()) || r.role?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto w-full px-6 py-10 space-y-12 pb-safe">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Engagement CRM Active</span>
            </div>
            <h1 className="title-xl">Interaction History<span className="text-indigo-500">.</span></h1>
            <p className="text-sm font-medium text-white/40 max-w-2xl leading-relaxed">
              Strategic tracking of network engagements, recruiter correspondence, and referral loops.
            </p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <button onClick={handleExportCSV} className="btn-secondary h-14 px-6 flex items-center gap-3">
              <FileDown size={16} />
              <span className="text-[10px] uppercase font-black tracking-widest">Export CSV</span>
            </button>
            <button 
              onClick={() => handleOpenContactModal()}
              className="btn-primary h-14 px-8 flex items-center gap-3 shadow-2xl active:scale-95 transition-all"
              data-testid="comms-new-contact"
            >
              <Plus size={18} />
              <span className="text-[10px] uppercase font-black tracking-widest">New Contact</span>
            </button>
            {selectedTargets.length > 0 && (
              <button onClick={handleBatchPurge} className="px-6 py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all flex items-center gap-3 active:scale-95">
                <Trash2 size={16} /> Batch Purge
              </button>
            )}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="flex flex-wrap gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 min-w-[280px] panel relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <Users size={120} strokeWidth={1} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Total Network Nodes</p>
            <p className="text-4xl font-black font-outfit text-white">{metrics.total}</p>
            <div className="mt-6 flex items-center gap-2 text-emerald-500">
              <TrendingUp size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">Scaling Efficiently</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1 min-w-[280px] panel relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <Zap size={120} strokeWidth={1} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Response Efficiency</p>
            <p className="text-4xl font-black font-outfit text-indigo-400">{metrics.responseRate}%</p>
            <div className="mt-6 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${metrics.responseRate}%` }} className="h-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1 min-w-[280px] panel relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <Clock size={120} strokeWidth={1} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Critical Follow-ups</p>
            <p className="text-4xl font-black font-outfit text-rose-400">{metrics.overdue}</p>
            <p className="mt-6 text-[10px] font-bold text-white/20 uppercase tracking-widest">Engagement threshold breached</p>
          </motion.div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Transmission Log (Table/Cards) */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black font-outfit tracking-tighter text-white">Transmission Log</h2>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" size={14} />
                <input
                  type="text" placeholder="Search contacts..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="bg-white/[0.02] border border-white/5 rounded-2xl py-3 pl-11 pr-5 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all w-64 font-bold"
                />
              </div>
            </div>

            <div className="panel overflow-hidden p-0 border-white/5 bg-[#05070a]/50">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto scrollbar-hide">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.01] border-b border-white/[0.05]">
                      <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Target Node</th>
                      <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Status</th>
                      <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Sync Cadence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {dataLoading ? (
                      <tr><td colSpan={3} className="py-24 text-center"><LogoLoader size="sm" className="mx-auto opacity-40" /></td></tr>
                    ) : filteredOutreach.length === 0 ? (
                      <tr><td colSpan={3} className="py-40 text-center opacity-10 grayscale">
                        <Target size={64} className="mx-auto mb-6" />
                        <p className="text-[11px] font-black uppercase tracking-[0.4em]">No Active Transmissions</p>
                      </td></tr>
                    ) : filteredOutreach.map(row => (
                      <InteractionRow 
                        key={row.id} row={row} onUpdate={updateData} isSelected={selectedTargets.includes(row.id)}
                        onDelete={id => { deleteData(id); toast.info('Log entry purged'); }} 
                        onSelect={(id) => setSelectedTargets(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])}
                        onEdit={handleOpenContactModal}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-white/[0.03]">
                {dataLoading ? (
                  <div className="py-24 text-center"><LogoLoader size="sm" className="mx-auto opacity-40" /></div>
                ) : filteredOutreach.length === 0 ? (
                  <div className="py-40 text-center opacity-10 grayscale">
                    <Target size={64} className="mx-auto mb-6" />
                    <p className="text-[11px] font-black uppercase tracking-[0.4em]">No Active Transmissions</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {filteredOutreach.map(row => (
                      <InteractionCard 
                        key={row.id} row={row} onUpdate={updateData} isSelected={selectedTargets.includes(row.id)}
                        onDelete={id => { deleteData(id); toast.info('Log entry purged'); }} 
                        onSelect={(id) => setSelectedTargets(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])}
                        onEdit={handleOpenContactModal}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Templates & Specs */}
          <aside className="w-full lg:w-[380px] space-y-10">
            <section className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black font-outfit tracking-tighter text-white">Templates</h2>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">User-defined transmission nodes</p>
                </div>
                <button 
                  onClick={() => openModal(
                    <TemplateForm onSave={async (t) => { await addTemplate(t); toast.success('Template Created'); closeModal(); }} onClose={closeModal} />, 
                    { title: 'Create Template', size: 'lg' }
                  )}
                  className="p-2.5 hover:bg-white/5 rounded-2xl text-white/20 hover:text-amber-400 transition-all border border-white/5"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {templatesLoading ? (
                  <div className="py-12 text-center opacity-20"><LogoLoader size="sm" className="mx-auto" /></div>
                ) : userTemplates.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-white/5 rounded-3xl opacity-20 grayscale">
                    <p className="text-[9px] font-black uppercase tracking-widest">Empty Library</p>
                  </div>
                ) : (
                  userTemplates.map(t => (
                    <TemplateCard key={t.id} title={t.title} body={t.body} isCustom onDelete={() => deleteTemplate(t.id)} />
                  ))
                )}
              </div>

              <div className="pt-6 border-t border-white/[0.03]">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 mb-6 ml-2">System Inspiration</p>
                <div className="space-y-4">
                  {SYSTEM_TEMPLATES.map((t, i) => <TemplateCard key={i} title={t.title} body={t.body} />)}
                </div>
              </div>
            </section>

            {/* Cadence Specifications Panel */}
            <div className="panel border-indigo-500/10 bg-indigo-500/[0.02] border-l-4 border-l-indigo-500 rounded-3xl p-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-6 flex items-center gap-2">
                <History size={14} /> Cadence Specs
              </h4>
              <div className="space-y-5">
                {[
                  { label: 'Follow-up Loop', value: '3 → 10 → 21 Days' },
                  { label: 'Network Target', value: '15 Active Threads' },
                  { label: 'Success KPI', value: '≥ 20% Sync Rate' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center pb-4 border-b border-white/[0.03] last:border-0 last:pb-0">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{item.label}</span>
                    <span className="text-[10px] font-black font-outfit text-white/50 uppercase tracking-tight">{item.value}</span>
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
