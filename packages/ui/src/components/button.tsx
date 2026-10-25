import type { ReactNode } from "react";

import cn from "../lib/cn";
import tv from "../lib/tv";
import Spinner from "./spinner";

/**
 * constants
 */
/**
 * 버튼 클래스. `next/link`처럼 Button으로 그릴 수 없는 요소에 같은 모양을 입힐 때 쓴다
 */
export const buttonStyle = tv({
  base: "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 border border-transparent font-semibold whitespace-nowrap transition-colors duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 disabled:cursor-not-allowed disabled:opacity-40",
  variants: {
    variant: {
      solid: "",
      tint: "",
      line: "bg-transparent",
      ghost: "bg-transparent",
    },
    color: {
      primary: "",
      gray: "",
      black: "",
      danger: "",
      pine: "",
      gold: "",
      paper: "",
      white: "",
      kakao: "",
    },
    size: {
      xsmall: "h-8 px-3 text-3 leading-4",
      small: "h-10 px-4 text-3.5 leading-5",
      medium: "h-12 px-5 text-4 leading-5",
      large: "h-14 px-6 text-5 leading-6",
    },
    isRound: {
      true: "rounded-full",
      false: "rounded-medium",
    },
    isFullWidth: {
      true: "w-full shrink",
    },
  },
  compoundVariants: [
    {
      variant: "solid",
      color: "primary",
      class: "bg-primary-500 text-white hover:bg-primary-600",
    },
    {
      variant: "tint",
      color: "primary",
      class: "bg-primary-50 text-primary-600 hover:bg-primary-100",
    },
    {
      variant: "line",
      color: "primary",
      class: "border-primary-300 text-primary-600 hover:bg-primary-50",
    },
    {
      variant: "ghost",
      color: "primary",
      class: "text-primary-600 hover:bg-primary-50",
    },
    {
      variant: "solid",
      color: "gray",
      class: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    },
    {
      variant: "tint",
      color: "gray",
      class: "bg-gray-50 text-gray-700 hover:bg-gray-100",
    },
    {
      variant: "line",
      color: "gray",
      class: "border-gray-200 bg-white text-gray-800 hover:bg-gray-50",
    },
    {
      variant: "ghost",
      color: "gray",
      class: "text-gray-700 hover:bg-gray-100",
    },
    {
      variant: "solid",
      color: "black",
      class: "bg-gray-900 text-white hover:bg-gray-800",
    },
    {
      variant: "line",
      color: "black",
      class: "border-gray-900 text-gray-900 hover:bg-gray-100",
    },
    {
      variant: "solid",
      color: "danger",
      class: "bg-red-500 text-white hover:bg-red-600",
    },
    {
      variant: "tint",
      color: "danger",
      class: "bg-red-50 text-red-700 hover:bg-red-100",
    },
    {
      variant: "line",
      color: "danger",
      class: "border-red-200 text-red-700 hover:bg-red-50",
    },
    {
      variant: "ghost",
      color: "danger",
      class: "text-red-700 hover:bg-red-50",
    },
    {
      variant: "solid",
      color: "pine",
      class: "bg-pine text-white hover:bg-pine-deep",
    },
    {
      variant: "line",
      color: "pine",
      class: "border-pine/30 text-pine hover:bg-pine/5",
    },
    {
      variant: "ghost",
      color: "pine",
      class: "text-pine hover:bg-pine/5",
    },
    {
      variant: "solid",
      color: "gold",
      class: "bg-gold text-pine-deep hover:bg-gold/85",
    },
    {
      variant: "line",
      color: "gold",
      class: "border-gold text-gold-deep hover:bg-gold/10",
    },
    {
      variant: "solid",
      color: "paper",
      class: "bg-paper text-pine hover:bg-beige",
    },
    {
      variant: "line",
      color: "paper",
      class: "border-beige bg-white text-ink hover:bg-paper",
    },
    {
      variant: "solid",
      color: "white",
      class: "bg-white text-pine hover:bg-paper",
    },
    {
      variant: "line",
      color: "white",
      class: "border-white/40 text-white hover:bg-white/10",
    },
    {
      variant: "solid",
      color: "kakao",
      class: "bg-kakao text-kakao-ink hover:bg-kakao/90",
    },
  ],
  defaultVariants: {
    size: "medium",
    isRound: false,
  },
});

/**
 * types
 */
export type Variant = "solid" | "tint" | "line" | "ghost";

export type Color =
  | "primary"
  | "gray"
  | "black"
  | "danger"
  | "pine"
  | "gold"
  | "paper"
  | "white"
  | "kakao";

export type Size = "xsmall" | "small" | "medium" | "large";

type Props = {
  variant: Variant;
  color: Color;
  size?: Size;
  text: string;
  type?: "button" | "submit";
  href?: string;
  isExternal?: boolean;
  isRound?: boolean;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  leftChildren?: ReactNode;
  rightChildren?: ReactNode;
  className?: string;
  onClick?: () => void;
};

/**
 * 버튼. `href`가 있으면 링크로 그린다
 * @param variant 형태. solid 채움 / tint 옅은 채움 / line 테두리 / ghost 배경 없음
 * @param color 색 조합. 시스템(primary·gray·black·danger), 브랜드(pine·gold·paper, 어두운 바탕 위 white), 외부(kakao)
 * @param size 높이·글자 크기
 * @param text 문구
 * @param type 폼 안에서 제출 버튼일 때 `submit`
 * @param href 이동 주소
 * @param isExternal 새 탭으로 열지
 * @param isRound 알약 모양
 * @param isFullWidth 부모 너비를 채울지
 * @param isDisabled 비활성
 * @param isLoading 로딩 중. 누를 수 없고 스피너를 보인다
 * @param leftChildren 문구 왼쪽 요소(아이콘 등)
 * @param rightChildren 문구 오른쪽 요소
 * @param className 추가 클래스
 * @param onClick 클릭
 */
const Button = ({
  variant,
  color,
  size = "medium",
  text,
  type = "button",
  href,
  isExternal = false,
  isRound = false,
  isFullWidth = false,
  isDisabled = false,
  isLoading = false,
  leftChildren,
  rightChildren,
  className,
  onClick,
}: Props) => {
  // variables
  const classNames = cn(
    buttonStyle({ variant, color, size, isRound, isFullWidth }),
    className,
  );
  const content = (
    <>
      {isLoading ? <Spinner size="small" className="absolute" /> : null}
      <span
        className={cn(
          "inline-flex items-center gap-1.5",
          isLoading && "invisible",
        )}>
        {leftChildren}
        <span>{text}</span>
        {rightChildren}
      </span>
    </>
  );
  // render
  if (href && !isDisabled) {
    return (
      <a
        className={classNames}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        onClick={onClick}>
        {content}
      </a>
    );
  }
  return (
    <button
      className={classNames}
      type={type}
      disabled={isDisabled || isLoading}
      aria-busy={isLoading || undefined}
      onClick={onClick}>
      {content}
    </button>
  );
};

export default Button;
