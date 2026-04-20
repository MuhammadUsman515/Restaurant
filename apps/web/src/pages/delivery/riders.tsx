import { useState } from 'react';
import { Phone, MapPin, Bike, Car, ToggleLeft, ToggleRight, Plus, Edit2, X, Star } from 'lucide-react';

const mockRiders = [
  { id: '1', name: 'Ahmed Raza', phone: '0300-1234567', vehicle: 'Bike', isOnline: true, photo: null, deliveriesToday: 12, avgTime: 25, cashCollected: 8400, rating: 4.8 },
  { id: '2', name: 'Bilal Khan', phone: '0321-9876543', vehicle: 'Bike', isOnline: true, photo: null, deliveriesToday: 9, avgTime: 28, cashCollected: 6200, rating: 4.5 },
  { id: '3', name: 'Faisal Mehmood', phone: '0333-5551234', vehicle: 'Car', isOnline: true, photo: null, deliveriesToday: 7, avgTime: 22, cashCollected: 5100, rating: 4.9 },
  { id: '4', name: 'Hassan Ali', phone: '0345-6789012', vehicle: 'Bike', isOnline: false, photo: null, deliveriesToday: 0, avgTime: 30, cashCollected: 0, rating: 4.2 },
  { id: '5', name: 'Imran Butt', phone: '0312-4445678', vehicle: 'Bike', isOnline: true, photo: null, deliveriesToday: 5, avgTime: 32, cashCollected: 3800, rating: 4.0 },
];

export default function RidersPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[Syne] text-white">Rider Management</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add Rider
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4">
          <p className="text-xs text-[#9CA3AF] uppercase">Total Riders</p>
          <p className="text-2xl font-bold font-[Syne] text-white mt-1">5</p>
        </div>
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4">
          <p className="text-xs text-[#9CA3AF] uppercase">Online Now</p>
          <p className="text-2xl font-bold font-[Syne] text-emerald-400 mt-1">4</p>
        </div>
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4">
          <p className="text-xs text-[#9CA3AF] uppercase">Deliveries Today</p>
          <p className="text-2xl font-bold font-[Syne] text-white mt-1">33</p>
        </div>
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4">
          <p className="text-xs text-[#9CA3AF] uppercase">Cash to Collect</p>
          <p className="text-2xl font-bold font-[Syne] text-[#F97316] mt-1">Rs 23,500</p>
        </div>
      </div>

      {/* Rider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockRiders.map((rider) => (
          <div key={rider.id} className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-5 hover:border-[#4B1FA8]/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#4B1FA8]/20 flex items-center justify-center text-lg font-bold text-[#D8B4FE]">
                {rider.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">{rider.name}</h3>
                  <div className="flex items-center gap-1">
                    {rider.isOnline ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400"><ToggleRight size={16} /> Online</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-[#9CA3AF]"><ToggleLeft size={16} /> Offline</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-[#9CA3AF] flex items-center gap-1"><Phone size={10} /> {rider.phone}</span>
                  <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
                    {rider.vehicle === 'Bike' ? <Bike size={10} /> : <Car size={10} />} {rider.vehicle}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={10} className={i < Math.floor(rider.rating) ? 'text-amber-400 fill-amber-400' : 'text-[#2D1F50]'} />
                  ))}
                  <span className="text-xs text-[#9CA3AF] ml-1">{rider.rating}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#2D1F50]">
              <div className="text-center">
                <p className="text-lg font-bold text-white">{rider.deliveriesToday}</p>
                <p className="text-[10px] text-[#9CA3AF]">Deliveries</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{rider.avgTime}m</p>
                <p className="text-[10px] text-[#9CA3AF]">Avg Time</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#F97316]">Rs {rider.cashCollected.toLocaleString()}</p>
                <p className="text-[10px] text-[#9CA3AF]">Cash</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 border border-[#2D1F50] text-[#9CA3AF] rounded-lg text-xs hover:bg-[#2D1F50] hover:text-white transition-colors">
                <Edit2 size={12} className="inline mr-1" /> Edit
              </button>
              <button className="flex-1 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs hover:bg-emerald-500/20 transition-colors">
                Collect Cash
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Rider Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1030] border border-[#2D1F50] rounded-2xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-[Syne] text-white">Add Rider</h3>
              <button onClick={() => setShowAdd(false)} className="text-[#9CA3AF] hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Name</label><input className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" placeholder="Full name" /></div>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Phone</label><input className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" placeholder="03XX-XXXXXXX" /></div>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Vehicle Type</label>
                <div className="flex gap-3">
                  <label className="flex-1 flex items-center gap-2 p-3 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg cursor-pointer hover:border-[#4B1FA8]"><input type="radio" name="vehicle" defaultChecked /> <Bike size={16} className="text-[#9CA3AF]" /> <span className="text-sm text-white">Bike</span></label>
                  <label className="flex-1 flex items-center gap-2 p-3 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg cursor-pointer hover:border-[#4B1FA8]"><input type="radio" name="vehicle" /> <Car size={16} className="text-[#9CA3AF]" /> <span className="text-sm text-white">Car</span></label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-[#2D1F50] text-[#9CA3AF] rounded-lg text-sm">Cancel</button>
                <button className="flex-1 py-2.5 bg-[#4B1FA8] text-white rounded-lg text-sm font-medium">Add Rider</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
