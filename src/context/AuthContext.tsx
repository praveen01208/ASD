"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: Error | null; user?: User | null }>;
  signOut: () => Promise<void>;
  signInAsDemo: () => void;
}

const DEMO_USER: User = {
  id: "demo-caregiver-001",
  app_metadata: {},
  user_metadata: {
    full_name: "Sarah (Caregiver)",
    name: "Sarah",
  },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "caregiver@asd-care.local",
  phone: "",
  role: "authenticated",
  updated_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoaded: false,
  isSignedIn: false,
  isConfigured: false,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signOut: async () => {},
  signInAsDemo: () => {},
});

const DEMO_SESSION_KEY = "asd_demo_auth_active";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const isConfigured = Boolean(supabase);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (mounted) {
            setSession(data.session);
            setUser(data.session?.user ?? null);
          }
        } catch (err) {
          console.error("Supabase auth getSession error:", err);
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, currentSession) => {
          if (mounted) {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
          }
        });

        if (mounted) {
          setIsLoaded(true);
        }

        return () => {
          subscription.unsubscribe();
        };
      } else {
        // Fallback / local demo mode when Supabase credentials aren't configured yet
        if (typeof window !== "undefined") {
          const storedDemoAuth = localStorage.getItem(DEMO_SESSION_KEY);
          // Default to signed-in demo user for frictionless local development
          if (storedDemoAuth !== "false") {
            setUser(DEMO_USER);
          } else {
            setUser(null);
          }
        }
        if (mounted) {
          setIsLoaded(true);
        }
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) {
      // Local fallback
      setUser({ ...DEMO_USER, email });
      localStorage.setItem(DEMO_SESSION_KEY, "true");
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, metadata?: Record<string, any>) => {
    if (!supabase) {
      // Local fallback
      const newUser: User = {
        ...DEMO_USER,
        email,
        user_metadata: { ...DEMO_USER.user_metadata, ...(metadata || {}) },
      };
      setUser(newUser);
      localStorage.setItem(DEMO_SESSION_KEY, "true");
      return { error: null, user: newUser };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { error, user: data.user };
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    if (typeof window !== "undefined") {
      localStorage.setItem(DEMO_SESSION_KEY, "false");
    }
    router.push("/landing");
  };

  const signInAsDemo = () => {
    setUser(DEMO_USER);
    if (typeof window !== "undefined") {
      localStorage.setItem(DEMO_SESSION_KEY, "true");
    }
    router.push("/");
  };

  const isSignedIn = Boolean(user);

  const value = useMemo(
    () => ({
      user,
      session,
      isLoaded,
      isSignedIn,
      isConfigured,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      signInAsDemo,
    }),
    [user, session, isLoaded, isSignedIn, isConfigured]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useUser() {
  const { user, isLoaded, isSignedIn } = useAuth();
  return {
    user,
    isLoaded,
    isSignedIn,
  };
}
