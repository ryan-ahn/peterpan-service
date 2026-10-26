"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import Icon from "@repo/ui/icon";

import BrandText from "@components/brandText";
import { WORKS } from "@lib/foundation";

/**
 * types
 */
type ArrowButtonProps = {
  label: string;
  icon: "chevron-left" | "chevron-right";
  onClick: () => void;
};

/**
 * section — 홈 "우리가 만들어가는 변화" 가로 카드. 화살표로 한 장씩 옮긴다
 */
const WorkCarousel = () => {
  // states
  const [index, setIndex] = useState(0);
  // functions
  const move = (direction: number) => {
    const next = (index + direction + WORKS.length) % WORKS.length;
    setIndex(next);
    document.getElementById(`work-${next}`)?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  };
  // handlers
  const handlePrevClick = () => {
    move(-1);
  };
  const handleNextClick = () => {
    move(1);
  };
  // render
  return (
    <section className="bg-white py-20">
      <div className="page-wide">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <BrandText variant="overline" color="pine">
              Our work
            </BrandText>
            <BrandText as="h2" variant="section" color="pine" className="mt-2">
              우리가 만들어가는 변화
            </BrandText>
            <BrandText variant="bodyCompact" color="muted" className="mt-4">
              피터팬 재단은 단순한 수용이 아닌, 삶을 지속하기 위한 주거와 돌봄의
              모델을 만들어 성인 중증 자폐성장애인과 그 가족의 더 나은 내일을
              함께 만들어갑니다.
            </BrandText>
          </div>
          <div className="flex items-center gap-3">
            <ArrowButton
              label="이전"
              icon="chevron-left"
              onClick={handlePrevClick}
            />
            <span className="text-4 leading-5 text-muted">
              {index + 1} / {WORKS.length}
            </span>
            <ArrowButton
              label="다음"
              icon="chevron-right"
              onClick={handleNextClick}
            />
          </div>
        </div>
        <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-2">
          {WORKS.map((work, workIndex) => (
            <Link
              id={`work-${workIndex}`}
              key={work.index}
              href={work.href}
              className="relative min-h-72 w-4/5 shrink-0 snap-start overflow-hidden rounded-2xlarge md:w-[calc((100%-var(--spacing)*12)/4)]">
              <Image
                src={work.image}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 768px) 25vw, 80vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-pine-deep/90 via-pine-deep/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <BrandText variant="caption" color="gold">
                  {work.index}
                </BrandText>
                <BrandText as="h3" variant="cardTitle" className="mt-1">
                  {work.title}
                </BrandText>
                <BrandText
                  variant="smallCompact"
                  color="whiteSoft"
                  className="mt-2">
                  {work.body}
                </BrandText>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * inner components
 */
const ArrowButton = ({ label, icon, onClick }: ArrowButtonProps) => (
  <button
    type="button"
    aria-label={label}
    className="grid size-10 place-items-center rounded-full border border-beige text-ink"
    onClick={onClick}>
    <Icon name={icon} size={18} />
  </button>
);

export default WorkCarousel;
