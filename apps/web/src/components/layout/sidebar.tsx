import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BookOpen,
  Package,
  Factory,
  Building2,
  ShoppingBag,
  MapPin,
  Bike,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[];
  children?: { label: string; path: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    path: '/dashboard',
  },
  {
    label: 'Orders',
    icon: <ShoppingCart size={20} />,
    path: '/orders',
  },
  {
    label: 'POS',
    icon: <Monitor size={20} />,
    path: '/pos',
    roles: ['owner', 'manager', 'cashier'],
  },
  {
    label: 'KDS',
    icon: <ChefHat size={20} />,
    path: '/kds',
    roles: ['owner', 'manager', 'chef'],
  },
  {
    label: 'Delivery',
    icon: <Truck size={20} />,
    path: '/delivery',
    roles: ['owner', 'manager'],
    children: [
      { label: 'Overview', path: '/delivery', icon: <MapPin size={16} /> },
      { label: 'Riders', path: '/delivery/riders', icon: <Bike size={16} /> },
      { label: 'Zones', path: '/delivery/zones', icon: <MapPin size={16} /> },
    ],
  },
  {
    label: 'Production',
    icon: <Factory size={20} />,
    path: '/production',
    roles: ['owner', 'manager', 'chef'],
    children: [
      { label: 'Recipes & BOM', path: '/production/recipes', icon: <BookOpen size={16} /> },
      { label: 'Raw Materials', path: '/production/inventory', icon: <Package size={16} /> },
      { label: 'Production Orders', path: '/production/orders', icon: <Factory size={16} /> },
      { label: 'Central Kitchen', path: '/production/central-kitchen', icon: <Building2 size={16} /> },
      { label: 'Suppliers', path: '/production/suppliers', icon: <ShoppingBag size={16} /> },
      { label: 'Purchase Orders', path: '/production/purchase-orders', icon: <ShoppingCart size={16} /> },
    ],
  },
  {
    label: 'Menu',
    icon: <UtensilsCrossed size={20} />,
    path: '/menu',
    roles: ['owner', 'manager'],
  },
  {
    label: 'Customers',
    icon: <Users size={20} />,
    path: '/customers',
    roles: ['owner', 'manager'],
  },
  {
    label: 'Loyalty',
    icon: <Heart size={20} />,
    path: '/loyalty',
    roles: ['owner', 'manager'],
  },
  {
    label: 'Analytics',
    icon: <BarChart3 size={20} />,
    path: '/analytics',
    roles: ['owner', 'manager'],
  },
  {
    label: 'Staff',
    icon: <UserCog size={20} />,
    path: '/staff',
    roles: ['owner', 'manager'],
  },
  {
    label: 'Settings',
    icon: <Settings size={20} />,
    path: '/settings',
    roles: ['owner'],
  },
];

function NavItemComponent({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (collapsed) {
    return (
      <NavLink
        to={hasChildren ? item.children![0].path : item.path}
        className={({ isActive }) =>
          cn(
            'relative flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition-all duration-200 group',
            isActive
              ? 'bg-primary/20 text-white'
              : 'text-muted hover:text-white hover:bg-white/5'
          )
        }
        title={item.label}
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[7px] w-[3px] h-5 bg-primary rounded-r-full" />
            )}
            {item.icon}
          </>
        )}
      </NavLink>
    );
  }

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
            expanded
              ? 'text-white bg-white/5'
              : 'text-muted hover:text-white hover:bg-white/5'
          )}
        >
          <span className="shrink-0">{item.icon}</span>
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            size={14}
            className={cn(
              'transition-transform duration-200',
              expanded && 'rotate-180'
            )}
          />
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-5 mt-1 space-y-0.5 border-l border-border pl-3">
                {item.children!.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    end
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                        isActive
                          ? 'text-white bg-primary/15 font-medium'
                          : 'text-muted hover:text-white hover:bg-white/5'
                      )
                    }
                  >
                    {child.icon}
                    {child.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-primary/20 text-white'
            : 'text-muted hover:text-white hover:bg-white/5'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
          )}
          <span className="shrink-0">{item.icon}</span>
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const userRole = user?.role ?? 'owner';

  const filteredItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <motion.aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-dark-bg border-r border-border',
        'hidden lg:flex'
      )}
      animate={{ width: sidebarCollapsed ? 64 : 260 }}
      transition={{ duration: 0.2 }}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center h-16 border-b border-border shrink-0',
          sidebarCollapsed ? 'justify-center px-2' : 'px-5'
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <UtensilsCrossed size={16} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-heading text-lg font-bold text-white"
            >
              RestroFlow
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn('flex-1 overflow-y-auto py-4 space-y-1', sidebarCollapsed ? 'px-2' : 'px-3')}>
        {filteredItems.map((item) => (
          <NavItemComponent
            key={item.path}
            item={item}
            collapsed={sidebarCollapsed}
          />
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-2">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors text-sm"
        >
          {sidebarCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* User section */}
      <div
        className={cn(
          'border-t border-border p-3 shrink-0',
          sidebarCollapsed && 'flex justify-center'
        )}
      >
        {sidebarCollapsed ? (
          <Avatar
            name={user?.name ?? 'User'}
            src={user?.avatar}
            size="sm"
          />
        ) : (
          <div className="flex items-center gap-3">
            <Avatar
              name={user?.name ?? 'User'}
              src={user?.avatar}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name ?? 'Demo User'}
              </p>
              <p className="text-xs text-muted truncate capitalize">
                {user?.role ?? 'Owner'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
