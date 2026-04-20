import { useState } from 'react';
import { Building, CreditCard, Bell, Shield, Printer, Globe, Save } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Restaurant Profile', icon: Building },
  { id: 'branches', label: 'Branches', icon: Globe },
  { id: 'pos', label: 'POS Config', icon: Printer },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
];

const plans = [
  { name: 'Starter', price: 5000, features: ['1 Branch', 'POS', 'Basic Reports', '500 orders/mo'], current: false },
  { name: 'Growth', price: 10000, features: ['3 Branches', 'POS + Online', 'Analytics', '2,000 orders/mo', 'Delivery management'], current: false },
  { name: 'Pro', price: 15000, features: ['10 Branches', 'Full Platform', 'Production Module', 'Unlimited orders', 'Priority support'], current: true },
  { name: 'Enterprise', price: 30000, features: ['Unlimited', 'Everything in Pro', 'API access', 'Custom integrations', 'Dedicated support'], current: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[Syne] text-white">Settings</h1>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-56 space-y-1 shrink-0">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${activeTab === t.id ? 'bg-[#4B1FA8]/20 text-white border-l-2 border-l-[#4B1FA8]' : 'text-[#9CA3AF] hover:text-white hover:bg-[#1A1030]'}`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold font-[Syne] text-white">Restaurant Profile</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full bg-[#4B1FA8]/20 flex items-center justify-center text-2xl font-bold text-[#D8B4FE]">BP</div>
                <button className="px-4 py-2 border border-[#2D1F50] text-[#9CA3AF] rounded-lg text-sm hover:text-white hover:bg-[#2D1F50]">Upload Logo</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { l: 'Restaurant Name', v: 'Burger Palace' }, { l: 'Tagline', v: 'Best Burgers in Karachi' },
                  { l: 'Address', v: 'Block 5, Clifton, Karachi' }, { l: 'Phone', v: '021-34567890' },
                  { l: 'Email', v: 'info@burgerpalace.pk' }, { l: 'Currency', v: 'PKR (Rs)' },
                ].map((f) => (
                  <div key={f.l}><label className="text-xs text-[#9CA3AF] mb-1 block">{f.l}</label><input defaultValue={f.v} className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" /></div>
                ))}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#4B1FA8] text-white rounded-lg text-sm font-medium mt-4"><Save size={16} /> Save Changes</button>
            </div>
          )}

          {activeTab === 'branches' && (
            <div className="space-y-4">
              {[
                { name: 'Main Branch', address: 'Block 5, Clifton, Karachi', phone: '021-34567890', manager: 'Ali Hassan', active: true },
                { name: 'Clifton Branch', address: 'Sea View Avenue, Clifton, Karachi', phone: '021-35678901', manager: 'Kashif Rizwan', active: true },
              ].map((b) => (
                <div key={b.name} className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">{b.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${b.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{b.active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div><p className="text-xs text-[#9CA3AF]">Address</p><p className="text-white mt-0.5">{b.address}</p></div>
                    <div><p className="text-xs text-[#9CA3AF]">Phone</p><p className="text-white mt-0.5">{b.phone}</p></div>
                    <div><p className="text-xs text-[#9CA3AF]">Manager</p><p className="text-white mt-0.5">{b.manager}</p></div>
                  </div>
                </div>
              ))}
              <button className="w-full border-2 border-dashed border-[#2D1F50] rounded-xl p-4 text-[#9CA3AF] hover:text-white hover:border-[#4B1FA8]/50 text-sm transition-colors">+ Add Branch</button>
            </div>
          )}

          {activeTab === 'pos' && (
            <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold font-[Syne] text-white">POS Configuration</h3>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Receipt Header</label><textarea defaultValue="Burger Palace&#10;Block 5, Clifton, Karachi&#10;Tel: 021-34567890" className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8] h-20 resize-none" /></div>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Receipt Footer</label><input defaultValue="Thank you for dining with us!" className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-[#9CA3AF] mb-1 block">GST Rate (%)</label><input type="number" defaultValue={16} className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" /></div>
                <div><label className="text-xs text-[#9CA3AF] mb-1 block">Service Charge (%)</label><input type="number" defaultValue={0} className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" /></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg">
                <span className="text-sm text-white">Auto-print receipt on order</span>
                <button className="text-emerald-400"><svg width="36" height="20" viewBox="0 0 36 20"><rect width="36" height="20" rx="10" fill="#10B981" /><circle cx="26" cy="10" r="7" fill="white" /></svg></button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#4B1FA8] text-white rounded-lg text-sm font-medium"><Save size={16} /> Save</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold font-[Syne] text-white">Notification Settings</h3>
              {['New Order Received', 'Order Ready', 'Low Stock Alert', 'Daily Sales Report', 'New Customer Registration'].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg">
                  <span className="text-sm text-white">{item}</span>
                  <div className="flex gap-3">
                    {['SMS', 'Email', 'Push'].map((ch) => (
                      <label key={ch} className="flex items-center gap-1 text-xs text-[#9CA3AF] cursor-pointer">
                        <input type="checkbox" defaultChecked={ch !== 'SMS'} className="rounded" /> {ch}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#4B1FA8]/20 to-[#1E1440] border border-[#4B1FA8]/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#D8B4FE] uppercase tracking-wider">Current Plan</span>
                    <h3 className="text-2xl font-bold font-[Syne] text-white mt-1">Pro</h3>
                    <p className="text-sm text-[#9CA3AF] mt-1">Rs 15,000/month · Renews Apr 1, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#9CA3AF]">Usage this month</p>
                    <p className="text-lg font-bold text-white">2,847 orders</p>
                    <p className="text-xs text-emerald-400">Unlimited</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {plans.map((p) => (
                  <div key={p.name} className={`bg-gradient-to-br from-[#1A1030] to-[#1E1440] border rounded-xl p-5 ${p.current ? 'border-[#4B1FA8]' : 'border-[#2D1F50]'}`}>
                    {p.current && <span className="text-[10px] text-[#4B1FA8] uppercase tracking-wider font-medium">Current</span>}
                    <h3 className="text-sm font-semibold text-white mt-1">{p.name}</h3>
                    <p className="text-xl font-bold text-white mt-2">Rs {p.price.toLocaleString()}<span className="text-xs text-[#9CA3AF] font-normal">/mo</span></p>
                    <div className="mt-3 space-y-1">
                      {p.features.map((f) => <p key={f} className="text-xs text-[#9CA3AF]">✓ {f}</p>)}
                    </div>
                    {!p.current && <button className="w-full mt-4 py-2 border border-[#2D1F50] text-[#9CA3AF] rounded-lg text-xs hover:text-white hover:border-[#4B1FA8]">{plans.indexOf(p) > plans.findIndex((x) => x.current) ? 'Upgrade' : 'Downgrade'}</button>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold font-[Syne] text-white">Change Password</h3>
                {['Current Password', 'New Password', 'Confirm Password'].map((l) => (
                  <div key={l}><label className="text-xs text-[#9CA3AF] mb-1 block">{l}</label><input type="password" className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" /></div>
                ))}
                <button className="px-4 py-2 bg-[#4B1FA8] text-white rounded-lg text-sm font-medium">Update Password</button>
              </div>
              <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div><h3 className="text-sm font-semibold text-white">Two-Factor Authentication</h3><p className="text-xs text-[#9CA3AF] mt-0.5">Add extra security to your account</p></div>
                  <button className="px-4 py-2 border border-[#2D1F50] text-[#9CA3AF] rounded-lg text-sm hover:text-white">Enable 2FA</button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white mb-3">Active Sessions</h3>
                {[{ device: 'Chrome on MacOS', ip: '192.168.1.1', time: 'Current session' }, { device: 'Safari on iPhone', ip: '192.168.1.5', time: '2 hours ago' }].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg mb-2">
                    <div><p className="text-sm text-white">{s.device}</p><p className="text-xs text-[#9CA3AF]">{s.ip} · {s.time}</p></div>
                    {idx > 0 && <button className="text-xs text-red-400 hover:text-red-300">Revoke</button>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
