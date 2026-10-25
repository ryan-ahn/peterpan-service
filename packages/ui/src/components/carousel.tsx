"use client";

import {
  type ReactNode,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

import Icon from "../icon";
import cn from "../lib/cn";

/**
 * constants
 */
const ARROW_CLASS_NAME =
  "absolute top-1/2 z-1 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-gray-900 shadow-medium transition-opacity duration-150 hover:bg-white disabled:pointer-events-none disabled:opacity-0";

/**
 * types
 */
type Props = {
  items: ReactNode[];
  label: string;
  isLoop?: boolean;
  isAutoPlay?: boolean;
  autoPlayInterval?: number;
  hasArrows?: boolean;
  hasDots?: boolean;
  slideClassName?: string;
  className?: string;
  onIndexChange?: (index: number) => void;
};

/**
 * 가로로 넘기는 슬라이드. 손가락·트랙패드 스와이프는 브라우저 스크롤 스냅을 쓴다
 * @param items 슬라이드 내용
 * @param label 스크린 리더용 이름
 * @param isLoop 끝에서 처음으로 이어질지
 * @param isAutoPlay 자동 넘김. 마우스를 올리거나 포커스가 있으면 멈춘다
 * @param autoPlayInterval 자동 넘김 간격(ms)
 * @param hasArrows 좌우 버튼
 * @param hasDots 아래 점 표시
 * @param slideClassName 슬라이드 너비 등. 기본은 한 장씩 꽉 채운다
 * @param className 바깥 래퍼 추가 클래스
 * @param onIndexChange 보이는 슬라이드 변경
 */
const Carousel = ({
  items,
  label,
  isLoop = false,
  isAutoPlay = false,
  autoPlayInterval = 4000,
  hasArrows = true,
  hasDots = true,
  slideClassName,
  className,
  onIndexChange,
}: Props) => {
  // refs
  const trackRef = useRef<HTMLDivElement>(null);
  // states
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // variables
  const lastIndex = items.length - 1;
  const isPrevDisabled = !isLoop && index <= 0;
  const isNextDisabled = !isLoop && index >= lastIndex;
  // functions
  const scrollToIndex = (nextIndex: number) => {
    const track = trackRef.current;
    const slide = track?.children[nextIndex];
    if (!track || !(slide instanceof HTMLElement)) {
      return;
    }
    track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  };
  const readStepIndex = (step: number): number => {
    const nextIndex = index + step;
    if (isLoop) {
      return (nextIndex + items.length) % items.length;
    }
    return Math.min(Math.max(nextIndex, 0), lastIndex);
  };
  // handlers
  const handleTrackScroll = () => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const slides = Array.from(track.children) as HTMLElement[];
    const nearestIndex = slides.reduce(
      (nearest, slide, slideIndex) =>
        Math.abs(slide.offsetLeft - track.scrollLeft) <
        Math.abs((slides[nearest]?.offsetLeft ?? 0) - track.scrollLeft)
          ? slideIndex
          : nearest,
      0,
    );
    if (nearestIndex === index) {
      return;
    }
    setIndex(nearestIndex);
    onIndexChange?.(nearestIndex);
  };
  const handlePrevClick = () => {
    scrollToIndex(readStepIndex(-1));
  };
  const handleNextClick = () => {
    scrollToIndex(readStepIndex(1));
  };
  const handlePauseStart = () => {
    setIsPaused(true);
  };
  const handlePauseEnd = () => {
    setIsPaused(false);
  };
  const handleAutoPlayTick = useEffectEvent(() => {
    scrollToIndex(readStepIndex(1));
  });
  // effects
  useEffect(() => {
    if (!isAutoPlay || isPaused || items.length <= 1) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = window.setInterval(handleAutoPlayTick, autoPlayInterval);
    return () => window.clearInterval(timer);
  }, [isAutoPlay, isPaused, items.length, autoPlayInterval]);
  // render
  return (
    <div
      className={cn("relative flex flex-col gap-3", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={handlePauseStart}
      onMouseLeave={handlePauseEnd}
      onFocus={handlePauseStart}
      onBlur={handlePauseEnd}>
      <div
        className="relative scrollbar-none flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        ref={trackRef}
        onScroll={handleTrackScroll}>
        {items.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className={cn("w-full shrink-0 snap-start", slideClassName)}
            role="group"
            aria-roledescription="slide"
            aria-label={`${itemIndex + 1} / ${items.length}`}>
            {item}
          </div>
        ))}
      </div>
      {hasArrows && items.length > 1 ? (
        <>
          <button
            className={cn(ARROW_CLASS_NAME, "left-3")}
            type="button"
            aria-label="이전 슬라이드"
            disabled={isPrevDisabled}
            onClick={handlePrevClick}>
            <Icon name="chevron-left" size={20} />
          </button>
          <button
            className={cn(ARROW_CLASS_NAME, "right-3")}
            type="button"
            aria-label="다음 슬라이드"
            disabled={isNextDisabled}
            onClick={handleNextClick}>
            <Icon name="chevron-right" size={20} />
          </button>
        </>
      ) : null}
      {hasDots && items.length > 1 ? (
        <div className="flex justify-center gap-1.5">
          {items.map((_, dotIndex) => (
            <button
              key={dotIndex}
              className={cn(
                "h-1.5 cursor-pointer rounded-full transition-all duration-200",
                dotIndex === index ? "w-5 bg-gray-900" : "w-1.5 bg-gray-300",
              )}
              type="button"
              aria-label={`${dotIndex + 1}번째 슬라이드`}
              aria-current={dotIndex === index || undefined}
              onClick={() => scrollToIndex(dotIndex)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Carousel;
