"use client";

import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { colors } from "@repo/tailwind-config/theme";
import Avatar from "@repo/ui/components/avatar";
import Button from "@repo/ui/components/button";
import Input from "@repo/ui/components/input";
import Icon, { type Name as IconName } from "@repo/ui/icon";
import cn from "@repo/ui/lib/cn";
import Text from "@repo/ui/text";

import { adminTextHeadingColor, adminTextLabelColor } from "@constants/adminUi";
import {
  ADMIN_MENUS,
  DASHBOARD_MENU,
  PERMISSIONS_MENU,
  canUseMenu,
  findMenuByPath,
  isSuperRole,
} from "@lib/adminMenu";
import type { AdminSelf } from "@lib/adminSession";

/**
 * constants
 */
const ROLE_LABEL: Record<AdminSelf["role"], string> = {
  owner: "슈퍼 관리자",
  super: "슈퍼 관리자",
  manager: "관리자",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const SESSION_LIMIT_MS = 10 * 60 * 1000;

const SESSION_EXTEND_AT_SECONDS = 60;

const SESSION_WARN_AT_SECONDS = 30;

const SESSION_DEADLINE_KEY = "peterpan-admin-session-until";

const SESSION_EXPIRED_MESSAGE =
  "로그인 후 10분이 지나 자동으로 로그아웃됐어요. 다시 로그인해 주세요.";

/**
 * types
 */
export type AdminHeaderSearch = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

type Props = {
  self: AdminSelf;
  headerSearch: AdminHeaderSearch | null;
  children: ReactNode;
};

type SessionWarningToastProps = {
  seconds: number;
  onExtend: () => void;
};

type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  isAllowed: boolean;
};

type NavLinkProps = {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
};

/**
 * pre-root runtime
 */
const deadlineListeners = new Set<() => void>();

const readDeadline = () => {
  const stored = Number(sessionStorage.getItem(SESSION_DEADLINE_KEY));
  return stored > 0 ? stored : null;
};

const readServerDeadline = () => null;

const notifyDeadline = () => {
  deadlineListeners.forEach(listener => listener());
};

const startDeadline = () => {
  sessionStorage.setItem(
    SESSION_DEADLINE_KEY,
    String(Date.now() + SESSION_LIMIT_MS),
  );
  notifyDeadline();
};

const clearDeadline = () => {
  sessionStorage.removeItem(SESSION_DEADLINE_KEY);
  notifyDeadline();
};

const subscribeDeadline = (listener: () => void) => {
  deadlineListeners.add(listener);
  queueMicrotask(() => {
    if (readDeadline() !== null) return;
    startDeadline();
  });
  return () => {
    deadlineListeners.delete(listener);
  };
};

const expireSession = async () => {
  clearDeadline();
  await fetch("/auth/logout", { method: "POST", redirect: "manual" });
  window.location.replace(
    `/?error=${encodeURIComponent(SESSION_EXPIRED_MESSAGE)}`,
  );
};

/**
 * hooks
 */
/**
 * 로그인 유지 시간. 탭마다 10분을 세고, 끝나면 세션을 지우고 로그인 화면으로 보낸다
 */
