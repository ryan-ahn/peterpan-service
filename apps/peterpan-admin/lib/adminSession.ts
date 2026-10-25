import { redirect } from "next/navigation";

import { type SessionProfile, getSessionProfile } from "@repo/auth/session";

/**
 * 운영자 확인. profiles.role이 admin인 로그인 사용자만 관리 화면에 들어온다.
 * 서버 컴포넌트·서버 액션에서만 부른다.
 */

/**
 * types
 */
export type AdminSelf = Pick<SessionProfile, "id" | "name" | "email">;

/**
 * actions
 */
/**
 * 관리 화면 진입. 운영자가 아니면 로그인 화면(`/`)으로 보낸다
 */
export const requireAdmin = async (): Promise<AdminSelf> => {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/");
  }
  return { id: profile.id, name: profile.name, email: profile.email };
};

/**
 * 서버 액션 첫 줄. 운영자가 아니면 오류를 던져 화면에 알린다
 */
export const assertAdmin = async (): Promise<AdminSelf> => {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("관리자 권한이 없습니다. 다시 로그인해 주세요.");
  }
  return { id: profile.id, name: profile.name, email: profile.email };
};
