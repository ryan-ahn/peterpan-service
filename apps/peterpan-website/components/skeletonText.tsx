import type { ReactNode } from "react";

/**
 * types
 */
type Props = {
  children: ReactNode;
};

/**
 * 글자 자리 스켈레톤. 대신 넣은 글을 투명하게 두고 배경만 칠해, 줄 높이·기준선·줄바꿈이 실제 글과 같다
 * @param children 실제 글과 비슷한 길이의 대신 글
 */
const SkeletonText = ({ children }: Props) => {
  // render
  return (
    <span
      className="animate-pulse rounded-small bg-beige box-decoration-clone text-transparent select-none"
      aria-hidden="true">
      {children}
    </span>
  );
};

export default SkeletonText;
