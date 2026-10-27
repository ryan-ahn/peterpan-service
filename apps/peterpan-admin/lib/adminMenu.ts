import type { AdminRole } from "@repo/auth/session";
import type { Name as IconName } from "@repo/ui/icon";

/**
 * 어드민 메뉴와 메뉴 권한. 오너·슈퍼 관리자는 모든 메뉴, 관리자는 받은 메뉴만 쓴다.
 * 권한 관리는 오너·슈퍼 관리자만. 서버(권한 확인)와 화면(왼쪽 메뉴)이 함께 쓴다
 */

/**
 * constants
 */
export const ADMIN_MENUS = [
  { id: "members", href: "/members", label: "회원 관리", icon: "users" },
  { id: "inquiries", href: "/inquiries", label: "후원 관리", icon: "mail" },
  { id: "news", href: "/news", label: "소식 관리", icon: "megaphone" },
  { id: "posts", href: "/posts", label: "게시물 관리", icon: "edit" },
  {
    id: "disclosures",
    href: "/disclosures",
    label: "공시 관리",
    icon: "file-text",
  },
  {
    id: "organization",
    href: "/organization",
    label: "조직도 관리",
    icon: "sitemap",
  },
  { id: "bylaws", href: "/bylaws", label: "정관 관리", icon: "file-text" },
  { id: "settings", href: "/settings", label: "기본 정보", icon: "home" },
  { id: "logs", href: "/logs", label: "관리 기록", icon: "clock" },
] as const satisfies readonly {
  id: string;
  href: string;
  label: string;
  icon: IconName;
}[];

/**
 * 홈. 메뉴 권한 없이 운영진 누구나 본다. 로고를 누르면 여기로 온다
 */
export const DASHBOARD_MENU = {
  href: "/dashboard",
  label: "대시보드",
  icon: "chart",
} as const satisfies { href: string; label: string; icon: IconName };

export const PERMISSIONS_MENU = {
  href: "/permissions",
  label: "권한 관리",
  icon: "user",
} as const satisfies { href: string; label: string; icon: IconName };

export const ADMIN_MENU_IDS = ADMIN_MENUS.map(menu => menu.id);

export const ADMIN_MENU_LABEL = Object.fromEntries(
  ADMIN_MENUS.map(menu => [menu.id, menu.label]),
) as Record<AdminMenuId, string>;

export const ADMIN_LOG_MENUS: AdminLogMenu[] = [
  ...ADMIN_MENU_IDS,
  "permissions",
];

export const ADMIN_LOG_MENU_LABEL: Record<AdminLogMenu, string> = {
  ...ADMIN_MENU_LABEL,
  permissions: PERMISSIONS_MENU.label,
};

/**
 * types
 */
export type AdminMenuId = (typeof ADMIN_MENUS)[number]["id"];

/**
 * 활동 기록의 메뉴. 권한 관리는 메뉴 권한 id가 없어 따로 둔다
 */
export type AdminLogMenu = AdminMenuId | "permissions";

type MenuAccess = {
  role: AdminRole;
  menus: AdminMenuId[];
};

type CanUseMenuParams = MenuAccess & {
  menu: AdminMenuId;
};

type FindMenuParams = {
  pathname: string;
};

/**
 * utils
 */
/**
 * 오너·슈퍼 관리자인지. 권한 관리와 관리자 관리를 할 수 있다
 */
export const isSuperRole = (role: AdminRole) =>
  role === "owner" || role === "super";

export const canUseMenu = (params: CanUseMenuParams) => {
  const { role, menus, menu } = params;
  return isSuperRole(role) || menus.includes(menu);
};

/**
 * 로그인 뒤 처음 갈 화면. 쓸 수 있는 메뉴가 하나라도 있으면 대시보드, 없으면 null
 */
export const readAdminHome = (params: MenuAccess) => {
  const { role, menus } = params;
  const hasMenu = ADMIN_MENUS.some(item =>
    canUseMenu({ role, menus, menu: item.id }),
  );
  return hasMenu ? DASHBOARD_MENU.href : null;
};

/**
 * 지금 경로가 어느 메뉴 화면인지. 권한 관리·메뉴 밖 경로는 null
 */
export const findMenuByPath = (params: FindMenuParams) => {
  const { pathname } = params;
  return (
    ADMIN_MENUS.find(
      menu => pathname === menu.href || pathname.startsWith(`${menu.href}/`),
    ) ?? null
  );
};

/**
 * 저장된 값 중 아는 메뉴 id만 남긴다
 */
export const readAdminMenus = (values: readonly string[]): AdminMenuId[] =>
  ADMIN_MENU_IDS.filter(id => values.includes(id));
