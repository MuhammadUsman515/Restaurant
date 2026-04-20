import { useState } from 'react';
import { Plus, Grid3X3, List, Search, Edit2, Trash2, GripVertical, ToggleLeft, ToggleRight, X } from 'lucide-react';

const mockCategories = [
  { id: '1', name: 'Burgers', itemCount: 8, emoji: '🍔' },
  { id: '2', name: 'Sides', itemCount: 4, emoji: '🍟' },
  { id: '3', name: 'Drinks', itemCount: 4, emoji: '🥤' },
  { id: '4', name: 'Desserts', itemCount: 2, emoji: '🍨' },
  { id: '5', name: 'Deals', itemCount: 2, emoji: '🎉' },
];

const mockItems = [
  { id: '1', name: 'Classic Burger', category: 'Burgers', price: 550, variants: ['Regular', 'Large'], isAvailable: true, tags: ['Bestseller'] },
  { id: '2', name: 'Zinger Burger', category: 'Burgers', price: 650, variants: ['Regular', 'Large'], isAvailable: true, tags: ['Bestseller', 'Spicy'] },
  { id: '3', name: 'Double Patty', category: 'Burgers', price: 850, variants: [], isAvailable: true, tags: [] },
  { id: '4', name: 'Chicken Shawarma', category: 'Burgers', price: 450, variants: ['Half', 'Full'], isAvailable: true, tags: ['New'] },
  { id: '5', name: 'BBQ Burger', category: 'Burgers', price: 750, variants: [], isAvailable: true, tags: ['Spicy'] },
  { id: '6', name: 'Smash Burger', category: 'Burgers', price: 600, variants: [], isAvailable: false, tags: [] },
  { id: '7', name: 'Mushroom Swiss', category: 'Burgers', price: 700, variants: [], isAvailable: true, tags: [] },
  { id: '8', name: 'Spicy Crunch', category: 'Burgers', price: 620, variants: [], isAvailable: true, tags: ['Spicy'] },
  { id: '9', name: 'Regular Fries', category: 'Sides', price: 200, variants: ['Small', 'Large'], isAvailable: true, tags: [] },
  { id: '10', name: 'Loaded Fries', category: 'Sides', price: 350, variants: [], isAvailable: true, tags: ['Bestseller'] },
  { id: '11', name: 'Coleslaw', category: 'Sides', price: 150, variants: [], isAvailable: true, tags: [] },
  { id: '12', name: 'Onion Rings', category: 'Sides', price: 250, variants: [], isAvailable: true, tags: [] },
  { id: '13', name: 'Pepsi', category: 'Drinks', price: 100, variants: ['Regular', '1.5L'], isAvailable: true, tags: [] },
  { id: '14', name: '7UP', category: 'Drinks', price: 100, variants: ['Regular', '1.5L'], isAvailable: true, tags: [] },
  { id: '15', name: 'Fresh Lime', category: 'Drinks', price: 150, variants: [], isAvailable: true, tags: [] },
  { id: '16', name: 'Mango Shake', category: 'Drinks', price: 250, variants: [], isAvailable: true, tags: ['New'] },
  { id: '17', name: 'Chocolate Brownie', category: 'Desserts', price: 300, variants: [], isAvailable: true, tags: [] },
  { id: '18', name: 'Ice Cream Sundae', category: 'Desserts', price: 350, variants: [], isAvailable: false, tags: [] },
  { id: '19', name: 'Family Deal', category: 'Deals', price: 2500, variants: [], isAvailable: true, tags: ['Bestseller'] },
  { id: '20', name: 'Buddy Deal', category: 'Deals', price: 1200, variants: [], isAvailable: true, tags: [] },
];

