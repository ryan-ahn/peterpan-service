import cn from "../lib/cn";
import tv from "../lib/tv";

/**
 * constants
 */
const spinner = tv({
  base: "inline-block shrink-0 animate-spin rounded-full border-current border-r-transparent",
  variants: {
    size: {
      small: "size-4 border-2",
      medium: "size-5 border-2",
      large: "size-8 border-3",
    },
  },
});

/**
 * types
 */
export type Size = "small" | "medium" | "large";

type Props = {
  size?: Size;
  className?: string;
};

/**
 * 로딩 표시. 글자색(`currentColor`)으로 그린다
 * @param size 크기
 * @param className 추가 클래스
 */
const Spinner = ({ size = "medium", className }: Props) => {
  // render
  return (
    <span
      className={cn(spinner({ size }), className)}
      role="status"
      aria-label="불러오는 중"
    />
  );
};

export default Spinner;
