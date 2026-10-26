"use client";

import { type ReactNode, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Avatar from "@repo/ui/components/avatar";
import Button from "@repo/ui/components/button";
import Input from "@repo/ui/components/input";
import Icon, { type Name as IconName } from "@repo/ui/icon";
import cn from "@repo/ui/lib/cn";
import Text from "@repo/ui/text";

import { adminTextHeadingColor, adminTextLabelColor } from "@constants/adminUi";
import type { AdminSelf } from "@lib/adminSession";

/**
 * constants
 */
const NAV_LINKS: {
  href: string;
  label: string;
  icon: IconName;
  isOwnerOnly: boolean;
}[] = [
  {
    href: "/posts",
    label: "게시물 관리",
    icon: "edit",
    isOwnerOnly: false,
  },
  {
    href: "/news",
    label: "소식 관리",
    icon: "megaphone",
    isOwnerOnly: false,
  },
  {
    href: "/disclosures",
    label: "공시 관리",
    icon: "file-text",
    isOwnerOnly: false,
  },
  {
    href: "/organization",
    label: "조직도",
    icon: "sitemap",
    isOwnerOnly: false,
  },
  { href: "/bylaws", label: "정관", icon: "file-text", isOwnerOnly: false },
  { href: "/inquiries", label: "후원 문의", icon: "mail", isOwnerOnly: false },
  { href: "/members", label: "회원 관리", icon: "users", isOwnerOnly: false },
  { href: "/permissions", label: "권한 관리", icon: "user", isOwnerOnly: true },
  { href: "/settings", label: "기본정보", icon: "home", isOwnerOnly: false },
];

const ROLE_LABEL: Record<AdminSelf["role"], string> = {
  owner: "관리자",
  manager: "관리자",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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

/**
 * 어드민 크롬. 왼쪽 메뉴, 위쪽 검색 바, 본문 스크롤 영역
 * @param self 로그인한 운영자
 * @param headerSearch 화면이 등록한 검색 바. 없으면 비워 둔다
 * @param children 본문
 */
const AdminShell = ({ self, headerSearch, children }: Props) => {
  // hooks
  const pathname = usePathname();
  // states
  const [isNavOpen, setIsNavOpen] = useState(false);
  // handlers
  const handleNavToggle = () => {
    setIsNavOpen(current => !current);
  };
  const handleNavClose = () => {
    setIsNavOpen(false);
  };
  // render
  return (
    <div className="flex h-dvh overflow-hidden bg-gray-100">
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
          <div className="flex items-center gap-2">
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
          </div>
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
            </div>
          </div>
        </div>
        <div className="-mx-5 my-4 border-b border-gray-200" />
        <nav className="flex flex-col gap-1" aria-label="관리 메뉴">
          {NAV_LINKS.map(item => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            if (item.isOwnerOnly && self.role !== "owner") {
              return (
                <span
                  key={item.href}
                  className="flex cursor-not-allowed items-center gap-2.5 rounded-medium px-3 py-2.5 text-4 leading-5 text-gray-300"
                  aria-disabled="true">
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </span>
              );
            }
            return (
              <Link
                key={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-medium px-3 py-2.5 text-4 leading-5 transition-colors duration-150",
                  isActive
                    ? "bg-primary-100 font-medium text-primary-600"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800",
                )}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={handleNavClose}>
                <Icon name={item.icon} size={18} />
                {item.label}
              </Link>
            );
          })}
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
          <form action="/auth/logout" method="post">
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
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
