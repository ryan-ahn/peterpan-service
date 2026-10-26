import type { Metadata } from "next";
import Link from "next/link";

import cn from "@repo/ui/lib/cn";

import BrandText from "@components/brandText";
import FoundationHeader from "@components/foundationHeader";
import LogoEmblem from "@components/logoEmblem";
import {
  CREED_HORIZON,
  CREED_NOTE,
  CREED_PRINCIPLES,
  CREED_SLOGAN,
  CREED_STATEMENT,
} from "@lib/foundation";

export const metadata: Metadata = {
  title: "이념",
  description:
    "피터팬 재단의 이념. 자폐인의 오늘을 지키고 더 넓은 내일을 여는 재단의 생각을 담았습니다.",
};

/**
 * constants
 */
const COLOR_SWATCH = {
  pine: "bg-pine",
  sage: "bg-sage",
  gold: "bg-gold",
  beige: "bg-beige",
} as const;

/**
 * types
 */
/**
 * screen — 이념. 설립 목적과 로고·색의 뜻을 한 흐름으로
 */
const CreedScreen = () => (
  <article>
    <FoundationHeader overline="Belief" title="이념" lead={CREED_SLOGAN} />
    <StatementSection />
    <PrincipleSection />
  </article>
);

/**
 * section
 */
const StatementSection = () => (
  <section className="border-b border-beige">
    <div className="page-article grid gap-8 py-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)] lg:items-start lg:gap-16 lg:py-12">
      <div>
        <h2 className="text-8 leading-12 font-semibold text-pine">
          {CREED_STATEMENT}
        </h2>
        <p className="mt-6 text-6 leading-10 font-semibold text-ink">
          {CREED_HORIZON}
        </p>
      </div>
      <BrandText variant="body" color="muted">
        {CREED_NOTE}
      </BrandText>
    </div>
  </section>
);

const PrincipleSection = () => (
  <section className="bg-paper">
    <div className="page-article py-10 lg:py-12">
      <BrandText variant="overline" color="pine">
        In the mark
      </BrandText>
      <BrandText as="h2" variant="heading" color="pine" className="mt-2">
        모양으로 읽는 이념
      </BrandText>
      <BrandText variant="bodyCompact" color="muted" className="mt-4">
        사람과 곡선, 위로 향하는 움직임과 별, 그리고 색은 이 이념을 그린
        것입니다.
      </BrandText>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {CREED_PRINCIPLES.map(principle => (
          <article
            key={principle.name}
            className="flex flex-col rounded-xlarge border border-beige bg-white px-6 py-7">
            <div className="flex items-center justify-between">
              <span className="grid size-12 place-items-center rounded-large bg-paper text-pine">
                <LogoEmblem name={principle.name} />
              </span>
              <span
                className={cn(
                  "size-4 rounded-full border border-ink/15",
                  COLOR_SWATCH[principle.color],
                )}
                aria-hidden="true"
              />
            </div>
            <p className="mt-5 text-4 leading-5 font-semibold text-gold-deep">
              {principle.words}
            </p>
            <h3 className="mt-2 text-6 leading-8 font-semibold text-pine">
              {principle.title}
            </h3>
            <BrandText variant="smallCompact" color="muted" className="mt-3">
              {principle.body}
            </BrandText>
            <BrandText variant="caption" color="muted" className="mt-5">
              {principle.tone}
            </BrandText>
          </article>
        ))}
      </div>
      <Link
        href="/about"
        className="mt-8 inline-block text-4 leading-5 text-pine">
        설립 배경과 목적 보기
      </Link>
    </div>
  </section>
);

export default CreedScreen;
