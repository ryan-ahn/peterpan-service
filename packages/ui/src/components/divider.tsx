import cn from "../lib/cn";

/**
 * types
 */
type Props = {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

/**
 * 구분선
 * @param orientation 방향
 * @param className 색·여백
 */
const Divider = ({ orientation = "horizontal", className }: Props) => {
  // render
  return (
    <span
      className={cn(
        "block shrink-0 bg-gray-200",
        orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
        className,
      )}
      role="separator"
      aria-orientation={orientation}
    />
  );
};

export default Divider;
