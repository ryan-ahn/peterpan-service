"use client";

import { type KeyboardEvent, type ReactNode, useId } from "react";

import cn from "../lib/cn";
import tv from "../lib/tv";

/**
 * constants
 */
const field = tv({
  base: "flex w-full items-center gap-2 border bg-white text-gray-900 transition-colors duration-150 focus-within:border-gray-900",
  variants: {
    size: {
      small: "h-9 rounded-medium px-3 text-3.5 leading-5",
      medium: "h-11 rounded-medium px-3.5 text-4 leading-5",
      large: "h-13 rounded-large px-4 text-5 leading-6",
    },
    isInvalid: {
      true: "border-red-500 focus-within:border-red-500",
      false: "border-gray-200",
    },
    isDisabled: {
      true: "cursor-not-allowed bg-gray-50 text-gray-400",
    },
  },
});

/**
 * types
 */
export type Size = "small" | "medium" | "large";

export type Type = "text" | "email" | "password" | "search" | "tel" | "url";

type Props = {
  value: string;
  label?: string;
  name?: string;
  type?: Type;
  size?: Size;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  maxLength?: number;
  autoComplete?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  leftChildren?: ReactNode;
  rightChildren?: ReactNode;
  className?: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
};

/**
 * 한 줄 입력
 * @param value 값
 * @param label 위쪽 이름표
 * @param name 폼 이름
 * @param type 입력 종류
 * @param size 높이·글자 크기
 * @param placeholder 빈 칸 안내
 * @param helperText 아래 안내 문구
 * @param errorMessage 오류 문구. 있으면 빨간 테두리로 바뀌고 안내 문구 대신 보인다
 * @param maxLength 최대 글자 수
 * @param autoComplete 브라우저 자동 완성 힌트
 * @param isDisabled 비활성
 * @param isReadOnly 읽기 전용
 * @param leftChildren 입력칸 왼쪽 요소(아이콘 등)
 * @param rightChildren 입력칸 오른쪽 요소
 * @param className 바깥 래퍼 추가 클래스
 * @param onChange 값 변경
 * @param onEnter Enter 입력
 */
const Input = ({
  value,
  label,
  name,
  type = "text",
  size = "medium",
  placeholder,
  helperText,
  errorMessage,
  maxLength,
  autoComplete,
  isDisabled = false,
  isReadOnly = false,
  leftChildren,
  rightChildren,
  className,
  onChange,
  onEnter,
}: Props) => {
  // hooks
  const id = useId();
  // variables
  const isInvalid = Boolean(errorMessage);
  const message = errorMessage ?? helperText;
  // handlers
  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing || !onEnter) {
      return;
    }
    onEnter();
  };
  // render
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label ? (
        <label
          className="text-3.5 leading-5 font-medium text-gray-700"
          htmlFor={id}>
          {label}
        </label>
      ) : null}
      <div className={field({ size, isInvalid, isDisabled })}>
        {leftChildren}
        <input
          className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          disabled={isDisabled}
          readOnly={isReadOnly}
          aria-invalid={isInvalid || undefined}
          aria-describedby={message ? `${id}-message` : undefined}
          onChange={event => onChange(event.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        {rightChildren}
      </div>
      {message ? (
        <p
          className={cn(
            "text-3 leading-4",
            isInvalid ? "text-red-600" : "text-gray-500",
          )}
          id={`${id}-message`}>
          {message}
        </p>
      ) : null}
    </div>
  );
};

export default Input;
