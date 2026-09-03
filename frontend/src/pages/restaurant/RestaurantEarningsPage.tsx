import React, { useState } from 'react';
import { TrendingUp, ArrowDownRight, Wallet, Calendar, Download } from 'lucide-react';

type TimeframeOption = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

interface Settlement {
  id: string;
  period: string;
  ordersCount: number;
  grossAmount: number;
  commission: number;
  netPayout: number;
  status: 'PAID' | 'PROCESSING';
}

export const RestaurantEarningsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('WEEKLY');

  // Ledger records mapped per timeframe
  const ledgerData: Record<TimeframeOption, Settlement[]> = {
    DAILY: [
      { id: 'SET-D01', period: 'Today (03 Sep 2026)', ordersCount: 18, grossAmount: 7650, commission: 1147, netPayout: 6503, status: 'PROCESSING' },
      { id: 'SET-D02', period: 'Yesterday (02 Sep 2026)', ordersCount: 42, grossAmount: 18450, commission: 2767, netPayout: 15683, status: 'PAID' },
      { id: 'SET-D03', period: '01 Sep 2026', ordersCount: 38, grossAmount: 15200, commission: 2280, netPayout: 12920, status: 'PAID' },
      { id: 'SET-D04', period: '31 Aug 2026', ordersCount: 51, grossAmount: 22100, commission: 3315, netPayout: 18785, status: 'PAID' },
    ],
    WEEKLY: [
      { id: 'SET-W35', period: 'Week 35 (28 Aug - 03 Sep)', ordersCount: 264, grossAmount: 112400, commission: 16860, netPayout: 95540, status: 'PROCESSING' },
      { id: 'SET-W34', period: 'Week 34 (21 Aug - 27 Aug)', ordersCount: 290, grossAmount: 124500, commission: 18675, netPayout: 105825, status: 'PAID' },
      { id: 'SET-W33', period: 'Week 33 (14 Aug - 20 Aug)', ordersCount: 312, grossAmount: 138000, commission: 20700, netPayout: 117300, status: 'PAID' },
      { id: 'SET-W32', period: 'Week 32 (07 Aug - 13 Aug)', ordersCount: 278, grossAmount: 119800, commission: 17970, netPayout: 101830, status: 'PAID' },
    ],
    MONTHLY: [
      { id: 'SET-M09', period: 'September 2026 (Live)', ordersCount: 98, grossAmount: 41300, commission: 6195, netPayout: 35105, status: 'PROCESSING' },
      { id: 'SET-M08', period: 'August 2026', ordersCount: 1240, grossAmount: 532000, commission: 79800, netPayout: 452200, status: 'PAID' },
      { id: 'SET-M07', period: 'July 2026', ordersCount: 1180, grossAmount: 498500, commission: 74775, netPayout: 423725, status: 'PAID' },
      { id: 'SET-M06', period: 'June 2026', ordersCount: 1090, grossAmount: 462000, commission: 69300, netPayout: 392700, status: 'PAID' },
    ],
    YEARLY: [
      { id: 'SET-Y26', period: 'Financial Year 2026 (YTD)', ordersCount: 8940, grossAmount: 3824000, commission: 573600, netPayout: 3250400, status: 'PROCESSING' },
      { id: 'SET-Y25', period: 'Financial Year 2025', ordersCount: 13420, grossAmount: 5780000, commission: 867000, netPayout: 4913000, status: 'PAID' },
    ],
  };

  const activeRecords = ledgerData[timeframe];
  const totalGross = activeRecords.reduce((acc, curr) => acc + curr.grossAmount, 0);
  const totalCommission = activeRecords.reduce((acc, curr) => acc + curr.commission, 0);
  const totalNet = activeRecords.reduce((acc, curr) => acc + curr.netPayout, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Earnings & Payouts</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Filter sales, commission cuts, and settlements by day, week, month, or year</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-zinc-700 rounded-xl text-xs font-bold hover:bg-gray-50 shadow-xs transition">
          <Download className="w-3.5 h-3.5" />
          <span>Export {timeframe.toLowerCase()} report</span>
        </button>
      </div>

      {/* Timeframe Switcher Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-2xl w-fit border border-gray-200/60">
        {(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as TimeframeOption[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setTimeframe(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
              timeframe === tab
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            {tab.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">{timeframe} Gross Sales</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-900">₹{totalGross.toLocaleString()}</div>
          <div className="text-[11px] text-zinc-400 font-medium">{activeRecords.length} records in this view</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Fee (15%)</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-900">₹{totalCommission.toLocaleString()}</div>
          <div className="text-[11px] text-zinc-400 font-medium">Auto-deducted BiteTown fee</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Net Payout Transferred</span>
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-brand-600">₹{totalNet.toLocaleString()}</div>
          <div className="text-[11px] text-zinc-400 font-medium">Disbursed to registered bank account</div>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-900">
              {timeframe} Settlement Breakdown
            </h2>
          </div>
          <span className="text-xs font-bold text-zinc-400">
            {activeRecords.length} Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 text-zinc-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="p-4">Settlement ID</th>
                <th className="p-4">Timeline / Date</th>
                <th className="p-4">Orders Count</th>
                <th className="p-4">Gross Revenue</th>
                <th className="p-4">Platform Fee (15%)</th>
                <th className="p-4">Net Payout</th>
                <th className="p-4">Payout Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-zinc-800 font-medium">
              {activeRecords.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition">
                  <td className="p-4 font-mono font-bold text-zinc-900">{item.id}</td>
                  <td className="p-4 font-semibold text-zinc-700">{item.period}</td>
                  <td className="p-4">{item.ordersCount} orders</td>
                  <td className="p-4 font-bold text-zinc-900">₹{item.grossAmount.toLocaleString()}</td>
                  <td className="p-4 text-rose-600 font-semibold">-₹{item.commission.toLocaleString()}</td>
                  <td className="p-4 font-black text-emerald-600">₹{item.netPayout.toLocaleString()}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {item.status === 'PAID' ? 'Transferred' : 'Processing'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};