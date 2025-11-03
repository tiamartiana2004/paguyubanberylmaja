// contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode, FC } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseClient';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchUserProfile(session);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session) {
          await fetchUserProfile(session);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (session: Session) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, nama_lengkap, role')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error("Error fetching profile:", error);
      setUser(null);
      return;
    }

    if (profile) {
      setUser({
        id: session.user.id,
        username: profile.username || session.user.email || '',
        namaLengkap: profile.nama_lengkap,
        role: profile.role as 'ketua' | 'pengurus',
      });
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};