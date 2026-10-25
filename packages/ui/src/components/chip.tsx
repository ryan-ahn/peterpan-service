import type { ReactNode } from "react";

import cn from "../lib/cn";
import tv from "../lib/tv";

/**
 * constants
 */
const chip = tv({
  base: "inline-flex shrink-0 items-center justify-center border border-transparent font-medium whitespace-nowrap",
  variants: {
    variant: {
      contain: "",
      tint: "",
      line: "bg-white",
    },
    color: {
      primary: "",
      gray: "",
      green: "",
      orange: "",
      red: "",
      gold: "",
    },
    size: {
      small: "h-6 gap-1 px-2 text-3 leading-4",
      medium: "h-8 gap-1 px-3 text-3.5 leading-5",
      large: "h-10 gap-1.5 px-4 text-4 leading-5",
    },
    isRound: {
      true: "rounded-full",
      false: "rounded-small",
    },
    isPressable: {
      true: "cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400",
    },
  },
  compoundVariants: [
    {
      variant: "contain",
      color: "primary",
      class: "bg-primary-500 text-white",
    },
    { variant: "contain", color: "gray", class: "bg-gray-800 text-white" },
    { variant: "contain", color: "green", class: "bg-green-600 text-white" },
    {
      variant: "contain",
      color: "orange",
      class: "bg-orange-500 text-white",
    },
    { variant: "contain", color: "red", class: "bg-red-500 text-white" },
    { variant: "contain", color: "gold", class: "bg-gold text-pine-deep" },
    {
      variant: "tint",
      color: "primary",
      class: "border-primary-100 bg-primary-50 text-primary-600",
    },
    {
      variant: "tint",
      color: "gray",
      class: "border-gray-200 bg-gray-100 text-gray-700",
    },
    {
      variant: "tint",
      color: "green",
      class: "border-green-100 bg-green-50 text-green-700",
    },
    {
      variant: "tint",
      color: "orange",
      class: "border-orange-100 bg-orange-50 text-orange-700",
    },
    {
      variant: "tint",
      color: "red",
      class: "border-red-100 bg-red-50 text-red-700",
    },
    {
      variant: "tint",
      color: "gold",
      class: "border-beige bg-paper text-gold-deep",
    },
    {
      variant: "line",
      color: "primary",
      class: "border-primary-300 text-primary-600",
    },
    { variant: "line", color: "gray", class: "border-gray-200 text-gray-600" },
    {
      variant: "line",
      color: "green",
      class: "border-green-300 text-green-700",
    },
    {
      variant: "line",
      color: "orange",
      class: "border-orange-300 text-orange-700",
    },
    { variant: "line", color: "red", class: "border-red-200 text-red-700" },
    { variant: "line", color: "gold", class: "border-gold text-gold-deep" },
    {
      variant: "line",
      isPressable: true,
      class: "hover:bg-gray-50",
    },
  ],
});

/**
 * types
 */
export type Variant = "contain" | "tint" | "line";

export type Color = "primary" | "gray" | "green" | "orange" | "red" | "gold";

export type Size = "small" | "medium" | "large";

type Props = {
  variant: Variant;
  color: Color;
  size?: Size;
  text: string;
  isRound?: boolean;
  isSelected?: boolean;
  leftChildren?: ReactNode;
  rightChildren?: ReactNode;
  className?: string;
  onClick?: () => void;
};

/**
 * 칩. 상태 표시나 필터 선택에 쓴다. `onClick`이 있으면 누를 수 있는 버튼이 된다
 * @param variant 형태. contain 채움 / tint 옅은 채움 / line 테두리
 * @param color 색
 * @param size 크기
 * @param text 문구
 * @param isRound 알약 모양
 * @param isSelected 필터로 쓸 때 선택 여부(`aria-pressed`)
 * @param leftChildren 문구 왼쪽 요소
 * @param rightChildren 문구 오른쪽 요소
 * @param className 추가 클래스
 * @param onClick 클릭
 */
const Chip = ({
  variant,
  color,
  size = "medium",
  text,
  isRound = true,
  isSelected,
  leftChildren,
  rightChildren,
  className,
  onClick,
}: Props) => {
  // variables
  const isPressable = Boolean(onClick);
  const classNames = cn(
    chip({ variant, color, size, isRound, isPressable }),
    className,
  );
  const content = (
    <>
      {leftChildren}
      <span>{text}</span>
      {rightChildren}
    </>
  );
  // render
  if (!onClick) {
    return <span className={classNames}>{content}</span>;
  }
  return (
    <button
      className={classNames}
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}>
      {content}
    </button>
  );
};

export default Chip;
