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
          if (mounted && data.session?.user) {
            setSession(data.session);
            setUser(data.session.user);
            if (typeof window !== "undefined") {
              localStorage.setItem("asd_current_user_id", data.session.user.id);
              localStorage.setItem("asd_caregiver_session", JSON.stringify(data.session.user));
            }
          } else if (mounted && typeof window !== "undefined") {
            const cached = localStorage.getItem("asd_caregiver_session");
            if (cached) {
              try {
                const parsed = JSON.parse(cached);
                if (parsed?.id) setUser(parsed);
              } catch (e) {}
            }
          }
        } catch (err) {
          console.error("Supabase auth getSession error:", err);
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, currentSession) => {
          if (mounted) {
            setSession(currentSession);
            if (currentSession?.user) {
              setUser(currentSession.user);
              if (typeof window !== "undefined") {
                localStorage.setItem("asd_current_user_id", currentSession.user.id);
                localStorage.setItem("asd_caregiver_session", JSON.stringify(currentSession.user));
              }
            }
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
          const cached = localStorage.getItem("asd_caregiver_session");
          const storedDemoAuth = localStorage.getItem(DEMO_SESSION_KEY);
          if (cached) {
            try {
              setUser(JSON.parse(cached));
            } catch (e) {
              setUser(null);
            }
          } else if (storedDemoAuth === "true") {
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
      const u: User = { ...DEMO_USER, id: "user-" + Date.now(), email };
      setUser(u);
      if (typeof window !== "undefined") {
        localStorage.setItem(DEMO_SESSION_KEY, "true");
        localStorage.setItem("asd_caregiver_session", JSON.stringify(u));
        localStorage.setItem("asd_current_user_id", u.id);
      }
      return { error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    if (data.user) {
      setUser(data.user);
      setSession(data.session);
      if (typeof window !== "undefined") {
        localStorage.setItem("asd_caregiver_session", JSON.stringify(data.user));
        localStorage.setItem("asd_current_user_id", data.user.id);
      }
    }

    return { error: null };
  };

  const signUpWithEmail = async (email: string, password: string, metadata?: Record<string, any>) => {
    if (!supabase) {
      const newUser: User = {
        ...DEMO_USER,
        id: "user-" + Date.now(),
        email,
        user_metadata: { ...DEMO_USER.user_metadata, ...(metadata || {}) },
      };
      setUser(newUser);
      if (typeof window !== "undefined") {
        localStorage.setItem(DEMO_SESSION_KEY, "true");
        localStorage.setItem("asd_caregiver_session", JSON.stringify(newUser));
        localStorage.setItem("asd_current_user_id", newUser.id);
        localStorage.setItem("asd_current_user_email", email);
      }
      return { error: null, user: newUser };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      return { error, user: null };
    }

    let activeUser = data.user;
    let activeSession = data.session;

    // If session was not immediately returned (e.g. email confirmation setting),
    // try to sign in with password to obtain active session
    if (!activeSession) {
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInData?.session && signInData.user) {
        activeSession = signInData.session;
        activeUser = signInData.user;
      }
    }

    // Ensure state always has the authenticated caregiver user
    const resolvedUser: User = activeUser || {
      id: "caregiver-" + Date.now(),
      app_metadata: {},
      user_metadata: metadata || {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
      email,
      phone: "",
      role: "authenticated",
      updated_at: new Date().toISOString(),
    };

    setUser(resolvedUser);
    setSession(activeSession);

    if (typeof window !== "undefined") {
      localStorage.setItem("asd_caregiver_session", JSON.stringify(resolvedUser));
      localStorage.setItem("asd_current_user_id", resolvedUser.id);
      localStorage.setItem("asd_current_user_email", email);
    }

    return { error: null, user: resolvedUser };
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("asd_caregiver_session");
      localStorage.removeItem("asd_current_user_id");
      localStorage.removeItem("asd_current_user_email");
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
