import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Ingredient {
  id: string;
  name: string;
  qty: number;
  unit: string;
  wastePercent: number;
  costPerUnit: number;
}

const initialIngredients: Ingredient[] = [
  { id: '1', name: 'Beef Patty', qty: 150, unit: 'g', wastePercent: 5, costPerUnit: 3.2 },
  { id: '2', name: 'Burger Bun', qty: 1, unit: 'pc', wastePercent: 2, costPerUnit: 30 },
  { id: '3', name: 'Lettuce', qty: 30, unit: 'g', wastePercent: 10, costPerUnit: 0.5 },
  { id: '4', name: 'Tomato Slices', qty: 40, unit: 'g', wastePercent: 8, costPerUnit: 0.3 },
  { id: '5', name: 'Cheese Slice', qty: 1, unit: 'pc', wastePercent: 0, costPerUnit: 45 },
  { id: '6', name: 'BBQ Sauce', qty: 15, unit: 'ml', wastePercent: 0, costPerUnit: 0.8 },
  { id: '7', name: 'Onion Rings', qty: 20, unit: 'g', wastePercent: 5, costPerUnit: 0.6 },
];

export default function RecipeDetailPage() {
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [recipeName] = useState('Classic Burger');
  const [overheadPercent] = useState(15);

  const addIngredient = () => {
    setIngredients([...ingredients, { id: String(Date.now()), name: '', qty: 0, unit: 'g', wastePercent: 0, costPerUnit: 0 }]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((i) => i.id !== id));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(ingredients.map((i) => i.id === id ? { ...i, [field]: value } : i));
  };

  const totalRawCost = ingredients.reduce((sum, i) => {
    const netQty = i.qty * (1 + i.wastePercent / 100);
    return sum + netQty * i.costPerUnit;
  }, 0);
  const overhead = totalRawCost * (overheadPercent / 100);
  const totalCost = totalRawCost + overhead;
  const suggestedPrice = totalCost * 3;
  const sellingPrice = 550;
  const margin = ((sellingPrice - totalCost) / sellingPrice) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/production/recipes" className="p-2 rounded-lg hover:bg-[#1A1030] text-[#9CA3AF] hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-[Syne] text-white">{recipeName}</h1>
          <p className="text-sm text-[#9CA3AF]">Recipe & Bill of Materials</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-lg text-sm font-medium transition-colors">
          <Save size={16} /> Save Recipe
        </button>
      </div>

      {/* Recipe Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4">
          <label className="text-xs text-[#9CA3AF] mb-1 block">Recipe Name</label>
          <input defaultValue="Classic Burger" className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" />
        </div>
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4">
          <label className="text-xs text-[#9CA3AF] mb-1 block">Category</label>
          <select className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]">
            <option>Burgers</option><option>Sides</option><option>Drinks</option><option>Desserts</option>
          </select>
        </div>
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4">
          <label className="text-xs text-[#9CA3AF] mb-1 block">Yield</label>
          <div className="flex gap-2">
            <input defaultValue="1" type="number" className="flex-1 px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]" />
            <select className="px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8]">
              <option>Portion</option><option>Kg</option><option>Pieces</option>
            </select>
          </div>
        </div>
      </div>

      {/* BOM Table */}
      <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#2D1F50] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Ingredient BOM</h3>
          <button onClick={addIngredient} className="flex items-center gap-1 px-3 py-1.5 bg-[#4B1FA8]/20 text-[#D8B4FE] rounded-lg text-xs hover:bg-[#4B1FA8]/30 transition-colors">
            <Plus size={12} /> Add Ingredient
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2D1F50]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">Ingredient</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">Qty</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">Unit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">Waste%</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">Net Qty</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">Cost/Unit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase">Total Cost</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, idx) => {
                const netQty = ing.qty * (1 + ing.wastePercent / 100);
                const totalCostItem = netQty * ing.costPerUnit;
                return (
                  <tr key={ing.id} className={`border-b border-[#2D1F50]/50 ${idx % 2 === 0 ? 'bg-[#0F0A1E]/30' : ''}`}>
                    <td className="px-4 py-2">
                      <input value={ing.name} onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)} className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-[#2D1F50] focus:border-[#4B1FA8] rounded text-sm text-white focus:outline-none" />
                    </td>
                    <td className="px-4 py-2">
                      <input type="number" value={ing.qty} onChange={(e) => updateIngredient(ing.id, 'qty', parseFloat(e.target.value) || 0)} className="w-20 px-2 py-1 bg-transparent border border-transparent hover:border-[#2D1F50] focus:border-[#4B1FA8] rounded text-sm text-white focus:outline-none text-right" />
                    </td>
                    <td className="px-4 py-2">
                      <select value={ing.unit} onChange={(e) => updateIngredient(ing.id, 'unit', e.target.value)} className="px-2 py-1 bg-transparent border border-transparent hover:border-[#2D1F50] focus:border-[#4B1FA8] rounded text-sm text-white focus:outline-none">
                        <option value="g">g</option><option value="kg">kg</option><option value="ml">ml</option><option value="L">L</option><option value="pc">pc</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input type="number" value={ing.wastePercent} onChange={(e) => updateIngredient(ing.id, 'wastePercent', parseFloat(e.target.value) || 0)} className="w-16 px-2 py-1 bg-transparent border border-transparent hover:border-[#2D1F50] focus:border-[#4B1FA8] rounded text-sm text-white focus:outline-none text-right" />
                    </td>
                    <td className="px-4 py-2 text-sm text-[#9CA3AF]">{netQty.toFixed(1)} {ing.unit}</td>
                    <td className="px-4 py-2">
                      <input type="number" value={ing.costPerUnit} onChange={(e) => updateIngredient(ing.id, 'costPerUnit', parseFloat(e.target.value) || 0)} className="w-20 px-2 py-1 bg-transparent border border-transparent hover:border-[#2D1F50] focus:border-[#4B1FA8] rounded text-sm text-white focus:outline-none text-right" step="0.1" />
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-[#F97316]">Rs {totalCostItem.toFixed(0)}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => removeIngredient(ing.id)} className="p-1 rounded hover:bg-red-500/10 text-[#9CA3AF] hover:text-red-400"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Cost Summary */}
        <div className="p-4 border-t border-[#2D1F50] bg-[#0F0A1E]/50">
          <div className="max-w-sm ml-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#9CA3AF]">Total Raw Material Cost</span>
              <span className="text-white font-medium">Rs {totalRawCost.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#9CA3AF]">Overhead ({overheadPercent}%)</span>
              <span className="text-white font-medium">Rs {overhead.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-[#2D1F50]">
              <span className="text-white font-semibold">Total Cost per Portion</span>
              <span className="text-white font-bold">Rs {totalCost.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#9CA3AF]">Suggested Price (3x)</span>
              <span className="text-[#9CA3AF]">Rs {suggestedPrice.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white">Current Selling Price</span>
              <span className="text-[#F97316] font-bold">Rs {sellingPrice}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-[#2D1F50]">
              <span className="text-white font-semibold">Gross Margin</span>
              <span className={`font-bold ${margin > 50 ? 'text-emerald-400' : margin > 30 ? 'text-amber-400' : 'text-red-400'}`}>
                {margin.toFixed(1)}% {margin > 50 ? '✓' : margin < 30 ? '!' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Method & Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4">
          <label className="text-xs text-[#9CA3AF] mb-2 block">Method / Instructions</label>
          <textarea defaultValue="1. Season and grill the beef patty for 4 minutes each side.&#10;2. Toast the bun lightly on the grill.&#10;3. Layer lettuce, tomato, patty, cheese, onion rings.&#10;4. Drizzle BBQ sauce. Serve hot." className="w-full px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-sm text-white focus:outline-none focus:border-[#4B1FA8] h-32 resize-none" />
        </div>
        <div className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4">
          <label className="text-xs text-[#9CA3AF] mb-2 block">Link to Menu Item</label>
          <div className="flex items-center gap-2 p-3 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg">
            <Link2 size={16} className="text-[#4B1FA8]" />
            <span className="text-sm text-white">Classic Burger — Rs 550</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Linked</span>
          </div>
          <div className="mt-4">
            <label className="text-xs text-[#9CA3AF] mb-2 block">Recipe Photo</label>
            <div className="h-20 border-2 border-dashed border-[#2D1F50] rounded-lg flex items-center justify-center text-xs text-[#9CA3AF] cursor-pointer hover:border-[#4B1FA8]/50">
              Click to upload
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
