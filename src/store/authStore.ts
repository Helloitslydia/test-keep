import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  firstName: string;
  email: string;
  organizationId?: string;
  organizationName?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        set({ 
          user: { 
            id: data.user.id,
            firstName: email.split('@')[0],
            email: data.user.email || email,
            organizationId: data.user.user_metadata.organization_id,
            organizationName: data.user.user_metadata.organization_name
          }, 
          isAuthenticated: true 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
}));