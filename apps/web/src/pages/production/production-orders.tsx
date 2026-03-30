import { useState } from 'react';
import { Plus, Search, Calendar, CheckCircle2, Clock, AlertCircle, X, Package } from 'lucide-react';

const orders = [
  { id: '1', number: 'PO-001', recipe: 'Classic Burger', qty: 50, status: 'COMPLETED', scheduled: 'Mar 28, 2026', completed: 'Mar 28, 2026', yield: 48, notes: '' },
  { id: '2', number: 'PO-002', recipe: 'Zinger Burger', qty: 30, status: 'IN_PROGRESS', scheduled: 'Mar 29, 2026', completed: null, yield: null, notes: 'Batch 2 in progress' },
  { id: '3', number: 'PO-003', recipe: 'BBQ Sauce', qty: 10, status: 'CONFIRMED', scheduled: 'Mar 29, 2026', completed: null, yield: null, notes: '' },
  { id: '4', number: 'PO-004', recipe: 'Loaded Fries', qty: 40, status: 'DRAFT', scheduled: 'Mar 30, 2026', completed: null, yield: null, notes: '' },
  { id: '5', number: 'PO-005', recipe: 'Chicken Shawarma', qty: 25, status: 'CANCELLED', scheduled: 'Mar 27, 2026', completed: null, yield: null, notes: 'Supplier delay' },
];

const statusConfig: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
  DRAFT: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: Clock },
  CONFIRMED: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: CheckCircle2 },
  IN_PROGRESS: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Package },
  COMPLETED: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle2 },
  CANCELLED: { bg: 'bg-red-500/20', text: 'text-red-400', icon: AlertCircle },
};

const materialRequirements = [
  { name: 'Beef Patties', required: 30, available: 45, unit: 'pcs', sufficient: true },
  { name: 'Burger Buns', required: 30, available: 80, unit: 'pcs', sufficient: true },
  { name: 'Lettuce', required: 1, available: 8, unit: 'kg', sufficient: true },
  { name: 'Cheese Slices', required: 30, available: 150, unit: 'pcs', sufficient: true },
  { name: 'BBQ Sauce', required: 0.5, available: 3, unit: 'L', sufficient: true },
];

export default function ProductionOrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [showCreate, setShowCreate] = useState(false);

  const tabs = ['All', 'Draft', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
  const statusMap: Record<string, string> = { 'Draft': 'DRAFT', 'Confirmed': 'CONFIRMED', 'In Progress': 'IN_PROGRESS', 'Completed': 'COMPLETED', 'Cancelled': 'CANCELLED' };

  const filtered = activeTab === 'All' ? orders : orders.filter((o) => o.status === statusMap[activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[Syne] text-white">Production Orders</h1>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Create Order
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const count = tab === 'All' ? orders.length : orders.filter((o) => o.status === statusMap[tab]).length;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-[#4B1FA8] text-white' : 'bg-[#1A1030] text-[#9CA3AF] hover:text-white border border-[#2D1F50]'}`}>
              {tab} <span className="text-xs opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-[#1A1030] border border-[#2D1F50] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2D1F50]">
              {['PO #', 'Recipe', 'Quantity', 'Scheduled', 'Status', 'Actual Yield', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((order, idx) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              return (
                <tr key={order.id} className={`border-b border-[#2D1F50]/50 hover:bg-[#4B1FA8]/5 ${idx % 2 === 0 ? 'bg-[#0F0A1E]/30' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-white">{order.number}</td>
                  <td className="px-4 py-3 text-sm text-white">{order.recipe}</td>
                  <td className="px-4 py-3 text-sm text-white">{order.qty} portions</td>
                  <td className="px-4 py-3 text-sm text-[#9CA3AF] flex items-center gap-1"><Calendar size={12} /> {order.scheduled}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${status.bg} ${status.text} inline-flex items-center gap-1`}>
                      <StatusIcon size={10} /> {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {order.yield ? (
                      <span className={order.yield >= order.qty ? 'text-emerald-400' : 'text-amber-400'}>{order.yield}/{order.qty}</span>
                    ) : (
                      <span className="text-[#4B5563]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs px-3 py-1 border border-[#2D1F50] text-[#9CA3AF] rounded hover:text-white hover:border-[#4B1FA8] transition-colors">View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1030] border border-[#2D1F50] rounded-2xl w-full max-w-lg p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-[Syne] text-white">Create Production Order</h3>
              <button onClick={() => setShowCreate(false)} className="text-[#9CA3AF] hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Recipe</label><select className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]"><option>Select recipe...</option><option>Classic Burger</option><option>Zinger Burger</option><option>BBQ Sauce</option><option>Loaded Fries</option><option>Chicken Shawarma</option></select></div>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Quantity to Produce</label><input type="number" defaultValue={30} className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" /></div>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Scheduled Date</label><input type="date" className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" /></div>

              {/* Material Availability */}
              <div className="bg-[#0F0A1E] border border-[#2D1F50] rounded-lg p-4">
                <h4 className="text-xs font-medium text-[#9CA3AF] mb-3 uppercase">Material Availability Check</h4>
                <div className="space-y-2">
                  {materialRequirements.map((m) => (
                    <div key={m.name} className="flex items-center justify-between text-sm">
                      <span className="text-white">{m.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#9CA3AF]">{m.required} / {m.available} {m.unit}</span>
                        {m.sufficient ? (
                          <CheckCircle2 size={14} className="text-emerald-400" />
                        ) : (
                          <AlertCircle size={14} className="text-red-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Notes</label><textarea className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8] h-16 resize-none" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-[#2D1F50] text-[#9CA3AF] rounded-lg text-sm">Cancel</button>
                <button className="flex-1 py-2.5 bg-[#4B1FA8] text-white rounded-lg text-sm font-medium">Create Order</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
