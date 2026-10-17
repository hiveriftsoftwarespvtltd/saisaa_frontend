import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminModal } from '../../components/common/AdminModal';

export const AdminPayments = () => {
  const { payments } = useAdmin();
  const [inspectPayment, setInspectPayment] = useState(null);

  const filterConfig = [
    {
      key: 'status',
      label: 'Settlement Status',
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
      label: 'Transaction ID',
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
      label: 'Customer',
      sortable: true,
      render: (cust) => <span className="font-semibold text-xs text-stone-800">{cust}</span>,
    },
    {
      key: 'amount',
      label: 'Amount Settled',
      sortable: true,
      render: (amt) => (
        <span className="font-bold text-xs text-stone-900">
          ₹{amt.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'method',
      label: 'Payment Rail',
      sortable: true,
      render: (method, row) => (
        <div>
          <span className="text-xs font-medium text-stone-800">{method}</span>
          <span className="text-[10px] text-stone-400 block">{row.gateway}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'date',
      label: 'Timestamp',
      sortable: true,
      render: (dt) => <span className="text-xs text-stone-500 font-mono">{dt}</span>,
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <button
          onClick={() => setInspectPayment(row)}
          className="p-1.5 text-stone-400 hover:text-[#0A261C] hover:bg-stone-100 rounded-lg transition-colors"
          title="Inspect Transaction"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader
        title="Payment Gateways & Ledger"
        subtitle={`Tracking ${payments.length} financial transactions across UPI, Cards, NetBanking, and COD.`}
        breadcrumbs={[{ label: 'Sales', path: '/admin/orders' }, { label: 'Payments' }]}
      />

      <DataTable
        columns={columns}
        data={payments}
        searchKeys={['id', 'orderId', 'customer', 'method', 'gateway', 'status']}
        filters={filterConfig}
        pageSize={10}
        emptyMessage="No payment transactions match the chosen filter."
      />

      {/* Inspect Payment Modal */}
      <AdminModal
        isOpen={Boolean(inspectPayment)}
        onClose={() => setInspectPayment(null)}
        title="Transaction Ledger Audit"
        subtitle={`Transaction #${inspectPayment?.id}`}
        maxWidth="max-w-md"
        footer={
          <button
            onClick={() => setInspectPayment(null)}
            className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl"
          >
            Close
          </button>
        }
      >
        <div className="space-y-3 py-1 text-xs">
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200 space-y-2.5">
            <div className="flex justify-between">
              <span className="text-stone-500">Order Reference:</span>
              <strong className="font-mono text-stone-800">#{inspectPayment?.orderId}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Payer Name:</span>
              <strong className="text-stone-800">{inspectPayment?.customer}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Gross Remittance:</span>
              <strong className="text-[#0A261C] font-mono text-sm">
                ₹{inspectPayment?.amount?.toLocaleString('en-IN')}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Settlement Gateway:</span>
              <span className="font-medium text-stone-700">{inspectPayment?.gateway}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Rail Method:</span>
              <span className="text-stone-700">{inspectPayment?.method}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Payment Status:</span>
              <StatusBadge status={inspectPayment?.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Settled At:</span>
              <span className="font-mono text-stone-600">{inspectPayment?.date}</span>
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};
