import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, Legend,
} from 'recharts';

const revenueData = Array.from({ length: 30 }, (_, i) => ({
  date: `Mar ${i + 1}`,
  revenue: 35000 + Math.random() * 50000,
  orders: 40 + Math.floor(Math.random() * 60),
}));

const revenueByBranch = [
  { branch: 'Main Branch', revenue: 1850000 },
  { branch: 'Clifton Branch', revenue: 1120000 },
];

const revenueByType = [
  { type: 'Delivery', revenue: 1200000 },
  { type: 'Takeaway', revenue: 680000 },
  { type: 'Dine-in', revenue: 520000 },
  { type: 'POS', revenue: 570000 },
];

const paymentData = [
  { name: 'Cash', value: 45, color: '#10B981' },
  { name: 'Card', value: 30, color: '#3B82F6' },
  { name: 'JazzCash', value: 15, color: '#EF4444' },
  { name: 'Easypaisa', value: 10, color: '#8B5CF6' },
];

const topItems = [
  { name: 'Zinger Burger', revenue: 245000, qty: 377 },
  { name: 'Classic Burger', revenue: 198000, qty: 360 },
  { name: 'Family Deal', revenue: 175000, qty: 70 },
  { name: 'Loaded Fries', revenue: 122500, qty: 350 },
  { name: 'Double Patty', revenue: 119000, qty: 140 },
  { name: 'Chicken Shawarma', revenue: 108000, qty: 240 },
  { name: 'Buddy Deal', revenue: 96000, qty: 80 },
  { name: 'Mango Shake', revenue: 55000, qty: 220 },
];

const deliveryData = Array.from({ length: 14 }, (_, i) => ({
  date: `Mar ${i + 16}`,
  avgTime: 25 + Math.floor(Math.random() * 10),
}));

const riderPerf = [
  { name: 'Faisal Mehmood', deliveries: 168, avgTime: 22, rating: 4.9 },
  { name: 'Ahmed Raza', deliveries: 195, avgTime: 25, rating: 4.8 },
  { name: 'Bilal Khan', deliveries: 152, avgTime: 28, rating: 4.5 },
  { name: 'Imran Butt', deliveries: 120, avgTime: 32, rating: 4.0 },
  { name: 'Hassan Ali', deliveries: 98, avgTime: 30, rating: 4.2 },
];

