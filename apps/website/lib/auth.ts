import { eq } from "drizzle-orm";
import { getDb, profiles } from "@repo/db";

import { createServerSupabase } from "@/lib/supabase/server";

export type SessionProfile = {
  id: string;
  email: string | null;
  name: string;
  role: "admin" | "member";
  avatarUrl: string | null;
};

export const getSessionProfile = async (): Promise<SessionProfile | null> => {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) {
      return null;
    }
    const db = getDb();
    const rows = await db
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

export const adminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);
