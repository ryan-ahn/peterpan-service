"use client";

import { useId } from "react";

import Icon from "../icon";
import cn from "../lib/cn";
import tv from "../lib/tv";

/**
 * constants
 */
const select = tv({
  base: "w-full cursor-pointer appearance-none border border-gray-200 bg-white pr-10 text-gray-900 transition-colors duration-150 outline-none focus:border-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
  variants: {
    size: {
      small: "h-9 rounded-medium pl-3 text-3.5 leading-5",
      medium: "h-11 rounded-medium pl-3.5 text-4 leading-5",
      large: "h-13 rounded-large pl-4 text-5 leading-6",
    },
  },
});

/**
 * types
 */
export type Size = "small" | "medium" | "large";

export type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  value: T | "";
  options: Option<T>[];
  label?: string;
  name?: string;
  placeholder?: string;
  size?: Size;
  isDisabled?: boolean;
  className?: string;
  onChange: (value: T) => void;
};

/**
 * 고르기. 모바일에서도 OS 선택 UI가 뜨도록 기본 `select`를 쓴다
 * @param value 고른 값. 비어 있으면 `placeholder`가 보인다
 * @param options 선택지
 * @param label 위쪽 이름표
 * @param name 폼 이름
 * @param placeholder 고르기 전 안내
 * @param size 높이·글자 크기
 * @param isDisabled 비활성
 * @param className 바깥 래퍼 추가 클래스
 * @param onChange 고른 값 변경
 */
const Select = <T extends string>({
  value,
  options,
  label,
  name,
  placeholder,
  size = "medium",
  isDisabled = false,
  className,
  onChange,
}: Props<T>) => {
  // hooks
  const id = useId();
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
      <div className="relative">
        <select
          className={select({ size })}
          id={id}
          name={name}
          value={value}
          disabled={isDisabled}
          onChange={event => onChange(event.target.value as T)}>
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size={18}
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
        />
      </div>
    </div>
  );
};

export default Select;
