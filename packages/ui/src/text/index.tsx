import type { ElementType, ReactNode } from "react";

import cn from "../lib/cn";
import tv from "../lib/tv";

/**
 * constants
 */
const text = tv({
  base: "m-0",
  variants: {
    variant: {
      "display-1": "text-17 leading-23 font-bold tracking-4",
      "display-2": "text-13 leading-19 font-bold tracking-3",
      "heading-1": "text-11 leading-15 font-semibold tracking-3",
      "heading-2": "text-9 leading-13 font-semibold tracking-2",
      "heading-3": "text-8 leading-11 font-semibold tracking-2",
      "heading-4": "text-7 leading-10 font-semibold tracking-2",
      "heading-5": "text-6 leading-9 font-semibold tracking-1",
      "body-1": "text-5 leading-8 font-normal",
      "body-2": "text-4.5 leading-7 font-normal",
      "body-3": "text-4 leading-6 font-normal",
      "caption-1": "text-3.5 leading-5 font-normal",
      "caption-2": "text-3 leading-4 font-normal",
      "label-1": "text-5 leading-6 font-medium",
      "label-2": "text-4.5 leading-5 font-medium",
      "label-3": "text-4 leading-5 font-medium",
      "label-4": "text-3.5 leading-4 font-medium",
      "label-5": "text-3 leading-3 font-medium",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    numberOfLines: {
      1: "truncate",
      2: "line-clamp-2",
      3: "line-clamp-3",
      4: "line-clamp-4",
    },
  },
});

/**
 * types
 */
export type Variant =
  | "display-1"
  | "display-2"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "heading-5"
  | "body-1"
  | "body-2"
  | "body-3"
  | "caption-1"
  | "caption-2"
  | "label-1"
  | "label-2"
  | "label-3"
  | "label-4"
  | "label-5";

export type Weight = "light" | "normal" | "medium" | "semibold" | "bold";

type Props = {
  as?: ElementType;
  variant: Variant;
  weight?: Weight;
  color?: string;
  numberOfLines?: 1 | 2 | 3 | 4;
  className?: string;
  children: ReactNode;
};

/**
 * 텍스트
 * @param as 렌더할 태그
 * @param variant 타이포그래피. 글자 크기·줄간격·기본 굵기
 * @param weight 굵기. 없으면 variant 기본값
 * @param color CSS 색. `@repo/tailwind-config/theme`의 `colors`를 넘긴다. 없으면 부모 색을 따른다
 * @param numberOfLines 말줄임 줄 수
 * @param className 추가 클래스. 반응형 크기는 여기서 덮는다
 * @param children 내용
 */
const Text = ({
  as = "p",
  variant,
  weight,
  color,
  numberOfLines,
  className,
  children,
}: Props) => {
  // variables
  const Tag = as;
  // render
  return (
    <Tag
      className={cn(text({ variant, weight, numberOfLines }), className)}
      style={color ? { color } : undefined}>
      {children}
    </Tag>
  );
};

export default Text;
