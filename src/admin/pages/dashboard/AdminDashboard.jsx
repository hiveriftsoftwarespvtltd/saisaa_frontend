import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Clock,
  AlertTriangle,
  Plus,
  FolderTree,
  TicketPercent,
  ArrowRight,
  Eye,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { StatCard } from '../../components/common/StatCard';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';

// Helper for patron avatar initials fallback
const getInitials = (name) => {
  if (!name) return 'SP';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
};

export const AdminDashboard = () => {
  const {
    products,
    orders,
    customers,
    inventory,
    analytics,
  } = useAdmin();

  const navigate = useNavigate();
  const [salesTimeframe, setSalesTimeframe] = useState('30d');

  // Dynamic Total Revenue across all placed orders
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.grandTotal || o.amount || o.total) || 0), 0);
  }, [orders]);

  // Dynamic Unique Customers across registered patrons and order patrons
  const totalCustomersCount = useMemo(() => {
    const emailSet = new Set();
    orders.forEach((o) => {
      const em = (o.customer?.email || o.userEmail || '').toLowerCase();
      if (em) emailSet.add(em);
    });
    customers.forEach((c) => {
      const em = (c.email || '').toLowerCase();
      if (em) emailSet.add(em);
    });
    return emailSet.size || customers.length || 0;
  }, [orders, customers]);

  // Dynamic KPIs from state
  const pendingOrdersCount = useMemo(() => {
    return orders.filter(
      (o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing'
    ).length;
  }, [orders]);

  const lowStockCount = useMemo(() => {
    return inventory.filter(
      (i) => i.status === 'Low Stock' || i.status === 'Out of Stock' || Number(i.currentStock ?? i.stock) <= Number(i.threshold ?? 5)
    ).length;
  }, [inventory]);

  // Order status counts for status breakdown
  const statusCounts = useMemo(() => {
    return {
      Pending: orders.filter((o) => o.orderStatus === 'Pending').length,
      Confirmed: orders.filter((o) => o.orderStatus === 'Confirmed').length,
      Processing: orders.filter((o) => o.orderStatus === 'Processing').length,
      Shipped: orders.filter((o) => o.orderStatus === 'Shipped').length,
      Delivered: orders.filter((o) => o.orderStatus === 'Delivered').length,
      Cancelled: orders.filter((o) => o.orderStatus === 'Cancelled').length,
      Returned: orders.filter((o) => o.orderStatus === 'Returned').length,
    };
  }, [orders]);

  // Filtered Orders for the Sales Analytics Section according to selected timeframe
  const filteredOrders = useMemo(() => {
    const now = new Date();
    if (salesTimeframe === 'today') {
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      return orders.filter((o) => {
        const t = o.createdAt ? new Date(o.createdAt).getTime() : now.getTime();
        return t >= startOfToday;
      });
    }
    if (salesTimeframe === '7d') {
      const limit = now.getTime() - 7 * 24 * 60 * 60 * 1000;
      return orders.filter((o) => {
        const t = o.createdAt ? new Date(o.createdAt).getTime() : now.getTime();
        return t >= limit;
      });
    }
    if (salesTimeframe === '30d') {
      const limit = now.getTime() - 30 * 24 * 60 * 60 * 1000;
      return orders.filter((o) => {
        const t = o.createdAt ? new Date(o.createdAt).getTime() : now.getTime();
        return t >= limit;
      });
    }
    return orders; // '1y' or all
  }, [orders, salesTimeframe]);

  const timeframeRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (Number(o.grandTotal || o.amount || o.total) || 0), 0);
  }, [filteredOrders]);

  const timeframeOrdersCount = filteredOrders.length;
  const timeframeAOV = timeframeOrdersCount > 0 ? Math.round(timeframeRevenue / timeframeOrdersCount) : 0;

  // Dynamic Monthly Revenue Bar Chart (Aggregated from real orders)
  const dynamicMonthlyRevenue = useMemo(() => {
    const monthNames = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const monthIndices = [4, 5, 6, 7, 8, 9];

    return monthNames.map((mName, i) => {
      const mIdx = monthIndices[i];
      const monthOrders = orders.filter((o) => {
        if (o.createdAt) {
          return new Date(o.createdAt).getMonth() === mIdx;
        }
        if (o.date) {
          return o.date.toLowerCase().includes(mName.toLowerCase());
        }
        return false;
      });
      const rev = monthOrders.reduce((sum, o) => sum + (Number(o.grandTotal || o.amount || o.total) || 0), 0);
      return {
        month: mName,
        revenue: rev,
        orders: monthOrders.length,
      };
    });
  }, [orders]);

  const maxMonthlyRevenue = useMemo(() => {
    return Math.max(...dynamicMonthlyRevenue.map((m) => m.revenue), 10000);
  }, [dynamicMonthlyRevenue]);

  // Dynamic Top Selling Products (Calculates units sold from actual order items + baseline)
  const topProducts = useMemo(() => {
    const salesMap = {};
    orders.forEach((o) => {
      if (Array.isArray(o.items)) {
        o.items.forEach((it) => {
          const key = it.id || it.name;
          salesMap[key] = (salesMap[key] || 0) + (Number(it.quantity) || 1);
        });
      }
    });

    const list = products.map((p) => {
      const liveSold = salesMap[p.id] || salesMap[p._id] || salesMap[p.name] || 0;
      const totalSold = liveSold + (p.unitsSold || 0);
      return { ...p, calculatedSold: totalSold };
    });

    list.sort((a, b) => b.calculatedSold - a.calculatedSold);
    return list.slice(0, 5);
  }, [products, orders]);

  // Dynamic Low Stock Inventory (lowest available stock first)
  const lowStockInventory = useMemo(() => {
    const sorted = [...inventory].sort((a, b) => {
      const stockA = Number(a.currentStock ?? a.stock) || 0;
      const stockB = Number(b.currentStock ?? b.stock) || 0;
      return stockA - stockB;
    });
    return sorted.slice(0, 5);
  }, [inventory]);

  // Dynamic Recent Patrons
  const recentPatrons = useMemo(() => {
    const map = new Map();
    // Live orders first
    orders.forEach((o) => {
      const email = (o.customer?.email || o.userEmail || '').toLowerCase();
      if (email) {
        if (!map.has(email)) {
          map.set(email, {
            id: o.customer?.id || `cust-${email}`,
            name: o.customer?.name || 'Valued Patron',
            email,
            phone: o.customer?.phone || '',
            totalSpent: Number(o.grandTotal || o.amount || o.total) || 0,
            status: 'Active',
            avatar: null,
          });
        } else {
          const existing = map.get(email);
          existing.totalSpent += Number(o.grandTotal || o.amount || o.total) || 0;
        }
      }
    });

    // Merge registered customers
    customers.forEach((c) => {
      const email = (c.email || '').toLowerCase();
      if (email) {
        if (!map.has(email)) {
          map.set(email, {
            id: c.id || c._id,
            name: c.name || c.fullName || 'Valued Patron',
            email,
            phone: c.phone || '',
            totalSpent: Number(c.totalSpent) || 0,
            status: c.status || 'Active',
            avatar: c.avatar || null,
          });
        } else {
          const existing = map.get(email);
          if (c.avatar) existing.avatar = c.avatar;
          if (c.name && c.name !== 'Valued Patron') existing.name = c.name;
        }
      }
    });

    return Array.from(map.values()).slice(0, 5);
  }, [orders, customers]);

  // Recent Orders columns for the Universal DataTable
  const orderColumns = [
    {
      key: 'id',
      label: 'Order ID',
      sortable: true,
      render: (val) => (
        <span className="font-mono font-bold text-stone-900 hover:text-[#0A261C]">
          #{val}
        </span>
      ),
    },
    {
      key: 'customer',
      label: 'Patron',
      sortable: true,
      render: (cust) => (
        <div>
          <p className="font-semibold text-stone-800">{cust.name}</p>
          <p className="text-[10px] text-stone-400">{cust.email}</p>
        </div>
      ),
    },
    {
      key: 'items',
      label: 'Product Item',
      render: (items) => (
        <div className="flex items-center gap-2">
          {items[0]?.image && (
            <img
              src={items[0].image}
              alt=""
              className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
            />
          )}
          <span className="line-clamp-1 max-w-[150px] font-medium text-stone-700">
            {items[0]?.name || 'Item'}
            {items.length > 1 && ` (+${items.length - 1})`}
          </span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Order Date',
      sortable: true,
      render: (_, row) => {
        let dateText = row?.date || '';
        let timeText = '';

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

        if (!timeText && Array.isArray(row?.timeline) && row.timeline.length > 0) {
          const placed = row.timeline.find((t) => t.status === 'Placed') || row.timeline[0];
          if (placed?.date && placed.date.includes(',')) {
            const [dPart, tPart] = placed.date.split(',');
            if (!dateText) dateText = dPart.trim();
            timeText = tPart?.trim() || '';
          }
        }

        if (!timeText && dateText.includes(',')) {
          const [dPart, tPart] = dateText.split(',');
          dateText = dPart.trim();
          timeText = tPart?.trim() || '';
        }

        if (!dateText) dateText = 'Recent';
        if (!timeText) timeText = '10:30 AM';

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
      label: 'Amount',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-stone-900">₹{val.toLocaleString('en-IN')}</span>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Payment',
      render: (val, row) => (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-stone-600">{val}</span>
          <StatusBadge status={row.paymentStatus} className="text-[10px] py-0 px-1.5" />
        </div>
      ),
    },
    {
      key: 'orderStatus',
      label: 'Status',
      sortable: true,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <button
          onClick={() => navigate(`/admin/orders/${row.id}`)}
          className="p-1.5 rounded-lg bg-stone-100 hover:bg-[#0A261C] hover:text-[#F7E7BE] text-stone-600 transition-colors"
          title="View Order Details"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  const totalOrdersCount = orders.length;

  const statusBreakdown = useMemo(() => {
    return [
      { status: 'Delivered', count: statusCounts.Delivered, color: 'bg-emerald-600' },
      { status: 'Shipped', count: statusCounts.Shipped, color: 'bg-blue-600' },
      { status: 'Processing', count: statusCounts.Processing, color: 'bg-amber-600' },
      { status: 'Confirmed', count: statusCounts.Confirmed, color: 'bg-sky-600' },
      { status: 'Pending', count: statusCounts.Pending, color: 'bg-purple-600' },
      { status: 'Returned', count: statusCounts.Returned, color: 'bg-orange-600' },
      { status: 'Cancelled', count: statusCounts.Cancelled, color: 'bg-rose-600' },
    ];
  }, [statusCounts]);

  const onTimeRate = useMemo(() => {
    if (totalOrdersCount === 0) return '100.0';
    const activePipeline =
      statusCounts.Delivered + statusCounts.Shipped + statusCounts.Confirmed + statusCounts.Processing;
    return ((activePipeline / totalOrdersCount) * 100).toFixed(1);
  }, [totalOrdersCount, statusCounts]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Dashboard Welcome & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
            SAISAA Executive Overview
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-0.5">
            Royal Atelier Dashboard
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Real-time catalog metrics, inventory alerts, and patron order fulfillment.
          </p>
        </div>

        {/* 4 Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Add Product</span>
          </Link>

          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold shadow-2xs transition-all"
          >
            <FolderTree className="w-4 h-4 text-stone-500" />
            <span>Categories</span>
          </Link>

          <Link
            to="/admin/coupons"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold shadow-2xs transition-all"
          >
            <TicketPercent className="w-4 h-4 text-stone-500" />
            <span>Create Coupon</span>
          </Link>

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold shadow-2xs transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-stone-500" />
            <span>View Orders</span>
          </Link>
        </div>
      </div>

      {/* 2. Top 6 Dynamic KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
        <StatCard
          icon={DollarSign}
          title="Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          change={`${orders.length} orders`}
          isPositive={true}
          comparisonText="gross volume"
          accentColor="gold"
          onClick={() => navigate('/admin/orders')}
        />

        <StatCard
          icon={ShoppingCart}
          title="Orders"
          value={orders.length.toLocaleString('en-IN')}
          change={`${statusCounts.Delivered} done`}
          isPositive={true}
          comparisonText="lifetime"
          accentColor="green"
          onClick={() => navigate('/admin/orders')}
        />

        <StatCard
          icon={Users}
          title="Customers"
          value={totalCustomersCount.toLocaleString('en-IN')}
          change={`${customers.length} patrons`}
          isPositive={true}
          comparisonText="registered"
          accentColor="blue"
          onClick={() => navigate('/admin/customers')}
        />

        <StatCard
          icon={Package}
          title="Products"
          value={products.length.toLocaleString('en-IN')}
          change={`${inventory.length} SKUs`}
          isPositive={true}
          comparisonText="in catalog"
          accentColor="purple"
          onClick={() => navigate('/admin/products')}
        />

        <StatCard
          icon={Clock}
          title="Pending"
          value={String(pendingOrdersCount)}
          change={pendingOrdersCount > 0 ? `${pendingOrdersCount} urgent` : 'All Clear'}
          isPositive={pendingOrdersCount === 0}
          comparisonText="to dispatch"
          accentColor="amber"
          onClick={() => navigate('/admin/orders')}
        />

        <StatCard
          icon={AlertTriangle}
          title="Low Stock"
          value={String(lowStockCount)}
          change={lowStockCount > 0 ? `${lowStockCount} alerts` : 'Optimal'}
          isPositive={lowStockCount === 0}
          comparisonText="inventory"
          accentColor="rose"
          onClick={() => navigate('/admin/inventory')}
        />
      </div>

      {/* 3. Sales Overview Chart & Order Status Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Sales Overview Graphic */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 tracking-tight">
                Sales & Revenue Analytics
              </h3>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                Aggregate gross volume and order velocity over time.
              </p>
            </div>

            {/* Time Filter Buttons */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
              {[
                { label: 'Today', key: 'today' },
                { label: '7 Days', key: '7d' },
                { label: '30 Days', key: '30d' },
                { label: 'This Year', key: '1y' },
              ].map((tf) => (
                <button
                  key={tf.key}
                  onClick={() => setSalesTimeframe(tf.key)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    salesTimeframe === tf.key
                      ? 'bg-white text-[#0A261C] shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Summary Tickers */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-[#FAF9F5] border border-stone-200/70">
            <div>
              <span className="text-[11px] font-semibold text-stone-500 uppercase">Gross Revenue</span>
              <p className="font-serif text-xl font-bold text-[#0A261C] mt-0.5">
                ₹{timeframeRevenue.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-700 font-medium">
                {salesTimeframe === 'today'
                  ? 'Today'
                  : salesTimeframe === '7d'
                  ? 'Past 7 Days'
                  : salesTimeframe === '30d'
                  ? 'Past 30 Days'
                  : 'This Year'}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-stone-500 uppercase">Orders Volume</span>
              <p className="font-serif text-xl font-bold text-stone-900 mt-0.5">
                {timeframeOrdersCount.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-700 font-medium">
                {timeframeOrdersCount} {timeframeOrdersCount === 1 ? 'order' : 'orders'} placed
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-stone-500 uppercase">Average Order Value</span>
              <p className="font-serif text-xl font-bold text-stone-900 mt-0.5">
                ₹{timeframeAOV.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-stone-500 font-medium">per transaction</span>
            </div>
          </div>

          {/* Clean High-Fidelity SVG Bar & Area Chart */}
          <div className="h-64 w-full pt-4">
            <div className="h-48 flex items-end justify-between gap-3 px-2">
              {dynamicMonthlyRevenue.map((item, idx) => {
                const heightPercent =
                  maxMonthlyRevenue > 0
                    ? Math.max(
                        item.revenue > 0 ? Math.round((item.revenue / maxMonthlyRevenue) * 100) : 4,
                        4
                      )
                    : 4;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-[#0A261C] text-[#F7E7BE] px-2 py-1 rounded-md shadow-md mb-1 pointer-events-none whitespace-nowrap z-10">
                      ₹{item.revenue.toLocaleString('en-IN')} &bull; {item.orders} orders
                    </div>

                    {/* Bar Column */}
                    <div className="w-full max-w-[42px] bg-stone-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          item.revenue > 0
                            ? 'bg-gradient-to-t from-[#0A261C] to-[#18523D] group-hover:to-[#D4AF37]'
                            : 'bg-stone-200'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-stone-500 mt-1">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Order Status Summary */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-serif text-lg font-bold text-stone-900 tracking-tight">
                Order Status Summary
              </h3>
              <Link to="/admin/orders" className="text-xs text-[#0A261C] hover:underline font-semibold">
                View all &rarr;
              </Link>
            </div>
            <p className="text-xs text-stone-500 font-light mb-4">
              Breakdown of {totalOrdersCount} fulfillment transactions.
            </p>

            {/* Status Bars */}
            <div className="space-y-3.5">
              {statusBreakdown.map((item, idx) => {
                const percent =
                  totalOrdersCount > 0 ? Math.round((item.count / totalOrdersCount) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${item.color}`} />
                        {item.status}
                      </span>
                      <span className="text-stone-500 font-mono">
                        {item.count}{' '}
                        <span className="text-stone-400 text-[10px]">({percent}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200/80 flex items-center justify-between text-xs">
            <span className="text-stone-600 font-medium">Fulfillment Health</span>
            <span className="font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {onTimeRate}% On Track
            </span>
          </div>
        </div>
      </div>

      {/* 4. Universal DataTable: Recent Orders */}
      <DataTable
        title="Recent Patron Orders"
        subtitle="Live orders awaiting processing, dispatch, or delivery confirmation."
        columns={orderColumns}
        data={orders}
        searchKeys={['id', 'customer', 'paymentMethod', 'orderStatus']}
        pageSize={5}
        headerActions={
          <Link
            to="/admin/orders"
            className="text-xs text-[#0A261C] font-semibold hover:underline flex items-center gap-1"
          >
            <span>See all {orders.length} orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      />

      {/* 5. Bottom 3 Widgets: Top Products, Low-Stock Alert, Recent Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Top Selling Products */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Top Selling Creations
              </h3>
              <p className="text-[11px] text-stone-400 font-light">Highest velocity SKUs</p>
            </div>
            <Link to="/admin/products" className="text-xs text-[#0A261C] font-semibold hover:underline">
              Catalog &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {topProducts.map((p) => {
              const pImg = p.cardImage || p.image || p.images?.[0] || '/images/hero-model.jpg';
              const pSold = p.calculatedSold ?? p.unitsSold ?? 0;
              const pStock = Number(p.stock ?? p.currentStock ?? 0);
              return (
                <div
                  key={p.id || p._id}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={pImg}
                      alt={p.name}
                      className="w-11 h-11 rounded-lg object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <h5 className="font-serif text-xs font-bold text-stone-900 line-clamp-1">
                        {p.name}
                      </h5>
                      <p className="text-[10px] text-stone-400">
                        {p.category || 'Luxury'} &bull; {pSold} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#0A261C]">
                      ₹{Number(p.price || 0).toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-stone-400 block">Stock: {pStock}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Widget 2: Low-Stock Inventory Widget */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Low Stock Thresholds
              </h3>
              <p className="text-[11px] text-stone-400 font-light">Urgent replenishment</p>
            </div>
            <Link to="/admin/inventory" className="text-xs text-[#0A261C] font-semibold hover:underline">
              Manage &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockInventory.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">All inventory levels are healthy.</p>
            ) : (
              lowStockInventory.map((item) => {
                const stockLeft = Number(item.currentStock ?? item.stock ?? 0);
                return (
                  <div
                    key={item.id || item._id}
                    className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</h5>
                      <p className="text-[10px] font-mono text-stone-400">
                        {item.sku || 'SKU-001'} &bull; Reorder at {item.threshold || 5}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-800">
                        {stockLeft} left
                      </span>
                      <StatusBadge status={item.status || (stockLeft <= 0 ? 'Out of Stock' : 'Low Stock')} className="text-[10px] py-0 px-2" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Widget 3: Recent Patrons Widget */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Recent Patrons
              </h3>
              <p className="text-[11px] text-stone-400 font-light">Active accounts & VIPs</p>
            </div>
            <Link to="/admin/customers" className="text-xs text-[#0A261C] font-semibold hover:underline">
              Directory &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {recentPatrons.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">No patron records available.</p>
            ) : (
              recentPatrons.map((c) => (
                <div
                  key={c.id || c.email}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {c.avatar ? (
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#0A261C] text-[#F7E7BE] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        {getInitials(c.name)}
                      </div>
                    )}
                    <div>
                      <h5 className="text-xs font-bold text-stone-900 line-clamp-1">{c.name}</h5>
                      <p className="text-[10px] text-stone-400 truncate max-w-[130px]">{c.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={c.status || 'Active'} className="text-[10px] py-0 px-1.5" />
                    <p className="text-[10px] text-stone-500 mt-0.5 font-medium">
                      ₹{Number(c.totalSpent || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
