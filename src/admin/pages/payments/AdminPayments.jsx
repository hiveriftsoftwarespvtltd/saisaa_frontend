import React, { useState } from 'react';
import { Eye, RefreshCw, AlertTriangle, CreditCard } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminModal } from '../../components/common/AdminModal';

export const AdminPayments = () => {
  const { payments, isLoadingOrders, orderError, refreshOrders, isServerOnline, serverError } = useAdmin();
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
        actions={
          <button
            onClick={refreshOrders}
            disabled={isLoadingOrders}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-stone-200 hover:border-stone-300 text-stone-700 rounded-xl text-xs font-semibold shadow-2xs transition-all disabled:opacity-60 cursor-pointer"
            title="Refresh Transactions from Live Orders"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin text-[#0A261C]' : ''}`} />
            <span className="hidden sm:inline">{isLoadingOrders ? 'Checking...' : 'Refresh'}</span>
          </button>
        }
      />

      {/* 1. Loading State */}
      {isLoadingOrders && payments.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center shadow-xs">
          <div className="flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#0A261C] animate-spin" />
            <h4 className="font-serif text-sm font-bold text-stone-800">
              Fetching Live Transactions...
            </h4>
            <p className="text-xs text-stone-400">
              Connecting to live orders database...
            </p>
          </div>
        </div>
      )}

      {/* 2. Error State (Backend Server Offline / 502) */}
      {!isLoadingOrders && (orderError || !isServerOnline) && payments.length === 0 && (
        <div className="bg-white rounded-2xl border border-rose-200 p-8 sm:p-12 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Unable to Load Transactions from Server
            </h3>
            <p className="text-xs font-mono text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {orderError || serverError || '502 Bad Gateway / Server Offline'}
            </p>
            <p className="text-xs text-stone-500 pt-2 leading-relaxed">
              Live orders database se connect nahi ho pa raha hai. Kripya check karein ki NestJS server running hai ya nahi.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={refreshOrders}
              disabled={isLoadingOrders}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] text-xs font-bold rounded-xl shadow transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
              <span>Retry Fetching Transactions</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Empty State (Database connected, 0 orders placed) */}
      {!isLoadingOrders && !orderError && isServerOnline && payments.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 sm:p-14 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto border border-stone-200">
            <CreditCard className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              No Transactions Recorded
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Database me abhi koi payment transaction record nahi hai. Jab koi customer storefront par checkout karega, transaction automatically yahan track hogi.
            </p>
          </div>
        </div>
      )}

      {/* 4. Real Payments Table */}
      {payments.length > 0 && (
        <DataTable
          columns={columns}
          data={payments}
          searchKeys={['id', 'orderId', 'customer', 'method', 'gateway', 'status']}
          filters={filterConfig}
          pageSize={10}
          emptyMessage="No payment transactions match the chosen filter."
        />
      )}

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
            {inspectPayment?.razorpayPaymentId && (
              <div className="flex justify-between">
                <span className="text-stone-500">Razorpay Payment ID:</span>
                <span className="font-mono text-stone-800 font-bold">{inspectPayment?.razorpayPaymentId}</span>
              </div>
            )}
            {inspectPayment?.razorpayOrderId && (
              <div className="flex justify-between">
                <span className="text-stone-500">Razorpay Order ID:</span>
                <span className="font-mono text-stone-800">{inspectPayment?.razorpayOrderId}</span>
              </div>
            )}
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
