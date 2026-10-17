import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminCustomers = () => {
  const { customers } = useAdmin();
  const navigate = useNavigate();

  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'VIP', label: 'VIP' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Patron Name',
      sortable: true,
      render: (name, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
          />
          <div>
            <h4
              onClick={() => navigate(`/admin/customers/${row.id}`)}
              className="font-serif text-xs font-bold text-stone-900 hover:text-[#0A261C] cursor-pointer hover:underline"
            >
              {name}
            </h4>
            <span className="font-mono text-[10px] text-stone-400 block">{row.id}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email Address',
      sortable: true,
      render: (email) => <span className="text-stone-600 text-xs">{email}</span>,
    },
    {
      key: 'phone',
      label: 'Phone Number',
      render: (phone) => <span className="text-stone-600 text-xs font-mono">{phone}</span>,
    },
    {
      key: 'orders',
      label: 'Orders',
      sortable: true,
      render: (ords) => (
        <span className="font-mono font-bold text-stone-900 text-xs">
          {ords} {ords === 1 ? 'order' : 'orders'}
        </span>
      ),
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      sortable: true,
      render: (amt) => (
        <span className="font-bold text-stone-900 text-xs">
          ₹{amt.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'joined',
      label: 'Joined Date',
      sortable: true,
      render: (dt) => <span className="text-stone-500 text-xs">{dt}</span>,
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
          onClick={() => navigate(`/admin/customers/${row.id}`)}
          className="p-1.5 text-stone-400 hover:text-[#0A261C] hover:bg-stone-100 rounded-lg transition-colors"
          title="View Patron Profile"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader
        title="Patron Directory"
        subtitle={`Managing ${customers.length} registered patrons and Royal Heritage Club clientele.`}
        breadcrumbs={[{ label: 'Customers', path: '/admin/customers' }, { label: 'Directory' }]}
      />

      <DataTable
        columns={columns}
        data={customers}
        searchKeys={['name', 'email', 'phone', 'id']}
        filters={filterConfig}
        pageSize={10}
        emptyMessage="No patrons found matching your search criteria."
      />
    </div>
  );
};
