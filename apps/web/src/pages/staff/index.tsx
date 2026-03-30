import { useState } from 'react';
import { Plus, Edit2, X, Shield, ToggleLeft, ToggleRight } from 'lucide-react';

const staff = [
  { id: '1', name: 'Muhammad Usman', email: 'admin@burgerpalace.com', phone: '0300-1111111', role: 'OWNER', branch: 'All Branches', isActive: true, lastLogin: '10 min ago', orders: 0 },
  { id: '2', name: 'Ali Hassan', email: 'ali@burgerpalace.com', phone: '0321-2222222', role: 'BRANCH_MANAGER', branch: 'Main Branch', isActive: true, lastLogin: '1 hour ago', orders: 0 },
  { id: '3', name: 'Kashif Rizwan', email: 'kashif@burgerpalace.com', phone: '0333-3333333', role: 'BRANCH_MANAGER', branch: 'Clifton Branch', isActive: true, lastLogin: '3 hours ago', orders: 0 },
  { id: '4', name: 'Hamza Khan', email: 'hamza@burgerpalace.com', phone: '0345-4444444', role: 'CASHIER', branch: 'Main Branch', isActive: true, lastLogin: '30 min ago', orders: 156 },
  { id: '5', name: 'Fawad Ali', email: 'fawad@burgerpalace.com', phone: '0312-5555555', role: 'CASHIER', branch: 'Clifton Branch', isActive: true, lastLogin: '2 hours ago', orders: 98 },
  { id: '6', name: 'Raza Ahmed', email: 'raza@burgerpalace.com', phone: '0300-6666666', role: 'KITCHEN_STAFF', branch: 'Main Branch', isActive: true, lastLogin: '45 min ago', orders: 0 },
  { id: '7', name: 'Asif Iqbal', email: 'asif@burgerpalace.com', phone: '0321-7777777', role: 'KITCHEN_STAFF', branch: 'Clifton Branch', isActive: false, lastLogin: '5 days ago', orders: 0 },
  { id: '8', name: 'Ahmed Raza', email: 'rider1@burgerpalace.com', phone: '0333-8888888', role: 'RIDER', branch: 'Main Branch', isActive: true, lastLogin: '15 min ago', orders: 195 },
];

const roleColors: Record<string, string> = {
  OWNER: 'bg-purple-500/20 text-purple-400',
  BRANCH_MANAGER: 'bg-blue-500/20 text-blue-400',
  CASHIER: 'bg-emerald-500/20 text-emerald-400',
  KITCHEN_STAFF: 'bg-orange-500/20 text-orange-400',
  RIDER: 'bg-cyan-500/20 text-cyan-400',
};

const roleLabels: Record<string, string> = {
  OWNER: 'Owner',
  BRANCH_MANAGER: 'Branch Manager',
  CASHIER: 'Cashier',
  KITCHEN_STAFF: 'Kitchen Staff',
  RIDER: 'Rider',
};

export default function StaffPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[Syne] text-white">Staff Management</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(roleLabels).map(([key, label]) => (
          <div key={key} className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-3 text-center">
            <p className="text-xs text-[#9CA3AF]">{label}s</p>
            <p className="text-xl font-bold font-[Syne] text-white mt-1">{staff.filter((s) => s.role === key).length}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1A1030] border border-[#2D1F50] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-[#2D1F50]">
            {['Staff', 'Role', 'Branch', 'Phone', 'Status', 'Last Login', 'Orders', 'Actions'].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {staff.map((s, idx) => (
              <tr key={s.id} className={`border-b border-[#2D1F50]/50 hover:bg-[#4B1FA8]/5 ${idx % 2 === 0 ? 'bg-[#0F0A1E]/30' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#4B1FA8]/20 flex items-center justify-center text-xs font-bold text-[#D8B4FE]">{s.name.split(' ').map((n) => n[0]).join('')}</div>
                    <div>
                      <p className="text-sm text-white">{s.name}</p>
                      <p className="text-[10px] text-[#9CA3AF]">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[s.role]}`}>{roleLabels[s.role]}</span></td>
                <td className="px-4 py-3 text-sm text-[#9CA3AF]">{s.branch}</td>
                <td className="px-4 py-3 text-sm text-[#9CA3AF]">{s.phone}</td>
                <td className="px-4 py-3">
                  {s.isActive ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400"><ToggleRight size={14} /> Active</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-[#9CA3AF]"><ToggleLeft size={14} /> Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-[#9CA3AF]">{s.lastLogin}</td>
                <td className="px-4 py-3 text-sm text-white">{s.orders || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-md hover:bg-[#2D1F50] text-[#9CA3AF] hover:text-white"><Edit2 size={14} /></button>
                    <button className="p-1.5 rounded-md hover:bg-[#2D1F50] text-[#9CA3AF] hover:text-white"><Shield size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1030] border border-[#2D1F50] rounded-2xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-[Syne] text-white">Add Staff Member</h3>
              <button onClick={() => setShowAdd(false)} className="text-[#9CA3AF] hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {[{ l: 'Full Name', p: 'Enter name' }, { l: 'Email', p: 'email@burgerpalace.com' }, { l: 'Phone', p: '03XX-XXXXXXX' }].map((f) => (
                <div key={f.l}><label className="text-xs text-[#9CA3AF] mb-1 block">{f.l}</label><input className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" placeholder={f.p} /></div>
              ))}
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Role</label><select className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]">{Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Branch</label><select className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]"><option>Main Branch</option><option>Clifton Branch</option></select></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-[#2D1F50] text-[#9CA3AF] rounded-lg text-sm">Cancel</button>
                <button className="flex-1 py-2.5 bg-[#4B1FA8] text-white rounded-lg text-sm font-medium">Add Staff</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
