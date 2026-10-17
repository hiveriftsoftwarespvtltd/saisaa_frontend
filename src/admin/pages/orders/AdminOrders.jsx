import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit3, Clock } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminModal } from '../../components/common/AdminModal';

// Helper to format date & time for orders in backoffice tables
const formatOrderDateTime = (row) => {
  let dateText = row?.date || '';
  let timeText = '';

  // 1. Try ISO createdAt first
  if (row?.createdAt) {
    try {
      const d = new Date(row.createdAt);
      if (!isNaN(d.getTime())) {
        dateText = d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        timeText = d.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      }
    } catch {}
  }

  // 2. Try placed timeline entry
  if (!timeText && Array.isArray(row?.timeline) && row.timeline.length > 0) {
    const placed = row.timeline.find((t) => t.status === 'Placed') || row.timeline[0];
    if (placed?.date && placed.date.includes(',')) {
      const [dPart, tPart] = placed.date.split(',');
      if (!dateText) dateText = dPart.trim();
      timeText = tPart?.trim() || '';
    }
  }

  // 3. Try splitting row.date if it already has a time
  if (!timeText && dateText.includes(',')) {
    const [dPart, tPart] = dateText.split(',');
    dateText = dPart.trim();
    timeText = tPart?.trim() || '';
  }

  // 4. Fallback if empty
  if (!dateText) dateText = 'Recent';
  if (!timeText) timeText = '10:30 AM';

  return { dateText, timeText };
};

export const AdminOrders = () => {
  const { orders, updateOrderStatus } = useAdmin();
  const navigate = useNavigate();

  const [quickStatusOrder, setQuickStatusOrder] = useState(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState('Processing');

  const filterConfig = [
    {
      key: 'orderStatus',
      label: 'Order Status',
      options: [
        { value: 'Pending', label: 'Pending' },
        { value: 'Confirmed', label: 'Confirmed' },
        { value: 'Processing', label: 'Processing' },
        { value: 'Shipped', label: 'Shipped' },
        { value: 'Delivered', label: 'Delivered' },
        { value: 'Cancelled', label: 'Cancelled' },
        { value: 'Returned', label: 'Returned' },
      ],
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      options: [
        { value: 'Paid', label: 'Paid' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Refunded', label: 'Refunded' },
        { value: 'Failed', label: 'Failed' },
      ],
    },
  ];

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      sortable: true,
      render: (id) => (
        <span
          onClick={() => navigate(`/admin/orders/${id}`)}
          className="font-mono font-bold text-xs text-stone-900 hover:text-[#0A261C] cursor-pointer hover:underline"
        >
          #{id}
        </span>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      render: (cust) => (
        <div>
          <h5 className="font-semibold text-xs text-stone-900">{cust.name}</h5>
          <span className="text-[10px] text-stone-400 block">{cust.phone}</span>
          <span className="text-[10px] text-stone-500 truncate max-w-[180px] block">{cust.email}</span>
        </div>
      ),
    },
    {
      key: 'items',
      label: 'Items & Sizing',
      render: (items) => (
        <div className="flex items-center gap-2">
          {items[0]?.image && (
            <img
              src={items[0].image}
              alt=""
              className="w-9 h-11 rounded-md object-cover border border-stone-200 shrink-0"
            />
          )}
          <div>
            <p className="text-xs font-medium text-stone-800 line-clamp-1 max-w-[160px]">
              {items[0]?.name}
            </p>
            <span className="text-[10px] text-stone-400">
              Size: {items[0]?.size || 'Standard'} &bull; Qty: {items[0]?.quantity || 1}
              {items.length > 1 && ` (+${items.length - 1} more)`}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Order Date',
      sortable: true,
      render: (_, row) => {
        const { dateText, timeText } = formatOrderDateTime(row);
        return (
          <div className="space-y-0.5">
            <span className="font-semibold text-xs text-stone-900 block">{dateText}</span>
            <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-stone-400 shrink-0" />
              {timeText}
            </span>
          </div>
        );
      },
    },
    {
      key: 'grandTotal',
      label: 'Grand Total',
      sortable: true,
      render: (amt) => (
        <span className="font-bold text-xs text-stone-900">
          ₹{amt?.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Payment Rail',
      render: (pm, row) => (
        <div>
          <span className="text-xs font-semibold text-stone-700 block">{pm}</span>
          <StatusBadge status={row.paymentStatus} className="text-[10px] py-0 px-1.5 mt-0.5" />
        </div>
      ),
    },
    {
      key: 'orderStatus',
      label: 'Fulfillment Status',
      sortable: true,
      render: (st) => <StatusBadge status={st} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/admin/orders/${row.id}`)}
            className="p-1.5 text-stone-500 hover:text-[#0A261C] hover:bg-stone-100 rounded-lg transition-colors"
            title="Inspect Full Order"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setQuickStatusOrder(row);
              setSelectedNewStatus(row.orderStatus);
            }}
            className="p-1.5 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Quick Change Status"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader
        title="Orders & Dispatch Log"
        subtitle={`Tracking ${orders.length} transactions across live customer fulfillment stages.`}
        breadcrumbs={[{ label: 'Sales', path: '/admin/orders' }, { label: 'Orders' }]}
      />

      {/* Universal DataTable */}
      <DataTable
        columns={columns}
        data={orders}
        searchKeys={['id', 'customer', 'paymentMethod', 'orderStatus', 'paymentStatus']}
        filters={filterConfig}
        pageSize={10}
        emptyMessage="No customer orders match the current filter selection."
      />

      {/* Quick Status Modal */}
      <AdminModal
        isOpen={Boolean(quickStatusOrder)}
        onClose={() => setQuickStatusOrder(null)}
        title={`Update Status: Order #${quickStatusOrder?.id}`}
        subtitle={`Customer: ${quickStatusOrder?.customer?.name}`}
        maxWidth="max-w-md"
        footer={
          <>
            <button
              onClick={() => setQuickStatusOrder(null)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (quickStatusOrder) {
                  updateOrderStatus(quickStatusOrder.id, selectedNewStatus);
                  setQuickStatusOrder(null);
                }
              }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#0A261C] hover:bg-[#123D2E] rounded-xl shadow-sm"
            >
              Apply Status
            </button>
          </>
        }
      >
        <div className="space-y-3 py-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
            Select New Fulfillment Stage
          </label>
          <div className="space-y-2">
            {[
              'Pending',
              'Confirmed',
              'Processing',
              'Shipped',
              'Delivered',
              'Cancelled',
              'Returned',
            ].map((st) => (
              <label
                key={st}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedNewStatus === st
                    ? 'bg-[#0A261C]/5 border-[#0A261C] text-[#0A261C] font-bold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs">{st}</span>
                </div>
                <input
                  type="radio"
                  name="modalOrderStatus"
                  value={st}
                  checked={selectedNewStatus === st}
                  onChange={(e) => setSelectedNewStatus(e.target.value)}
                  className="text-[#0A261C] focus:ring-[#0A261C]"
                />
              </label>
            ))}
          </div>
        </div>
      </AdminModal>
    </div>
  );
};
