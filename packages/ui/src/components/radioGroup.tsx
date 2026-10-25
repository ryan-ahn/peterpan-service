import cn from "../lib/cn";

/**
 * types
 */
export type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  name: string;
  value: T;
  options: Option<T>[];
  label?: string;
  direction?: "row" | "column";
  isDisabled?: boolean;
  className?: string;
  onChange: (value: T) => void;
};

/**
 * 라디오 묶음. 화살표 키 이동은 브라우저 기본 동작을 쓴다
 * @param name 묶음 이름(input name)
 * @param value 고른 값
 * @param options 선택지
 * @param label 묶음 이름표
 * @param direction 배치 방향
 * @param isDisabled 비활성
 * @param className 추가 클래스
 * @param onChange 고른 값 변경
 */
const RadioGroup = <T extends string>({
  name,
  value,
  options,
  label,
  direction = "row",
  isDisabled = false,
  className,
  onChange,
}: Props<T>) => {
  // render
  return (
    <fieldset
      className={cn("flex flex-col gap-2", className)}
      disabled={isDisabled}>
      {label ? (
        <legend className="mb-2 text-3.5 leading-5 font-medium text-gray-700">
          {label}
        </legend>
      ) : null}
      <div
        className={cn(
          "flex gap-x-5 gap-y-2.5",
          direction === "column" ? "flex-col" : "flex-wrap",
        )}>
        {options.map(option => (
          <label
            key={option.value}
            className="inline-flex cursor-pointer items-center gap-2 text-4 leading-5 text-gray-800 has-disabled:cursor-not-allowed has-disabled:opacity-40">
            <input
              className="peer sr-only"
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="grid size-5 shrink-0 place-items-center rounded-full border border-gray-300 bg-white transition-colors duration-150 peer-checked:border-gray-900 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-400 after:size-2.5 after:scale-0 after:rounded-full after:bg-gray-900 after:transition-transform after:duration-150 peer-checked:after:scale-100" />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

export default RadioGroup;
