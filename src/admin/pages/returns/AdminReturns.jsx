import React, { useState } from 'react';
import { Check, Eye, DollarSign } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminModal } from '../../components/common/AdminModal';

export const AdminReturns = () => {
  const { returns, updateReturnStatus } = useAdmin();

  const [inspectReturn, setInspectReturn] = useState(null);

  const filterConfig = [
    {
      key: 'status',
      label: 'Return Status',
      options: [
        { value: 'Requested', label: 'Requested' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Refunded', label: 'Refunded' },
        { value: 'Rejected', label: 'Rejected' },
      ],
    },
  ];

  const columns = [
    {
      key: 'id',
      label: 'Return ID',
      sortable: true,
      render: (id) => <span className="font-mono font-bold text-xs text-stone-900">#{id}</span>,
    },
    {
      key: 'orderId',
      label: 'Order ID',
      sortable: true,
      render: (ordId) => (
        <span className="font-mono font-bold text-xs text-stone-600">#{ordId}</span>
      ),
    },
    {
      key: 'customer',
      label: 'Patron',
      sortable: true,
      render: (cust) => <span className="font-semibold text-xs text-stone-800">{cust}</span>,
    },
    {
      key: 'productName',
      label: 'Item To Return',
      render: (pName) => (
        <span className="font-serif text-xs font-bold text-stone-900 line-clamp-1 max-w-[150px]">
          {pName}
        </span>
      ),
    },
    {
      key: 'reason',
      label: 'Return Justification',
      render: (rsn) => (
        <p className="text-xs text-stone-600 line-clamp-1 max-w-xs">{rsn}</p>
      ),
    },
    {
      key: 'amount',
      label: 'Refund Amount',
      sortable: true,
      render: (amt) => (
        <span className="font-bold text-xs text-stone-900">
          ₹{amt.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Request Date',
      sortable: true,
      render: (dt) => <span className="text-xs text-stone-500">{dt}</span>,
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
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setInspectReturn(row)}
            className="p-1.5 text-stone-400 hover:text-[#0A261C] hover:bg-stone-100 rounded-lg transition-colors"
            title="Inspect Return Application"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {row.status === 'Requested' && (
            <button
              onClick={() => updateReturnStatus(row.id, 'Approved')}
              className="p-1.5 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Authorize Return"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
          {row.status === 'Approved' && (
            <button
              onClick={() => updateReturnStatus(row.id, 'Refunded')}
              className="p-1.5 text-stone-400 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors"
              title="Issue Refund Settlement"
            >
              <DollarSign className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader
        title="Returns & Reverse Logistics"
        subtitle={`Processing ${returns.length} garment return claims and exchange approvals.`}
        breadcrumbs={[{ label: 'Sales', path: '/admin/orders' }, { label: 'Returns' }]}
      />

      <DataTable
        columns={columns}
        data={returns}
        searchKeys={['id', 'orderId', 'customer', 'productName', 'reason', 'status']}
        filters={filterConfig}
        pageSize={10}
        emptyMessage="No return claims match your current filter selection."
      />

      {/* Return Details Modal */}
      <AdminModal
        isOpen={Boolean(inspectReturn)}
        onClose={() => setInspectReturn(null)}
        title={`Return #${inspectReturn?.id} Claim Details`}
        subtitle={`Order #${inspectReturn?.orderId} &bull; Requested on ${inspectReturn?.date}`}
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInspectReturn(null)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl"
            >
              Close
            </button>
            {inspectReturn?.status === 'Requested' && (
              <>
                <button
                  onClick={() => {
                    updateReturnStatus(inspectReturn.id, 'Rejected');
                    setInspectReturn(null);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl"
                >
                  Reject Claim
                </button>
                <button
                  onClick={() => {
                    updateReturnStatus(inspectReturn.id, 'Approved');
                    setInspectReturn(null);
                  }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl"
                >
                  Approve Return
                </button>
              </>
            )}
            {inspectReturn?.status === 'Approved' && (
              <button
                onClick={() => {
                  updateReturnStatus(inspectReturn.id, 'Refunded');
                  setInspectReturn(null);
                }}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0A261C] bg-[#D4AF37] hover:bg-[#E5C786] rounded-xl"
              >
                Disburse Refund (₹{inspectReturn?.amount?.toLocaleString('en-IN')})
              </button>
            )}
          </div>
        }
      >
        <div className="space-y-4 py-1 text-xs">
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-500">Patron:</span>
              <strong className="text-stone-800">{inspectReturn?.customer}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Product:</span>
              <strong className="text-stone-800">{inspectReturn?.productName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Claim Amount:</span>
              <strong className="text-[#0A261C] font-mono">
                ₹{inspectReturn?.amount?.toLocaleString('en-IN')}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Preferred Refund Rail:</span>
              <span className="text-stone-700 font-medium">{inspectReturn?.method}</span>
            </div>
          </div>

          <div>
            <span className="font-semibold uppercase tracking-wider text-stone-500 block mb-1">
              Patron Reason:
            </span>
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <p className="text-stone-800 leading-relaxed italic">
                "{inspectReturn?.reason}"
              </p>
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};
