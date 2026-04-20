import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import {
  TrendingUp, TrendingDown, ShoppingBag, Truck, AlertTriangle,
  Package, ArrowRight, Plus, Clock, DollarSign,
} from 'lucide-react';

const revenueData = [
  { date: 'Mon', revenue: 42500, orders: 58, avgOrderValue: 732 },
  { date: 'Tue', revenue: 38200, orders: 52, avgOrderValue: 735 },
  { date: 'Wed', revenue: 51800, orders: 71, avgOrderValue: 730 },
  { date: 'Thu', revenue: 47600, orders: 65, avgOrderValue: 732 },
  { date: 'Fri', revenue: 63200, orders: 87, avgOrderValue: 727 },
  { date: 'Sat', revenue: 78400, orders: 108, avgOrderValue: 726 },
  { date: 'Sun', revenue: 125400, orders: 84, avgOrderValue: 749 },
];

const ordersByType = [
  { name: 'Delivery', value: 38, color: '#F97316' },
  { name: 'Takeaway', value: 22, color: '#8B5CF6' },
  { name: 'Dine-in', value: 14, color: '#3B82F6' },
  { name: 'POS', value: 10, color: '#10B981' },
];

const topItems = [
  { name: 'Zinger Burger', revenue: 18200, qty: 28 },
  { name: 'Classic Burger', revenue: 14850, qty: 27 },
  { name: 'Family Deal', revenue: 12500, qty: 5 },
  { name: 'Loaded Fries', revenue: 8750, qty: 25 },
  { name: 'Chicken Shawarma', revenue: 7650, qty: 17 },
];

const sparklineData = [
  { v: 32 }, { v: 40 }, { v: 35 }, { v: 50 }, { v: 49 }, { v: 60 }, { v: 70 },
];

