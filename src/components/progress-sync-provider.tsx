"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

import {
  getCurrentUser,
  getSupabaseClient,
  isCloudSyncConfigured,
  loadCloudProgress,
  saveCloudProgress,
  signInWithEmail,
  signOutOfSync,
  type SyncStatus,
} from "@/lib/supabase-progress";
import { mergeProgress, replaceProgress, useProgress, useProgressStorageSync } from "@/lib/progress";
import { useThemeSync } from "@/lib/theme";

interface ProgressSyncContextValue {
  configured: boolean;
  user: User | null;
  status: SyncStatus;
  error: string;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<void>;
}

const ProgressSyncContext = createContext<ProgressSyncContextValue | null>(null);

export function ProgressSyncProvider({ children }: { children: ReactNode }) {
  useProgressStorageSync();
  useThemeSync();

  const configured = isCloudSyncConfigured();
  const progress = useProgress();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<SyncStatus>(configured ? "signed-out" : "disabled");
  const [error, setError] = useState("");
  const bootstrappedRef = useRef(false);
  const skipNextSaveRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);
  const latestProgressRef = useRef(progress);

  useEffect(() => {
    latestProgressRef.current = progress;
  }, [progress]);

  const syncNow = useCallback(async () => {
    if (!configured || !user) return;
    setStatus("syncing");
    setError("");
    try {
      const cloudProgress = await loadCloudProgress(user.id);
      const currentProgress = latestProgressRef.current;
      const nextProgress = cloudProgress
        ? mergeProgress(currentProgress, cloudProgress)
        : currentProgress;
      if (cloudProgress) {
        skipNextSaveRef.current = true;
        replaceProgress(nextProgress);
      }
      await saveCloudProgress(user.id, nextProgress);
      setStatus("synced");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Progress sync failed.");
    }
  }, [configured, user]);

  useEffect(() => {
    if (!configured) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;
    let mounted = true;
    getCurrentUser().then((currentUser) => {
      if (!mounted) return;
      setUser(currentUser);
      setStatus(currentUser ? "syncing" : "signed-out");
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setStatus(session?.user ? "syncing" : "signed-out");
      setError("");
      bootstrappedRef.current = false;
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [configured]);

  useEffect(() => {
    if (!configured || !user || bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    syncNow();
  }, [configured, syncNow, user]);

  useEffect(() => {
    if (!configured || !user || !bootstrappedRef.current) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(async () => {
      try {
        await saveCloudProgress(user.id, progress);
        setStatus("synced");
        setError("");
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Progress sync failed.");
      }
    }, 700);
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [configured, progress, user]);

  const value = useMemo<ProgressSyncContextValue>(
    () => ({
      configured,
      user,
      status,
      error,
      signIn: async (email: string) => {
        setStatus("syncing");
        setError("");
        try {
          await signInWithEmail(email);
          setStatus("signed-out");
        } catch (err) {
          setStatus("error");
          setError(err instanceof Error ? err.message : "Sign-in failed.");
        }
      },
      signOut: async () => {
        try {
          await signOutOfSync();
          setUser(null);
          setStatus(configured ? "signed-out" : "disabled");
          setError("");
        } catch (err) {
          setStatus("error");
          setError(err instanceof Error ? err.message : "Sign-out failed.");
        }
      },
      syncNow,
    }),
    [configured, error, status, syncNow, user],
  );

  return <ProgressSyncContext.Provider value={value}>{children}</ProgressSyncContext.Provider>;
}

export function useProgressSync(): ProgressSyncContextValue {
  const value = useContext(ProgressSyncContext);
  if (!value) {
    return {
      configured: false,
      user: null,
      status: "disabled",
      error: "",
      signIn: async () => undefined,
      signOut: async () => undefined,
      syncNow: async () => undefined,
    };
  }
  return value;
}
