import { useState } from 'react';
import { Plus, Send, Clock, CheckCircle2, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const campaigns = [
  { id: '1', name: 'Win Back Churned', segment: 'Churned (60+ days)', channel: 'SMS', status: 'SENT', sent: 45, deliveryRate: 92, date: 'Mar 25, 2026' },
  { id: '2', name: 'VIP Exclusive Deal', segment: 'VIP Customers', channel: 'SMS', status: 'SENT', sent: 12, deliveryRate: 100, date: 'Mar 22, 2026' },
  { id: '3', name: 'New Menu Launch', segment: 'All Customers', channel: 'SMS', status: 'SCHEDULED', sent: 0, deliveryRate: 0, date: 'Mar 31, 2026' },
  { id: '4', name: 'Weekend Special', segment: 'Regular + VIP', channel: 'Push', status: 'DRAFT', sent: 0, deliveryRate: 0, date: '' },
];

const statusConfig: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  SCHEDULED: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  SENT: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
};

export default function CampaignsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/customers" className="p-2 rounded-lg hover:bg-[#1A1030] text-[#9CA3AF] hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold font-[Syne] text-white flex-1">Campaigns</h1>
        <button onClick={() => { setShowCreate(true); setStep(1); }} className="flex items-center gap-2 px-4 py-2 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Create Campaign
        </button>
      </div>

      <div className="bg-[#1A1030] border border-[#2D1F50] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-[#2D1F50]">
            {['Campaign', 'Segment', 'Channel', 'Status', 'Sent', 'Delivery Rate', 'Date'].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {campaigns.map((c, idx) => {
              const status = statusConfig[c.status];
              return (
                <tr key={c.id} className={`border-b border-[#2D1F50]/50 hover:bg-[#4B1FA8]/5 ${idx % 2 === 0 ? 'bg-[#0F0A1E]/30' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-white">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-[#9CA3AF]">{c.segment}</td>
                  <td className="px-4 py-3 text-sm text-[#9CA3AF]">{c.channel}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>{c.status}</span></td>
                  <td className="px-4 py-3 text-sm text-white">{c.sent || '—'}</td>
                  <td className="px-4 py-3 text-sm">{c.deliveryRate > 0 ? <span className="text-emerald-400">{c.deliveryRate}%</span> : <span className="text-[#4B5563]">—</span>}</td>
                  <td className="px-4 py-3 text-sm text-[#9CA3AF]">{c.date || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Campaign Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1030] border border-[#2D1F50] rounded-2xl w-full max-w-lg p-6 mx-4">
            <h3 className="text-lg font-bold font-[Syne] text-white mb-1">Create Campaign</h3>
            <p className="text-xs text-[#9CA3AF] mb-6">Step {step} of 3</p>
            <div className="flex gap-1 mb-6">{[1, 2, 3].map((s) => <div key={s} className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-[#4B1FA8]' : 'bg-[#2D1F50]'}`} />)}</div>

            {step === 1 && (
              <div className="space-y-4">
                <div><label className="text-xs text-[#9CA3AF] mb-1 block">Campaign Name</label><input className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" placeholder="e.g., Win Back Churned" /></div>
                <div><label className="text-xs text-[#9CA3AF] mb-1 block">Target Segment</label>
                  <select className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]">
                    <option>All Customers</option><option>VIP Customers</option><option>Regular Customers</option><option>Churned (60+ days)</option><option>New Customers</option><option>Custom Segment...</option>
                  </select>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <div><label className="text-xs text-[#9CA3AF] mb-1 block">Channel</label>
                  <div className="flex gap-2">{['SMS', 'Push', 'Email'].map((ch) => <button key={ch} className="flex-1 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-[#9CA3AF] hover:border-[#4B1FA8] hover:text-white transition-colors">{ch}</button>)}</div>
                </div>
                <div><label className="text-xs text-[#9CA3AF] mb-1 block">Message</label><textarea className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8] h-24 resize-none" placeholder="We miss you at Burger Palace! Get 20% off your next order with code COMEBACK20. Order now!" /><p className="text-[10px] text-[#9CA3AF] mt-1">0/160 characters</p></div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <div><label className="text-xs text-[#9CA3AF] mb-1 block">Schedule</label>
                  <div className="flex gap-2"><button className="flex-1 py-2 bg-[#4B1FA8]/20 border border-[#4B1FA8]/30 rounded-lg text-sm text-[#D8B4FE]">Send Now</button><button className="flex-1 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-[#9CA3AF]">Schedule</button></div>
                </div>
                <div className="p-4 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg">
                  <p className="text-xs text-[#9CA3AF]">Summary:</p>
                  <p className="text-sm text-white mt-1">Sending SMS to ~45 customers</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">Estimated cost: Rs 135 (Rs 3/SMS)</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => step === 1 ? setShowCreate(false) : setStep(step - 1)} className="flex-1 py-2.5 border border-[#2D1F50] text-[#9CA3AF] rounded-lg text-sm">{step === 1 ? 'Cancel' : 'Back'}</button>
              <button onClick={() => step === 3 ? setShowCreate(false) : setStep(step + 1)} className="flex-1 py-2.5 bg-[#4B1FA8] text-white rounded-lg text-sm font-medium">{step === 3 ? 'Send Campaign' : 'Next'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
