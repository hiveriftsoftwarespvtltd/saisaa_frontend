import React, { useState } from 'react';
import {
  Edit,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Boxes,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminModal } from '../../components/common/AdminModal';

export const AdminInventory = () => {
  const { inventory, updateStock, refreshInventory, isLoadingInventory } = useAdmin();

  const [adjustItem, setAdjustItem] = useState(null);
  const [newStockVal, setNewStockVal] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Real-time inventory metrics calculation
  const totalUnits = inventory.reduce((sum, item) => sum + (Number(item.currentStock) || 0), 0);
  const inStockCount = inventory.filter((i) => i.status === 'In Stock').length;
  const lowStockCount = inventory.filter((i) => i.status === 'Low Stock').length;
  const outOfStockCount = inventory.filter((i) => i.status === 'Out of Stock').length;

  const filterConfig = [
    {
      key: 'status',
      label: 'Inventory Health',
      options: [
        { value: 'In Stock', label: 'In Stock' },
        { value: 'Low Stock', label: 'Low Stock' },
        { value: 'Out of Stock', label: 'Out of Stock' },
      ],
    },
    {
      key: 'category',
      label: 'Category',
      options: [
        { value: 'Suits', label: 'Suits' },
        { value: 'Kurtis', label: 'Kurtis' },
        { value: 'Sarees', label: 'Sarees' },
      ],
    },
  ];

  const handleOpenAdjust = (item) => {
    setAdjustItem(item);
    setNewStockVal(item.currentStock.toString());
  };

  const handleSaveAdjust = async (e) => {
    e.preventDefault();
    if (!adjustItem) return;
    setIsUpdating(true);
    try {
      await updateStock(adjustItem.sku || adjustItem.productId, newStockVal);
      setAdjustItem(null);
    } finally {
      setIsUpdating(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Product Title',
      sortable: true,
      render: (name, row) => (
        <div className="flex items-center gap-2.5">
          {row.cardImage && (
            <img
              src={row.cardImage}
              alt=""
              className="w-9 h-11 rounded-lg object-cover border border-stone-200 shrink-0"
            />
          )}
          <div>
            <h4 className="font-serif text-xs font-bold text-stone-900 line-clamp-1">{name}</h4>
            <span className="text-[10px] text-stone-400 font-medium">{row.category}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'sku',
      label: 'SKU Code',
      sortable: true,
      render: (sku) => <span className="font-mono text-xs font-bold text-stone-700">{sku}</span>,
    },
    {
      key: 'currentStock',
      label: 'Physical Stock',
      sortable: true,
      render: (stk, row) => (
        <span
          className={`font-mono font-bold text-xs ${
            stk === 0
              ? 'text-rose-600'
              : stk <= row.threshold
              ? 'text-amber-600'
              : 'text-stone-900'
          }`}
        >
          {stk} units
        </span>
      ),
    },
    {
      key: 'reserved',
      label: 'Reserved / In Cart',
      sortable: true,
      render: (res) => <span className="font-mono text-xs text-stone-500">{res} units</span>,
    },
    {
      key: 'available',
      label: 'Available for Sale',
      sortable: true,
      render: (avail) => (
        <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          {avail} units
        </span>
      ),
    },
    {
      key: 'threshold',
      label: 'Reorder Point',
      sortable: true,
      render: (th) => <span className="font-mono text-xs text-stone-500">&le; {th} units</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <button
          onClick={() => handleOpenAdjust(row)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-[#0A261C] hover:text-[#F7E7BE] text-stone-700 transition-colors shadow-2xs cursor-pointer"
        >
          <Edit className="w-3 h-3" />
          <span>Adjust Stock</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader
        title="Stock & Inventory Control"
        subtitle={`Tracking physical warehoused inventory across ${inventory.length} distinct atelier SKUs.`}
        breadcrumbs={[{ label: 'Catalog', path: '/admin/products' }, { label: 'Inventory' }]}
        actions={
          <button
            onClick={() => refreshInventory && refreshInventory()}
            disabled={isLoadingInventory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
            title="Refresh Inventory Directory"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInventory ? 'animate-spin' : ''}`} />
            <span>Sync Catalog</span>
          </button>
        }
      />

      {/* Real-Time Inventory Health Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Total Warehoused Units
            </span>
            <span className="font-serif text-2xl font-bold text-[#0A261C] mt-0.5 block">
              {totalUnits.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-stone-500 font-medium">{inventory.length} active SKUs</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-[#0A261C] flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
              Healthy Stock
            </span>
            <span className="font-serif text-2xl font-bold text-emerald-800 mt-0.5 block">
              {inStockCount}
            </span>
            <span className="text-[11px] text-stone-500 font-medium">Sufficient warehouse buffer</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-100 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
              Low Stock Warnings
            </span>
            <span className="font-serif text-2xl font-bold text-amber-800 mt-0.5 block">
              {lowStockCount}
            </span>
            <span className="text-[11px] text-stone-500 font-medium">At or below reorder point</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
              Depleted / Out of Stock
            </span>
            <span className="font-serif text-2xl font-bold text-rose-800 mt-0.5 block">
              {outOfStockCount}
            </span>
            <span className="text-[11px] text-stone-500 font-medium">Requires immediate tailoring</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Universal DataTable */}
      <DataTable
        columns={columns}
        data={inventory}
        searchKeys={['name', 'sku', 'category', 'status']}
        filters={filterConfig}
        pageSize={10}
        emptyMessage="No inventory entries match your filter criteria."
      />

      {/* Adjust Stock Modal */}
      <AdminModal
        isOpen={Boolean(adjustItem)}
        onClose={() => setAdjustItem(null)}
        title="Adjust Physical Inventory"
        subtitle={`Product: ${adjustItem?.name} (${adjustItem?.sku})`}
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setAdjustItem(null)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAdjust}
              disabled={isUpdating}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0A261C] bg-[#D4AF37] hover:bg-[#E5C786] rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {isUpdating ? 'Updating...' : 'Update Inventory'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveAdjust} className="space-y-4 py-1">
          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-500">Current Logged Count:</span>
              <strong className="font-mono text-stone-800">{adjustItem?.currentStock} units</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Reserved in Checkout Baskets:</span>
              <span className="font-mono text-stone-600">{adjustItem?.reserved} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Low Stock Alert Threshold:</span>
              <span className="font-mono text-amber-700 font-bold">&le; {adjustItem?.threshold} units</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              New On-Hand Physical Count *
            </label>
            <input
              type="number"
              min="0"
              value={newStockVal}
              onChange={(e) => setNewStockVal(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-sm font-mono font-bold bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-900"
            />
          </div>

          <div className="flex gap-2">
            {[+5, +10, +25, -1].map((delta) => (
              <button
                type="button"
                key={delta}
                onClick={() =>
                  setNewStockVal((prev) => Math.max(0, (Number(prev) || 0) + delta).toString())
                }
                className="flex-1 py-1 px-2 rounded-lg text-xs font-mono font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200"
              >
                {delta > 0 ? `+${delta}` : delta}
              </button>
            ))}
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
