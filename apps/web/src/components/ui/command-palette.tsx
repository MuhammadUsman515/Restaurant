import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';
import {
  LayoutDashboard,
  ShoppingCart,
  Monitor,
  Truck,
  ChefHat,
  UtensilsCrossed,
  Users,
  Heart,
  BarChart3,
  UserCog,
  Settings,
  Package,
  Factory,
  BookOpen,
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  path: string;
  category: string;
}

const commands: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Overview & analytics', icon: <LayoutDashboard size={16} />, path: '/dashboard', category: 'Navigation' },
  { id: 'orders', label: 'Orders', description: 'Manage orders', icon: <ShoppingCart size={16} />, path: '/orders', category: 'Navigation' },
  { id: 'pos', label: 'Point of Sale', description: 'POS terminal', icon: <Monitor size={16} />, path: '/pos', category: 'Navigation' },
  { id: 'delivery', label: 'Delivery', description: 'Delivery management', icon: <Truck size={16} />, path: '/delivery', category: 'Navigation' },
  { id: 'riders', label: 'Delivery Riders', description: 'Manage riders', icon: <Truck size={16} />, path: '/delivery/riders', category: 'Navigation' },
  { id: 'recipes', label: 'Recipes & BOM', description: 'Production recipes', icon: <BookOpen size={16} />, path: '/production/recipes', category: 'Production' },
  { id: 'inventory', label: 'Raw Materials', description: 'Inventory management', icon: <Package size={16} />, path: '/production/inventory', category: 'Production' },
  { id: 'prod-orders', label: 'Production Orders', description: 'Manage production', icon: <Factory size={16} />, path: '/production/orders', category: 'Production' },
  { id: 'central-kitchen', label: 'Central Kitchen', description: 'Kitchen operations', icon: <ChefHat size={16} />, path: '/production/central-kitchen', category: 'Production' },
  { id: 'menu', label: 'Menu Management', description: 'Manage menu items', icon: <UtensilsCrossed size={16} />, path: '/menu', category: 'Navigation' },
  { id: 'customers', label: 'Customers & CRM', description: 'Customer management', icon: <Users size={16} />, path: '/customers', category: 'Navigation' },
  { id: 'loyalty', label: 'Loyalty Program', description: 'Rewards & points', icon: <Heart size={16} />, path: '/loyalty', category: 'Navigation' },
  { id: 'analytics', label: 'Analytics', description: 'Reports & insights', icon: <BarChart3 size={16} />, path: '/analytics', category: 'Navigation' },
  { id: 'staff', label: 'Staff Management', description: 'Manage employees', icon: <UserCog size={16} />, path: '/staff', category: 'Navigation' },
  { id: 'settings', label: 'Settings', description: 'App settings', icon: <Settings size={16} />, path: '/settings', category: 'Navigation' },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filtered.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filtered]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function handleSelect(item: CommandItem) {
    navigate(item.path);
    setCommandPaletteOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  }

  return createPortal(
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            className="relative w-full max-w-lg rounded-xl bg-card-bg border border-border shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search size={18} className="text-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search commands..."
                className="w-full h-12 bg-transparent text-sm text-white placeholder:text-muted/60 outline-none"
              />
              <kbd className="shrink-0 text-[10px] text-muted bg-white/5 px-1.5 py-0.5 rounded border border-border">
                ESC
              </kbd>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="py-6 text-center text-sm text-muted">
                  No results found.
                </p>
              )}
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <p className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted">
                    {category}
                  </p>
                  {items.map((item) => {
                    const flatIndex = filtered.indexOf(item);
                    const isSelected = flatIndex === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(flatIndex)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                          isSelected
                            ? 'bg-primary/15 text-white'
                            : 'text-muted-light hover:bg-white/5'
                        )}
                      >
                        <span className={cn(isSelected ? 'text-primary-light' : 'text-muted')}>
                          {item.icon}
                        </span>
                        <div className="flex-1 text-left">
                          <span className="font-medium">{item.label}</span>
                          {item.description && (
                            <span className="ml-2 text-xs text-muted">{item.description}</span>
                          )}
                        </div>
                        {isSelected && <ArrowRight size={14} className="text-primary-light" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
