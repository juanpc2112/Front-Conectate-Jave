"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { User } from "@/lib/api";

type SessionContextValue = {
  user: User | null;
  ready: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);
const SESSION_KEY = "conectate-jave-user";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) setUser(JSON.parse(stored) as User);
    } catch {
      localStorage.removeItem(SESSION_KEY);
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

  const signIn = useCallback((nextUser: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);
  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
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
