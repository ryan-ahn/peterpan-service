import type { ReactNode } from "react";

import cn from "@repo/ui/lib/cn";

import BrandText from "@components/brandText";

/**
 * types
 */
type Tone = "plain" | "paper";

type Props = {
  id?: string;
  overline: string;
  title: string;
  description?: string;
  tone?: Tone;
  children: ReactNode;
};

/**
 * 가로 띠 구역. 영문 소제목·제목·설명 아래에 본문을 page-article 칼럼으로 놓는다
 * @param id 앵커 이름
 * @param overline 제목 위 영문 소제목
 * @param title 구역 제목
 * @param description 제목 아래 한두 줄 설명
 * @param tone 바탕. plain 기본 / paper 종이색
 * @param children 본문
 */
const BandSection = ({
  id,
  overline,
  title,
  description,
  tone = "plain",
  children,
}: Props) => {
  // render
  return (
    <section
      id={id}
      className={cn(
        "border-b border-beige last:border-b-0",
        tone === "paper" && "bg-paper",
      )}>
      <div className="page-article py-10 lg:py-12">
        <BrandText variant="overline" color="pine">
          {overline}
        </BrandText>
        <BrandText as="h2" variant="heading" color="pine" className="mt-2">
          {title}
        </BrandText>
        {description ? (
          <BrandText variant="bodyCompact" color="muted" className="mt-4">
            {description}
          </BrandText>
        ) : null}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
};

export default BandSection;
