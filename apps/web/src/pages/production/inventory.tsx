import { useState } from 'react';
import { Package, AlertTriangle, Clock, DollarSign, Search, Download, Plus, X } from 'lucide-react';

const materials = [
  { id: '1', name: 'Chicken Breast', category: 'Meat', stock: 12, unit: 'kg', reorderLevel: 15, reorderQty: 30, avgCost: 850, lastUpdated: '2 hours ago' },
  { id: '2', name: 'Beef Patties', category: 'Meat', stock: 45, unit: 'pcs', reorderLevel: 50, reorderQty: 100, avgCost: 120, lastUpdated: '1 hour ago' },
  { id: '3', name: 'Burger Buns', category: 'Bakery', stock: 80, unit: 'pcs', reorderLevel: 100, reorderQty: 200, avgCost: 30, lastUpdated: '3 hours ago' },
  { id: '4', name: 'Lettuce', category: 'Produce', stock: 8, unit: 'kg', reorderLevel: 5, reorderQty: 15, avgCost: 200, lastUpdated: '5 hours ago' },
  { id: '5', name: 'Tomatoes', category: 'Produce', stock: 6, unit: 'kg', reorderLevel: 8, reorderQty: 20, avgCost: 150, lastUpdated: '5 hours ago' },
  { id: '6', name: 'Cheese Slices', category: 'Dairy', stock: 150, unit: 'pcs', reorderLevel: 100, reorderQty: 300, avgCost: 45, lastUpdated: '1 day ago' },
  { id: '7', name: 'BBQ Sauce', category: 'Condiments', stock: 3, unit: 'L', reorderLevel: 5, reorderQty: 10, avgCost: 450, lastUpdated: '2 days ago' },
  { id: '8', name: 'Cooking Oil', category: 'Oils', stock: 15, unit: 'L', reorderLevel: 10, reorderQty: 20, avgCost: 380, lastUpdated: '3 days ago' },
  { id: '9', name: 'French Fries (Frozen)', category: 'Frozen', stock: 20, unit: 'kg', reorderLevel: 15, reorderQty: 40, avgCost: 320, lastUpdated: '1 day ago' },
  { id: '10', name: 'Onion Rings', category: 'Frozen', stock: 5, unit: 'kg', reorderLevel: 8, reorderQty: 15, avgCost: 400, lastUpdated: '4 hours ago' },
];

function getStockStatus(stock: number, reorder: number): { label: string; color: string; bg: string } {
  if (stock <= reorder * 0.5) return { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20' };
  if (stock <= reorder) return { label: 'Low', color: 'text-amber-400', bg: 'bg-amber-500/20' };
  return { label: 'Healthy', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
}

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAdjust, setShowAdjust] = useState(false);

  const totalValue = materials.reduce((s, m) => s + m.stock * m.avgCost, 0);
  const lowItems = materials.filter((m) => m.stock <= m.reorderLevel);
  const categories = ['All', ...new Set(materials.map((m) => m.category))];

  const filtered = materials.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'All' || m.category === filterCategory;
    const status = getStockStatus(m.stock, m.reorderLevel);
    const matchStatus = filterStatus === 'All' || (filterStatus === 'Low' && status.label !== 'Healthy') || (filterStatus === 'Healthy' && status.label === 'Healthy');
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[Syne] text-white">Raw Material Inventory</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowAdjust(true)} className="flex items-center gap-2 px-4 py-2 border border-[#2D1F50] text-[#D1D5DB] hover:bg-[#1A1030] rounded-lg text-sm transition-colors">
            <Plus size={16} /> Stock Adjustment
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#2D1F50] text-[#D1D5DB] hover:bg-[#1A1030] rounded-lg text-sm transition-colors">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4 border-l-4 border-l-blue-500">
          <Package size={18} className="text-blue-400 mb-2" />
          <p className="text-xs text-[#9CA3AF]">Total SKUs</p>
          <p className="text-2xl font-bold font-[Syne] text-white">{materials.length}</p>
        </div>
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4 border-l-4 border-l-red-500">
          <AlertTriangle size={18} className="text-red-400 mb-2" />
          <p className="text-xs text-[#9CA3AF]">Low Stock Items</p>
          <p className="text-2xl font-bold font-[Syne] text-red-400">{lowItems.length}</p>
        </div>
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4 border-l-4 border-l-amber-500">
          <Clock size={18} className="text-amber-400 mb-2" />
          <p className="text-xs text-[#9CA3AF]">Expiring Soon</p>
          <p className="text-2xl font-bold font-[Syne] text-amber-400">2</p>
        </div>
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4 border-l-4 border-l-emerald-500">
          <DollarSign size={18} className="text-emerald-400 mb-2" />
          <p className="text-xs text-[#9CA3AF]">Total Value</p>
          <p className="text-2xl font-bold font-[Syne] text-white">Rs {(totalValue / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input type="text" placeholder="Search materials..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-[#1A1030] border border-[#2D1F50] rounded-lg text-sm text-white placeholder-[#4B5563] focus:outline-none focus:border-[#4B1FA8]" />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 bg-[#1A1030] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 bg-[#1A1030] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]">
          <option value="All">All Status</option><option value="Low">Low Stock</option><option value="Healthy">Healthy</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1A1030] border border-[#2D1F50] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2D1F50]">
              {['Item', 'Category', 'Stock', 'Unit', 'Reorder Level', 'Avg Cost', 'Total Value', 'Status', 'Updated'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, idx) => {
              const status = getStockStatus(m.stock, m.reorderLevel);
              return (
                <tr key={m.id} className={`border-b border-[#2D1F50]/50 hover:bg-[#4B1FA8]/5 ${idx % 2 === 0 ? 'bg-[#0F0A1E]/30' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-white">{m.name}</td>
                  <td className="px-4 py-3 text-sm text-[#9CA3AF]">{m.category}</td>
                  <td className="px-4 py-3 text-sm font-medium text-white">{m.stock}</td>
                  <td className="px-4 py-3 text-sm text-[#9CA3AF]">{m.unit}</td>
                  <td className="px-4 py-3 text-sm text-[#9CA3AF]">{m.reorderLevel}</td>
                  <td className="px-4 py-3 text-sm text-[#F97316]">Rs {m.avgCost}</td>
                  <td className="px-4 py-3 text-sm text-white">Rs {(m.stock * m.avgCost).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>{status.label}</span></td>
                  <td className="px-4 py-3 text-xs text-[#9CA3AF]">{m.lastUpdated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjust && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1030] border border-[#2D1F50] rounded-2xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-[Syne] text-white">Stock Adjustment</h3>
              <button onClick={() => setShowAdjust(false)} className="text-[#9CA3AF] hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Material</label><select className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]"><option>Select material</option>{materials.map((m) => <option key={m.id}>{m.name}</option>)}</select></div>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Adjustment Type</label><select className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]"><option>Addition</option><option>Subtraction</option><option>Damage</option><option>Wastage</option><option>Audit Count</option></select></div>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Quantity</label><input type="number" className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" placeholder="0" /></div>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Reason / Notes</label><textarea className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8] h-20 resize-none" placeholder="Reason for adjustment" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdjust(false)} className="flex-1 py-2.5 border border-[#2D1F50] text-[#9CA3AF] rounded-lg text-sm">Cancel</button>
                <button className="flex-1 py-2.5 bg-[#4B1FA8] text-white rounded-lg text-sm font-medium">Save Adjustment</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
