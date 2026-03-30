import { useState } from 'react';
import { Phone, MapPin, Navigation, DollarSign, Package, CheckCircle2, Clock, Home, User } from 'lucide-react';

const currentOrder = {
  id: '1084',
  customer: 'Fatima Khan',
  phone: '0300-1234567',
  pickupAddress: 'Burger Palace, Block 5, Clifton',
  deliveryAddress: 'Apt 302, Ocean Towers, Sea View, Clifton, Karachi',
  amount: 1850,
  items: '2x Zinger Burger, 1x Loaded Fries, 2x Pepsi',
  status: 'PICKED_UP' as const,
};

const upcomingOrders = [
  { id: '1086', customer: 'Nadia Hussain', address: 'FB Area Block 7', amount: 1100, readySince: '2 min' },
  { id: '1087', customer: 'Waqar Ahmed', address: 'Gulistan-e-Jauhar', amount: 550, readySince: '1 min' },
];

const statusSteps = ['ACCEPTED', 'PICKED_UP', 'DELIVERED'] as const;
type Status = typeof statusSteps[number];

export default function RiderPage() {
  const [orderStatus, setOrderStatus] = useState<Status>(currentOrder.status);

  const currentStepIdx = statusSteps.indexOf(orderStatus);
  const nextStatus = statusSteps[currentStepIdx + 1];
  const buttonLabels: Record<string, string> = { ACCEPTED: 'Mark as Picked Up', PICKED_UP: 'Mark as Delivered', DELIVERED: 'Completed' };

  return (
    <div className="min-h-screen bg-[#0F0A1E] max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-[#2D1F50] flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold font-[Syne] text-white">Ahmed Raza</h1>
          <p className="text-xs text-[#9CA3AF]">Burger Palace — Rider</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#9CA3AF]">Today's Earnings</p>
          <p className="text-lg font-bold text-emerald-400">Rs 2,100</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 p-4">
        <div className="bg-[#1A1030] border border-[#2D1F50] rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-white">3</p>
          <p className="text-[10px] text-[#9CA3AF]">Assigned</p>
        </div>
        <div className="bg-[#1A1030] border border-[#2D1F50] rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-emerald-400">8</p>
          <p className="text-[10px] text-[#9CA3AF]">Completed</p>
        </div>
        <div className="bg-[#1A1030] border border-[#2D1F50] rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-[#F97316]">Rs 4,200</p>
          <p className="text-[10px] text-[#9CA3AF]">Cash to Collect</p>
        </div>
      </div>

      {/* Current Order */}
      <div className="px-4 pb-4">
        <h2 className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider mb-2">Current Delivery</h2>
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#4B1FA8]/30 rounded-xl p-4">
          {/* Status Progress */}
          <div className="flex items-center gap-2 mb-4">
            {statusSteps.map((step, idx) => (
              <div key={step} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${idx <= currentStepIdx ? 'bg-[#4B1FA8] text-white' : 'bg-[#2D1F50] text-[#9CA3AF]'}`}>
                  {idx <= currentStepIdx ? <CheckCircle2 size={14} /> : idx + 1}
                </div>
                {idx < statusSteps.length - 1 && <div className={`flex-1 h-0.5 ${idx < currentStepIdx ? 'bg-[#4B1FA8]' : 'bg-[#2D1F50]'}`} />}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold font-[Syne] text-white">Order #{currentOrder.id}</span>
            <span className="text-sm font-bold text-[#F97316]">Rs {currentOrder.amount.toLocaleString()}</span>
          </div>

          <p className="text-xs text-[#9CA3AF] mb-3">{currentOrder.items}</p>

          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5"><MapPin size={10} className="text-emerald-400" /></div>
              <div><p className="text-[10px] text-[#9CA3AF]">Pickup</p><p className="text-xs text-white">{currentOrder.pickupAddress}</p></div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5"><MapPin size={10} className="text-red-400" /></div>
              <div><p className="text-[10px] text-[#9CA3AF]">Delivery</p><p className="text-xs text-white">{currentOrder.deliveryAddress}</p></div>
            </div>
          </div>

          {/* Customer */}
          <div className="flex items-center justify-between p-3 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg mb-4">
            <div><p className="text-sm text-white">{currentOrder.customer}</p><p className="text-xs text-[#9CA3AF]">{currentOrder.phone}</p></div>
            <div className="flex gap-2">
              <a href={`tel:${currentOrder.phone}`} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Phone size={16} /></a>
              <button className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20"><Navigation size={16} /></button>
            </div>
          </div>

          {/* Action Button */}
          {nextStatus && (
            <button
              onClick={() => setOrderStatus(nextStatus)}
              className="w-full py-3 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {buttonLabels[orderStatus]}
            </button>
          )}
          {orderStatus === 'DELIVERED' && (
            <div className="text-center py-3">
              <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-1" />
              <p className="text-sm text-emerald-400 font-medium">Delivered!</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming */}
      <div className="px-4 pb-4">
        <h2 className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider mb-2">Up Next</h2>
        <div className="space-y-2">
          {upcomingOrders.map((o) => (
            <div key={o.id} className="bg-[#1A1030] border border-[#2D1F50] rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-white">#{o.id} · {o.customer}</span>
                <p className="text-xs text-[#9CA3AF]"><MapPin size={10} className="inline mr-1" />{o.address}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#F97316]">Rs {o.amount}</p>
                <p className="text-[10px] text-[#9CA3AF] flex items-center gap-1 justify-end"><Clock size={8} /> {o.readySince}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#1A1030] border-t border-[#2D1F50] flex">
        {[
          { icon: Home, label: 'Home', active: true },
          { icon: Package, label: 'Orders', active: false },
          { icon: DollarSign, label: 'Earnings', active: false },
          { icon: User, label: 'Profile', active: false },
        ].map((tab) => (
          <button key={tab.label} className={`flex-1 py-3 flex flex-col items-center gap-1 ${tab.active ? 'text-[#4B1FA8]' : 'text-[#9CA3AF]'}`}>
            <tab.icon size={18} />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
