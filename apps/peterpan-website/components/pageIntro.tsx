import type { ReactNode } from "react";

import BrandText from "@components/brandText";

/**
 * types
 */
type Props = {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  className?: string;
};

/**
 * 하위 페이지 머리. 작은 분류, 제목, 설명 순서
 * @param eyebrow 제목 위 분류
 * @param title 페이지 제목
 * @param lead 제목 아래 설명
 * @param className 추가 클래스
 */
const PageIntro = ({ eyebrow, title, lead, className }: Props) => {
  // render
  return (
    <div className={className}>
      {eyebrow ? (
        <BrandText variant="caption" color="goldDeep" className="mb-2">
          {eyebrow}
        </BrandText>
      ) : null}
      <BrandText as="h1" variant="title" color="pine">
        {title}
      </BrandText>
      {lead ? (
        <BrandText variant="body" color="muted" className="mt-4">
          {lead}
        </BrandText>
      ) : null}
    </div>
  );
};

export default PageIntro;
