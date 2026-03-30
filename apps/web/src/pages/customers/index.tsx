import { useState } from 'react';
import { Search, Download, Mail, Phone, Crown, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const customers = [
  { id: '1', name: 'Saad Ahmed', phone: '0300-1234567', email: 'saad@gmail.com', orders: 45, spent: 67500, points: 4500, tier: 'PLATINUM', segment: 'VIP', lastOrder: '1 day ago' },
  { id: '2', name: 'Fatima Khan', phone: '0321-9876543', email: 'fatima@gmail.com', orders: 32, spent: 48000, points: 3200, tier: 'GOLD', segment: 'VIP', lastOrder: '2 days ago' },
  { id: '3', name: 'Ahmed Raza', phone: '0333-5551234', email: null, orders: 28, spent: 35000, points: 2800, tier: 'GOLD', segment: 'REGULAR', lastOrder: '3 days ago' },
  { id: '4', name: 'Sara Malik', phone: '0345-6789012', email: 'sara.m@gmail.com', orders: 22, spent: 28600, points: 2100, tier: 'GOLD', segment: 'REGULAR', lastOrder: '1 week ago' },
  { id: '5', name: 'Usman Ali', phone: '0312-4445678', email: null, orders: 18, spent: 22400, points: 1800, tier: 'GOLD', segment: 'REGULAR', lastOrder: '4 days ago' },
  { id: '6', name: 'Ayesha Butt', phone: '0300-7778899', email: 'ayesha@gmail.com', orders: 15, spent: 18750, points: 1500, tier: 'GOLD', segment: 'REGULAR', lastOrder: '5 days ago' },
  { id: '7', name: 'Bilal Khan', phone: '0321-1112233', email: null, orders: 12, spent: 14400, points: 1200, tier: 'GOLD', segment: 'REGULAR', lastOrder: '1 week ago' },
  { id: '8', name: 'Nadia Hussain', phone: '0333-4445566', email: 'nadia@gmail.com', orders: 8, spent: 9600, points: 800, tier: 'SILVER', segment: 'REGULAR', lastOrder: '2 weeks ago' },
  { id: '9', name: 'Hassan Raza', phone: '0345-7788990', email: null, orders: 5, spent: 5500, points: 450, tier: 'SILVER', segment: 'REGULAR', lastOrder: '3 weeks ago' },
  { id: '10', name: 'Tariq Jameel', phone: '0300-2233445', email: 'tariq@gmail.com', orders: 3, spent: 3200, points: 250, tier: 'SILVER', segment: 'NEW', lastOrder: '1 week ago' },
  { id: '11', name: 'Waqar Ahmed', phone: '0312-5566778', email: null, orders: 2, spent: 1800, points: 120, tier: 'SILVER', segment: 'NEW', lastOrder: '2 days ago' },
  { id: '12', name: 'Kamran Shah', phone: '0321-8899001', email: null, orders: 1, spent: 850, points: 60, tier: 'SILVER', segment: 'NEW', lastOrder: '5 days ago' },
  { id: '13', name: 'Zara Khan', phone: '0333-1122334', email: 'zara@gmail.com', orders: 3, spent: 2100, points: 0, tier: 'SILVER', segment: 'CHURNED', lastOrder: '75 days ago' },
  { id: '14', name: 'Imran Butt', phone: '0345-3344556', email: null, orders: 5, spent: 4200, points: 0, tier: 'SILVER', segment: 'CHURNED', lastOrder: '90 days ago' },
  { id: '15', name: 'Sana Malik', phone: '0300-5566778', email: 'sana@gmail.com', orders: 2, spent: 1500, points: 0, tier: 'SILVER', segment: 'CHURNED', lastOrder: '65 days ago' },
];

const segmentColors: Record<string, string> = {
  NEW: 'bg-blue-500/20 text-blue-400',
  REGULAR: 'bg-emerald-500/20 text-emerald-400',
  VIP: 'bg-amber-500/20 text-amber-400',
  CHURNED: 'bg-red-500/20 text-red-400',
};

const tierColors: Record<string, string> = {
  SILVER: 'text-gray-400',
  GOLD: 'text-amber-400',
  PLATINUM: 'text-purple-400',
};

export default function CustomersPage() {
  const [activeSegment, setActiveSegment] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const segments = [
    { id: 'All', count: customers.length },
    { id: 'NEW', count: customers.filter((c) => c.segment === 'NEW').length },
    { id: 'REGULAR', count: customers.filter((c) => c.segment === 'REGULAR').length },
    { id: 'VIP', count: customers.filter((c) => c.segment === 'VIP').length },
    { id: 'CHURNED', count: customers.filter((c) => c.segment === 'CHURNED').length },
  ];

  const filtered = customers.filter((c) => {
    const matchSegment = activeSegment === 'All' || c.segment === activeSegment;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    return matchSegment && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[Syne] text-white">Customers</h1>
        <div className="flex gap-2">
          <Link to="/customers/campaigns" className="flex items-center gap-2 px-4 py-2 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-lg text-sm font-medium transition-colors">
            <Mail size={16} /> Campaigns
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#2D1F50] text-[#D1D5DB] hover:bg-[#1A1030] rounded-lg text-sm transition-colors">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Segment Tabs */}
      <div className="flex gap-2">
        {segments.map((s) => (
          <button key={s.id} onClick={() => setActiveSegment(s.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSegment === s.id ? 'bg-[#4B1FA8] text-white' : 'bg-[#1A1030] text-[#9CA3AF] hover:text-white border border-[#2D1F50]'}`}>
            {s.id === 'All' ? 'All' : s.id.charAt(0) + s.id.slice(1).toLowerCase()} ({s.count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone..." className="w-full pl-9 pr-4 py-2 bg-[#1A1030] border border-[#2D1F50] rounded-lg text-sm text-white placeholder-[#4B5563] focus:outline-none focus:border-[#4B1FA8]" />
      </div>

      {/* Table */}
      <div className="bg-[#1A1030] border border-[#2D1F50] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2D1F50]">
              {['Customer', 'Phone', 'Orders', 'Total Spent', 'Points', 'Tier', 'Segment', 'Last Order'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, idx) => (
              <>
                <tr key={c.id} onClick={() => setExpanded(expanded === c.id ? null : c.id)} className={`border-b border-[#2D1F50]/50 hover:bg-[#4B1FA8]/5 cursor-pointer ${idx % 2 === 0 ? 'bg-[#0F0A1E]/30' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#4B1FA8]/20 flex items-center justify-center text-xs font-bold text-[#D8B4FE]">{c.name.split(' ').map((n) => n[0]).join('')}</div>
                      <div>
                        <span className="text-sm text-white">{c.name}</span>
                        {c.email && <p className="text-[10px] text-[#9CA3AF]">{c.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#9CA3AF]">{c.phone}</td>
                  <td className="px-4 py-3 text-sm text-white">{c.orders}</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#F97316]">Rs {c.spent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-white">{c.points.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`text-xs flex items-center gap-1 ${tierColors[c.tier]}`}><Crown size={10} /> {c.tier}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${segmentColors[c.segment]}`}>{c.segment}</span></td>
                  <td className="px-4 py-3 text-xs text-[#9CA3AF]">{c.lastOrder}</td>
                </tr>
                {expanded === c.id && (
                  <tr key={`${c.id}-detail`}>
                    <td colSpan={8} className="px-4 py-4 bg-[#0F0A1E]/70">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-[#1A1030] border border-[#2D1F50] rounded-lg p-3 text-center">
                          <p className="text-lg font-bold text-white">{c.orders}</p>
                          <p className="text-[10px] text-[#9CA3AF]">Total Orders</p>
                        </div>
                        <div className="bg-[#1A1030] border border-[#2D1F50] rounded-lg p-3 text-center">
                          <p className="text-lg font-bold text-[#F97316]">Rs {c.spent.toLocaleString()}</p>
                          <p className="text-[10px] text-[#9CA3AF]">Total Spent</p>
                        </div>
                        <div className="bg-[#1A1030] border border-[#2D1F50] rounded-lg p-3 text-center">
                          <p className="text-lg font-bold text-white">Rs {c.orders > 0 ? Math.round(c.spent / c.orders) : 0}</p>
                          <p className="text-[10px] text-[#9CA3AF]">Avg Order Value</p>
                        </div>
                        <div className="bg-[#1A1030] border border-[#2D1F50] rounded-lg p-3 text-center">
                          <p className="text-lg font-bold text-[#4B1FA8]">{c.points.toLocaleString()}</p>
                          <p className="text-[10px] text-[#9CA3AF]">Loyalty Points</p>
                        </div>
                      </div>
                      <button className="mt-3 px-4 py-2 bg-[#4B1FA8]/20 text-[#D8B4FE] border border-[#4B1FA8]/30 rounded-lg text-xs hover:bg-[#4B1FA8]/30">Send Personal Offer</button>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
