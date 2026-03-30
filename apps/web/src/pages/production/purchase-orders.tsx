import { useState } from 'react';
import { Plus, FileText, Send, X, Calendar } from 'lucide-react';

const purchaseOrders = [
  { id: '1', number: 'PUR-001', supplier: 'Karachi Meats', items: 4, total: 85000, status: 'RECEIVED', date: 'Mar 25, 2026', deliveryDate: 'Mar 27, 2026' },
  { id: '2', number: 'PUR-002', supplier: 'Fresh Farms Dairy', items: 2, total: 22000, status: 'SENT', date: 'Mar 28, 2026', deliveryDate: 'Mar 30, 2026' },
  { id: '3', number: 'PUR-003', supplier: 'Ali Grocery', items: 6, total: 15500, status: 'PARTIAL', date: 'Mar 27, 2026', deliveryDate: 'Mar 29, 2026' },
  { id: '4', number: 'PUR-004', supplier: 'PakFry Foods', items: 3, total: 42000, status: 'DRAFT', date: 'Mar 29, 2026', deliveryDate: null },
  { id: '5', number: 'PUR-005', supplier: 'Karachi Meats', items: 2, total: 35000, status: 'CANCELLED', date: 'Mar 20, 2026', deliveryDate: null },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  SENT: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  RECEIVED: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  PARTIAL: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  CANCELLED: { bg: 'bg-red-500/20', text: 'text-red-400' },
};

export default function PurchaseOrdersPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[Syne] text-white">Purchase Orders</h1>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Create PO
        </button>
      </div>

      <div className="bg-[#1A1030] border border-[#2D1F50] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2D1F50]">
              {['PO #', 'Supplier', 'Items', 'Total', 'Status', 'Date', 'Delivery', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((po, idx) => {
              const status = statusColors[po.status];
              return (
                <tr key={po.id} className={`border-b border-[#2D1F50]/50 hover:bg-[#4B1FA8]/5 ${idx % 2 === 0 ? 'bg-[#0F0A1E]/30' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-white">{po.number}</td>
                  <td className="px-4 py-3 text-sm text-white">{po.supplier}</td>
                  <td className="px-4 py-3 text-sm text-[#9CA3AF]">{po.items} items</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#F97316]">Rs {po.total.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>{po.status}</span></td>
                  <td className="px-4 py-3 text-sm text-[#9CA3AF]">{po.date}</td>
                  <td className="px-4 py-3 text-sm text-[#9CA3AF]">{po.deliveryDate || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-md hover:bg-[#2D1F50] text-[#9CA3AF] hover:text-white" title="View"><FileText size={14} /></button>
                      {po.status === 'DRAFT' && <button className="p-1.5 rounded-md hover:bg-blue-500/10 text-[#9CA3AF] hover:text-blue-400" title="Send"><Send size={14} /></button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1030] border border-[#2D1F50] rounded-2xl w-full max-w-lg p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-[Syne] text-white">Create Purchase Order</h3>
              <button onClick={() => setShowCreate(false)} className="text-[#9CA3AF] hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Supplier</label><select className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]"><option>Select supplier</option><option>Karachi Meats</option><option>Fresh Farms Dairy</option><option>Ali Grocery</option><option>PakFry Foods</option><option>Supreme Packaging</option></select></div>
              <div>
                <label className="text-xs text-[#9CA3AF] mb-2 block">Items</label>
                <div className="space-y-2">
                  {[{ name: 'Beef Patties', qty: 100, unit: 'pcs', price: 120 }].map((item, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2">
                      <input defaultValue={item.name} className="col-span-2 px-2 py-1.5 bg-[#0F0A1E] border border-[#2D1F50] rounded text-xs text-white focus:outline-none focus:border-[#4B1FA8]" placeholder="Item" />
                      <input defaultValue={item.qty} type="number" className="px-2 py-1.5 bg-[#0F0A1E] border border-[#2D1F50] rounded text-xs text-white focus:outline-none focus:border-[#4B1FA8]" placeholder="Qty" />
                      <input defaultValue={item.price} type="number" className="px-2 py-1.5 bg-[#0F0A1E] border border-[#2D1F50] rounded text-xs text-white focus:outline-none focus:border-[#4B1FA8]" placeholder="Price" />
                    </div>
                  ))}
                  <button className="text-xs text-[#4B1FA8] hover:text-[#7C3AED]">+ Add item</button>
                </div>
              </div>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Delivery Date</label><input type="date" className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" /></div>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Notes</label><textarea className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8] h-16 resize-none" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-[#2D1F50] text-[#9CA3AF] rounded-lg text-sm">Cancel</button>
                <button className="flex-1 py-2.5 bg-[#4B1FA8] text-white rounded-lg text-sm font-medium">Create PO</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
