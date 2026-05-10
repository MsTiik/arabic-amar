"use client";

import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

import type { UserProgress } from "@/lib/types";

export type SyncStatus = "disabled" | "signed-out" | "syncing" | "synced" | "error";

export interface CloudProgressRow {
  user_id: string;
  progress: UserProgress;
  updated_at: string;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function isCloudSyncConfigured(): boolean {
  return Boolean(url && anonKey);
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isCloudSyncConfigured()) return null;
  if (!client) {
    client = createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return client;
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function signInWithEmail(email: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Progress sync is not configured.");
  const origin = window.location.origin;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: origin,
    },
  });
  if (error) throw error;
}

export async function signOutOfSync(): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function loadCloudProgress(userId: string): Promise<UserProgress | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("user_progress")
    .select("progress")
    .eq("user_id", userId)
    .maybeSingle<Pick<CloudProgressRow, "progress">>();
  if (error) throw error;
  return data?.progress ?? null;
}

export async function saveCloudProgress(userId: string, progress: UserProgress): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("user_progress").upsert({
    user_id: userId,
    progress,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
