import { redirect } from "next/navigation";

import {
  type AdminRole,
  type SessionProfile,
  getSessionProfile,
} from "@repo/auth/session";

/**
 * 운영진 확인. admin_members에 오너·관리자로 있는 로그인 사용자만 관리 화면에 들어온다.
 * 권한 관리는 오너만. 서버 컴포넌트·서버 액션에서만 부른다.
 */

/**
 * types
 */
export type AdminSelf = Pick<SessionProfile, "id" | "name" | "email"> & {
  role: AdminRole;
};

/**
 * actions
 */
/**
 * 관리 화면 진입. 운영진이 아니면 로그인 화면(`/`)으로 보낸다
 */
export const requireAdmin = async (): Promise<AdminSelf> => {
  const self = await readAdminSelf();
  if (!self) {
    redirect("/");
  }
  return self;
};

/**
 * 오너 전용 화면 진입. 관리자는 첫 관리 화면으로 보낸다
 */
export const requireOwner = async (): Promise<AdminSelf> => {
  const self = await requireAdmin();
  if (self.role !== "owner") {
    redirect("/posts");
  }
  return self;
};

/**
 * 서버 액션 첫 줄. 운영진이 아니면 오류를 던져 화면에 알린다
 */
export const assertAdmin = async (): Promise<AdminSelf> => {
  const self = await readAdminSelf();
  if (!self) {
    throw new Error("관리자 권한이 없습니다. 다시 로그인해 주세요.");
  }
  return self;
};

/**
 * 오너 전용 서버 액션 첫 줄
 */
export const assertOwner = async (): Promise<AdminSelf> => {
  const self = await assertAdmin();
  if (self.role !== "owner") {
    throw new Error("이 작업을 할 권한이 없어요.");
  }
  return self;
};

/**
 * utils
 */
const readAdminSelf = async (): Promise<AdminSelf | null> => {
  const profile = await getSessionProfile();
  if (!profile?.role) {
    return null;
  }
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
  };
};
