import { useState } from 'react';
import { Clock, ChefHat, CheckCircle2, Bell } from 'lucide-react';

interface KDSOrder {
  id: string;
  orderNumber: string;
  type: string;
  items: { name: string; qty: number; mods: string[] }[];
  status: 'NEW' | 'PREPARING' | 'READY';
  createdAt: Date;
}

const initialOrders: KDSOrder[] = [
  { id: '1', orderNumber: '#1084', type: 'DELIVERY', items: [{ name: 'Zinger Burger', qty: 2, mods: ['Extra Cheese'] }, { name: 'Loaded Fries', qty: 1, mods: [] }, { name: 'Pepsi', qty: 2, mods: [] }], status: 'NEW', createdAt: new Date(Date.now() - 2 * 60000) },
  { id: '2', orderNumber: '#1083', type: 'DINE_IN', items: [{ name: 'Family Deal', qty: 1, mods: [] }, { name: 'Coleslaw', qty: 2, mods: [] }], status: 'NEW', createdAt: new Date(Date.now() - 5 * 60000) },
  { id: '3', orderNumber: '#1082', type: 'TAKEAWAY', items: [{ name: 'Classic Burger', qty: 1, mods: [] }, { name: 'Regular Fries', qty: 1, mods: [] }], status: 'NEW', createdAt: new Date(Date.now() - 8 * 60000) },
  { id: '4', orderNumber: '#1081', type: 'DELIVERY', items: [{ name: 'Double Patty', qty: 1, mods: ['No Onion'] }, { name: 'Mango Shake', qty: 1, mods: [] }], status: 'PREPARING', createdAt: new Date(Date.now() - 12 * 60000) },
  { id: '5', orderNumber: '#1080', type: 'DINE_IN', items: [{ name: 'BBQ Burger', qty: 3, mods: [] }, { name: 'Onion Rings', qty: 2, mods: [] }, { name: '7UP', qty: 3, mods: [] }], status: 'PREPARING', createdAt: new Date(Date.now() - 15 * 60000) },
  { id: '6', orderNumber: '#1079', type: 'TAKEAWAY', items: [{ name: 'Chicken Shawarma', qty: 2, mods: ['Extra Sauce'] }], status: 'PREPARING', createdAt: new Date(Date.now() - 6 * 60000) },
  { id: '7', orderNumber: '#1078', type: 'DELIVERY', items: [{ name: 'Buddy Deal', qty: 1, mods: [] }], status: 'READY', createdAt: new Date(Date.now() - 20 * 60000) },
  { id: '8', orderNumber: '#1077', type: 'DINE_IN', items: [{ name: 'Smash Burger', qty: 2, mods: [] }, { name: 'Fresh Lime', qty: 2, mods: [] }], status: 'READY', createdAt: new Date(Date.now() - 18 * 60000) },
];

function getElapsed(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  return `${mins}m`;
}

function getTimerColor(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins >= 15) return 'text-red-400 bg-red-500/20';
  if (mins >= 10) return 'text-amber-400 bg-amber-500/20';
  return 'text-emerald-400 bg-emerald-500/20';
}

const typeBadge: Record<string, string> = {
  DELIVERY: 'bg-orange-500/20 text-orange-400',
  TAKEAWAY: 'bg-purple-500/20 text-purple-400',
  DINE_IN: 'bg-blue-500/20 text-blue-400',
};

const statusConfig = {
  NEW: { label: 'New Orders', icon: Bell, color: 'text-amber-400', borderColor: 'border-amber-500/30', bg: 'bg-amber-500/5' },
  PREPARING: { label: 'Preparing', icon: ChefHat, color: 'text-blue-400', borderColor: 'border-blue-500/30', bg: 'bg-blue-500/5' },
  READY: { label: 'Ready', icon: CheckCircle2, color: 'text-emerald-400', borderColor: 'border-emerald-500/30', bg: 'bg-emerald-500/5' },
};

export default function KDSPage() {
  const [orders, setOrders] = useState<KDSOrder[]>(initialOrders);

  const bumpOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== id) return o;
      if (o.status === 'NEW') return { ...o, status: 'PREPARING' };
      if (o.status === 'PREPARING') return { ...o, status: 'READY' };
      return o;
    }));
  };

  const columns: Array<'NEW' | 'PREPARING' | 'READY'> = ['NEW', 'PREPARING', 'READY'];

  return (
    <div className="fixed inset-0 bg-[#0F0A1E] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#2D1F50]">
        <div className="flex items-center gap-3">
          <ChefHat size={24} className="text-[#4B1FA8]" />
          <h1 className="text-xl font-bold font-[Syne] text-white">Kitchen Display</h1>
          <span className="text-xs text-[#9CA3AF]">Burger Palace — Main Branch</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-emerald-400">Live</span>
          </div>
          <span className="text-sm text-[#9CA3AF]">{orders.filter((o) => o.status === 'NEW').length} new</span>
        </div>
      </div>

      {/* Columns */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {columns.map((status) => {
          const config = statusConfig[status];
          const Icon = config.icon;
          const columnOrders = orders.filter((o) => o.status === status);
          return (
            <div key={status} className="flex-1 flex flex-col min-w-0">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-t-lg ${config.bg} border ${config.borderColor} border-b-0`}>
                <Icon size={18} className={config.color} />
                <h2 className={`text-sm font-semibold ${config.color}`}>{config.label}</h2>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${config.color} bg-white/5`}>{columnOrders.length}</span>
              </div>
              <div className={`flex-1 overflow-y-auto space-y-3 p-3 border ${config.borderColor} border-t-0 rounded-b-lg ${config.bg}`}>
                {columnOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => bumpOrder(order.id)}
                    className="w-full text-left bg-[#1A1030] border border-[#2D1F50] rounded-xl p-4 hover:border-[#4B1FA8] hover:shadow-lg hover:shadow-[#4B1FA8]/5 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold font-[Syne] text-white">{order.orderNumber}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${typeBadge[order.type]}`}>
                          {order.type.replace('_', ' ')}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-md flex items-center gap-1 ${getTimerColor(order.createdAt)}`}>
                          <Clock size={10} />
                          {getElapsed(order.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-lg font-bold text-[#F97316] min-w-[28px]">{item.qty}x</span>
                          <div>
                            <p className="text-base font-medium text-white">{item.name}</p>
                            {item.mods.length > 0 && (
                              <p className="text-xs text-[#9CA3AF] mt-0.5">{item.mods.join(', ')}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#2D1F50]">
                      <p className="text-xs text-[#9CA3AF] text-center">
                        {status === 'READY' ? 'Tap to dismiss' : `Tap to mark as ${status === 'NEW' ? 'preparing' : 'ready'}`}
                      </p>
                    </div>
                  </button>
                ))}
                {columnOrders.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <Icon size={24} className="text-[#2D1F50] mb-2" />
                    <p className="text-xs text-[#4B5563]">No orders</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
