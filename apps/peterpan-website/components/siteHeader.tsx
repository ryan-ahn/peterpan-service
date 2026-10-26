"use client";

import { useState } from "react";

import Link from "next/link";

import Avatar from "@repo/ui/components/avatar";
import { buttonStyle } from "@repo/ui/components/button";
import Icon from "@repo/ui/icon";
import cn from "@repo/ui/lib/cn";

import Logo from "@components/logo";
import { NAV } from "@lib/nav";

/**
 * types
 */
type HeaderUser = {
  name: string;
  avatarUrl: string | null;
};

type Props = {
  user: HeaderUser | null;
};

type UserBadgeProps = {
  user: HeaderUser;
};

/**
 * 상단 메뉴. 넓은 화면은 드롭다운, 좁은 화면은 펼침 메뉴
 * @param user 로그인한 사용자. 있으면 사진·닉네임이 마이페이지 링크, 없으면 로그인 링크
 */
const SiteHeader = ({ user }: Props) => {
  // states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // handlers
  const handleMenuToggle = () => {
    setIsMenuOpen(current => !current);
  };
  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };
  // render
  return (
    <header className="sticky top-0 z-40 border-b border-beige bg-white/95 backdrop-blur">
      <div className="page-wide flex h-20 items-center justify-between gap-6">
        <Logo />
        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="주요 메뉴">
          {NAV.map(item => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className="text-4.5 leading-6 font-medium text-ink transition hover:text-pine">
                {item.label}
              </Link>
              {item.children ? (
                <div className="invisible absolute top-full left-1/2 z-20 w-52 -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="rounded-xlarge border border-beige bg-white p-2 shadow-large">
                    {item.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-large px-3 py-2 text-center text-4 leading-5 text-ink/80 hover:bg-paper hover:text-pine">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href="/mypage"
              className="mr-2 hidden items-center gap-2 text-4 leading-5 font-medium text-ink transition hover:text-pine md:inline-flex">
              <UserBadge user={user} />
            </Link>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonStyle({ variant: "line", color: "pine", size: "small" }),
                "hidden md:inline-flex",
              )}>
              로그인
            </Link>
          )}
          <Link
            href="/donate"
            className={buttonStyle({
              variant: "solid",
              color: "pine",
              size: "small",
            })}>
            후원하기
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-beige text-pine lg:hidden"
            aria-expanded={isMenuOpen}
            aria-label="메뉴"
            onClick={handleMenuToggle}>
            <Icon name={isMenuOpen ? "close" : "menu"} size={20} />
          </button>
        </div>
      </div>
      {isMenuOpen ? (
        <nav
          className="border-t border-beige bg-paper px-4 py-4 lg:hidden"
          aria-label="모바일 메뉴">
          {NAV.map(item => (
            <div key={item.href} className="border-b border-beige/70 py-3">
              <Link
                href={item.href}
                className="font-medium"
                onClick={handleMenuClose}>
                {item.label}
              </Link>
              {item.children ? (
                <div className="mt-2 flex flex-col gap-2 pl-3">
                  {item.children.map(child => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="text-4 leading-5 text-muted"
                      onClick={handleMenuClose}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <Link
            href={user ? "/mypage" : "/login"}
            className="mt-3 flex items-center gap-2 text-4 leading-5"
            onClick={handleMenuClose}>
            {user ? <UserBadge user={user} /> : "로그인"}
          </Link>
        </nav>
      ) : null}
    </header>
  );
};

/**
 * inner components
 */
const UserBadge = ({ user }: UserBadgeProps) => (
  <>
    <Avatar
      name={user.name}
      src={user.avatarUrl}
      size="medium"
      className="bg-beige text-pine"
    />
    <span>{user.name}</span>
  </>
);

export default SiteHeader;
