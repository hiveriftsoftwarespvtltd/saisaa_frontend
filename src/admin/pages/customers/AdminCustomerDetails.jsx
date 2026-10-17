import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Eye,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { apiClient, API_ENDPOINTS } from '../../../config';

export const AdminCustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, orders } = useAdmin();
  const [liveCustomer, setLiveCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLiveCustomer = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
        if (res?.data) {
          setLiveCustomer(res.data);
        }
      } catch (err) {
        console.warn('Could not load customer live details:', err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchLiveCustomer();
    }
  }, [id]);

  const customer =
    liveCustomer ||
    customers.find((c) => c.id === id || c._id === id || c.customId === id) ||
    customers[0] ||
    {};

  // Match orders placed by this customer
  const customerOrders =
    liveCustomer?.orderHistory && liveCustomer.orderHistory.length > 0
      ? liveCustomer.orderHistory
      : orders.filter(
          (o) =>
            o.customer?.email?.toLowerCase() === customer.email?.toLowerCase() ||
            o.customer?.name?.toLowerCase() === customer.name?.toLowerCase()
        );

  const orderColumns = [
    {
      key: 'id',
      label: 'Order ID',
      sortable: true,
      render: (ordId) => (
        <span
          onClick={() => navigate(`/admin/orders/${ordId}`)}
          className="font-mono font-bold text-xs text-stone-900 hover:underline cursor-pointer"
        >
          #{ordId}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (dt) => <span className="text-xs text-stone-500">{dt}</span>,
    },
    {
      key: 'grandTotal',
      label: 'Amount',
      sortable: true,
      render: (amt) => (
        <span className="font-bold text-xs text-stone-900">
          ₹{amt.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Payment',
      render: (pm) => <span className="text-xs text-stone-600">{pm}</span>,
    },
    {
      key: 'orderStatus',
      label: 'Status',
      sortable: true,
      render: (st) => <StatusBadge status={st} />,
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <button
          onClick={() => navigate(`/admin/orders/${row.id}`)}
          className="p-1.5 text-stone-500 hover:text-[#0A261C] hover:bg-stone-100 rounded-lg transition-colors"
          title="Inspect Order"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <PageHeader
        title={customer.name}
        subtitle={`Patron ID: ${customer.id} &bull; Member since ${customer.joined}`}
        breadcrumbs={[
          { label: 'Customers', path: '/admin/customers' },
          { label: 'Directory', path: '/admin/customers' },
          { label: customer.name },
        ]}
        actions={
          <Link
            to="/admin/customers"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl hover:text-stone-900 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Directory</span>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Profile Card & Addresses */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs text-center space-y-4">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#D4AF37] mx-auto shadow-md"
            />
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">{customer.name}</h3>
              <p className="text-xs text-stone-400 font-mono">{customer.id}</p>
              <div className="mt-2 flex justify-center">
                <StatusBadge status={customer.status} />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-2.5 text-left text-xs">
              <div className="flex items-center gap-2.5 text-stone-600">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-600">
                <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-600">
                <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Joined {customer.joined}</span>
              </div>
            </div>

            {customer.notes && (
              <div className="p-3 bg-[#FAF9F5] rounded-xl text-left border border-stone-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Atelier Concierge Notes
                </span>
                <p className="text-xs text-stone-600 italic leading-relaxed">
                  "{customer.notes}"
                </p>
              </div>
            )}
          </div>

          {/* Shipping Addresses */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h4 className="font-serif text-sm font-bold text-stone-900 border-b border-stone-100 pb-2.5">
              Saved Delivery Addresses
            </h4>

            <div className="space-y-3">
              {customer.addresses?.map((addr, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-stone-200/70 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">{addr.type}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-[#0A261C] text-[#F7E7BE] px-1.5 py-0.5 rounded font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-stone-600 leading-relaxed">{addr.line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): KPIs & Order History Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
              <span className="text-[11px] font-semibold text-stone-400 uppercase">Lifetime Spend</span>
              <p className="font-serif text-xl font-bold text-[#0A261C] mt-1">
                ₹{customer.totalSpent?.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold">High tier patron</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
              <span className="text-[11px] font-semibold text-stone-400 uppercase">Completed Orders</span>
              <p className="font-serif text-xl font-bold text-stone-900 mt-1">
                {customer.orders} orders
              </p>
              <span className="text-[10px] text-stone-400">0 returns recorded</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
              <span className="text-[11px] font-semibold text-stone-400 uppercase">Avg Basket Value</span>
              <p className="font-serif text-xl font-bold text-stone-900 mt-1">
                ₹{Math.round(customer.totalSpent / Math.max(1, customer.orders)).toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-stone-400 font-light">Per acquisition</span>
            </div>
          </div>

          {/* Universal DataTable: Order History */}
          <DataTable
            title="Patron Order History"
            subtitle="All acquisitions and transactions placed by this patron account."
            columns={orderColumns}
            data={customerOrders.length > 0 ? customerOrders : orders.slice(0, 3)}
            searchKeys={['id', 'paymentMethod', 'orderStatus']}
            pageSize={5}
            emptyMessage="No orders found for this customer."
          />
        </div>
      </div>
    </div>
  );
};
