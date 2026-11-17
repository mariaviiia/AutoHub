'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { updateUser } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error during auth callback:', error);
        router.push('/login?error=auth_failed');
        return;
      }

      if (data.session) {
        // Check if user profile exists, create if not
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (!profile) {
          // Create profile for OAuth users
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.session.user.id,
            name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || '',
            email: data.session.user.email || '',
            phone: data.session.user.user_metadata?.phone || '',
            role: 'buyer',
            created_at: new Date().toISOString(),
          });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          }
        }

        // Fetch the profile again (in case it was just created)
        const { data: finalProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        // Update the auth store with user data and set authenticated state
        const userData = {
          id: data.session.user.id,
          name: finalProfile?.name || data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || '',
          email: data.session.user.email || '',
          phone: finalProfile?.phone || data.session.user.user_metadata?.phone || '',
          role: finalProfile?.role || 'buyer',
          created_at: new Date(data.session.user.created_at),
        };
        updateUser(userData);

        // Set isAuthenticated to true
        useAuthStore.setState({ isAuthenticated: true, user: userData });

        router.push('/');
      } else {
        router.push('/login');
      }
    };

    handleAuthCallback();
  }, [router, updateUser]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gold)] mx-auto mb-4"></div>
        <p className="text-white">Procesando autenticación...</p>
      </div>
    </div>
  );
}
