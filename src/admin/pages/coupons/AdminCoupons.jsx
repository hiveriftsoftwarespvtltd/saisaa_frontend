import React, { useState } from 'react';
import { Plus, Trash2, Copy, Check } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminModal } from '../../components/common/AdminModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AdminCoupons = () => {
  const { coupons, addCoupon, deleteCoupon, showAdminToast } = useAdmin();

  const [modalOpen, setModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '15%',
    type: 'Percentage',
    value: 15,
    minimumOrder: 3999,
    maximumDiscount: 2000,
    usageLimit: 500,
    validFrom: 'Today',
    validUntil: '31 Dec 2026',
    status: 'Active',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showAdminToast(`Copied "${code}" to clipboard`, 'info');
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleSaveCoupon = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newCoupon.code.trim()) return;

    const formattedCode = newCoupon.code.trim().toUpperCase();
    const discountDisplay =
      newCoupon.type === 'Percentage' ? `${newCoupon.value}%` : `₹${newCoupon.value}`;

    setIsSubmitting(true);
    try {
      await addCoupon({
        ...newCoupon,
        code: formattedCode,
        discount: discountDisplay,
        value: Number(newCoupon.value),
        minimumOrder: Number(newCoupon.minimumOrder),
        maximumDiscount: Number(newCoupon.maximumDiscount),
        usageLimit: Number(newCoupon.usageLimit),
      });

      setModalOpen(false);
      setNewCoupon({
        code: '',
        discount: '15%',
        type: 'Percentage',
        value: 15,
        minimumOrder: 3999,
        maximumDiscount: 2000,
        usageLimit: 500,
        validFrom: 'Today',
        validUntil: '31 Dec 2026',
        status: 'Active',
        description: '',
      });
    } catch (err) {
      // Error notification handled by showAdminToast
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'code',
      label: 'Coupon Code',
      sortable: true,
      render: (code) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs bg-[#FAF7F2] text-[#0A261C] border border-[#D4AF37]/50 px-2.5 py-1 rounded-md tracking-wider">
            {code}
          </span>
          <button
            onClick={() => handleCopyCode(code)}
            className="text-stone-400 hover:text-stone-700 p-1"
            title="Copy promo code"
          >
            {copiedCode === code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      ),
    },
    {
      key: 'discount',
      label: 'Discount Benefit',
      sortable: true,
      render: (disc, row) => (
        <div>
          <span className="font-bold text-xs text-[#0A261C]">{disc}</span>
          <span className="text-[10px] text-stone-400 block">{row.type}</span>
        </div>
      ),
    },
    {
      key: 'minimumOrder',
      label: 'Min. Order',
      sortable: true,
      render: (amt) => (
        <span className="font-mono text-xs text-stone-700">₹{amt?.toLocaleString('en-IN')}</span>
      ),
    },
    {
      key: 'maximumDiscount',
      label: 'Max. Cap',
      sortable: true,
      render: (amt) => (
        <span className="font-mono text-xs text-stone-700">₹{amt?.toLocaleString('en-IN')}</span>
      ),
    },
    {
      key: 'usedCount',
      label: 'Redemptions',
      sortable: true,
      render: (used, row) => (
        <div>
          <span className="font-mono font-bold text-xs text-stone-800">
            {used} / {row.usageLimit}
          </span>
          <div className="h-1 w-20 bg-stone-100 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-[#0A261C] rounded-full"
              style={{
                width: `${Math.min(100, Math.round((used / Math.max(1, row.usageLimit)) * 100))}%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'validUntil',
      label: 'Valid Until',
      sortable: true,
      render: (until) => <span className="text-xs text-stone-500">{until}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => setCouponToDelete(row)}
          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Delete Promo Code"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader
        title="Royal Promo Codes & Discounts"
        subtitle={`Managing ${coupons.length} promotional rules, seasonal privileges, and welcome vouchers.`}
        breadcrumbs={[{ label: 'Marketing', path: '/admin/coupons' }, { label: 'Coupons' }]}
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Create Promo Code</span>
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={coupons}
        searchKeys={['code', 'description', 'discount', 'type', 'status']}
        pageSize={10}
        emptyMessage="No promotional coupons match your search."
      />

      {/* Add Coupon Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Issue New Royal Promo Code"
        subtitle="Establish discount algorithms, minimum basket thresholds, and redemption quotas."
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveCoupon}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0A261C] bg-[#D4AF37] hover:bg-[#E5C786] rounded-xl shadow-sm"
            >
              Issue Coupon
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveCoupon} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                value={newCoupon.code}
                onChange={(e) =>
                  setNewCoupon((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
                }
                required
                placeholder="e.g. UTSAV25"
                className="w-full px-3.5 py-2 text-xs font-mono font-bold bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Discount Type *
              </label>
              <select
                value={newCoupon.type}
                onChange={(e) =>
                  setNewCoupon((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Flat Amount">Flat Amount (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                value={newCoupon.value}
                onChange={(e) =>
                  setNewCoupon((prev) => ({ ...prev, value: e.target.value }))
                }
                required
                placeholder="15"
                className="w-full px-3.5 py-2 text-xs font-bold bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Min Basket (₹)
              </label>
              <input
                type="number"
                value={newCoupon.minimumOrder}
                onChange={(e) =>
                  setNewCoupon((prev) => ({ ...prev, minimumOrder: e.target.value }))
                }
                placeholder="4999"
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Max Cap (₹)
              </label>
              <input
                type="number"
                value={newCoupon.maximumDiscount}
                onChange={(e) =>
                  setNewCoupon((prev) => ({ ...prev, maximumDiscount: e.target.value }))
                }
                placeholder="2500"
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Max Redemption Quota
              </label>
              <input
                type="number"
                value={newCoupon.usageLimit}
                onChange={(e) =>
                  setNewCoupon((prev) => ({ ...prev, usageLimit: e.target.value }))
                }
                placeholder="500"
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={newCoupon.validUntil}
                onChange={(e) =>
                  setNewCoupon((prev) => ({ ...prev, validUntil: e.target.value }))
                }
                placeholder="31 Dec 2026"
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Public Description
            </label>
            <textarea
              rows={2}
              value={newCoupon.description}
              onChange={(e) =>
                setNewCoupon((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="e.g. 15% Royal Welcome Offer for first-time patrons"
              className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
            />
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(couponToDelete)}
        onClose={() => setCouponToDelete(null)}
        onConfirm={() =>
          couponToDelete && deleteCoupon(couponToDelete.id || couponToDelete._id)
        }
        title="Deactivate Promo Rule"
        message={`Are you sure you want to delete promo code "${couponToDelete?.code}"? Customers will no longer be able to apply this discount in their shopping bag.`}
      />
    </div>
  );
};
