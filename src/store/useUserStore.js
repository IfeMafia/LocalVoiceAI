import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create()(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ 
        user, 
        role: user?.role || null, 
        isAuthenticated: !!user 
      }),
      
      clearUser: () => set({ 
        user: null, 
        role: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'voxy-user-storage',
    }
  )
);
