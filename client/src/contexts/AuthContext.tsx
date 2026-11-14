import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { setAuthToken } from '../lib/api.js';
import { UserProfile } from '../types/index.js';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string, companyName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loginAsDemoCustomer: () => void;
  loginAsDemoAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_CUSTOMER: UserProfile = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  email: 'director@vertexrealty.in',
  full_name: 'Aditya Sharma',
  company_name: 'Vertex Commercial Towers',
  phone: '+91 98765 43210',
  role: 'customer'
};

export const DEMO_ADMIN: UserProfile = {
  id: 'b1ffcd88-8b1a-4de7-aa5c-5aa8ac270b22',
  email: 'admin@aeroclean.ai',
  full_name: 'Alexei Vance',
  company_name: 'AeroClean AI Robotics Corp',
  phone: '+1 415 555 0199',
  role: 'admin'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for saved demo session first
      const savedDemoUser = localStorage.getItem('aeroclean_demo_user');
      const savedToken = localStorage.getItem('aeroclean_token');

      if (savedDemoUser && savedToken?.startsWith('demo-')) {
        try {
          setUser(JSON.parse(savedDemoUser));
          setIsDemoMode(true);
          setLoading(false);
          return;
        } catch (e) {
          localStorage.removeItem('aeroclean_demo_user');
        }
      }

      // If Supabase is configured, check session
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setAuthToken(session.access_token);
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: profile?.full_name || session.user.user_metadata?.full_name,
              company_name: profile?.company_name || session.user.user_metadata?.company_name,
              phone: profile?.phone,
              role: profile?.role || 'customer'
            });
          }
        } catch (err) {
          console.error('Error fetching Supabase session:', err);
        }
      }

      setLoading(false);
    };

    initializeAuth();

    // Supabase auth change listener
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setAuthToken(session.access_token);
          const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: profile?.full_name || session.user.user_metadata?.full_name,
            company_name: profile?.company_name || session.user.user_metadata?.company_name,
            phone: profile?.phone,
            role: profile?.role || 'customer'
          });
          setIsDemoMode(false);
        } else if (!isDemoMode) {
          setUser(null);
          setAuthToken(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isDemoMode]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast.error(error.message);
          setLoading(false);
          return false;
        }
        if (data.session) {
          setAuthToken(data.session.access_token);
          toast.success('Enterprise portal access authorized');
          setLoading(false);
          return true;
        }
      } else {
        // Fallback demo login
        loginAsDemoCustomer();
        toast.success('Logged in with Demo Enterprise credentials');
        setLoading(false);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
      setLoading(false);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    companyName: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              company_name: companyName
            }
          }
        });

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return false;
        }

        if (data.user) {
          toast.success('Registration successful. You can now access your dashboard.');
          setLoading(false);
          return true;
        }
      } else {
        // Fallback demo registration
        const newDemoUser: UserProfile = {
          id: `usr-${Date.now()}`,
          email,
          full_name: fullName,
          company_name: companyName,
          role: 'customer'
        };
        setUser(newDemoUser);
        setIsDemoMode(true);
        setAuthToken('demo-customer-token');
        localStorage.setItem('aeroclean_demo_user', JSON.stringify(newDemoUser));
        toast.success('Account created in Demo Mode');
        setLoading(false);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsDemoMode(false);
    setAuthToken(null);
    localStorage.removeItem('aeroclean_demo_user');
    toast.success('Signed out from AeroClean AI platform');
    setLoading(false);
  };

  const loginAsDemoCustomer = () => {
    setUser(DEMO_CUSTOMER);
    setIsDemoMode(true);
    setAuthToken('demo-customer-token');
    localStorage.setItem('aeroclean_demo_user', JSON.stringify(DEMO_CUSTOMER));
    toast.success('Welcome back, Aditya (Vertex Commercial Towers)');
  };

  const loginAsDemoAdmin = () => {
    setUser(DEMO_ADMIN);
    setIsDemoMode(true);
    setAuthToken('demo-admin-token');
    localStorage.setItem('aeroclean_demo_user', JSON.stringify(DEMO_ADMIN));
    toast.success('Admin privileges active (AeroClean AI Robotics Corp)');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        isDemoMode,
        login,
        register,
        logout,
        loginAsDemoCustomer,
        loginAsDemoAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
