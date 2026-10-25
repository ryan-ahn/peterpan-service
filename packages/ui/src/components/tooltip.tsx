import type { ReactNode } from "react";

import cn from "../lib/cn";

/**
 * types
 */
export type Placement = "top" | "bottom";

type Props = {
  text: string;
  placement?: Placement;
  children: ReactNode;
  className?: string;
};

/**
 * 말풍선 도움말. 마우스를 올리거나 키보드 포커스가 들어오면 보인다
 * @param text 도움말 문구
 * @param placement 위치
 * @param children 기준 요소. 포커스가 가능한 요소(버튼 등)를 넘긴다
 * @param className 바깥 래퍼 추가 클래스
 */
const Tooltip = ({ text, placement = "top", children, className }: Props) => {
  // render
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 z-40 w-max max-w-60 -translate-x-1/2 rounded-medium bg-gray-900 px-2.5 py-1.5 text-3 leading-4 text-white opacity-0 shadow-medium transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100",
          placement === "top" ? "bottom-full mb-2" : "top-full mt-2",
        )}
        role="tooltip">
        {text}
      </span>
    </span>
  );
};

export default Tooltip;
