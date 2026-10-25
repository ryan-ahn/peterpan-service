"use client";

import { useId } from "react";

import cn from "../lib/cn";

/**
 * types
 */
type Props = {
  value: string;
  label?: string;
  name?: string;
  rows?: number;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  maxLength?: number;
  hasCounter?: boolean;
  isDisabled?: boolean;
  className?: string;
  onChange: (value: string) => void;
};

/**
 * 여러 줄 입력
 * @param value 값
 * @param label 위쪽 이름표
 * @param name 폼 이름
 * @param rows 보이는 줄 수
 * @param placeholder 빈 칸 안내
 * @param helperText 아래 안내 문구
 * @param errorMessage 오류 문구. 있으면 빨간 테두리
 * @param maxLength 최대 글자 수
 * @param hasCounter 글자 수 표시. `maxLength`가 있으면 남은 한도도 보인다
 * @param isDisabled 비활성
 * @param className 바깥 래퍼 추가 클래스
 * @param onChange 값 변경
 */
const Textarea = ({
  value,
  label,
  name,
  rows = 5,
  placeholder,
  helperText,
  errorMessage,
  maxLength,
  hasCounter = false,
  isDisabled = false,
  className,
  onChange,
}: Props) => {
  // hooks
  const id = useId();
  // variables
  const isInvalid = Boolean(errorMessage);
  const message = errorMessage ?? helperText;
  const counter = maxLength
    ? `${value.length} / ${maxLength}`
    : String(value.length);
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
      <textarea
        className={cn(
          "w-full resize-y rounded-medium border bg-white px-3.5 py-3 text-4 leading-6 text-gray-900 transition-colors duration-150 outline-none placeholder:text-gray-400 focus:border-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
          isInvalid ? "border-red-500 focus:border-red-500" : "border-gray-200",
        )}
        id={id}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={isDisabled}
        aria-invalid={isInvalid || undefined}
        onChange={event => onChange(event.target.value)}
      />
      {message || hasCounter ? (
        <div className="flex items-start justify-between gap-3 text-3 leading-4">
          <p className={isInvalid ? "text-red-600" : "text-gray-500"}>
            {message}
          </p>
          {hasCounter ? (
            <span className="shrink-0 text-gray-400">{counter}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Textarea;