const mockModifiers = [
  { id: '1', name: 'Size', required: true, min: 1, max: 1, items: [{ name: 'Small', price: 0 }, { name: 'Medium', price: 100 }, { name: 'Large', price: 200 }] },
  { id: '2', name: 'Extra Toppings', required: false, min: 0, max: 3, items: [{ name: 'Extra Cheese', price: 80 }, { name: 'Jalapenos', price: 50 }, { name: 'Bacon', price: 120 }, { name: 'Egg', price: 60 }] },
  { id: '3', name: 'Sauces', required: false, min: 0, max: 2, items: [{ name: 'Ketchup', price: 0 }, { name: 'Mayo', price: 0 }, { name: 'BBQ', price: 30 }, { name: 'Garlic Mayo', price: 30 }] },
  { id: '4', name: 'Add-ons', required: false, min: 0, max: 5, items: [{ name: 'Fries', price: 150 }, { name: 'Drink', price: 80 }, { name: 'Coleslaw', price: 100 }] },
];

const tagColors: Record<string, string> = {
  Bestseller: 'bg-amber-500/20 text-amber-400',
  Spicy: 'bg-red-500/20 text-red-400',
  New: 'bg-emerald-500/20 text-emerald-400',
  Vegan: 'bg-green-500/20 text-green-400',
};

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'items' | 'modifiers'>('items');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddItem, setShowAddItem] = useState(false);

  const filteredItems = mockItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'All' || item.category === filterCategory;
    return matchSearch && matchCat;
  });

  const tabs = [
    { id: 'categories' as const, label: 'Categories', count: mockCategories.length },
    { id: 'items' as const, label: 'Items', count: mockItems.length },
    { id: 'modifiers' as const, label: 'Modifiers', count: mockModifiers.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[Syne] text-white">Menu Management</h1>
        <button onClick={() => setShowAddItem(true)} className="flex items-center gap-2 px-4 py-2 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1A1030] rounded-lg p-1 w-fit border border-[#2D1F50]">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-[#4B1FA8] text-white' : 'text-[#9CA3AF] hover:text-white'}`}>
            {tab.label} <span className="text-xs opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {mockCategories.map((cat) => (
            <div key={cat.id} className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-5 hover:border-[#4B1FA8]/50 transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-3xl mb-2 block">{cat.emoji}</span>
                  <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                  <p className="text-xs text-[#9CA3AF] mt-1">{cat.itemCount} items</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-md hover:bg-[#2D1F50] text-[#9CA3AF] hover:text-white"><Edit2 size={12} /></button>
                  <button className="p-1.5 rounded-md hover:bg-red-500/10 text-[#9CA3AF] hover:text-red-400"><Trash2 size={12} /></button>
                </div>
              </div>
              <GripVertical size={14} className="text-[#2D1F50] mt-3 cursor-grab" />
            </div>
          ))}
          <button className="border-2 border-dashed border-[#2D1F50] rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-[#9CA3AF] hover:text-white hover:border-[#4B1FA8]/50 transition-all">
            <Plus size={20} />
            <span className="text-xs">Add Category</span>
          </button>
        </div>
      )}

      {/* Items Tab */}
      {activeTab === 'items' && (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input type="text" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-[#1A1030] border border-[#2D1F50] rounded-lg text-sm text-white placeholder-[#4B5563] focus:outline-none focus:border-[#4B1FA8]" />
            </div>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 bg-[#1A1030] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]">
              <option value="All">All Categories</option>
              {mockCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <div className="flex gap-1 bg-[#1A1030] rounded-lg p-1 border border-[#2D1F50]">
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#4B1FA8] text-white' : 'text-[#9CA3AF]'}`}><List size={16} /></button>
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#4B1FA8] text-white' : 'text-[#9CA3AF]'}`}><Grid3X3 size={16} /></button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="bg-[#1A1030] border border-[#2D1F50] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2D1F50]">
                    <th className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">Item</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">Price</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">Variants</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">Tags</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, idx) => (
                    <tr key={item.id} className={`border-b border-[#2D1F50]/50 hover:bg-[#4B1FA8]/5 transition-colors ${idx % 2 === 0 ? 'bg-[#0F0A1E]/30' : ''}`}>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-white">{item.name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#9CA3AF]">{item.category}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#F97316]">Rs {item.price}</td>
                      <td className="px-4 py-3 text-sm text-[#9CA3AF]">{item.variants.length > 0 ? item.variants.join(', ') : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">{item.tags.map((t) => <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full ${tagColors[t] || 'bg-[#2D1F50] text-[#9CA3AF]'}`}>{t}</span>)}</div>
                      </td>
                      <td className="px-4 py-3">
                        {item.isAvailable ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400"><ToggleRight size={16} /> Available</span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-400"><ToggleLeft size={16} /> Unavailable</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end">
                          <button className="p-1.5 rounded-md hover:bg-[#2D1F50] text-[#9CA3AF] hover:text-white"><Edit2 size={14} /></button>
                          <button className="p-1.5 rounded-md hover:bg-red-500/10 text-[#9CA3AF] hover:text-red-400"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4 hover:border-[#4B1FA8]/50 transition-all group">
                  <div className="h-24 bg-[#0F0A1E] rounded-lg mb-3 flex items-center justify-center text-4xl">
                    {item.category === 'Burgers' ? '🍔' : item.category === 'Sides' ? '🍟' : item.category === 'Drinks' ? '🥤' : item.category === 'Desserts' ? '🍨' : '🎉'}
                  </div>
                  <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
                  <p className="text-sm font-bold text-[#F97316] mt-1">Rs {item.price}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">{item.tags.slice(0, 1).map((t) => <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded-full ${tagColors[t]}`}>{t}</span>)}</div>
                    <span className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modifiers Tab */}
      {activeTab === 'modifiers' && (
        <div className="space-y-4">
          {mockModifiers.map((group) => (
            <div key={group.id} className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">{group.name}</h3>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{group.required ? 'Required' : 'Optional'} · Min {group.min} · Max {group.max}</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-md hover:bg-[#2D1F50] text-[#9CA3AF] hover:text-white"><Edit2 size={14} /></button>
                  <button className="p-1.5 rounded-md hover:bg-red-500/10 text-[#9CA3AF] hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-xs text-white">
                    {item.name} {item.price > 0 && <span className="text-[#F97316]">+Rs {item.price}</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <button className="w-full border-2 border-dashed border-[#2D1F50] rounded-xl p-4 flex items-center justify-center gap-2 text-[#9CA3AF] hover:text-white hover:border-[#4B1FA8]/50 transition-all">
            <Plus size={16} /> Add Modifier Group
          </button>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1030] border border-[#2D1F50] rounded-2xl w-full max-w-lg p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-[Syne] text-white">Add Menu Item</h3>
              <button onClick={() => setShowAddItem(false)} className="text-[#9CA3AF] hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Item Name</label><input type="text" className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" placeholder="e.g., Classic Burger" /></div>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Category</label><select className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]"><option>Select category</option>{mockCategories.map((c) => <option key={c.id}>{c.name}</option>)}</select></div>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Description</label><textarea className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8] h-20 resize-none" placeholder="Describe the item..." /></div>
              <div><label className="text-xs text-[#9CA3AF] mb-1 block">Price (Rs)</label><input type="number" className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" placeholder="0" /></div>
              <div>
                <label className="text-xs text-[#9CA3AF] mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {['Spicy', 'Vegan', 'New', 'Bestseller'].map((tag) => (
                    <label key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-xs text-[#9CA3AF] cursor-pointer hover:border-[#4B1FA8] transition-colors">
                      <input type="checkbox" className="rounded" /> {tag}
                    </label>
                  ))}
                </div>
              </div>
              <div className="h-24 border-2 border-dashed border-[#2D1F50] rounded-lg flex items-center justify-center text-[#9CA3AF] text-xs cursor-pointer hover:border-[#4B1FA8]/50">Click to upload image</div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddItem(false)} className="flex-1 py-2.5 border border-[#2D1F50] text-[#9CA3AF] rounded-lg text-sm hover:bg-[#2D1F50] transition-colors">Cancel</button>
                <button className="flex-1 py-2.5 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-lg text-sm font-medium transition-colors">Save Item</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
