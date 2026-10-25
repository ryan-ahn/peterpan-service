import { eq } from "drizzle-orm";

import { getDb, profiles } from "@repo/db";

import { createServerSupabase } from "./supabase";

/**
 * types
 */
export type Role = "admin" | "member";

export type SessionProfile = {
  id: string;
  email: string | null;
  name: string;
  role: Role;
  avatarUrl: string | null;
};

/**
 * 로그인한 사용자와 profiles 행. 로그인하지 않았거나 읽지 못하면 null
 */
export const getSessionProfile = async (): Promise<SessionProfile | null> => {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) {
      return null;
    }
    const rows = await getDb()
      .select()
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);
    const profile = rows[0];
    return {
      id: user.id,
      email: profile?.email ?? user.email ?? null,
      name: profile?.name || user.user_metadata?.name || "회원",
      role: profile?.role === "admin" ? "admin" : "member",
      avatarUrl: profile?.avatarUrl ?? null,
    };
  } catch {
    return null;
  }
};

/**
 * ADMIN_EMAILS에 적힌 관리자 이메일 (소문자)
 */
export const readAdminEmails = (): string[] =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);

/**
 * 세션을 끝낸다
 */
export const signOut = async () => {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
};
