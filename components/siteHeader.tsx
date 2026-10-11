"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

import Button from "@components/button";
import Icon from "@components/icon";
import cn from "@utils/cn";

/**
 * constants
 */
const NAV_ITEMS = [
  { id: "story", label: "재단 이야기" },
  { id: "neverland", label: "우리가 만드는 네버랜드" },
  { id: "community", label: "피터팬즈" },
  { id: "news", label: "소식과 기록" },
  { id: "support", label: "후원과 참여" },
];

const HEADER_HEIGHT = 76;
const SCROLL_DELTA = 8;

/**
 * 상단 탭
 * 아래로 스크롤하면 숨기고, 위로 스크롤하면 다시 보여 준다.
 */
const SiteHeader = () => {
  // refs
  const lastScrollYRef = useRef(0);
  const scrollDeltaRef = useRef(0);
  const isMenuOpenRef = useRef(false);
  // states
  const [isHidden, setIsHidden] = useState(false);
  const [isSolid, setIsSolid] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // handlers
  const handleMenuToggle = () => {
    setIsMenuOpen(prev => {
      const next = !prev;
      isMenuOpenRef.current = next;
      return next;
    });
  };
  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute("href");
    isMenuOpenRef.current = false;
    setIsMenuOpen(false);
    if (!href?.startsWith("#")) {
      return;
    }
    event.preventDefault();
    const id = href.slice(1) || "top";
    const target = document.getElementById(id);
    if (!target) {
      return;
    }
    if (id === "top") {
      setIsHidden(false);
      scrollDeltaRef.current = 0;
      lastScrollYRef.current = 0;
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsHidden(true);
    scrollDeltaRef.current = SCROLL_DELTA + 1;
    const top = target.offsetTop;
    lastScrollYRef.current = top;
    window.scrollTo({ top, behavior: "smooth" });
  };
  // effects
  useEffect(() => {
    const handleWindowScroll = () => {
      const nextY = window.scrollY;
      const delta = nextY - lastScrollYRef.current;
      scrollDeltaRef.current += delta;
      const story = document.getElementById("story");
      const storyTop = story?.getBoundingClientRect().top ?? window.innerHeight;
      const marker = window.innerHeight * 0.35;
      let nextActiveId = "";
      NAV_ITEMS.forEach(item => {
        const section = document.getElementById(item.id);
        if (!section) {
          return;
        }
        if (section.getBoundingClientRect().top - HEADER_HEIGHT <= marker) {
          nextActiveId = item.id;
        }
      });
      const nextHidden =
        !isMenuOpenRef.current &&
        nextY > HEADER_HEIGHT &&
        scrollDeltaRef.current > SCROLL_DELTA;
      const nextShown = scrollDeltaRef.current < -SCROLL_DELTA || nextY < 24;
      setIsSolid(storyTop < HEADER_HEIGHT);
      setActiveId(prev => (prev === nextActiveId ? prev : nextActiveId));
      if (nextShown) {
        scrollDeltaRef.current = 0;
        setIsHidden(false);
      }
      if (nextHidden) {
        scrollDeltaRef.current = 0;
        setIsHidden(true);
      }
      lastScrollYRef.current = nextY;
    };
    lastScrollYRef.current = window.scrollY;
    handleWindowScroll();
    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, []);
  // render
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 text-ivory transition duration-300 motion-reduce:transition-none",
        isSolid
          ? "bg-cream/95 text-ink shadow-header backdrop-blur-[14px]"
          : "bg-[linear-gradient(180deg,rgba(6,28,58,0.42),rgba(6,28,58,0))]",
        isHidden && "-translate-y-full",
      )}>
      <div className="flex h-19 items-center justify-between gap-5 px-5 md:px-7">
        <a
          className="flex shrink-0 items-center gap-2.5"
          href="#top"
          onClick={handleAnchorClick}>
          <span
            className={cn(
              "grid size-8.5 place-items-center rounded-full",
              isSolid
                ? "bg-gold-deep/10 text-gold-deep"
                : "bg-gold/20 text-gold-light",
            )}>
            <Icon name="star" size={16} />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="font-serif text-5 leading-none font-semibold tracking-[-0.03em]">
              피터팬 재단
            </span>
            <span className="text-2 leading-none font-medium tracking-[0.16em] opacity-70">
              PETER PAN FOUNDATION
            </span>
          </span>
        </a>
        <nav
          className="hidden items-center gap-6.5 xl:flex"
          aria-label="주요 메뉴">
          {NAV_ITEMS.map(item => (
            <a
              key={item.id}
              className={cn(
                "text-4 font-normal tracking-[-0.02em] opacity-80 hover:opacity-100",
                activeId === item.id && "font-semibold opacity-100",
              )}
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "true" : undefined}
              onClick={handleAnchorClick}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden xl:block">
          <Button variant="gold" size="small" text="함께하기" />
        </div>
        <button
          className="inline-flex size-10 items-center justify-center rounded-full border-0 bg-transparent p-0 text-inherit xl:hidden"
          type="button"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMenuOpen}
          onClick={handleMenuToggle}>
          <Icon name={isMenuOpen ? "close" : "menu"} size={22} />
        </button>
      </div>
      <nav
        className={cn(
          "flex flex-col gap-1.5 bg-cream px-5 pt-1 pb-4.5 text-ink xl:hidden",
          !isMenuOpen && "hidden",
        )}
        aria-label="모바일 메뉴">
        {NAV_ITEMS.map(item => (
          <a
            key={item.id}
            className="border-b border-ink/10 px-1 py-3 text-5"
            href={`#${item.id}`}
            onClick={handleAnchorClick}>
            {item.label}
          </a>
        ))}
        <div className="mt-2">
          <Button variant="gold" size="medium" text="함께하기" />
        </div>
      </nav>
    </header>
  );
};

export default SiteHeader;
