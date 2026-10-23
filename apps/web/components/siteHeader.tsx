"use client";

import Link from "next/link";
import { useState } from "react";

import { LogoLink } from "@/components/logo";
import { NAV } from "@/content/nav";
import type { SessionProfile } from "@/lib/auth";

type SiteHeaderProps = {
  user: SessionProfile | null;
};

const SiteHeader = ({ user }: SiteHeaderProps) => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-beige/80 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-[4.5rem] w-[min(1180px,calc(100%-2rem))] items-center justify-between gap-4">
        <LogoLink />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="주요 메뉴">
          {NAV.map(item => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className="text-[15px] text-ink/80 transition hover:text-green">
                {item.label}
              </Link>
              {item.children ? (
                <div className="invisible absolute top-full left-1/2 z-20 w-52 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="rounded-2xl border border-beige bg-white p-2 shadow-lg">
                    {item.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-xl px-3 py-2 text-sm text-ink/80 hover:bg-paper hover:text-green">
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
              href={user.role === "admin" ? "/admin" : "/login"}
              className="hidden text-sm text-muted md:inline">
              {user.name}
            </Link>
          ) : (
            <Link href="/login" className="hidden text-sm text-muted md:inline">
              로그인
            </Link>
          )}
          <Link
            href="/donate"
            className="inline-flex items-center gap-1.5 rounded-full bg-green px-4 py-2.5 text-sm font-medium text-white">
            <HeartIcon />
            후원하기
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-beige lg:hidden"
            aria-expanded={open}
            aria-label="메뉴"
            onClick={() => setOpen(current => !current)}>
            <span className="block h-0.5 w-4 bg-green shadow-[0_6px_0_#2e5b4b,0_-6px_0_#2e5b4b]" />
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-beige bg-paper px-4 py-4 lg:hidden" aria-label="모바일 메뉴">
          {NAV.map(item => (
            <div key={item.href} className="border-b border-beige/70 py-3">
              <Link href={item.href} onClick={() => setOpen(false)} className="font-medium">
                {item.label}
              </Link>
              {item.children ? (
                <div className="mt-2 flex flex-col gap-2 pl-3">
                  {item.children.map(child => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className="text-sm text-muted">
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="mt-3 block text-sm">
            {user ? user.name : "로그인"}
          </Link>
        </nav>
      ) : null}
    </header>
  );
};

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M12 20s-7-4.4-7-9.1C5 8 6.8 6.2 9 6.2c1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6 2.2 0 4 1.8 4 4.7C19 15.6 12 20 12 20z" />
  </svg>
);

export default SiteHeader;
