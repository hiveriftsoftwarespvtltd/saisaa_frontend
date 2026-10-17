import React from 'react';

const STATUS_CONFIGS = {
  // Positive / Delivered / Active / Paid
  active: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-600' },
  delivered: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-600' },
  paid: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-600' },
  approved: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-600' },
  new: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold', dot: 'bg-emerald-600 animate-pulse' },
  'in stock': { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-600' },
  vip: { bg: 'bg-purple-50 text-purple-800 border-purple-200', dot: 'bg-purple-600' },
  resolved: { bg: 'bg-purple-50 text-purple-800 border-purple-200', dot: 'bg-purple-600' },

  // Info / In Progress / Shipped
  shipped: { bg: 'bg-blue-50 text-blue-800 border-blue-200', dot: 'bg-blue-600' },
  confirmed: { bg: 'bg-sky-50 text-sky-800 border-sky-200', dot: 'bg-sky-600' },
  'in progress': { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-600' },
  processing: { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-600' },
  requested: { bg: 'bg-indigo-50 text-indigo-800 border-indigo-200', dot: 'bg-indigo-600' },

  // Warning / Low Stock / Pending
  pending: { bg: 'bg-yellow-50 text-yellow-800 border-yellow-200', dot: 'bg-yellow-600' },
  'low stock': { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-600' },
  draft: { bg: 'bg-stone-100 text-stone-700 border-stone-200', dot: 'bg-stone-500' },
  archived: { bg: 'bg-stone-100 text-stone-600 border-stone-300', dot: 'bg-stone-400' },
  'coming soon': { bg: 'bg-teal-50 text-teal-800 border-teal-200', dot: 'bg-teal-600' },

  // Danger / Out of Stock / Cancelled / Refunded / Rejected
  'out of stock': { bg: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-600' },
  cancelled: { bg: 'bg-red-50 text-red-800 border-red-200', dot: 'bg-red-600' },
  failed: { bg: 'bg-red-50 text-red-800 border-red-200', dot: 'bg-red-600' },
  rejected: { bg: 'bg-red-50 text-red-800 border-red-200', dot: 'bg-red-600' },
  returned: { bg: 'bg-orange-50 text-orange-800 border-orange-200', dot: 'bg-orange-600' },
  refunded: { bg: 'bg-cyan-50 text-cyan-800 border-cyan-200', dot: 'bg-cyan-600' },
  inactive: { bg: 'bg-stone-100 text-stone-500 border-stone-200', dot: 'bg-stone-400' },
  expired: { bg: 'bg-stone-100 text-stone-500 border-stone-200', dot: 'bg-stone-400' },
};

export const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null;
  const key = String(status).toLowerCase();
  const config = STATUS_CONFIGS[key] || {
    bg: 'bg-stone-100 text-stone-700 border-stone-200',
    dot: 'bg-stone-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide whitespace-nowrap shadow-2xs ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{status}</span>
    </span>
  );
};
