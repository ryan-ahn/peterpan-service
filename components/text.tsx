import type { ElementType, ReactNode } from "react";
import cn, { tv } from "@utils/cn";

/**
 * constants
 */
const text = tv({
  base: "m-0",
  variants: {
    variant: {
      display:
        "font-serif text-14 leading-18 font-semibold tracking-[-0.03em] lg:text-21 lg:leading-26 xl:text-26 xl:leading-33",
      title:
        "font-serif text-11 leading-15 font-semibold tracking-[-0.03em] lg:text-15 lg:leading-20 xl:text-19 xl:leading-26",
      heading:
        "font-serif text-7 leading-9 font-semibold tracking-[-0.02em] xl:text-10 xl:leading-14",
      body: "text-4 leading-8 font-light lg:text-5 lg:leading-10",
      caption: "text-3.5 leading-6 font-normal",
      label: "text-3 leading-4 font-medium tracking-[0.22em] uppercase",
      quote:
        "font-serif text-5 leading-8 font-medium lg:text-6 lg:leading-9 xl:text-7 xl:leading-11",
    },
    color: {
      ink: "text-ink",
      soft: "text-ink-soft",
      cream: "text-cream",
      creamDeep: "text-cream-deep",
      creamSoft: "text-cream/80",
      gold: "text-gold-deep",
      goldLight: "text-gold-light",
      snow: "text-snow",
      snowSoft: "text-snow/92",
      ivory: "text-ivory",
      ivorySoft: "text-ivory/90",
      night: "text-night",
      nightDeep: "text-night-deep",
      nightSoft: "text-night/90",
      sea: "text-sea",
      seaDeep: "text-sea-deep",
      seaSoft: "text-sea/90",
    },
  },
});

/**
 * types
 */
export type Variant =
  "display" | "title" | "heading" | "body" | "caption" | "label" | "quote";

export type Color =
  | "ink"
  | "soft"
  | "cream"
  | "creamDeep"
  | "creamSoft"
  | "gold"
  | "goldLight"
  | "snow"
  | "snowSoft"
  | "ivory"
  | "ivorySoft";

type Props = {
  as?: ElementType;
  variant: Variant;
  color?: Color;
  className?: string;
  children: ReactNode;
};

/**
 * 텍스트
 * @param as 렌더할 태그
 * @param variant 타이포그래피. 화면 크기별로 글자 스케일이 바뀐다
 * @param color 색
 * @param className 추가 클래스
 * @param children 내용
 */
const Text = ({
  as = "p",
  variant,
  color = "ink",
  className,
  children,
}: Props) => {
  // variables
  const Tag = as;
  // render
  return (
    <Tag className={cn(text({ variant, color }), className)}>{children}</Tag>
  );
};

export default Text;
