import { useState } from 'react';
import { MapPin, Clock, Phone, Navigation, Truck, Users, Timer, TrendingUp } from 'lucide-react';

const activeDeliveries = [
  { id: '1', orderNumber: '#1084', rider: 'Ahmed Raza', customer: 'Fatima Khan', address: 'Block 5, Clifton, Karachi', phone: '0300-1234567', amount: 1850, status: 'EN_ROUTE', eta: '8 min' },
  { id: '2', orderNumber: '#1080', rider: 'Bilal Khan', customer: 'Usman Ali', address: 'DHA Phase 6, Karachi', phone: '0321-9876543', amount: 950, status: 'PICKED_UP', eta: '15 min' },
  { id: '3', orderNumber: '#1079', rider: 'Faisal Mehmood', customer: 'Ayesha Butt', address: 'Gulshan-e-Iqbal Block 13, Karachi', phone: '0333-5551234', amount: 3200, status: 'ARRIVING', eta: '2 min' },
  { id: '4', orderNumber: '#1076', rider: 'Ahmed Raza', customer: 'Zara Iqbal', address: 'Nazimabad No. 3, Karachi', phone: '0312-4445678', amount: 1450, status: 'EN_ROUTE', eta: '20 min' },
  { id: '5', orderNumber: '#1075', rider: 'Hassan Ali', customer: 'Ali Raza', address: 'North Nazimabad, Karachi', phone: '0345-6789012', amount: 2100, status: 'PICKED_UP', eta: '25 min' },
  { id: '6', orderNumber: '#1074', rider: 'Imran Butt', customer: 'Sana Malik', address: 'Bahadurabad, Karachi', phone: '0300-7778899', amount: 780, status: 'EN_ROUTE', eta: '12 min' },
  { id: '7', orderNumber: '#1073', rider: 'Bilal Khan', customer: 'Kamran Shah', address: 'PECHS Block 2, Karachi', phone: '0321-1112233', amount: 1650, status: 'ARRIVING', eta: '3 min' },
];

const pendingOrders = [
  { id: '8', orderNumber: '#1085', customer: 'Tariq Jameel', address: 'Saddar, Karachi', amount: 2200, readySince: '3 min ago' },
  { id: '9', orderNumber: '#1086', customer: 'Nadia Hussain', address: 'FB Area Block 7, Karachi', amount: 1100, readySince: '1 min ago' },
  { id: '10', orderNumber: '#1087', customer: 'Waqar Ahmed', address: 'Gulistan-e-Jauhar, Karachi', amount: 550, readySince: 'Just now' },
];

const riders = ['Ahmed Raza', 'Bilal Khan', 'Faisal Mehmood', 'Hassan Ali', 'Imran Butt'];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  PICKED_UP: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Picked Up' },
  EN_ROUTE: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'En Route' },
  ARRIVING: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Arriving' },
};

export default function DeliveryPage() {
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[Syne] text-white">Delivery Management</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Deliveries', value: '7', icon: Truck, color: 'orange', change: '' },
          { label: 'Available Riders', value: '5', icon: Users, color: 'blue', change: '2 offline' },
          { label: 'Avg Delivery Time', value: '28 min', icon: Timer, color: 'purple', change: '-3 min vs last week' },
          { label: 'On-Time Rate', value: '94%', icon: TrendingUp, color: 'emerald', change: '+2% this week' },
        ].map((kpi) => (
          <div key={kpi.label} className={`bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4 border-l-4 border-l-${kpi.color}-500`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#9CA3AF] uppercase tracking-wider">{kpi.label}</p>
                <p className="text-2xl font-bold font-[Syne] text-white mt-1">{kpi.value}</p>
                {kpi.change && <p className="text-xs text-[#9CA3AF] mt-1">{kpi.change}</p>}
              </div>
              <kpi.icon size={20} className="text-[#9CA3AF]" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="xl:col-span-2 bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl overflow-hidden">
          <div className="relative h-[450px] bg-[#0F0A1E] flex items-center justify-center">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #4B1FA8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            {/* Map pins */}
            {activeDeliveries.map((d, i) => (
              <div
                key={d.id}
                className={`absolute cursor-pointer transition-all hover:scale-125 ${selectedDelivery === d.id ? 'scale-125 z-10' : ''}`}
                style={{ left: `${15 + (i * 12) % 70}%`, top: `${20 + (i * 17) % 60}%` }}
                onClick={() => setSelectedDelivery(d.id)}
              >
                <div className={`w-8 h-8 rounded-full ${statusColors[d.status].bg} ${statusColors[d.status].text} flex items-center justify-center border-2 border-current`}>
                  <Navigation size={14} />
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[9px] text-white whitespace-nowrap bg-[#1A1030] px-1.5 py-0.5 rounded">{d.rider}</div>
              </div>
            ))}
            <div className="relative z-0 text-center">
              <MapPin size={32} className="text-[#2D1F50] mx-auto mb-2" />
              <p className="text-sm text-[#4B5563]">Live Map View</p>
              <p className="text-xs text-[#4B5563]">7 active deliveries tracked</p>
            </div>
          </div>
        </div>

        {/* Active Deliveries List */}
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
            Active Deliveries
          </h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {activeDeliveries.map((d) => {
              const status = statusColors[d.status];
              return (
                <div key={d.id} className={`p-3 rounded-lg border transition-all cursor-pointer ${selectedDelivery === d.id ? 'bg-[#4B1FA8]/10 border-[#4B1FA8]' : 'bg-[#0F0A1E]/50 border-[#2D1F50] hover:border-[#4B1FA8]/30'}`} onClick={() => setSelectedDelivery(d.id)}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white">{d.orderNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>{status.label}</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF]"><Truck size={10} className="inline mr-1" />{d.rider}</p>
                  <p className="text-xs text-[#9CA3AF] truncate"><MapPin size={10} className="inline mr-1" />{d.address}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-medium text-[#F97316]">Rs {d.amount.toLocaleString()}</span>
                    <span className="text-xs text-[#9CA3AF] flex items-center gap-1"><Clock size={10} /> ETA: {d.eta}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pending Orders Queue */}
      <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Pending Deliveries — Ready for Pickup</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {pendingOrders.map((order) => (
            <div key={order.id} className="p-4 bg-[#0F0A1E] border border-amber-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{order.orderNumber}</span>
                <span className="text-xs text-amber-400">{order.readySince}</span>
              </div>
              <p className="text-xs text-[#9CA3AF] mb-1">{order.customer}</p>
              <p className="text-xs text-[#9CA3AF] mb-3 truncate"><MapPin size={10} className="inline mr-1" />{order.address}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#F97316]">Rs {order.amount.toLocaleString()}</span>
                <select className="px-2 py-1 bg-[#1A1030] border border-[#2D1F50] rounded text-xs text-white focus:outline-none focus:border-[#4B1FA8]">
                  <option>Assign Rider</option>
                  {riders.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
