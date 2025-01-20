import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  firstName: string;
  email: string;
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      set({
        user: {
          id: data.user.id,
          firstName: data.user.user_metadata.first_name || '',
          email: data.user.email || '',
        },
        isAuthenticated: true,
      });
    }
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));