"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/client";
import type { User } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  username: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const supabaseConfigured = isSupabaseConfigured();
  const supabase = useMemo(() => (supabaseConfigured ? createClient() : null), [supabaseConfigured]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let isMounted = true;

    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      if (isMounted) {
        setUser(data.user ?? null);
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase?.auth.signOut();
    setUser(null);
  };

  const username: string | null =
    (user?.user_metadata?.username as string) ?? user?.email?.split("@")[0] ?? null;

  return { user, username, loading, signOut };
}
