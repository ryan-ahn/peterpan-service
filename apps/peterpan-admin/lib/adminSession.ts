import { redirect } from "next/navigation";

import {
  type AdminRole,
  type SessionProfile,
  getSessionProfile,
} from "@repo/auth/session";

import {
  type AdminMenuId,
  canUseMenu,
  isSuperRole,
  readAdminMenus,
} from "@lib/adminMenu";

/**
 * 운영진 확인. admin_members에 있는 로그인 사용자만 관리 화면에 들어온다.
 * 관리자는 받은 메뉴만, 권한 관리는 오너·슈퍼 관리자만. 서버 컴포넌트·서버 액션에서만 부른다.
 */

/**
 * types
 */
export type AdminSelf = Pick<SessionProfile, "id" | "name" | "email"> & {
  role: AdminRole;
  menus: AdminMenuId[];
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
 * 오너·슈퍼 관리자 전용 화면 진입. 관리자는 로그인 화면으로 보내 첫 메뉴로 이어지게 한다
 */
export const requireSuper = async (): Promise<AdminSelf> => {
  const self = await requireAdmin();
  if (!isSuperRole(self.role)) {
    redirect("/");
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
 * 메뉴 서버 액션 첫 줄. 넘긴 메뉴 중 하나라도 쓸 수 있어야 한다
 */
export const assertMenu = async (
  ...menus: AdminMenuId[]
): Promise<AdminSelf> => {
  const self = await assertAdmin();
  const isAllowed = menus.some(menu =>
    canUseMenu({ role: self.role, menus: self.menus, menu }),
  );
  if (!isAllowed) {
    throw new Error("이 메뉴를 쓸 권한이 없어요.");
  }
  return self;
};

/**
 * 오너·슈퍼 관리자 전용 서버 액션 첫 줄
 */
export const assertSuper = async (): Promise<AdminSelf> => {
  const self = await assertAdmin();
  if (!isSuperRole(self.role)) {
    throw new Error("이 작업을 할 권한이 없어요.");
  }
  return self;
};

/**
 * 로그인한 운영자. 운영진이 아니면 null
 */
export const readAdminSelf = async (): Promise<AdminSelf | null> => {
  const profile = await getSessionProfile();
  if (!profile?.role) {
    return null;
  }
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    menus: readAdminMenus(profile.adminMenus),
  };
};
