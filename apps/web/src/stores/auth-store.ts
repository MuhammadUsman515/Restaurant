import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'manager' | 'cashier' | 'chef' | 'rider' | 'staff';
  avatar?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
}

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  branches: Branch[];
  token: string | null;
  isAuthenticated: boolean;

  login: (user: User, tenant: Tenant, branches: Branch[], token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tenant: null,
      branches: [],
      token: null,
      isAuthenticated: false,

      login: (user, tenant, branches, token) =>
        set({
          user,
          tenant,
          branches,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          tenant: null,
          branches: [],
          token: null,
          isAuthenticated: false,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
