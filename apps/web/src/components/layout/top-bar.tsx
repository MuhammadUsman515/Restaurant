import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  UtensilsCrossed,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dropdown } from '@/components/ui/dropdown';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';

export function TopBar() {
  const { user, branches, logout } = useAuthStore();
  const {
    sidebarCollapsed,
    toggleSidebar,
    activeBranchId,
    setActiveBranch,
    notifications,
    setCommandPaletteOpen,
  } = useAppStore();
  const navigate = useNavigate();
  const [branchOpen, setBranchOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeBranch = branches.find((b) => b.id === activeBranchId) ?? branches[0];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center h-16 bg-dark-bg/80 backdrop-blur-xl border-b border-border px-4 lg:px-6'
      )}
    >
      {/* Mobile menu + logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <UtensilsCrossed size={14} className="text-white" />
          </div>
          <span className="font-heading text-base font-bold text-white">
            RestroFlow
          </span>
        </div>
      </div>

      {/* Branch selector */}
      <div className="flex-1 flex items-center justify-center lg:justify-start">
        {branches.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setBranchOpen(!branchOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-light hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="font-medium">
                {activeBranch?.name ?? 'Select Branch'}
              </span>
              <ChevronDown size={14} />
            </button>
            {branchOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setBranchOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1 z-50 w-64 rounded-xl bg-card-bg border border-border shadow-xl py-1">
                  {branches.map((branch) => (
                    <button
                      key={branch.id}
                      onClick={() => {
                        setActiveBranch(branch.id);
                        setBranchOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                        branch.id === activeBranchId
                          ? 'bg-primary/15 text-white'
                          : 'text-muted-light hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full',
                          branch.isActive ? 'bg-success' : 'bg-muted'
                        )}
                      />
                      <div className="text-left">
                        <p className="font-medium">{branch.name}</p>
                        <p className="text-xs text-muted">{branch.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Search trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-border text-sm text-muted hover:text-white hover:border-primary/40 transition-colors"
        >
          <Search size={14} />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden md:inline text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-border ml-4">
            Ctrl+K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors"
          onClick={() => navigate('/orders')}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User dropdown */}
        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-2 pl-2 ml-1 border-l border-border cursor-pointer">
              <Avatar
                name={user?.name ?? 'User'}
                src={user?.avatar}
                size="sm"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white leading-tight">
                  {user?.name ?? 'Demo User'}
                </p>
                <p className="text-xs text-muted capitalize leading-tight">
                  {user?.role ?? 'Owner'}
                </p>
              </div>
            </div>
          }
          items={[
            {
              label: 'Profile',
              icon: <User size={16} />,
              onClick: () => navigate('/settings'),
            },
            {
              label: 'Settings',
              icon: <Settings size={16} />,
              onClick: () => navigate('/settings'),
            },
            {
              label: 'Logout',
              icon: <LogOut size={16} />,
              onClick: handleLogout,
              danger: true,
              divider: true,
            },
          ]}
        />
      </div>
    </header>
  );
}
