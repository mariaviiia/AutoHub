import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { Solitreo } from 'next/font/google';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithFacebook: () => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, phone: string, role: 'buyer' | 'dealer') => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          // Fetch user profile from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const userData: User = {
            id: data.user.id,
            name: profile?.name || data.user.email?.split('@')[0] || '',
            email: data.user.email || '',
            phone: profile?.phone || '',
            role: profile?.role || 'buyer',
            created_at: new Date(data.user.created_at),
          };

          set({ user: userData, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Error al iniciar sesión' };
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          // Don't set isAuthenticated here - it will be set in the callback
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Error al iniciar sesión con Google' };
        }
      },

      loginWithFacebook: async () => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Error al iniciar sesión con Facebook' };
        }
      },

      register: async (email: string, password: string, name: string, phone: string, role: 'buyer' | 'dealer') => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                phone,
                role,
              },
            },
          });

          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          if (data.user) {
            // Create profile in profiles table
            const { error: profileError } = await supabase.from('profiles').insert({
              id: data.user.id,
              name,
              email,
              phone,
              role,
              created_at: new Date().toISOString(),
            });

            if (profileError) {
              set({ isLoading: false });
              return { success: false, error: 'Error al crear perfil' };
            }

            const userData: User = {
              id: data.user.id,
              name,
              email,
              phone,
              role,
              created_at: new Date(data.user.created_at),
            };

            set({ user: userData, isAuthenticated: true, isLoading: false });
            return { success: true };
          }

          set({ isLoading: false });
          return { success: false, error: 'Error al registrar usuario' };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Error al registrar usuario' };
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      checkSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('checkSession - session:', session);
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          console.log('checkSession - profile:', profile);

          const userData: User = {
            id: session.user.id,
            name: profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            phone: profile?.phone || '',
            role: profile?.role || 'buyer',
            created_at: new Date(session.user.created_at),
          };

          console.log('checkSession - setting user:', userData);
          set({ user: userData, isAuthenticated: true });
        } else {
          console.log('checkSession - no session found');
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