const tooltipStyle = { backgroundColor: '#1A1030', border: '1px solid #2D1F50', borderRadius: '8px', color: '#fff' };

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('sales');
  const tabs = [
    { id: 'sales', label: 'Sales' },
    { id: 'menu', label: 'Menu' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'production', label: 'Production' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[Syne] text-white">Analytics</h1>
        <select className="px-3 py-2 bg-[#1A1030] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]">
          <option>Last 30 Days</option><option>Last 7 Days</option><option>Last 90 Days</option><option>This Month</option>
        </select>
      </div>

      <div className="flex gap-1 bg-[#1A1030] rounded-lg p-1 w-fit border border-[#2D1F50]">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#4B1FA8] text-white' : 'text-[#9CA3AF] hover:text-white'}`}>{t.label}</button>
        ))}
      </div>

      {activeTab === 'sales' && (
        <div className="space-y-6">
          {/* Revenue Chart */}
          <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Revenue Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4B1FA8" stopOpacity={0.3} /><stop offset="95%" stopColor="#4B1FA8" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D1F50" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} interval={4} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`Rs ${v.toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#4B1FA8" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* By Branch */}
            <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Revenue by Branch</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueByBranch}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D1F50" />
                  <XAxis dataKey="branch" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={10} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`Rs ${v.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#4B1FA8" radius={[6, 6, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* By Payment Method */}
            <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Payment Methods</h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={paymentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {paymentData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {paymentData.map((p) => (
                    <div key={p.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-xs text-[#9CA3AF]">{p.name}</span>
                      <span className="text-xs text-white font-medium ml-auto">{p.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* By Order Type */}
            <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6 xl:col-span-2">
              <h3 className="text-sm font-semibold text-white mb-4">Revenue by Order Type</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueByType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D1F50" />
                  <XAxis dataKey="type" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={10} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`Rs ${v.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={50}>
                    {revenueByType.map((_, i) => <Cell key={i} fill={['#F97316', '#8B5CF6', '#3B82F6', '#10B981'][i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Top Items by Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topItems} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D1F50" horizontal={false} />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={11} width={110} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`Rs ${v.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#4B1FA8" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Top Items by Quantity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topItems} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D1F50" horizontal={false} />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={10} />
                  <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={11} width={110} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="qty" fill="#F97316" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Margin Table */}
          <div className="bg-[#1A1030] border border-[#2D1F50] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#2D1F50]">
              <h3 className="text-sm font-semibold text-white">Item Margin Analysis</h3>
            </div>
            <table className="w-full">
              <thead><tr className="border-b border-[#2D1F50]">
                {['Item', 'Revenue', 'Qty Sold', 'Cost', 'Margin %', 'Category'].map((h) => (
                  <th key={h} className="text-left px-4 py-2 text-xs font-medium text-[#9CA3AF] uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {topItems.map((item, idx) => {
                  const margin = 45 + Math.random() * 20;
                  return (
                    <tr key={item.name} className={`border-b border-[#2D1F50]/50 ${idx % 2 === 0 ? 'bg-[#0F0A1E]/30' : ''}`}>
                      <td className="px-4 py-2 text-sm text-white">{item.name}</td>
                      <td className="px-4 py-2 text-sm text-[#F97316]">Rs {item.revenue.toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm text-[#9CA3AF]">{item.qty}</td>
                      <td className="px-4 py-2 text-sm text-[#9CA3AF]">Rs {Math.round(item.revenue * (1 - margin / 100)).toLocaleString()}</td>
                      <td className="px-4 py-2"><span className={`text-sm font-medium ${margin > 50 ? 'text-emerald-400' : 'text-amber-400'}`}>{margin.toFixed(1)}%</span></td>
                      <td className="px-4 py-2 text-xs text-[#9CA3AF]">{idx < 5 ? 'Star' : idx < 7 ? 'Plowhorse' : 'Puzzle'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'delivery' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Avg Delivery Time Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={deliveryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D1F50" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} />
                  <YAxis stroke="#9CA3AF" fontSize={10} domain={[20, 40]} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} min`, 'Avg Time']} />
                  <Line type="monotone" dataKey="avgTime" stroke="#F97316" strokeWidth={2} dot={{ fill: '#F97316', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6 flex flex-col items-center justify-center">
              <h3 className="text-sm font-semibold text-white mb-4">On-Time Delivery Rate</h3>
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#2D1F50" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#10B981" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${94 * 2.64} ${100 * 2.64}`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold font-[Syne] text-emerald-400">94%</span>
                </div>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-2">Target: 90%</p>
            </div>
          </div>
          {/* Rider Performance */}
          <div className="bg-[#1A1030] border border-[#2D1F50] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#2D1F50]"><h3 className="text-sm font-semibold text-white">Rider Performance</h3></div>
            <table className="w-full">
              <thead><tr className="border-b border-[#2D1F50]">
                {['Rider', 'Deliveries', 'Avg Time', 'Rating'].map((h) => <th key={h} className="text-left px-4 py-2 text-xs font-medium text-[#9CA3AF] uppercase">{h}</th>)}
              </tr></thead>
              <tbody>
                {riderPerf.map((r, idx) => (
                  <tr key={r.name} className={`border-b border-[#2D1F50]/50 ${idx % 2 === 0 ? 'bg-[#0F0A1E]/30' : ''}`}>
                    <td className="px-4 py-3 text-sm text-white">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-white">{r.deliveries}</td>
                    <td className="px-4 py-3 text-sm"><span className={r.avgTime <= 25 ? 'text-emerald-400' : r.avgTime <= 30 ? 'text-amber-400' : 'text-red-400'}>{r.avgTime} min</span></td>
                    <td className="px-4 py-3 text-sm text-amber-400">{r.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'production' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Theoretical vs Actual Consumption</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { item: 'Chicken', theoretical: 50, actual: 55 },
                  { item: 'Beef', theoretical: 30, actual: 28 },
                  { item: 'Buns', theoretical: 200, actual: 210 },
                  { item: 'Oil', theoretical: 10, actual: 12 },
                  { item: 'Sauce', theoretical: 5, actual: 6 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D1F50" />
                  <XAxis dataKey="item" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={10} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#9CA3AF' }} />
                  <Bar dataKey="theoretical" fill="#4B1FA8" radius={[4, 4, 0, 0]} barSize={20} name="Theoretical" />
                  <Bar dataKey="actual" fill="#F97316" radius={[4, 4, 0, 0]} barSize={20} name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Wastage Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={Array.from({ length: 14 }, (_, i) => ({ day: `Mar ${i + 16}`, wastage: 2 + Math.random() * 5 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D1F50" />
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} interval={2} />
                  <YAxis stroke="#9CA3AF" fontSize={10} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${Number(v).toFixed(1)}%`, 'Wastage']} />
                  <Line type="monotone" dataKey="wastage" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
