"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { User } from "@/lib/api";
import { SESSION_STORAGE_KEY } from "@/lib/api";

type SessionContextValue = {
  user: User | null;
  ready: boolean;
  signIn: (user: User, accessToken: string) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);
export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const session = JSON.parse(stored) as { user?: User; accessToken?: string };
        // La restauración lee una fuente externa al estado de React.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (session.user && session.accessToken) setUser(session.user);
        else localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    const isPublic = pathname === "/" || pathname === "/registro";
    if (!user && !isPublic) router.replace("/");
    if (user && isPublic) router.replace("/dashboard");
  }, [pathname, ready, router, user]);

  const signIn = useCallback((nextUser: User, accessToken: string) => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user: nextUser, accessToken }));
    setUser(nextUser);
  }, []);
  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
    router.replace("/");
  }, [router]);

  return (
    <SessionContext.Provider value={{ user, ready, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession debe usarse dentro de SessionProvider");
  return value;
}
