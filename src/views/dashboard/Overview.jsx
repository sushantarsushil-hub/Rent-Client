import React from 'react';
import { Building, CalendarCheck, DollarSign, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SectionTitle from '../../components/common/SectionTitle';
import { formatCurrency } from '../../utils/formatters';

const revenueData = [
  { month: 'Jan', revenue: 4200, bookings: 12 },
  { month: 'Feb', revenue: 5800, bookings: 16 },
  { month: 'Mar', revenue: 7400, bookings: 21 },
  { month: 'Apr', revenue: 6900, bookings: 18 },
  { month: 'May', revenue: 8900, bookings: 24 },
  { month: 'Jun', revenue: 11200, bookings: 31 },
];

const Overview = () => {
  return (
    <div className="space-y-8">
      <SectionTitle
        badge="Host Portal"
        title="Dashboard Overview"
        subtitle="Monitor performance metrics, recent bookings, and rental earnings."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(44400)}</h3>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% from last month
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Bookings</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">122</h3>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8.5% growth
            </span>
          </div>
          <div className="p-3 bg-slate-100 text-slate-800 rounded-xl border border-slate-200">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Listings</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">8</h3>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">2 reserved currently</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Guests</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">340</h3>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.7% new reviews
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recharts Area Chart Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Monthly Revenue Trends</h3>
            <p className="text-xs text-slate-500 font-normal">Rental revenue analytics over 2026</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <TrendingUp className="w-3.5 h-3.5" /> Upward Growth
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1d4ed8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Overview;