const liveOrders = [
  { id: '1084', customer: 'Ahmed Raza', amount: 1850, status: 'PREPARING', time: '2 min ago', type: 'DELIVERY' },
  { id: '1083', customer: 'Fatima Khan', amount: 2500, status: 'PENDING', time: '4 min ago', type: 'DELIVERY' },
  { id: '1082', customer: 'Bilal Ahmed', amount: 550, status: 'READY', time: '8 min ago', type: 'TAKEAWAY' },
  { id: '1081', customer: 'Sara Malik', amount: 1200, status: 'PREPARING', time: '12 min ago', type: 'DINE_IN' },
  { id: '1080', customer: 'Usman Ali', amount: 950, status: 'OUT_FOR_DELIVERY', time: '15 min ago', type: 'DELIVERY' },
  { id: '1079', customer: 'Ayesha Butt', amount: 3200, status: 'DELIVERED', time: '22 min ago', type: 'DELIVERY' },
  { id: '1078', customer: 'Hassan Raza', amount: 650, status: 'COMPLETED', time: '28 min ago', type: 'POS' },
  { id: '1077', customer: 'Zara Iqbal', amount: 1450, status: 'DELIVERED', time: '35 min ago', type: 'DELIVERY' },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-500/20 text-amber-400',
  PREPARING: 'bg-blue-500/20 text-blue-400',
  READY: 'bg-purple-500/20 text-purple-400',
  OUT_FOR_DELIVERY: 'bg-orange-500/20 text-orange-400',
  DELIVERED: 'bg-emerald-500/20 text-emerald-400',
  COMPLETED: 'bg-emerald-500/20 text-emerald-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

const heatmapData: number[][] = [
  [0,0,0,0,0,0,1,3,5,4,6,12,18,15,8,6,8,14,20,18,12,6,2,0],
  [0,0,0,0,0,0,1,2,4,5,7,10,16,14,9,5,7,12,18,16,10,5,1,0],
  [0,0,0,0,0,0,1,3,6,5,8,14,20,16,10,7,9,16,22,20,14,7,2,0],
  [0,0,0,0,0,0,1,2,5,4,6,11,17,13,8,6,8,13,19,17,11,6,2,0],
  [0,0,0,0,0,0,2,4,7,6,9,16,24,20,12,8,11,18,28,25,16,8,3,1],
  [0,0,0,0,0,0,2,5,8,7,10,18,28,22,14,10,13,22,32,28,18,10,4,1],
  [0,0,0,0,0,0,1,4,6,8,12,15,22,18,14,12,14,18,24,22,14,8,3,1],
];
const dayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function getHeatColor(val: number): string {
  if (val === 0) return '#1A1030';
  if (val < 5) return '#2D1F50';
  if (val < 10) return '#4B1FA830';
  if (val < 15) return '#4B1FA860';
  if (val < 20) return '#4B1FA8A0';
  if (val < 25) return '#4B1FA8';
  return '#7C3AED';
}

export default function DashboardPage() {
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders' | 'avgOrderValue'>('revenue');

  const metricLabels = { revenue: 'Revenue (Rs)', orders: 'Orders', avgOrderValue: 'Avg Order Value (Rs)' };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[Syne] text-white">Dashboard</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/pos" className="flex items-center gap-2 px-4 py-2 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> New Order
          </Link>
          <Link to="/menu" className="flex items-center gap-2 px-4 py-2 border border-[#2D1F50] text-[#D1D5DB] hover:bg-[#1A1030] rounded-lg text-sm font-medium transition-colors">
            <Package size={16} /> Add Menu Item
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="relative bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-5 border-l-4 border-l-emerald-500 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">Today's Revenue</p>
              <p className="text-3xl font-bold font-[Syne] text-white mt-2">Rs 125,400</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={14} className="text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">+12.5%</span>
                <span className="text-xs text-[#9CA3AF]">vs yesterday</span>
              </div>
            </div>
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="absolute inset-0 rounded-xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

        {/* Orders Card */}
        <div className="relative bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-5 border-l-4 border-l-blue-500 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">Total Orders</p>
              <p className="text-3xl font-bold font-[Syne] text-white mt-2">84</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">Online 32</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">POS 38</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Dine-in 14</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <ShoppingBag size={20} className="text-blue-400" />
            </div>
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="relative bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-5 border-l-4 border-l-orange-500 hover:shadow-lg hover:shadow-orange-500/5 transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">Active Deliveries</p>
              <p className="text-3xl font-bold font-[Syne] text-white mt-2">7</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-xs text-[#9CA3AF]">3 riders en route</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Truck size={20} className="text-orange-400" />
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <Link to="/production/inventory" className="relative bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-5 border-l-4 border-l-red-500 hover:shadow-lg hover:shadow-red-500/5 transition-all group cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">Low Stock Alerts</p>
              <p className="text-3xl font-bold font-[Syne] text-white mt-2">3</p>
              <div className="flex items-center gap-1 mt-2">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="text-xs text-red-400">Needs attention</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
          </div>
        </Link>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold font-[Syne] text-white">Revenue Trend</h3>
            <div className="flex gap-1 bg-[#0F0A1E] rounded-lg p-1">
              {(['revenue', 'orders', 'avgOrderValue'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setChartMetric(m)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    chartMetric === m ? 'bg-[#4B1FA8] text-white' : 'text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  {m === 'revenue' ? 'Revenue' : m === 'orders' ? 'Orders' : 'AOV'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D1F50" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => chartMetric === 'orders' ? v : `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1030', border: '1px solid #2D1F50', borderRadius: '8px', color: '#fff' }}
                formatter={(value: number) => [chartMetric === 'orders' ? value : `Rs ${value.toLocaleString()}`, metricLabels[chartMetric]]}
              />
              <Line type="monotone" dataKey={chartMetric} stroke="#4B1FA8" strokeWidth={3} dot={{ fill: '#4B1FA8', r: 4 }} activeDot={{ r: 6, fill: '#7C3AED' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Type */}
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
          <h3 className="text-lg font-semibold font-[Syne] text-white mb-6">Orders by Type</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={220}>
              <PieChart>
                <Pie data={ordersByType} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {ordersByType.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1A1030', border: '1px solid #2D1F50', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {ordersByType.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-[#D1D5DB]">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-white">{item.value}</span>
                    <span className="text-xs text-[#9CA3AF] ml-1">({Math.round((item.value / 84) * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
          <h3 className="text-lg font-semibold font-[Syne] text-white mb-6">Top Selling Items</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topItems} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D1F50" horizontal={false} />
              <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={12} width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1030', border: '1px solid #2D1F50', borderRadius: '8px', color: '#fff' }}
                formatter={(value: number) => [`Rs ${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#4B1FA8" radius={[0, 6, 6, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Orders Heatmap */}
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
          <h3 className="text-lg font-semibold font-[Syne] text-white mb-4">Hourly Orders Heatmap</h3>
          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              <div className="flex gap-[2px] mb-1 ml-10">
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="flex-1 text-center text-[9px] text-[#9CA3AF]">
                    {i % 3 === 0 ? `${i}` : ''}
                  </div>
                ))}
              </div>
              {heatmapData.map((row, dayIdx) => (
                <div key={dayIdx} className="flex items-center gap-[2px] mb-[2px]">
                  <span className="text-[10px] text-[#9CA3AF] w-10 text-right pr-2">{dayLabels[dayIdx]}</span>
                  {row.map((val, hourIdx) => (
                    <div
                      key={hourIdx}
                      className="flex-1 aspect-square rounded-sm min-w-[14px]"
                      style={{ backgroundColor: getHeatColor(val) }}
                      title={`${dayLabels[dayIdx]} ${hourIdx}:00 - ${val} orders`}
                    />
                  ))}
                </div>
              ))}
              <div className="flex items-center justify-end gap-2 mt-3">
                <span className="text-[10px] text-[#9CA3AF]">Less</span>
                {[0, 5, 10, 15, 20, 25].map((v) => (
                  <div key={v} className="w-3 h-3 rounded-sm" style={{ backgroundColor: getHeatColor(v) }} />
                ))}
                <span className="text-[10px] text-[#9CA3AF]">More</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Orders Feed */}
      <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold font-[Syne] text-white">Live Orders</h3>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <Link to="/orders" className="flex items-center gap-1 text-sm text-[#4B1FA8] hover:text-[#7C3AED] transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="space-y-2">
          {liveOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0F0A1E]/50 hover:bg-[#0F0A1E] transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium text-white">#{order.id}</span>
                  <span className="text-[10px] text-[#9CA3AF] uppercase">{order.type.replace('_', ' ')}</span>
                </div>
                <div>
                  <p className="text-sm text-white">{order.customer}</p>
                  <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                    <Clock size={10} />
                    {order.time}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-white">Rs {order.amount.toLocaleString()}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                  {order.status === 'OUT_FOR_DELIVERY' ? 'En Route' : order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
