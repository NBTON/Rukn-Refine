import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabaseApi, UserProfile } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Define context types
type AuthContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Storage keys
const AUTH_KEY = 'ruknapp_auth';

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from storage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedSession = await AsyncStorage.getItem(AUTH_KEY);
        
        if (storedSession) {
          const sessionData = JSON.parse(storedSession);
          
          // If we have stored credentials, restore the session
          if (sessionData && sessionData.user) {
            setUser(sessionData.user);
            setIsAuthenticated(true);
            
            // Update the in-memory session in supabaseApi
            if (sessionData.token) {
              // This will ensure supabaseApi has the session as well
              supabaseApi.setSession({
                access_token: sessionData.token,
                user: sessionData.user
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading authentication state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Handle sign in
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await supabaseApi.signIn(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Store auth data in AsyncStorage
        const session = supabaseApi.getCurrentSession();
        const sessionData = {
          user: result.user,
          token: session?.access_token,
          timestamp: new Date().toISOString()
        };
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
        
        return { success: true };
      }
      
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign up
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setIsLoading(true);
      const result = await supabaseApi.signUp(email, password, userData);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Store auth data in AsyncStorage
        const session = supabaseApi.getCurrentSession();
        const sessionData = {
          user: result.user,
          token: session?.access_token,
          timestamp: new Date().toISOString()
        };
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
        
        return { success: true };
      }
      
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabaseApi.signOut();
      
      // Clear from AsyncStorage
      await AsyncStorage.removeItem(AUTH_KEY);
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
