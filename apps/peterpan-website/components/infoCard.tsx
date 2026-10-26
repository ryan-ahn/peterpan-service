import type { ReactNode } from "react";

import cn from "@repo/ui/lib/cn";

import BrandText from "@components/brandText";

/**
 * types
 */
type Props = {
  meta?: string;
  title: string;
  body?: string;
  leftChildren?: ReactNode;
  children?: ReactNode;
};

/**
 * 흰 카드. 작은 분류·제목·설명, 그 아래 목록 같은 덧붙임
 * @param meta 제목 위 작은 분류
 * @param title 제목
 * @param body 설명
 * @param leftChildren 왼쪽 아이콘
 * @param children 설명 아래 덧붙임
 */
const InfoCard = ({ meta, title, body, leftChildren, children }: Props) => {
  // render
  return (
    <div className="flex gap-4 rounded-xlarge border border-beige bg-white px-5 py-6">
      {leftChildren}
      <div className="flex min-w-0 flex-1 flex-col">
        {meta ? (
          <BrandText variant="caption" color="goldDeep">
            {meta}
          </BrandText>
        ) : null}
        <h3
          className={cn(
            "text-6 leading-8 font-semibold text-pine",
            meta && "mt-1",
          )}>
          {title}
        </h3>
        {body ? (
          <BrandText variant="smallCompact" color="muted" className="mt-2">
            {body}
          </BrandText>
        ) : null}
        {children}
      </div>
    </div>
  );
};

export default InfoCard;
