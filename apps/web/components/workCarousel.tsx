"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { WORKS } from "@/content/foundation";

const WorkCarousel = () => {
  const [index, setIndex] = useState(0);
  const move = (direction: number) => {
    const next = (index + direction + WORKS.length) % WORKS.length;
    setIndex(next);
    document.getElementById(`work-${next}`)?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  };
  return (
    <section className="bg-white py-20">
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-nature">OUR WORK</p>
            <h2 className="mt-2 text-3xl font-semibold text-green md:text-4xl">
              우리가 만들어가는 변화
            </h2>
            <p className="mt-4 leading-7 text-muted">
              피터팬 재단은 단순한 수용이 아닌, 삶을 지속하기 위한 주거와 돌봄의
              모델을 만들어 성인 중증 자폐성장애인과 그 가족의 더 나은 내일을
              함께 만들어갑니다.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="이전"
              onClick={() => move(-1)}
              className="grid size-10 place-items-center rounded-full border border-beige">
              ‹
            </button>
            <span className="text-sm text-muted">
              {index + 1} / {WORKS.length}
            </span>
            <button
              type="button"
              aria-label="다음"
              onClick={() => move(1)}
              className="grid size-10 place-items-center rounded-full border border-beige">
              ›
            </button>
          </div>
        </div>
        <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-2">
            {WORKS.map((work, workIndex) => (
              <Link
                id={`work-${workIndex}`}
                key={work.index}
                href={work.href}
                className="relative min-h-72 w-[82%] shrink-0 snap-start overflow-hidden rounded-3xl md:w-[calc(25%-12px)]">
                <Image
                  src={work.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 25vw, 80vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-deep/90 via-green-deep/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-sm text-gold">{work.index}</p>
                  <h3 className="mt-1 text-lg font-semibold">{work.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/85">{work.body}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
};

export default WorkCarousel;
