import cn from "../lib/cn";
import tv from "../lib/tv";

/**
 * constants
 */
const track = tv({
  base: "relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-150",
  variants: {
    size: {
      small: "h-5 w-9",
      medium: "h-7 w-12",
    },
    isOn: {
      true: "bg-primary-500",
      false: "bg-gray-300",
    },
  },
});

const thumb = tv({
  base: "rounded-full bg-white shadow-small transition-transform duration-150",
  variants: {
    size: {
      small: "size-4",
      medium: "size-6",
    },
    isOn: {
      true: "",
      false: "translate-x-0",
    },
  },
  compoundVariants: [
    { size: "small", isOn: true, class: "translate-x-4" },
    { size: "medium", isOn: true, class: "translate-x-5" },
  ],
});

/**
 * types
 */
export type Size = "small" | "medium";

type Props = {
  isOn: boolean;
  label?: string;
  size?: Size;
  isDisabled?: boolean;
  className?: string;
  onChange: (isOn: boolean) => void;
};

/**
 * 켜고 끄는 스위치
 * @param isOn 켜짐 여부
 * @param label 오른쪽 이름
 * @param size 크기
 * @param isDisabled 비활성
 * @param className 추가 클래스
 * @param onChange 다음 값
 */
const Toggle = ({
  isOn,
  label,
  size = "medium",
  isDisabled = false,
  className,
  onChange,
}: Props) => {
  // handlers
  const handleToggleClick = () => {
    onChange(!isOn);
  };
  // render
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center gap-2.5 text-4 leading-5 text-gray-800 disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      type="button"
      role="switch"
      aria-checked={isOn}
      disabled={isDisabled}
      onClick={handleToggleClick}>
      <span className={track({ size, isOn })}>
        <span className={thumb({ size, isOn })} />
      </span>
      {label ? <span>{label}</span> : null}
    </button>
  );
};

export default Toggle;
