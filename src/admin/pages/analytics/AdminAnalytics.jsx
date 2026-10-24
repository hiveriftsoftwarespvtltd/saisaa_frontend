import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  RefreshCw,
  AlertCircle,
  PackageSearch,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';

export const AdminAnalytics = () => {
  const {
    analytics,
    orders,
    isLoadingOrders,
    orderError,
    refreshOrders,
    isServerOnline,
    serverError,
    retryAll,
    isRetryingAll,
  } = useAdmin();

  const [activeRange, setActiveRange] = useState('30d');

  // Filter orders dynamically based on selected activeRange
  const rangeFilteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    const now = new Date();
    if (activeRange === '7d') {
      const limit = now.getTime() - 7 * 24 * 60 * 60 * 1000;
      return orders.filter((o) => {
        const t = o.createdAt
          ? new Date(o.createdAt).getTime()
          : o.date
          ? new Date(o.date).getTime()
          : now.getTime();
        return t >= limit;
      });
    }
    if (activeRange === '30d') {
      const limit = now.getTime() - 30 * 24 * 60 * 60 * 1000;
      return orders.filter((o) => {
        const t = o.createdAt
          ? new Date(o.createdAt).getTime()
          : o.date
          ? new Date(o.date).getTime()
          : now.getTime();
        return t >= limit;
      });
    }
    if (activeRange === '90d') {
      const limit = now.getTime() - 90 * 24 * 60 * 60 * 1000;
      return orders.filter((o) => {
        const t = o.createdAt
          ? new Date(o.createdAt).getTime()
          : o.date
          ? new Date(o.date).getTime()
          : now.getTime();
        return t >= limit;
      });
    }
    if (activeRange === '1y') {
      const limit = now.getTime() - 365 * 24 * 60 * 60 * 1000;
      return orders.filter((o) => {
        const t = o.createdAt
          ? new Date(o.createdAt).getTime()
          : o.date
          ? new Date(o.date).getTime()
          : now.getTime();
        return t >= limit;
      });
    }
    return orders;
  }, [orders, activeRange]);

  // Range specific computations
  const rangeRevenue = useMemo(() => {
    return rangeFilteredOrders.reduce(
      (sum, o) => sum + (Number(o.grandTotal || o.amount || o.total) || 0),
      0
    );
  }, [rangeFilteredOrders]);

  const rangeOrdersCount = rangeFilteredOrders.length;
  const rangeAOV = rangeOrdersCount > 0 ? Math.round(rangeRevenue / rangeOrdersCount) : 0;

  // Maximum values for dynamic SVG bar chart scaling
  const maxRev = useMemo(() => {
    if (!analytics?.monthlyRevenue?.length) return 1000;
    const peak = Math.max(...analytics.monthlyRevenue.map((m) => m.revenue));
    return peak > 0 ? peak : 1000;
  }, [analytics]);

  const maxOrd = useMemo(() => {
    if (!analytics?.monthlyRevenue?.length) return 1;
    const peak = Math.max(...analytics.monthlyRevenue.map((m) => m.orders));
    return peak > 0 ? peak : 1;
  }, [analytics]);

  // Is error state present with 0 data
  const isConnectionDown = (orderError || !isServerOnline) && (!orders || orders.length === 0);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="Store Intelligence & Analytics"
        subtitle="Holistic performance reports, live revenue velocity, category share, and payment telemetry derived directly from storefront orders."
        breadcrumbs={[{ label: 'Analytics' }]}
        actions={
          <div className="flex items-center gap-2">
            {/* Timeframe Filter Buttons */}
            <div className="flex items-center gap-1 bg-white border border-stone-200 p-1 rounded-xl shadow-2xs">
              {[
                { label: '7 Days', key: '7d' },
                { label: '30 Days', key: '30d' },
                { label: 'Quarterly', key: '90d' },
                { label: 'Year to Date', key: '1y' },
              ].map((r) => (
                <button
                  key={r.key}
                  onClick={() => setActiveRange(r.key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeRange === r.key
                      ? 'bg-[#0A261C] text-[#F7E7BE] shadow-2xs font-bold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Live Refresh Button */}
            <button
              onClick={() => refreshOrders()}
              disabled={isLoadingOrders}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-[#0A261C] hover:border-[#0A261C] hover:bg-stone-50 transition-all shadow-2xs disabled:opacity-50"
              title="Refresh store orders and recalculate live analytics"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin text-[#0A261C]' : ''}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        }
      />

      {/* 1. Connection Error State (When Server is Offline or orders API fails) */}
      {isConnectionDown && (
        <div className="bg-red-50/90 border border-red-200/90 rounded-2xl p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-red-100 text-red-700 rounded-xl shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-red-950">
                  Live Store Analytics Offline — Server Disconnected
                </h3>
                <p className="text-xs text-red-800 mt-1 leading-relaxed">
                  {orderError ||
                    serverError ||
                    'Unable to reach backend orders service. Check backend connection.'}
                </p>
             
              </div>
            </div>
            <button
              onClick={() => retryAll()}
              disabled={isRetryingAll || isLoadingOrders}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRetryingAll || isLoadingOrders ? 'animate-spin' : ''}`}
              />
              {isRetryingAll || isLoadingOrders ? 'Reconnecting to Server...' : 'Retry Connection'}
            </button>
          </div>
        </div>
      )}

      {/* 2. Zero Orders Notice (When Server is Online but 0 orders in DB yet) */}
      {!isConnectionDown && !isLoadingOrders && orders && orders.length === 0 && (
        <div className="bg-[#0A261C]/5 border border-[#0A261C]/15 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-[#0A261C] text-[#F7E7BE] rounded-xl shrink-0">
            <PackageSearch className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-[#0A261C] uppercase tracking-wider">
              Storefront Waiting for Initial Orders
            </h4>
            <p className="text-xs text-stone-600 mt-0.5">
              0 customer orders currently recorded in the database. As patrons complete checkout on the storefront, gross revenue trajectory, basket sizes, category contribution, and payment telemetry will dynamically populate here in real-time.
            </p>
          </div>
        </div>
      )}

      {/* 3. Loading Skeleton */}
      {isLoadingOrders && (!orders || orders.length === 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-stone-100 rounded-2xl border border-stone-200/60 p-5 space-y-3"
            >
              <div className="w-8 h-8 rounded-lg bg-stone-200" />
              <div className="w-24 h-4 rounded bg-stone-200" />
              <div className="w-32 h-6 rounded bg-stone-200" />
            </div>
          ))}
        </div>
      )}

      {/* 4. Top High-Level Tickers */}
      {(!isLoadingOrders || (orders && orders.length > 0)) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={DollarSign}
            title="Gross Revenue"
            value={
              activeRange === '30d'
                ? `₹${Math.round(rangeRevenue).toLocaleString('en-IN')}`
                : analytics.summary.totalRevenue
            }
            change={analytics.summary.growthRate}
            isPositive={true}
            comparisonText={activeRange === '30d' ? 'Last 30 days' : `${activeRange} window`}
            accentColor="gold"
          />

          <StatCard
            icon={ShoppingBag}
            title="Average Order Value"
            value={
              rangeOrdersCount > 0
                ? `₹${rangeAOV.toLocaleString('en-IN')}`
                : analytics.summary.avgOrderValue
            }
            change={`${rangeOrdersCount} placed orders`}
            isPositive={rangeOrdersCount > 0}
            comparisonText="Real basket size"
            accentColor="green"
          />

          <StatCard
            icon={TrendingUp}
            title="Conversion Rate"
            value={analytics.summary.conversionRate}
            change={analytics.summary.totalOrders > 0 ? '+1.2%' : '0%'}
            isPositive={analytics.summary.totalOrders > 0}
            comparisonText="Storefront patrons"
            accentColor="blue"
          />

          <StatCard
            icon={Users}
            title="Patron Retention"
            value={analytics.summary.retentionRate || '0.0%'}
            change={analytics.summary.totalCustomers > 0 ? `${analytics.summary.totalCustomers} patrons` : '0 patrons'}
            isPositive={true}
            comparisonText="Repeat buyers"
            accentColor="purple"
          />
        </div>
      )}

      {/* 5. Revenue & Order Growth Chart */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900 tracking-tight">
              Monthly Revenue Trajectory
            </h3>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Gross acquisition volume and orders dispatched across trailing calendar months.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#0A261C]">
              <span className="w-3 h-3 rounded-sm bg-[#0A261C]" />
              Gross Revenue (INR)
            </span>
            <span className="flex items-center gap-1.5 text-stone-400">
              <span className="w-3 h-3 rounded-sm bg-stone-300" />
              Orders Dispatched
            </span>
          </div>
        </div>

        {/* SVG Multi-Bar Chart with Dynamic Math.max Scaling */}
        <div className="h-64 pt-6">
          <div className="h-48 flex items-end justify-between gap-4 px-4">
            {analytics?.monthlyRevenue?.map((m, idx) => {
              const revPercent =
                maxRev > 0
                  ? m.revenue > 0
                    ? Math.max(8, Math.round((m.revenue / maxRev) * 100))
                    : 0
                  : 0;
              const ordPercent =
                maxOrd > 0
                  ? m.orders > 0
                    ? Math.max(8, Math.round((m.orders / maxOrd) * 100))
                    : 0
                  : 0;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-[#0A261C] text-[#F7E7BE] px-2.5 py-1 rounded-md shadow-md mb-1 whitespace-nowrap border border-[#D4AF37]/30 z-10 pointer-events-none">
                    {m.revenue >= 100000
                      ? `₹${(m.revenue / 100000).toFixed(2)} Lakhs`
                      : `₹${Number(m.revenue).toLocaleString('en-IN')}`}
                    {' • '}
                    {m.orders} {m.orders === 1 ? 'Order' : 'Orders'}
                  </div>

                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${revPercent}%` }}
                      className="w-1/2 max-w-[24px] bg-[#0A261C] group-hover:bg-[#D4AF37] transition-all rounded-t-md"
                      title={`Revenue: ₹${Number(m.revenue).toLocaleString('en-IN')}`}
                    />
                    {/* Orders Bar */}
                    <div
                      style={{ height: `${ordPercent}%` }}
                      className="w-1/3 max-w-[16px] bg-stone-200 group-hover:bg-stone-300 transition-all rounded-t-md"
                      title={`Orders: ${m.orders}`}
                    />
                  </div>

                  <span className="text-xs font-bold text-stone-600 mt-1">
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Category Breakdown & Payment Rails Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Contribution */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Category Revenue Share
              </h3>
              <p className="text-xs text-stone-400 font-light">Gross contribution by product tier</p>
            </div>
            <span className="text-[11px] font-semibold text-stone-500 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-lg">
              Live Orders
            </span>
          </div>

          <div className="space-y-4">
            {analytics?.categoryBreakdown?.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-stone-500 font-mono">{cat.revenue}</span>
                    <span className="font-bold text-[#0A261C] font-mono">{cat.percentage}%</span>
                  </div>
                </div>

                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      idx === 0
                        ? 'bg-[#0A261C]'
                        : idx === 1
                        ? 'bg-[#18523D]'
                        : idx === 2
                        ? 'bg-[#D4AF37]'
                        : 'bg-stone-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, cat.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Rails Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Payment Rail Telemetry
              </h3>
              <p className="text-xs text-stone-400 font-light">
                Settlement channels adopted by patrons
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
              Live Channels
            </span>
          </div>

          <div className="space-y-4">
            {analytics?.paymentBreakdown?.map((rail, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">{rail.method}</span>
                  <span className="font-mono font-bold text-stone-900">{rail.share}%</span>
                </div>

                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      idx === 0
                        ? 'bg-emerald-600'
                        : idx === 1
                        ? 'bg-blue-600'
                        : idx === 2
                        ? 'bg-amber-600'
                        : 'bg-stone-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, rail.share))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Order Status & Fulfillment Velocity Distribution */}
      {analytics?.orderStatusDistribution && analytics.orderStatusDistribution.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Order Fulfillment & Lifecycle Distribution
              </h3>
              <p className="text-xs text-stone-400 font-light">
                Status breakdown across all received customer orders
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0A261C] bg-[#0A261C]/5 border border-[#0A261C]/15 px-2.5 py-1 rounded-lg self-start sm:self-auto">
              Total Placed: {analytics.summary.totalOrders}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {analytics.orderStatusDistribution.map((item, idx) => {
              const total = analytics.summary.totalOrders || 1;
              const pct = analytics.summary.totalOrders > 0 ? Math.round((item.count / total) * 100) : 0;
              const StatusIcon =
                item.status === 'Delivered'
                  ? CheckCircle2
                  : item.status === 'Shipped'
                  ? Truck
                  : item.status === 'Processing'
                  ? Clock
                  : item.status === 'Cancelled/Returned'
                  ? RotateCcw
                  : PackageSearch;

              return (
                <div
                  key={idx}
                  className="bg-stone-50/70 border border-stone-200/70 rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">{item.status}</span>
                    <StatusIcon
                      className="w-4 h-4"
                      style={{ color: item.color }}
                    />
                  </div>

                  <div>
                    <div className="text-xl font-bold font-mono text-stone-900">
                      {item.count}
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                      {pct}% of orders
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
