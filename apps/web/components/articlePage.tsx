import type { ReactNode } from "react";

import type { ArticleSection } from "@/content/foundation";

type ArticlePageProps = {
  eyebrow: string;
  title: string;
  lead: string;
  sections: ArticleSection[];
  children?: ReactNode;
};

const ArticlePage = ({
  eyebrow,
  title,
  lead,
  sections,
  children,
}: ArticlePageProps) => {
  return (
    <article>
      <header className="border-b border-beige bg-[linear-gradient(180deg,#fffaf3_0%,#f7f3ea_100%)]">
        <div className="mx-auto w-[min(860px,calc(100%-2rem))] py-16">
          <p className="text-sm font-medium tracking-wide text-gold-deep">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-green md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">{lead}</p>
        </div>
      </header>
      <div className="mx-auto flex w-[min(860px,calc(100%-2rem))] flex-col gap-12 py-14">
        {sections.map(section => (
          <section key={section.title ?? section.paragraphs?.[0]} className="flex flex-col gap-4">
            {section.title ? (
              <h2 className="text-2xl font-semibold text-green">{section.title}</h2>
            ) : null}
            {section.paragraphs?.map(paragraph => (
              <p key={paragraph.slice(0, 24)} className="leading-8 text-ink/90">
                {paragraph}
              </p>
            ))}
            {section.bullets ? (
              <ul className="flex flex-col gap-2 pl-5">
                {section.bullets.map(item => (
                  <li key={item} className="list-disc leading-7">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            {section.cards ? (
              <div className="grid gap-4 md:grid-cols-2">
                {section.cards.map(card => (
                  <div key={card.title} className="rounded-3xl bg-white p-5 shadow-sm">
                    {card.meta ? (
                      <p className="text-xs font-medium tracking-wide text-gold-deep">
                        {card.meta}
                      </p>
                    ) : null}
                    <h3 className="mt-1 font-semibold text-green">{card.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{card.body}</p>
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
