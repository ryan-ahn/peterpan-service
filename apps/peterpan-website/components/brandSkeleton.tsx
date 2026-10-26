import Skeleton from "@repo/ui/components/skeleton";
import cn from "@repo/ui/lib/cn";

/**
 * types
 */
type Props = {
  isRound?: boolean;
  className?: string;
};

/**
 * `Skeleton` 위에 베이지 톤을 얹어 바탕(paper)·흰 카드 어디서나 보이게 한 자리 블록
 * @param isRound 원형
 * @param className 크기·모서리
 */
const BrandSkeleton = ({ isRound = false, className }: Props) => {
  // render
  return <Skeleton isRound={isRound} className={cn("bg-beige", className)} />;
};

export default BrandSkeleton;
