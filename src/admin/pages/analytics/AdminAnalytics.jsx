import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';

export const AdminAnalytics = () => {
  const { analytics } = useAdmin();
  const [activeRange, setActiveRange] = useState('30d');

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="Store Intelligence & Analytics"
        subtitle="Holistic performance reports, revenue velocity, category share, and payment telemetry."
        breadcrumbs={[{ label: 'Analytics' }]}
        actions={
          <div className="flex items-center gap-2">
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
          </div>
        }
      />

      {/* 1. Top High-Level Tickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          title="Gross Revenue"
          value={analytics.summary.totalRevenue}
          change="+18.4%"
          isPositive={true}
          comparisonText="Annual run-rate"
          accentColor="gold"
        />

        <StatCard
          icon={ShoppingBag}
          title="Average Order Value"
          value={analytics.summary.avgOrderValue}
          change="+6.2%"
          isPositive={true}
          comparisonText="Basket size"
          accentColor="green"
        />

        <StatCard
          icon={TrendingUp}
          title="Conversion Rate"
          value={analytics.summary.conversionRate}
          change="+0.8%"
          isPositive={true}
          comparisonText="Storefront visitors"
          accentColor="blue"
        />

        <StatCard
          icon={Users}
          title="Patron Retention"
          value="42.8%"
          change="+4.5%"
          isPositive={true}
          comparisonText="Repeat purchases"
          accentColor="purple"
        />
      </div>

      {/* 2. Revenue & Order Growth Chart */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900 tracking-tight">
              Monthly Revenue Trajectory
            </h3>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Historical gross acquisition volume charted across the last 6 fiscal months.
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

        {/* SVG Multi-Bar Chart */}
        <div className="h-64 pt-6">
          <div className="h-48 flex items-end justify-between gap-4 px-4">
            {analytics.monthlyRevenue.map((m, idx) => {
              const maxRev = 1400000;
              const revPercent = Math.round((m.revenue / maxRev) * 100);
              const ordPercent = Math.round((m.orders / 160) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-[#0A261C] text-[#F7E7BE] px-2 py-1 rounded shadow-md mb-1 whitespace-nowrap">
                    ₹{(m.revenue / 100000).toFixed(2)} Lakhs &bull; {m.orders} Orders
                  </div>

                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${revPercent}%` }}
                      className="w-1/2 max-w-[24px] bg-[#0A261C] group-hover:bg-[#D4AF37] transition-all rounded-t-md"
                    />
                    {/* Orders Bar */}
                    <div
                      style={{ height: `${ordPercent}%` }}
                      className="w-1/3 max-w-[16px] bg-stone-200 group-hover:bg-stone-300 transition-all rounded-t-md"
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

      {/* 3. Category Breakdown & Payment Rails Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Contribution */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-serif text-base font-bold text-stone-900">
              Category Revenue Share
            </h3>
            <p className="text-xs text-stone-400 font-light">Gross contribution by product tier</p>
          </div>

          <div className="space-y-4">
            {analytics.categoryBreakdown.map((cat, idx) => (
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
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Rails Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-serif text-base font-bold text-stone-900">
              Payment Rail Telemetry
            </h3>
            <p className="text-xs text-stone-400 font-light">Settlement channels adopted by patrons</p>
          </div>

          <div className="space-y-4">
            {analytics.paymentBreakdown.map((rail, idx) => (
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
                    style={{ width: `${rail.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
