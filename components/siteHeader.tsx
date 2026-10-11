"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

import Button from "@components/button";
import Icon from "@components/icon";

import styles from "./siteHeader.module.css";

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
 * pre-root utils
 */
const joinClassNames = (names: Array<string | false>): string =>
  names.filter(Boolean).join(" ");

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
      className={joinClassNames([
        styles.header,
        isSolid ? styles.solid : styles.light,
        isHidden && styles.hidden,
      ])}>
      <div className={styles.bar}>
        <a className={styles.brand} href="#top" onClick={handleAnchorClick}>
          <span className={styles.mark}>
            <Icon name="star" size={16} />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>피터팬 재단</span>
            <span className={styles.brandEn}>PETER PAN FOUNDATION</span>
          </span>
        </a>
        <nav className={styles.nav} aria-label="주요 메뉴">
          {NAV_ITEMS.map(item => (
            <a
              key={item.id}
              className={joinClassNames([
                styles.link,
                activeId === item.id && styles.active,
              ])}
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "true" : undefined}
              onClick={handleAnchorClick}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.join}>
          <Button variant="gold" size="small" text="함께하기" />
        </div>
        <button
          className={styles.menuButton}
          type="button"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMenuOpen}
          onClick={handleMenuToggle}>
          <Icon name={isMenuOpen ? "close" : "menu"} size={22} />
        </button>
      </div>
      <nav
        className={styles.menu}
        hidden={!isMenuOpen}
        aria-label="모바일 메뉴">
        {NAV_ITEMS.map(item => (
          <a
            key={item.id}
            className={styles.menuLink}
            href={`#${item.id}`}
            onClick={handleAnchorClick}>
            {item.label}
          </a>
        ))}
        <div className={styles.menuJoin}>
          <Button variant="gold" size="medium" text="함께하기" />
        </div>
      </nav>
    </header>
  );
};

export default SiteHeader;
