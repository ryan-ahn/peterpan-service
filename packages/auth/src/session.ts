import { cache } from "react";

import { eq } from "drizzle-orm";

import { adminMembers, getDb, profiles } from "@repo/db";

import { createServerSupabase } from "./supabase";

/**
 * types
 */
export type AdminRole = "owner" | "super" | "manager";

export type SessionProfile = {
  id: string;
  email: string | null;
  name: string;
  role: AdminRole | null;
  adminMenus: string[];
  avatarUrl: string | null;
};

/**
 * 로그인한 사용자와 profiles 행, 어드민 권한. 이름·사진·이메일은 profiles에서만 읽는다.
 * 일반 회원은 role이 null. adminMenus는 manager가 쓸 수 있는 어드민 메뉴 id.
 * 로그인하지 않았거나 profiles 행이 없거나 읽지 못하면 null.
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
        .select({
          profile: profiles,
          role: adminMembers.role,
          menus: adminMembers.menus,
        })
        .from(profiles)
        .leftJoin(adminMembers, eq(adminMembers.userId, profiles.id))
        .where(eq(profiles.id, claims.sub))
        .limit(1);
      const row = rows[0];
      if (!row) {
        return null;
      }
      return {
        id: claims.sub,
        email: row.profile.email,
        name: row.profile.name || "회원",
        role: readAdminRole(row.role),
        adminMenus: row.menus ?? [],
        avatarUrl: row.profile.avatarUrl,
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
  if (value === "owner" || value === "super" || value === "manager") {
    return value;
  }
  return null;
};

/**
 * 세션을 끝낸다
 */
export const signOut = async () => {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
};
