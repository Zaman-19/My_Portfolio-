import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getAdminStatus } from "@/lib/site.functions";

export function useAdmin() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const userId = session?.user.id ?? null;

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (!active || event === "TOKEN_REFRESHED") return;
      setSession(next);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!userId) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    getAdminStatus()
      .then((res) => active && setIsAdmin(res.isAdmin))
      .catch(() => active && setIsAdmin(false))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [userId]);

  return { session, isAdmin, loading, signOut: () => supabase.auth.signOut() };
}
