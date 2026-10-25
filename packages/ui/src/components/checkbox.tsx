import Icon from "../icon";
import cn from "../lib/cn";
import tv from "../lib/tv";

/**
 * constants
 */
const box = tv({
  base: "grid shrink-0 place-items-center rounded-small border transition-colors duration-150",
  variants: {
    size: {
      small: "size-4",
      medium: "size-5",
    },
    isActive: {
      true: "border-gray-900 bg-gray-900 text-white",
      false: "border-gray-300 bg-white text-transparent",
    },
  },
});

/**
 * types
 */
export type Size = "small" | "medium";

type Props = {
  isChecked: boolean;
  isIndeterminate?: boolean;
  label?: string;
  size?: Size;
  isDisabled?: boolean;
  className?: string;
  onChange: (isChecked: boolean) => void;
};

/**
 * 체크박스. 목록 전체 선택처럼 일부만 고른 상태는 `isIndeterminate`
 * @param isChecked 선택 여부
 * @param isIndeterminate 일부 선택
 * @param label 오른쪽 이름. 없으면 스크린 리더용 이름이 필요하다
 * @param size 크기
 * @param isDisabled 비활성
 * @param className 추가 클래스
 * @param onChange 다음 선택 값
 */
const Checkbox = ({
  isChecked,
  isIndeterminate = false,
  label,
  size = "medium",
  isDisabled = false,
  className,
  onChange,
}: Props) => {
  // variables
  const isActive = isChecked || isIndeterminate;
  // handlers
  const handleCheckboxClick = () => {
    onChange(!isChecked);
  };
  // render
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-4 leading-5 text-gray-800 disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      type="button"
      role="checkbox"
      aria-checked={isIndeterminate ? "mixed" : isChecked}
      disabled={isDisabled}
      onClick={handleCheckboxClick}>
      <span className={box({ size, isActive })}>
        <Icon
          name={isIndeterminate ? "minus" : "check"}
          size={size === "small" ? 12 : 14}
        />
      </span>
      {label ? <span>{label}</span> : null}
    </button>
  );
};

export default Checkbox;
