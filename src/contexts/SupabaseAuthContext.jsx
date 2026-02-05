import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

// Initialize with safe default values to prevent destructuring errors
const defaultState = {
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  isSuperAdmin: false,
  unreadNotifCount: 0,
  setUnreadNotifCount: () => {},
  signOut: async () => {},
  signInWithEmail: async () => {},
  signUp: async () => {},
  updatePassword: async () => {},
  resetPasswordForEmail: async () => {},
  refreshProfile: async () => {},
  profile: null
};

const AuthContext = createContext(defaultState);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context || defaultState;
};

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching profile:', error.message);
      }
      
      if (data) {
        setProfile(data);
        const role = data.role || 'user';
        setIsAdmin(role === 'admin' || role === 'super_admin');
        setIsSuperAdmin(role === 'super_admin');
      } else {
        setProfile(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
    } catch (err) {
      console.error('Profile fetch exception:', err);
      setIsAdmin(false);
      setIsSuperAdmin(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (mounted) {
          if (currentSession) {
            setSession(currentSession);
            setUser(currentSession.user);
            await fetchProfile(currentSession.user.id);
          } else {
            setSession(null);
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
            setIsSuperAdmin(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (mounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
            await fetchProfile(newSession.user.id);
        } else {
            setProfile(null);
            setIsAdmin(false);
            setIsSuperAdmin(false);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
    } catch (error) {
        console.error("Error signing out:", error);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive"
        });
    }
  };

  const signInWithEmail = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email, password, metadata) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
  };

  const updatePassword = async (newPassword) => {
    return await supabase.auth.updateUser({ password: newPassword });
  };

  const resetPasswordForEmail = async (email) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    isSuperAdmin,
    unreadNotifCount,
    setUnreadNotifCount,
    signOut,
    signInWithEmail,
    signUp,
    updatePassword,
    resetPasswordForEmail,
    profile,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};