import { MapPin, ToggleLeft, ToggleRight, Edit2, Plus } from 'lucide-react';

const zones = [
  { id: '1', name: 'Zone A — Nearby', charge: 50, minOrder: 300, isActive: true, color: '#10B981', orders: 145 },
  { id: '2', name: 'Zone B — Mid Range', charge: 100, minOrder: 500, isActive: true, color: '#3B82F6', orders: 98 },
  { id: '3', name: 'Zone C — Far', charge: 150, minOrder: 800, isActive: true, color: '#F59E0B', orders: 42 },
  { id: '4', name: 'Zone D — Extended', charge: 250, minOrder: 1200, isActive: false, color: '#EF4444', orders: 8 },
];

export default function ZonesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[Syne] text-white">Delivery Zones</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add Zone
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Map */}
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl overflow-hidden">
          <div className="relative h-[400px] bg-[#0F0A1E] flex items-center justify-center">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #4B1FA8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            {zones.map((zone, i) => (
              <div key={zone.id} className="absolute rounded-full border-2 opacity-30" style={{
                borderColor: zone.color, backgroundColor: zone.color + '15',
                width: `${(i + 1) * 22}%`, height: `${(i + 1) * 22}%`,
                left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
              }} />
            ))}
            <div className="relative z-10 text-center">
              <MapPin size={24} className="text-[#4B1FA8] mx-auto mb-2" />
              <p className="text-xs text-[#9CA3AF]">Burger Palace</p>
            </div>
          </div>
          <div className="p-4 flex flex-wrap gap-3">
            {zones.map((z) => (
              <div key={z.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: z.color }} />
                <span className="text-xs text-[#9CA3AF]">{z.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Zone List */}
        <div className="space-y-3">
          {zones.map((zone) => (
            <div key={zone.id} className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-5" style={{ borderLeftWidth: 4, borderLeftColor: zone.color }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">{zone.name}</h3>
                <div className="flex items-center gap-2">
                  {zone.isActive ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400"><ToggleRight size={16} /> Active</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-[#9CA3AF]"><ToggleLeft size={16} /> Inactive</span>
                  )}
                  <button className="p-1.5 rounded-md hover:bg-[#2D1F50] text-[#9CA3AF] hover:text-white"><Edit2 size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><p className="text-xs text-[#9CA3AF]">Delivery Charge</p><p className="text-sm font-medium text-[#F97316]">Rs {zone.charge}</p></div>
                <div><p className="text-xs text-[#9CA3AF]">Min Order</p><p className="text-sm font-medium text-white">Rs {zone.minOrder}</p></div>
                <div><p className="text-xs text-[#9CA3AF]">Orders (30d)</p><p className="text-sm font-medium text-white">{zone.orders}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
