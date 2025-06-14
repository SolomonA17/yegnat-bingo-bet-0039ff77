
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (phoneNumber: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (phoneNumber: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (phoneNumber: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (phoneNumber: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      phone: phoneNumber,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
        }
      }
    });

    return { error };
  };

  const signIn = async (phoneNumber: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      phone: phoneNumber,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (phoneNumber: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(phoneNumber, {
      redirectTo: `${window.location.origin}/auth?reset=true`,
    });

    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
