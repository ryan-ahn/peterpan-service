import cn from "../lib/cn";

/**
 * types
 */
type Props = {
  isRound?: boolean;
  className?: string;
};

/**
 * 불러오는 동안 자리를 잡는 회색 블록. 크기는 `className`(`h-5 w-40` 등)으로 준다
 * @param isRound 원형
 * @param className 크기·모서리
 */
const Skeleton = ({ isRound = false, className }: Props) => {
  // render
  return (
    <span
      className={cn(
        "block animate-pulse bg-gray-100",
        isRound ? "rounded-full" : "rounded-small",
        className,
      )}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
