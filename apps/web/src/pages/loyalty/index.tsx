import { Crown, Gift, Star, TrendingUp, Users } from 'lucide-react';

const topMembers = [
  { name: 'Saad Ahmed', points: 4500, tier: 'PLATINUM', orders: 45 },
  { name: 'Fatima Khan', points: 3200, tier: 'GOLD', orders: 32 },
  { name: 'Ahmed Raza', points: 2800, tier: 'GOLD', orders: 28 },
  { name: 'Sara Malik', points: 2100, tier: 'GOLD', orders: 22 },
  { name: 'Usman Ali', points: 1800, tier: 'GOLD', orders: 18 },
  { name: 'Ayesha Butt', points: 1500, tier: 'GOLD', orders: 15 },
  { name: 'Bilal Khan', points: 1200, tier: 'GOLD', orders: 12 },
  { name: 'Nadia Hussain', points: 800, tier: 'SILVER', orders: 8 },
];

const tierConfig = [
  { tier: 'Silver', range: '0-999 pts', earn: '1x', perks: ['Standard earn rate', 'Birthday SMS'], color: 'from-gray-500/20 to-gray-600/10', border: 'border-gray-500/30', text: 'text-gray-300', icon: '🥈' },
  { tier: 'Gold', range: '1,000-4,999 pts', earn: '1.5x', perks: ['1.5x earn rate', 'Priority support', 'Exclusive offers'], color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: '🥇' },
  { tier: 'Platinum', range: '5,000+ pts', earn: '2x', perks: ['2x earn rate', 'Free delivery', 'Birthday reward', 'Early access'], color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: '💎' },
];

const recentTransactions = [
  { customer: 'Saad Ahmed', type: 'EARNED', points: 150, description: 'Order #1084', time: '2 hours ago' },
  { customer: 'Fatima Khan', type: 'REDEEMED', points: -500, description: 'Rs 250 discount applied', time: '3 hours ago' },
  { customer: 'Ahmed Raza', type: 'EARNED', points: 85, description: 'Order #1080', time: '5 hours ago' },
  { customer: 'Sara Malik', type: 'BONUS', points: 200, description: 'Birthday bonus', time: '1 day ago' },
  { customer: 'Bilal Khan', type: 'EARNED', points: 120, description: 'Order #1076', time: '1 day ago' },
];

const tierColors: Record<string, string> = { SILVER: 'text-gray-400', GOLD: 'text-amber-400', PLATINUM: 'text-purple-400' };
const txTypeColors: Record<string, string> = { EARNED: 'text-emerald-400', REDEEMED: 'text-red-400', BONUS: 'text-purple-400', EXPIRED: 'text-gray-400' };

export default function LoyaltyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[Syne] text-white">Loyalty Program</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Members', value: '230', icon: Users, color: 'blue' },
          { label: 'Points Issued MTD', value: '45,000', icon: Star, color: 'amber' },
          { label: 'Points Redeemed MTD', value: '12,000', icon: Gift, color: 'purple' },
          { label: 'Redemption Rate', value: '26.7%', icon: TrendingUp, color: 'emerald' },
        ].map((s) => (
          <div key={s.label} className={`bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4 border-l-4 border-l-${s.color}-500`}>
            <s.icon size={18} className="text-[#9CA3AF] mb-2" />
            <p className="text-xs text-[#9CA3AF]">{s.label}</p>
            <p className="text-2xl font-bold font-[Syne] text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Configuration */}
      <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Program Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Earn Rate', value: 'Rs 100 = 10 pts' },
            { label: 'Redemption', value: '100 pts = Rs 50' },
            { label: 'Min to Redeem', value: '200 points' },
            { label: 'Point Expiry', value: '365 days' },
          ].map((c) => (
            <div key={c.label} className="p-3 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg">
              <p className="text-xs text-[#9CA3AF]">{c.label}</p>
              <p className="text-sm font-medium text-white mt-1">{c.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tierConfig.map((t) => (
          <div key={t.tier} className={`bg-gradient-to-br ${t.color} border ${t.border} rounded-xl p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <h3 className={`text-sm font-semibold ${t.text}`}>{t.tier}</h3>
                <p className="text-xs text-[#9CA3AF]">{t.range}</p>
              </div>
              <span className={`ml-auto text-lg font-bold ${t.text}`}>{t.earn}</span>
            </div>
            <div className="space-y-1">
              {t.perks.map((p) => (
                <p key={p} className="text-xs text-[#D1D5DB] flex items-center gap-1">
                  <span className="text-emerald-400">✓</span> {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Members */}
        <div className="bg-[#1A1030] border border-[#2D1F50] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#2D1F50]"><h3 className="text-sm font-semibold text-white">Top Loyalty Members</h3></div>
          <table className="w-full">
            <thead><tr className="border-b border-[#2D1F50]">
              {['Member', 'Points', 'Tier', 'Orders'].map((h) => <th key={h} className="text-left px-4 py-2 text-xs text-[#9CA3AF] uppercase">{h}</th>)}
            </tr></thead>
            <tbody>
              {topMembers.map((m, idx) => (
                <tr key={m.name} className={`border-b border-[#2D1F50]/50 ${idx % 2 === 0 ? 'bg-[#0F0A1E]/30' : ''}`}>
                  <td className="px-4 py-2 text-sm text-white">{m.name}</td>
                  <td className="px-4 py-2 text-sm font-medium text-[#F97316]">{m.points.toLocaleString()}</td>
                  <td className="px-4 py-2"><span className={`text-xs flex items-center gap-1 ${tierColors[m.tier]}`}><Crown size={10} />{m.tier}</span></td>
                  <td className="px-4 py-2 text-sm text-[#9CA3AF]">{m.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#1A1030] border border-[#2D1F50] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#2D1F50]"><h3 className="text-sm font-semibold text-white">Recent Transactions</h3></div>
          <div className="divide-y divide-[#2D1F50]/50">
            {recentTransactions.map((tx, idx) => (
              <div key={idx} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{tx.customer}</p>
                  <p className="text-xs text-[#9CA3AF]">{tx.description} · {tx.time}</p>
                </div>
                <span className={`text-sm font-medium ${txTypeColors[tx.type]}`}>
                  {tx.points > 0 ? '+' : ''}{tx.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
