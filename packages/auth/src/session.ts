import { cache } from "react";

import { eq } from "drizzle-orm";

import { adminMembers, getDb, profiles } from "@repo/db";

import { createServerSupabase } from "./supabase";

/**
 * types
 */
export type AdminRole = "owner" | "manager";

export type SessionProfile = {
  id: string;
  email: string | null;
  name: string;
  role: AdminRole | null;
  avatarUrl: string | null;
};

/**
 * 로그인한 사용자와 profiles 행, 어드민 권한. 일반 회원은 role이 null. 로그인하지 않았거나 읽지 못하면 null.
 * 한 요청 안에서는 한 번만 읽는다. 세션 확인은 `getClaims()`(비대칭 서명 키면 Auth 서버를 부르지 않고 JWT를 검증)
 */
export const getSessionProfile = cache(
  async (): Promise<SessionProfile | null> => {
    try {
      const supabase = await createServerSupabase();
      const { data } = await supabase.auth.getClaims();
      const claims = data?.claims;
      if (!claims?.sub) {
        return null;
      }
      const rows = await getDb()
        .select({ profile: profiles, role: adminMembers.role })
        .from(profiles)
        .leftJoin(adminMembers, eq(adminMembers.userId, profiles.id))
        .where(eq(profiles.id, claims.sub))
        .limit(1);
      const row = rows[0];
      return {
        id: claims.sub,
        email: row?.profile.email ?? claims.email ?? null,
        name: row?.profile.name || readMetadataName(claims.user_metadata),
        role: readAdminRole(row?.role),
        avatarUrl: row?.profile.avatarUrl ?? null,
      };
    } catch {
      return null;
    }
  },
);

/**
 * admin_members.role 값을 권한으로 읽는다. 그 밖의 값은 null
 */
export const readAdminRole = (value: unknown): AdminRole | null => {
  if (value === "owner" || value === "manager") {
    return value;
  }
  return null;
};

const readMetadataName = (metadata: unknown) => {
  if (
    metadata &&
    typeof metadata === "object" &&
    "name" in metadata &&
    typeof metadata.name === "string" &&
    metadata.name
  ) {
    return metadata.name;
  }
  return "회원";
};

/**
 * 세션을 끝낸다
 */
export const signOut = async () => {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
};
