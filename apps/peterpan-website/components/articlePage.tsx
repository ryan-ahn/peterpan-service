import type { ReactNode } from "react";

import BrandText from "@components/brandText";
import type { ArticleSection } from "@lib/foundation";

/**
 * types
 */
type Props = {
  eyebrow: string;
  title: string;
  lead: string;
  sections: ArticleSection[];
  children?: ReactNode;
};

/**
 * 재단·마을 소개처럼 문단과 목록, 카드로 된 글 페이지
 * @param eyebrow 제목 위 분류
 * @param title 제목
 * @param lead 제목 아래 요약
 * @param sections 본문 묶음. 제목·문단·목록·카드를 순서대로 그린다
 * @param children 본문 뒤에 붙일 요소(사진, 내려받기 등)
 */
const ArticlePage = ({ eyebrow, title, lead, sections, children }: Props) => {
  // render
  return (
    <article>
      <header className="border-b border-beige bg-linear-to-b from-paper-light to-paper">
        <div className="page-article py-16">
          <BrandText
            variant="caption"
            color="goldDeep"
            className="font-medium tracking-wide">
            {eyebrow}
          </BrandText>
          <BrandText
            as="h1"
            variant="title"
            color="pine"
            className="mt-3 tracking-tight md:text-21 md:leading-19">
            {title}
          </BrandText>
          <BrandText variant="lead" color="muted" className="mt-5">
            {lead}
          </BrandText>
        </div>
      </header>
      <div className="page-article flex flex-col gap-12 py-14">
        {sections.map((section, index) => (
          <section key={index} className="flex flex-col gap-4">
            {section.title ? (
              <BrandText as="h2" variant="heading" color="pine">
                {section.title}
              </BrandText>
            ) : null}
            {section.paragraphs?.map(paragraph => (
              <BrandText
                key={paragraph.slice(0, 24)}
                variant="body"
                color="inkSoft">
                {paragraph}
              </BrandText>
            ))}
            {section.bullets ? (
              <ul className="flex flex-col gap-2 pl-5">
                {section.bullets.map(item => (
                  <li key={item} className="list-disc text-5 leading-9">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            {section.cards ? (
              <div className="grid gap-4 md:grid-cols-2">
                {section.cards.map(card => (
                  <div
                    key={card.title}
                    className="rounded-2xlarge bg-white p-5 shadow-small">
                    {card.meta ? (
                      <p className="text-3 leading-4 font-medium tracking-wide text-gold-deep">
                        {card.meta}
                      </p>
                    ) : null}
                    <h3 className="mt-1 text-5 leading-7 font-semibold text-pine">
                      {card.title}
                    </h3>
                    <BrandText variant="small" color="muted" className="mt-2">
                      {card.body}
                    </BrandText>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ))}
        {children}
      </div>
    </article>
  );
};

export default ArticlePage;
