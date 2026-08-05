// ============================================================
// Auth Store — Zustand
// ============================================================
import { create } from 'zustand';
import { User } from 'firebase/auth';
import { AdminUser } from '@/types';

interface AuthState {
  user: User | null;
  adminUser: AdminUser | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setAdminUser: (adminUser: AdminUser | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  adminUser: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user }),
  setAdminUser: (adminUser) => set({ adminUser }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  reset: () => set({ user: null, adminUser: null, loading: false }),
}));