const useSessionDeadline = () => {
  // hooks
  const deadline = useSyncExternalStore(
    subscribeDeadline,
    readDeadline,
    readServerDeadline,
  );
  // refs
  const isExpiringRef = useRef(false);
  // states
  const [now, setNow] = useState(() => Date.now());
  // variables
  const remainingSeconds =
    deadline === null ? null : Math.max(0, Math.ceil((deadline - now) / 1000));
  // functions
  const extendSession = () => {
    startDeadline();
    setNow(Date.now());
  };
  // effects
  useEffect(() => {
    if (deadline === null) return;
    const tick = () => {
      const current = Date.now();
      if (current < deadline) {
        setNow(current);
        return;
      }
      if (isExpiringRef.current) return;
      isExpiringRef.current = true;
      void expireSession();
    };
    const timeoutId = window.setTimeout(tick, 0);
    const intervalId = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [deadline]);
  return { remainingSeconds, extendSession };
};

/**
 * 어드민 크롬. 왼쪽 메뉴, 위쪽 검색 바, 본문 스크롤 영역
 * @param self 로그인한 운영자
 * @param headerSearch 화면이 등록한 검색 바. 없으면 비워 둔다
 * @param children 본문
 */
const AdminShell = ({ self, headerSearch, children }: Props) => {
  // hooks
  const pathname = usePathname();
  const { remainingSeconds, extendSession } = useSessionDeadline();
  // states
  const [isNavOpen, setIsNavOpen] = useState(false);
  // variables
  const navItems: NavItem[] = [
    { ...DASHBOARD_MENU, isAllowed: true },
    ...ADMIN_MENUS.map(menu => ({
      href: menu.href,
      label: menu.label,
      icon: menu.icon,
      isAllowed: canUseMenu({
        role: self.role,
        menus: self.menus,
        menu: menu.id,
      }),
    })),
    { ...PERMISSIONS_MENU, isAllowed: isSuperRole(self.role) },
  ];
  const currentMenu = findMenuByPath({ pathname });
  const isPageAllowed = currentMenu
    ? canUseMenu({ role: self.role, menus: self.menus, menu: currentMenu.id })
    : true;
  const isExtendVisible =
    remainingSeconds !== null &&
    remainingSeconds > 0 &&
    remainingSeconds <= SESSION_EXTEND_AT_SECONDS;
  const isWarningVisible =
    remainingSeconds !== null &&
    remainingSeconds > 0 &&
    remainingSeconds <= SESSION_WARN_AT_SECONDS;
  // handlers
  const handleSessionExtend = () => {
    extendSession();
  };
  const handleLogoutSubmit = () => {
    clearDeadline();
  };
  const handleNavToggle = () => {
    setIsNavOpen(current => !current);
  };
  const handleNavClose = () => {
    setIsNavOpen(false);
  };
  // render
  return (
    <div className="flex h-dvh overflow-hidden bg-gray-100">
      {isWarningVisible && remainingSeconds !== null ? (
        <SessionWarningToast
          seconds={remainingSeconds}
          onExtend={handleSessionExtend}
        />
      ) : null}
      {isNavOpen ? (
        <button
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          type="button"
          aria-label="메뉴 닫기"
          onClick={handleNavClose}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col border-r border-gray-200 bg-gray-50 px-5 py-6 transition-transform duration-200 lg:static lg:translate-x-0",
          isNavOpen ? "translate-x-0" : "-translate-x-full",
        )}>
        <div className="flex flex-col gap-4">
          <Link
            className="flex items-center gap-2 self-start rounded-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
            href={DASHBOARD_MENU.href}
            prefetch={false}
            aria-label="대시보드로 가기"
            onClick={handleNavClose}>
            <Image
              src="/brand/logo-symbol.png"
              alt=""
              width={313}
              height={354}
              className="h-8 w-auto"
            />
            <Text as="span" variant="heading-5" color={adminTextHeadingColor}>
              피터팬 재단
            </Text>
          </Link>
          <div className="flex items-center gap-2.5 rounded-large border border-gray-200 bg-white px-3 py-2.5">
            <Avatar name={self.name} size="small" />
            <div className="flex min-w-0 flex-col">
              <Text variant="label-4" numberOfLines={1}>
                {self.name}({ROLE_LABEL[self.role]})
              </Text>
              <Text
                variant="caption-2"
                color={adminTextLabelColor}
                numberOfLines={1}>
                {self.email ?? "이메일 없음"}
              </Text>
              {remainingSeconds !== null ? (
                <div className="flex items-center justify-between gap-2">
                  <Text variant="caption-2" color={adminTextLabelColor}>
                    {formatRemaining(remainingSeconds)}
                  </Text>
                  {isExtendVisible ? (
                    <Button
                      variant="tint"
                      color="primary"
                      size="xsmall"
                      text="연장"
                      onClick={handleSessionExtend}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="-mx-5 my-4 border-b border-gray-200" />
        <nav className="flex flex-col gap-1" aria-label="관리 메뉴">
          {navItems.map(item => (
            <NavLink
              key={item.href}
              item={item}
              isActive={
                pathname === item.href || pathname.startsWith(`${item.href}/`)
              }
              onClick={handleNavClose}
            />
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 pt-4">
          <Button
            variant="ghost"
            color="gray"
            size="small"
            text="웹사이트 보기"
            href={SITE_URL}
            isExternal
            isFullWidth
            leftChildren={<Icon name="external-link" size={16} />}
          />
          <form
            action="/auth/logout"
            method="post"
            onSubmit={handleLogoutSubmit}>
            <Button
              variant="line"
              color="gray"
              size="small"
              type="submit"
              text="로그아웃"
              isFullWidth
              leftChildren={<Icon name="log-out" size={16} />}
            />
          </form>
        </div>
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 md:px-4">
          <button
            className="grid size-10 shrink-0 place-items-center rounded-medium text-gray-700 hover:bg-gray-100 lg:hidden"
            type="button"
            aria-label={isNavOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isNavOpen}
            onClick={handleNavToggle}>
            <Icon name="menu" size={20} />
          </button>
          {headerSearch ? (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Input
                className="max-w-120"
                type="search"
                size="small"
                value={headerSearch.value}
                placeholder={headerSearch.placeholder}
                leftChildren={
                  <Icon name="search" size={16} className="text-gray-400" />
                }
                onChange={headerSearch.onChange}
                onEnter={headerSearch.onSubmit}
              />
              <Button
                variant="solid"
                color="primary"
                size="xsmall"
                text="검색"
                className="h-9"
                onClick={headerSearch.onSubmit}
              />
            </div>
          ) : null}
        </header>
        <main className="flex-1 overflow-auto px-4 py-4 md:px-8 md:py-6">
          {isPageAllowed ? (
            children
          ) : (
            <Text
              variant="body-3"
              color={adminTextLabelColor}
              className="py-10">
              이 메뉴를 쓸 권한이 없어요. 슈퍼 관리자에게 메뉴 권한을 요청해
              주세요.
            </Text>
          )}
        </main>
      </div>
    </div>
  );
};

/**
 * inner components
 */
/**
 * 왼쪽 메뉴 한 줄. 권한이 없으면 흐리게 두고 누를 수 없다.
 * 프리페치마다 관리 레이아웃의 requireAdmin()이 돌므로, 마우스를 올리거나·터치·포커스할 때만 프리페치한다
 * @param item 메뉴
 * @param isActive 지금 화면인지
 * @param onClick 눌렀을 때(모바일 메뉴 닫기)
 */
const NavLink = ({ item, isActive, onClick }: NavLinkProps) => {
  // states
  const [isPrefetchable, setIsPrefetchable] = useState(false);
  // handlers
  const handlePrefetchIntent = () => {
    setIsPrefetchable(true);
  };
  // render
  if (!item.isAllowed) {
    return (
      <span
        className="flex cursor-not-allowed items-center gap-2.5 rounded-medium px-3 py-2.5 text-4 leading-5 text-gray-300"
        aria-disabled="true">
        <Icon name={item.icon} size={18} />
        {item.label}
      </span>
    );
  }
  return (
    <Link
      className={cn(
        "flex items-center gap-2.5 rounded-medium px-3 py-2.5 text-4 leading-5 transition-colors duration-150",
        isActive
          ? "bg-primary-100 font-medium text-primary-600"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800",
      )}
      href={item.href}
      prefetch={isPrefetchable ? null : false}
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={handlePrefetchIntent}
      onTouchStart={handlePrefetchIntent}
      onFocus={handlePrefetchIntent}
      onClick={onClick}>
      <Icon name={item.icon} size={18} />
      {item.label}
    </Link>
  );
};

/**
 * 자동 로그아웃 직전 화면 위에 뜨는 알림
 * @param seconds 남은 초
 * @param onExtend 연장 버튼을 눌렀을 때
 */
const SessionWarningToast = ({
  seconds,
  onExtend,
}: SessionWarningToastProps) => (
  <div className="pointer-events-none fixed inset-x-0 top-4 z-60 flex justify-center px-4">
    <div
      className="pointer-events-auto flex w-full max-w-120 animate-pop-in items-center justify-between gap-4 rounded-full bg-gray-900 py-3 pr-3 pl-6 shadow-large"
      role="status"
      aria-live="assertive">
      <Text variant="label-3" color={colors.white}>
        {seconds}초 후 자동으로 로그아웃돼요
      </Text>
      <Button
        variant="solid"
        color="primary"
        size="small"
        isRound
        text="연장"
        onClick={onExtend}
      />
    </div>
  </div>
);

/**
 * utils
 */
const formatRemaining = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `남은 시간 ${seconds}초`;
  return `남은 시간 ${minutes}분 ${seconds}초`;
};

export default AdminShell;
