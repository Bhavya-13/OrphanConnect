"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  role: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

async function fetchRole(userId: string): Promise<string> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return data?.role ?? "donor";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let resolvedInitial = false;

    // onAuthStateChange fires once immediately with the real, fully-resolved
    // session (event === "INITIAL_SESSION") and again on every subsequent
    // auth change. We treat that first callback as authoritative instead of
    // racing it against a separate getSession() call, which can otherwise
    // report `loading: false` with a stale/empty session for a moment.
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          setRole(await fetchRole(currentUser.id));
        } else {
          setRole(null);
        }
        resolvedInitial = true;
        setLoading(false);
      }
    );

    // Safety net: if onAuthStateChange hasn't fired yet for some reason
    // shortly after mount, fall back to an explicit getSession() check
    // rather than leaving the app stuck on loading forever.
    const fallback = setTimeout(async () => {
      if (resolvedInitial) return;
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setRole(await fetchRole(currentUser.id));
      } else {
        setRole(null);
      }
      setLoading(false);
    }, 1500);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(fallback);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}