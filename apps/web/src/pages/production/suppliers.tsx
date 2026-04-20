import { useState } from 'react';
import { Plus, Phone, Mail, MapPin, Star, Edit2, X } from 'lucide-react';

const suppliers = [
  { id: '1', name: 'Karachi Meats', category: 'Meat', phone: '021-34567890', email: 'orders@karachimeats.pk', city: 'Karachi', rating: 4.5, balance: 45000 },
  { id: '2', name: 'Fresh Farms Dairy', category: 'Dairy', phone: '021-34561234', email: 'supply@freshfarms.pk', city: 'Karachi', rating: 4.8, balance: 12000 },
  { id: '3', name: 'Ali Grocery', category: 'Dry Goods', phone: '021-35678901', email: 'ali@aligrocery.pk', city: 'Karachi', rating: 4.0, balance: 8500 },
  { id: '4', name: 'PakFry Foods', category: 'Frozen', phone: '042-35671234', email: 'sales@pakfry.pk', city: 'Lahore', rating: 4.3, balance: 22000 },
  { id: '5', name: 'Supreme Packaging', category: 'Packaging', phone: '021-34569876', email: 'orders@supremepack.pk', city: 'Karachi', rating: 4.6, balance: 5000 },
];

const categoryColors: Record<string, string> = {
  Meat: 'bg-red-500/20 text-red-400',
  Dairy: 'bg-blue-500/20 text-blue-400',
  'Dry Goods': 'bg-amber-500/20 text-amber-400',
  Frozen: 'bg-cyan-500/20 text-cyan-400',
  Packaging: 'bg-gray-500/20 text-gray-400',
};

export default function SuppliersPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[Syne] text-white">Suppliers</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      <div className="bg-[#1A1030] border border-[#2D1F50] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2D1F50]">
              {['Supplier', 'Category', 'Contact', 'City', 'Rating', 'Outstanding', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s, idx) => (
              <tr key={s.id} className={`border-b border-[#2D1F50]/50 hover:bg-[#4B1FA8]/5 ${idx % 2 === 0 ? 'bg-[#0F0A1E]/30' : ''}`}>
                <td className="px-4 py-3 text-sm font-medium text-white">{s.name}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[s.category]}`}>{s.category}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-[#9CA3AF]"><Phone size={10} /> {s.phone}</div>
                  <div className="flex items-center gap-1 text-xs text-[#9CA3AF] mt-0.5"><Mail size={10} /> {s.email}</div>
                </td>
                <td className="px-4 py-3 text-sm text-[#9CA3AF] flex items-center gap-1"><MapPin size={12} /> {s.city}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={10} className={i < Math.floor(s.rating) ? 'text-amber-400 fill-amber-400' : 'text-[#2D1F50]'} />
                    ))}
                    <span className="text-xs text-[#9CA3AF] ml-1">{s.rating}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-[#F97316]">Rs {s.balance.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <button className="p-1.5 rounded-md hover:bg-[#2D1F50] text-[#9CA3AF] hover:text-white"><Edit2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1030] border border-[#2D1F50] rounded-2xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-[Syne] text-white">Add Supplier</h3>
              <button onClick={() => setShowAdd(false)} className="text-[#9CA3AF] hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {[{ label: 'Name', placeholder: 'Supplier name' }, { label: 'Phone', placeholder: '021-XXXXXXXX' }, { label: 'Email', placeholder: 'email@supplier.pk' }, { label: 'City', placeholder: 'City' }].map((f) => (
                <div key={f.label}><label className="text-xs text-[#9CA3AF] mb-1 block">{f.label}</label><input className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" placeholder={f.placeholder} /></div>
              ))}
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Category</label><select className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]"><option>Meat</option><option>Dairy</option><option>Dry Goods</option><option>Frozen</option><option>Packaging</option><option>Produce</option></select></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-[#2D1F50] text-[#9CA3AF] rounded-lg text-sm">Cancel</button>
                <button className="flex-1 py-2.5 bg-[#4B1FA8] text-white rounded-lg text-sm font-medium">Add Supplier</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
