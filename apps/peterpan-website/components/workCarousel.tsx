"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import cn from "@repo/ui/lib/cn";

import BrandText from "@components/brandText";
import { WORKS } from "@lib/foundation";

/**
 * constants
 */
const ROTATE_MS = 3000;

/**
 * types
 */
type WorkPanelProps = {
  work: (typeof WORKS)[number];
  isActive: boolean;
  isPaused: boolean;
  onActivate: () => void;
};

/**
 * section — 홈 "우리가 만들어가는 변화". 네 패널 중 하나가 넓게 펼쳐지고, 일정 간격으로 다음 패널로 넘어간다.
 * 마우스를 올리거나 포커스하면 그 패널을 펼치고 멈춘다. 동작 줄이기 설정이면 자동으로 넘기지 않는다
 */
const WorkCarousel = () => {
  // states
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // handlers
  const handleListEnter = () => {
    setIsPaused(true);
  };
  const handleListLeave = () => {
    setIsPaused(false);
  };
  // effects
  useEffect(() => {
    if (isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setIndex(current => (current + 1) % WORKS.length);
    }, ROTATE_MS);
    return () => window.clearTimeout(timer);
  }, [index, isPaused]);
  // render
  return (
    <section className="bg-white py-20">
      <div className="page-wide">
        <div className="max-w-xl">
          <BrandText variant="overline" color="pine">
            Our work
          </BrandText>
          <BrandText as="h2" variant="section" color="pine" className="mt-2">
            우리가 만들어가는 변화
          </BrandText>
          <BrandText variant="bodyCompact" color="muted" className="mt-4">
            피터팬 재단은 단순한 보호를 넘어, 성인 중증 자폐성장애인이 자신의
            삶을 지속할 수 있는 주거와 돌봄의 모델을 구축합니다. 이를 통해
            당사자와 가족이 더 나은 내일을 함께 그려 갈 수 있도록 돕겠습니다.
          </BrandText>
        </div>
        <ul
          className="mt-10 flex h-144 flex-col gap-3 md:h-104 md:flex-row"
          onMouseEnter={handleListEnter}
          onMouseLeave={handleListLeave}
          onFocus={handleListEnter}
          onBlur={handleListLeave}>
          {WORKS.map((work, workIndex) => (
            <WorkPanel
              key={work.index}
              work={work}
              isActive={workIndex === index}
              isPaused={isPaused}
              onActivate={() => setIndex(workIndex)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

/**
 * inner components
 */
const WorkPanel = ({
  work,
  isActive,
  isPaused,
  onActivate,
}: WorkPanelProps) => (
  <li
    className={cn(
      "relative min-h-0 min-w-0 basis-0 overflow-hidden rounded-2xlarge border border-beige bg-paper-light transition-[flex-grow,border-color] duration-700 ease-out",
      isActive ? "grow-4 border-sage" : "grow",
    )}
    onMouseEnter={onActivate}>
    <Link
      href={work.href}
      className="relative block size-full"
      aria-label={`${work.title} — ${work.body}`}
      onFocus={onActivate}>
      <Image
        src={work.image}
        alt=""
        fill
        className={cn(
          "object-cover transition-transform duration-1000 ease-out",
          isActive ? "scale-105" : "scale-100",
        )}
        sizes="(min-width: 768px) 50vw, 100vw"
      />
      <span
        className={cn(
          "absolute inset-0 bg-paper transition-opacity duration-700",
          isActive ? "opacity-0" : "opacity-40",
        )}
      />
      {isActive && !isPaused ? (
        <span className="absolute inset-x-0 top-0 h-1 origin-left animate-work-progress bg-gold motion-reduce:hidden" />
      ) : null}
      <span
        className={cn(
          "absolute top-4 left-4 rounded-full bg-paper-light/90 px-3 py-1 font-en text-3 leading-4 font-semibold text-gold-deep transition-opacity duration-300",
          isActive ? "opacity-0" : "opacity-100",
        )}>
        {work.index}
      </span>
      <div
        className={cn(
          "absolute inset-x-4 bottom-4 rounded-xlarge bg-paper-light/95 px-5 py-4 transition-[opacity,translate] md:max-w-md",
          isActive
            ? "translate-y-0 opacity-100 delay-300 duration-500"
            : "pointer-events-none translate-y-3 opacity-0 duration-200",
        )}>
        <BrandText variant="caption" color="goldDeep">
          {work.index}
        </BrandText>
        <BrandText as="h3" variant="cardTitle" color="pine" className="mt-1">
          {work.title}
        </BrandText>
        <BrandText variant="smallCompact" color="muted" className="mt-1">
          {work.body}
        </BrandText>
      </div>
    </Link>
  </li>
);

export default WorkCarousel;
