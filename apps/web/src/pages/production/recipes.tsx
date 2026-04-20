import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  ChefHat,
  Eye,
  Edit2,
  Copy,
  Trash2,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Package,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dropdown } from '@/components/ui/dropdown';

interface Recipe {
  id: string;
  name: string;
  category: string;
  yield: number;
  yieldUnit: string;
  costPerUnit: number;
  sellingPrice: number;
  marginPercent: number;
  status: 'active' | 'draft' | 'discontinued';
  linkedMenu: boolean;
  ingredients: number;
  lastUpdated: string;
}

const mockRecipes: Recipe[] = [
  {
    id: 'RCP-001',
    name: 'Classic Burger',
    category: 'Burgers',
    yield: 1,
    yieldUnit: 'piece',
    costPerUnit: 185,
    sellingPrice: 450,
    marginPercent: 58.9,
    status: 'active',
    linkedMenu: true,
    ingredients: 7,
    lastUpdated: '2026-03-28',
  },
  {
    id: 'RCP-002',
    name: 'Zinger Burger',
    category: 'Burgers',
    yield: 1,
    yieldUnit: 'piece',
    costPerUnit: 210,
    sellingPrice: 520,
    marginPercent: 59.6,
    status: 'active',
    linkedMenu: true,
    ingredients: 8,
    lastUpdated: '2026-03-27',
  },
  {
    id: 'RCP-003',
    name: 'BBQ Chicken Pizza',
    category: 'Pizzas',
    yield: 1,
    yieldUnit: 'piece',
    costPerUnit: 320,
    sellingPrice: 850,
    marginPercent: 62.4,
    status: 'active',
    linkedMenu: true,
    ingredients: 10,
    lastUpdated: '2026-03-26',
  },
  {
    id: 'RCP-004',
    name: 'Chicken Shawarma',
    category: 'Wraps',
    yield: 1,
    yieldUnit: 'piece',
    costPerUnit: 145,
    sellingPrice: 350,
    marginPercent: 58.6,
    status: 'active',
    linkedMenu: true,
    ingredients: 9,
    lastUpdated: '2026-03-25',
  },
  {
    id: 'RCP-005',
    name: 'Loaded Fries',
    category: 'Sides',
    yield: 1,
    yieldUnit: 'portion',
    costPerUnit: 120,
    sellingPrice: 280,
    marginPercent: 57.1,
    status: 'draft',
    linkedMenu: false,
    ingredients: 6,
    lastUpdated: '2026-03-24',
  },
];

const categories = ['All', 'Burgers', 'Pizzas', 'Wraps', 'Sides', 'Beverages'];

function getMarginColor(margin: number): string {
  if (margin >= 50) return 'text-emerald-400';
  if (margin >= 30) return 'text-amber-400';
  return 'text-red-400';
}

function getMarginBadge(margin: number): 'success' | 'warning' | 'danger' {
  if (margin >= 50) return 'success';
  if (margin >= 30) return 'warning';
  return 'danger';
}

export default function RecipesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredRecipes = mockRecipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalRecipes = mockRecipes.length;
  const activeRecipes = mockRecipes.filter((r) => r.status === 'active').length;
  const avgMargin = mockRecipes.reduce((sum, r) => sum + r.marginPercent, 0) / mockRecipes.length;
  const lowMarginCount = mockRecipes.filter((r) => r.marginPercent < 30).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Recipe & BOM Management</h1>
          <p className="text-muted mt-1">Manage recipes, ingredients, and cost analysis</p>
        </div>
        <Button icon={<Plus size={16} />}>Add Recipe</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Recipes',
            value: totalRecipes,
            icon: ChefHat,
            color: 'text-violet-400',
            bg: 'bg-violet-500/10',
          },
          {
            label: 'Active Recipes',
            value: activeRecipes,
            icon: Package,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Avg. Margin',
            value: `${avgMargin.toFixed(1)}%`,
            icon: TrendingUp,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
          },
          {
            label: 'Low Margin Items',
            value: lowMarginCount,
            icon: AlertCircle,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card glass hover>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${card.bg}`}>
                  <card.icon size={22} className={card.color} />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">{card.label}</p>
                  <p className="text-2xl font-bold text-white mt-0.5">{card.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card glass>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-muted" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-white/5 text-muted-light hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Recipes Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card glass noPadding>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipe Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Yield</TableHead>
                <TableHead>Cost/Unit</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Margin %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipes.map((recipe, i) => (
                <motion.tr
                  key={recipe.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border/50 transition-colors hover:bg-white/[0.02]"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                        <ChefHat size={16} className="text-primary-light" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{recipe.name}</p>
                        <p className="text-xs text-muted">{recipe.ingredients} ingredients</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral" size="sm">{recipe.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-white">{recipe.yield} {recipe.yieldUnit}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-white font-mono">Rs {recipe.costPerUnit}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-white font-mono">Rs {recipe.sellingPrice}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={getMarginBadge(recipe.marginPercent)} dot>
                        {recipe.marginPercent.toFixed(1)}%
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={recipe.status === 'active' ? 'success' : recipe.status === 'draft' ? 'warning' : 'danger'}
                      dot
                    >
                      {recipe.status.charAt(0).toUpperCase() + recipe.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dropdown
                      trigger={
                        <button className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      }
                      align="right"
                      items={[
                        { label: 'View Details', icon: <Eye size={14} />, onClick: () => {} },
                        { label: 'Edit Recipe', icon: <Edit2 size={14} />, onClick: () => {} },
                        { label: 'Duplicate', icon: <Copy size={14} />, onClick: () => {} },
                        { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => {}, danger: true, divider: true },
                      ]}
                    />
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
          {filteredRecipes.length === 0 && (
            <div className="py-16 text-center">
              <ChefHat size={48} className="mx-auto text-muted/30 mb-4" />
              <p className="text-muted">No recipes found matching your search</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
