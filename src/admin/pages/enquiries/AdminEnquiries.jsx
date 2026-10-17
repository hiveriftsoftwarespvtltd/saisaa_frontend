import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  Archive,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Search,
  Filter,
  Calendar,
  Save,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminModal } from '../../components/common/AdminModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AdminEnquiries = () => {
  const {
    inquiries,
    isLoadingInquiries,
    refreshInquiries,
    updateInquiryStatus,
    deleteInquiry,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectInquiry, setInspectInquiry] = useState(null);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Compute summary metrics
  const stats = useMemo(() => {
    const total = inquiries.length;
    const newCount = inquiries.filter((i) => i.status === 'New').length;
    const inProgressCount = inquiries.filter((i) => i.status === 'In Progress').length;
    const resolvedCount = inquiries.filter((i) => i.status === 'Resolved').length;
    return { total, newCount, inProgressCount, resolvedCount };
  }, [inquiries]);

  // Filtered dataset
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const matchTab = activeTab === 'All' || item.status === activeTab;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchTab;

      const matchSearch =
        item.name?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        item.phone?.toLowerCase().includes(term) ||
        item.message?.toLowerCase().includes(term);

      return matchTab && matchSearch;
    });
  }, [inquiries, activeTab, searchTerm]);

  const handleOpenInspect = (row) => {
    setInspectInquiry(row);
    setNotesDraft(row.notes || '');
  };

  const handleSaveNotes = async () => {
    if (!inspectInquiry) return;
    setIsSavingNotes(true);
    try {
      await updateInquiryStatus(inspectInquiry.id, inspectInquiry.status, notesDraft);
      setInspectInquiry((prev) => ({ ...prev, notes: notesDraft }));
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateInquiryStatus(id, newStatus);
    if (inspectInquiry && (inspectInquiry.id === id || inspectInquiry._id === id)) {
      setInspectInquiry((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!inquiryToDelete) return;
    await deleteInquiry(inquiryToDelete.id || inquiryToDelete._id);
    setInquiryToDelete(null);
  };

  const columns = [
    {
      key: 'name',
      label: 'Patron Information',
      sortable: true,
      render: (name, row) => (
        <div className="space-y-0.5">
          <div className="font-serif text-xs font-bold text-stone-900 flex items-center gap-1.5">
            <span>{name}</span>
            {row.status === 'New' && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" title="New Inquiry" />
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-[#D4AF37]" />
              <a href={`mailto:${row.email}`} className="hover:text-stone-900 hover:underline">
                {row.email}
              </a>
            </span>
            {row.phone && (
              <span className="flex items-center gap-1 border-l border-stone-200 pl-2">
                <Phone className="w-3 h-3 text-[#D4AF37]" />
                <a href={`tel:${row.phone}`} className="hover:text-stone-900">
                  {row.phone}
                </a>
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'message',
      label: 'Patron Request / Trousseau Note',
      render: (msg, row) => (
        <div
          onClick={() => handleOpenInspect(row)}
          className="cursor-pointer group max-w-xs"
        >
          <p className="text-xs text-stone-600 line-clamp-2 italic group-hover:text-stone-900 transition-colors">
            "{msg}"
          </p>
          {row.notes && (
            <span className="inline-block text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1 font-medium">
              Note: {row.notes.slice(0, 30)}...
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Submitted Date',
      sortable: true,
      render: (dt, row) => (
        <div className="text-xs text-stone-500 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-stone-400" />
          <span>{dt || (row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent')}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Workflow Status',
      sortable: true,
      render: (status, row) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <select
            value={status}
            onChange={(e) => handleStatusChange(row.id || row._id, e.target.value)}
            className="text-[10px] bg-white border border-stone-200 rounded px-1.5 py-0.5 text-stone-600 focus:outline-none focus:border-[#09231A]"
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Concierge Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleOpenInspect(row)}
            title="Inspect Inquiry"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.phone && (
            <a
              href={`https://wa.me/${row.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Message via WhatsApp"
              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
          <a
            href={`mailto:${row.email}?subject=${encodeURIComponent('Re: Saisaa Atelier Consultation Request')}`}
            title="Email Patron"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>
          <button
            onClick={() => setInquiryToDelete(row)}
            title="Delete Inquiry"
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Consultations & Enquiries"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Customers', path: '/admin/customers' },
          { label: 'Enquiries' },
        ]}
        actions={
          <button
            onClick={refreshInquiries}
            disabled={isLoadingInquiries}
            className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:border-stone-400 rounded-lg shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Clock className={`w-3.5 h-3.5 ${isLoadingInquiries ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        }
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Total Inquiries
            </p>
            <h4 className="font-serif text-2xl font-bold text-stone-900 mt-1">
              {stats.total}
            </h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              New Consultations
            </p>
            <h4 className="font-serif text-2xl font-bold text-emerald-900 mt-1 flex items-center gap-2">
              <span>{stats.newCount}</span>
              {stats.newCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-sans font-bold rounded-full">
                  Action Required
                </span>
              )}
            </h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              In Progress
            </p>
            <h4 className="font-serif text-2xl font-bold text-amber-900 mt-1">
              {stats.inProgressCount}
            </h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-purple-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-purple-800">
              Resolved & Scheduled
            </p>
            <h4 className="font-serif text-2xl font-bold text-purple-900 mt-1">
              {stats.resolvedCount}
            </h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'New', 'In Progress', 'Resolved', 'Archived'].map((tab) => {
            const count =
              tab === 'All'
                ? inquiries.length
                : inquiries.filter((i) => i.status === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#09231A] text-[#F7E7BE] shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#D4AF37] text-[#09231A] font-bold' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inquiries, patrons, phones..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#09231A] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={filteredInquiries}
        loading={isLoadingInquiries}
        emptyMessage="No consultation requests found for this filter criteria."
      />

      {/* Inspection Modal */}
      {inspectInquiry && (
        <AdminModal
          isOpen={Boolean(inspectInquiry)}
          onClose={() => setInspectInquiry(null)}
          title="Patron Consultation Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Header info */}
            <div className="bg-[#09231A] text-white p-6 rounded-2xl border border-[#D4AF37]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                  Consultation Request
                </span>
                <h3 className="font-serif text-xl font-bold text-[#F7E7BE] mt-0.5">
                  {inspectInquiry.name}
                </h3>
                <p className="text-xs text-stone-300 mt-1 flex items-center gap-3">
                  <span>{inspectInquiry.email}</span>
                  {inspectInquiry.phone && <span>&bull; {inspectInquiry.phone}</span>}
                </p>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end gap-2">
                <StatusBadge status={inspectInquiry.status} />
                <span className="text-[11px] text-stone-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#D4AF37]" />
                  {inspectInquiry.date || 'Recent'}
                </span>
              </div>
            </div>

            {/* Message Body */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                Patron's Trousseau / Styling Request
              </label>
              <p className="text-xs text-stone-800 leading-relaxed font-serif italic whitespace-pre-wrap">
                "{inspectInquiry.message}"
              </p>
            </div>

            {/* Quick Contact Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inspectInquiry.phone && (
                <a
                  href={`https://wa.me/${inspectInquiry.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect via WhatsApp</span>
                </a>
              )}
              <a
                href={`mailto:${inspectInquiry.email}?subject=${encodeURIComponent('Re: Saisaa Atelier Consultation Request')}`}
                className="bg-stone-900 hover:bg-black text-[#F7E7BE] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>Dispatch Email Reply</span>
              </a>
            </div>

            {/* Workflow Status Selector */}
            <div className="border-t border-stone-200 pt-4">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-2">
                Update Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['New', 'In Progress', 'Resolved', 'Archived'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(inspectInquiry.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      inspectInquiry.status === st
                        ? 'bg-[#09231A] text-[#F7E7BE] border-[#D4AF37]'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Concierge Internal Notes */}
            <div className="border-t border-stone-200 pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Concierge Internal Notes
                </label>
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-3 py-1 bg-[#09231A] hover:bg-[#103B2C] text-[#F7E7BE] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isSavingNotes ? 'Saving...' : 'Save Note'}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Log internal follow-up details (e.g., Fabric swatches sent, appointment booked for Saturday 3 PM)..."
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#09231A]"
              />
            </div>
          </div>
        </AdminModal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(inquiryToDelete)}
        onClose={() => setInquiryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Consultation Inquiry"
        message={`Are you certain you wish to delete the inquiry from "${inquiryToDelete?.name}"? This action cannot be reversed.`}
        confirmLabel="Delete Record"
        confirmVariant="danger"
      />
    </div>
  );
};

export default AdminEnquiries;
