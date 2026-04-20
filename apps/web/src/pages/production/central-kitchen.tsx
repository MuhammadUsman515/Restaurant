import { Factory, Package, TrendingUp, CheckCircle2, Clock, AlertCircle, Truck } from 'lucide-react';

const productionQueue = [
  { id: '1', recipe: 'Classic Burger Patties', qty: '50 pcs', status: 'IN_PROGRESS', progress: 60 },
  { id: '2', recipe: 'BBQ Sauce (House)', qty: '10 L', status: 'CONFIRMED', progress: 0 },
  { id: '3', recipe: 'Burger Buns', qty: '200 pcs', status: 'CONFIRMED', progress: 0 },
];

const supplyRequests = [
  { id: '1', branch: 'Clifton Branch', items: [{ name: 'Classic Burger Patties', qty: '30 pcs' }, { name: 'BBQ Sauce', qty: '2 L' }, { name: 'Burger Buns', qty: '50 pcs' }], status: 'PENDING', requestedAt: '2 hours ago' },
  { id: '2', branch: 'Main Branch', items: [{ name: 'Zinger Patties', qty: '40 pcs' }, { name: 'Coleslaw Mix', qty: '5 kg' }], status: 'APPROVED', requestedAt: '5 hours ago' },
  { id: '3', branch: 'Clifton Branch', items: [{ name: 'French Fries', qty: '15 kg' }], status: 'DISPATCHED', requestedAt: '1 day ago' },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  APPROVED: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  DISPATCHED: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  RECEIVED: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  REJECTED: { bg: 'bg-red-500/20', text: 'text-red-400' },
};

export default function CentralKitchenPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[Syne] text-white">Central Kitchen</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Production", value: '3 orders', icon: Factory, color: 'purple' },
          { label: 'Pending Requests', value: '1', icon: Clock, color: 'amber' },
          { label: 'Items Dispatched', value: '15 kg', icon: Truck, color: 'blue' },
          { label: 'Efficiency Rate', value: '96%', icon: TrendingUp, color: 'emerald' },
        ].map((kpi) => (
          <div key={kpi.label} className={`bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4 border-l-4 border-l-${kpi.color}-500`}>
            <kpi.icon size={18} className="text-[#9CA3AF] mb-2" />
            <p className="text-xs text-[#9CA3AF]">{kpi.label}</p>
            <p className="text-xl font-bold font-[Syne] text-white mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Production Queue */}
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Factory size={16} className="text-[#4B1FA8]" /> Production Queue — Today
          </h3>
          <div className="space-y-3">
            {productionQueue.map((item) => (
              <div key={item.id} className="p-4 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{item.recipe}</span>
                  <span className="text-xs text-[#9CA3AF]">{item.qty}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[#2D1F50] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4B1FA8] rounded-full transition-all" style={{ width: `${item.progress}%` }} />
                  </div>
                  <span className="text-xs text-[#9CA3AF]">{item.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supply Requests */}
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Package size={16} className="text-[#F97316]" /> Branch Supply Requests
          </h3>
          <div className="space-y-3">
            {supplyRequests.map((req) => {
              const status = statusColors[req.status];
              return (
                <div key={req.id} className="p-4 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{req.branch}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>{req.status}</span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {req.items.map((item, idx) => (
                      <p key={idx} className="text-xs text-[#9CA3AF]">• {item.name} — {item.qty}</p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#4B5563]">{req.requestedAt}</span>
                    {req.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs hover:bg-emerald-500/20">Approve</button>
                        <button className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-xs hover:bg-red-500/20">Reject</button>
                      </div>
                    )}
                    {req.status === 'APPROVED' && (
                      <button className="px-3 py-1 bg-[#4B1FA8]/20 text-[#D8B4FE] border border-[#4B1FA8]/30 rounded text-xs hover:bg-[#4B1FA8]/30">Dispatch</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Aggregated Demand */}
      <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Aggregated Demand — This Week</h3>
        <p className="text-xs text-[#9CA3AF] mb-3">Based on branch requests, you need to produce:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { item: 'Burger Patties', qty: '120 pcs' },
            { item: 'BBQ Sauce', qty: '8 L' },
            { item: 'Burger Buns', qty: '200 pcs' },
            { item: 'Coleslaw Mix', qty: '10 kg' },
          ].map((d) => (
            <div key={d.item} className="p-3 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-center">
              <p className="text-sm font-medium text-white">{d.qty}</p>
              <p className="text-xs text-[#9CA3AF] mt-1">{d.item}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 px-4 py-2 bg-[#4B1FA8]/20 text-[#D8B4FE] border border-[#4B1FA8]/30 rounded-lg text-sm hover:bg-[#4B1FA8]/30 transition-colors">
          Convert to Production Orders
        </button>
      </div>
    </div>
  );
}
