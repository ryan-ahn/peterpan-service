"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import Icon from "@repo/ui/icon";
import cn from "@repo/ui/lib/cn";

import { VILLAGE_SPOTS } from "@lib/foundation";

/**
 * constants
 */
const AERIAL = {
  src: "/images/village-aerial.png",
  width: 1775,
  height: 886,
};

/** 핀 끝 점이 놓일 자리(이미지 기준 %) */
const SPOT_POSITION: Record<SpotId, Point> = {
  community: { x: 56, y: 36 },
  homes: { x: 35, y: 46 },
  courtyard: { x: 49, y: 53 },
  garden: { x: 70, y: 51 },
  coop: { x: 14, y: 55 },
  pitch: { x: 78, y: 44 },
  path: { x: 48, y: 82 },
};

/**
 * types
 */
type Spot = (typeof VILLAGE_SPOTS)[number];

type SpotId = Spot["id"];

type Point = {
  x: number;
  y: number;
};

type SpotCardProps = {
  spot: Spot;
  onClose: () => void;
};

/**
 * 치유 마을 조감도. 자리마다 이름을 띄우고, 누르면 그 공간의 설명 창을 연다
 */
const VillageAerial = () => {
  // refs
  const containerRef = useRef<HTMLDivElement>(null);
  // states
  const [selectedId, setSelectedId] = useState<SpotId | null>(null);
  // variables
  const selectedSpot = VILLAGE_SPOTS.find(spot => spot.id === selectedId);
  // handlers
  const handleSpotClick = (id: SpotId) => {
    setSelectedId(current => (current === id ? null : id));
  };
  const handleCardClose = () => {
    setSelectedId(null);
  };
  // effects
  useEffect(() => {
    if (!selectedId) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      setSelectedId(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSelectedId(null);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedId]);
  // render
  return (
    <figure ref={containerRef} data-spot-open={selectedSpot ? "" : undefined}>
      <div className="relative">
        <Image
          src={AERIAL.src}
          alt="모듈하우스 10채가 중앙 정원을 둘러싸고, 커뮤니티동·텃밭·잔디 운동장·청계 사육장·산책로가 이어진 치유 마을 조감도"
          width={AERIAL.width}
          height={AERIAL.height}
          className="h-auto w-full"
          sizes="(min-width: 900px) 860px, 100vw"
          priority
        />
        {VILLAGE_SPOTS.map(spot => {
          const position = SPOT_POSITION[spot.id];
          const isSelected = spot.id === selectedId;
          return (
            <button
              key={spot.id}
              type="button"
              aria-expanded={isSelected}
              className={cn(
                "group/pin absolute flex -translate-x-1/2 -translate-y-[calc(100%-0.375rem)] flex-col items-center",
                isSelected ? "z-20" : "z-10 hover:z-20 focus-visible:z-20",
              )}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
              onClick={() => handleSpotClick(spot.id)}>
              <span
                className={cn(
                  "origin-bottom rounded-medium border px-2 py-0.5 text-3 leading-4 font-semibold whitespace-nowrap shadow-medium transition duration-200 group-hover/pin:-translate-y-0.5 group-focus-visible/pin:-translate-y-0.5 md:px-2.5 md:py-1 md:text-4 md:leading-5",
                  isSelected
                    ? "border-pine bg-pine text-paper"
                    : "border-beige bg-paper-light/95 text-pine group-hover/pin:border-pine",
                )}>
                {spot.name}
              </span>
              <span
                className={cn(
                  "h-2 w-0.5 md:h-3",
                  isSelected ? "bg-pine" : "bg-pine/60",
                )}
                aria-hidden="true"
              />
              <span className="relative grid size-3 place-items-center">
                {isSelected ? (
                  <span
                    className="absolute inset-0 animate-ping rounded-full bg-gold"
                    aria-hidden="true"
                  />
                ) : null}
                <span
                  className={cn(
                    "relative size-3 rounded-full border-2 border-white shadow-small",
                    isSelected ? "bg-gold" : "bg-pine",
                  )}
                  aria-hidden="true"
                />
              </span>
            </button>
          );
        })}
        {selectedSpot ? (
          <div
            className="absolute z-30 hidden w-80 md:block"
            style={cardPosition(SPOT_POSITION[selectedSpot.id])}>
            <SpotCard spot={selectedSpot} onClose={handleCardClose} />
          </div>
        ) : null}
      </div>
      {selectedSpot ? (
        <div className="mt-4 md:hidden">
          <SpotCard spot={selectedSpot} onClose={handleCardClose} />
        </div>
      ) : null}
    </figure>
  );
};

/**
 * inner components
 */
const SpotCard = ({ spot, onClose }: SpotCardProps) => {
  // render
  return (
    <div
      role="dialog"
      aria-label={spot.name}
      className="rounded-xlarge border border-beige bg-white px-5 py-5 shadow-large">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-4 leading-5 text-gold-deep">{spot.meta}</p>
          <h3 className="mt-1 text-6 leading-8 font-semibold text-pine">
            {spot.name}
          </h3>
        </div>
        <button
          type="button"
          aria-label="닫기"
          className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-paper hover:text-pine"
          onClick={onClose}>
          <Icon name="close" size={18} />
        </button>
      </div>
      <p className="mt-2 text-4 leading-7 text-ink/90">{spot.body}</p>
      {spot.items.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-1 border-t border-beige pt-3">
          {spot.items.map(item => (
            <li key={item} className="flex gap-2 text-4 leading-6 text-ink/90">
              <Icon
                name="check"
                size={16}
                className="mt-1 shrink-0 text-sage"
              />
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

/**
 * utils
 */
const cardPosition = (params: Point) => {
  const { x, y } = params;
  return {
    ...(x < 50
      ? { left: `max(0px, calc(${x}% - 2.5rem))` }
      : { right: `max(0px, calc(${100 - x}% - 2.5rem))` }),
    ...(y < 50
      ? { top: `calc(${y}% + 1.25rem)` }
      : { bottom: `calc(${100 - y}% + 4rem)` }),
  };
};

export default VillageAerial;
