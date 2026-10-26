import { Suspense } from "react";

import Link from "next/link";

import { categoryLabel } from "@repo/db/boards";
import { buttonStyle } from "@repo/ui/components/button";
import Icon from "@repo/ui/icon";
import cn from "@repo/ui/lib/cn";

import BrandText from "@components/brandText";
import LogoEmblem from "@components/logoEmblem";
import SkeletonText from "@components/skeletonText";
import VillageAerial from "@components/villageAerial";
import WorkCarousel from "@components/workCarousel";
import { formatDate } from "@lib/format";
import { VALUES } from "@lib/foundation";
import { listLatestNews } from "@lib/posts";

/**
 * constants
 */
const NEWS_COUNT = 5;

const DISCLOSURE_LINKS = [
  {
    href: "/disclosure/management",
    label: "경영 공시",
    description: "사업계획·결산서·감사보고서",
  },
  {
    href: "/disclosure/donations",
    label: "기부금 공시",
    description: "기부금 모금액과 활용 실적",
  },
];

/**
 * screen — 홈. 첫 화면, 가치, 하는 일, 소식과 정보공개. 소식 목록만 스켈레톤 뒤에서 따로 들어온다
 */
const HomeScreen = () => (
  <>
    <HeroSection />
    <ValuesSection />
    <WorkCarousel />
    <NewsSection />
  </>
);

/**
 * section
 */
const HeroSection = () => (
  <section className="border-b border-beige">
    <div className="page-wide grid items-center gap-10 py-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12 lg:py-20">
      <div>
        <BrandText variant="overline" color="pine">
          Peter Pan Foundation
        </BrandText>
        <div className="mt-4 w-10 border-t-2 border-gold" />
        <BrandText
          as="h1"
          variant="title"
          color="pine"
          className="mt-5 leading-16 xs:leading-20">
          홀로 남겨지지 않는 삶,
          <br />
          존엄이 지켜지는 안전한 삶,
          <br />그 삶을 함께 지키는 작은 마을
        </BrandText>
        <BrandText variant="body" color="muted" className="mt-6 max-w-md">
          피터팬 재단은 성인 중증 자폐성장애인이 가족의 돌봄 여건과 관계없이
          안전하고 존엄한 삶을 이어 갈 수 있도록, 지속 가능한 주거와 돌봄의
          기반을 만들어 갑니다.
        </BrandText>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/about"
            className={buttonStyle({ variant: "solid", color: "pine" })}>
            재단소개
          </Link>
          <Link
            href="/donate"
            className={buttonStyle({ variant: "line", color: "pine" })}>
            후원하기
          </Link>
        </div>
      </div>
      <div className="group/aerial flex flex-col items-center gap-1 lg:pt-12">
        <VillageAerial />
        <Link
          href="/village/spaces"
          className="inline-flex items-center gap-1 text-4 leading-5 font-medium text-pine transition-[opacity,visibility] duration-50 hover:text-pine-deep max-md:group-has-data-spot-open/aerial:invisible max-md:group-has-data-spot-open/aerial:opacity-0">
          조감도 자세히
          <Icon name="chevron-right" size={16} />
        </Link>
      </div>
    </div>
  </section>
);

const ValuesSection = () => (
  <section className="bg-paper">
    <div className="page-wide py-16 lg:py-20">
      <BrandText variant="overline" color="pine">
        What we stand for
      </BrandText>
      <BrandText as="h2" variant="section" color="pine" className="mt-2">
        재단이 지키는 가치
      </BrandText>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map(value => (
          <div
            key={value.title}
            className="group relative flex flex-col overflow-hidden rounded-xlarge border border-beige bg-white px-6 pt-7 pb-8 transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-sage">
            <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
            <span
              aria-hidden
              className="pointer-events-none absolute top-3 right-5 font-en text-19 leading-none font-semibold text-beige/60">
              {value.index}
            </span>
            <span
              className={cn(
                "relative grid size-14 place-items-center rounded-full bg-paper",
                value.emblem === "star" ? "text-gold-deep" : "text-pine",
              )}>
              <LogoEmblem name={value.emblem} className="size-8" />
            </span>
            <BrandText variant="caption" color="goldDeep" className="mt-6">
              {value.keywords.join(" · ")}
            </BrandText>
            <h3 className="mt-1 text-6 leading-8 font-semibold text-pine">
              {value.title}
            </h3>
            <div className="mt-3 w-8 border-t-2 border-gold" />
            <BrandText variant="smallCompact" color="muted" className="mt-3">
              {value.body}
            </BrandText>
            {"link" in value ? (
              <a
                href={value.link.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-4 leading-5 font-medium text-pine hover:text-pine-deep">
                {value.link.label}
                <Icon name="external-link" size={16} />
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const NewsSection = () => (
  <section className="border-t border-beige bg-paper py-16 lg:py-20">
    <div className="page-wide grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
      <div>
        <div className="flex items-end justify-between gap-4 border-b border-beige pb-4">
          <div>
            <BrandText variant="overline" color="pine">
              News
            </BrandText>
            <BrandText as="h2" variant="heading" color="pine" className="mt-2">
              재단 소식
            </BrandText>
          </div>
          <Link href="/news" className="text-4 leading-5 text-pine">
            소식 전체 보기
          </Link>
        </div>
        <Suspense fallback={<NewsListSkeleton />}>
          <NewsList />
        </Suspense>
      </div>
      <aside className="flex flex-col rounded-2xlarge bg-sage/15 px-7 py-8 md:px-8 md:py-9">
        <BrandText variant="overline" color="pine">
          Disclosure
        </BrandText>
        <BrandText as="h2" variant="heading" color="pine" className="mt-2">
          운영은 투명하게 공개하겠습니다.
        </BrandText>
        <BrandText variant="bodyCompact" color="inkSoft" className="mt-3">
          피터팬 재단은 사업계획과 재정 운영, 기부금의 모금 및 사용 내역을
          투명하게 공개하겠습니다.
        </BrandText>
        <ul className="mt-6 flex flex-col gap-2">
          {DISCLOSURE_LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex items-center gap-4 rounded-xlarge bg-white/85 px-5 py-4 transition-colors hover:bg-white">
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-pine">
                    {link.label}
                  </span>
                  <span className="block text-4 leading-5 text-muted">
                    {link.description}
                  </span>
                </span>
                <Icon
                  name="chevron-right"
                  size={18}
                  className="shrink-0 text-pine transition-transform group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  </section>
);

/**
 * inner components
 */
const NewsList = async () => {
  // variables
  const news = await listLatestNews(NEWS_COUNT).catch(() => []);
  // render
  return (
    <div className="flex flex-col">
      {news.length === 0 ? (
        <BrandText variant="bodyCompact" color="muted" className="py-8">
          등록된 소식이 없습니다.
        </BrandText>
      ) : (
        news.map(post => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="grid gap-1 border-b border-beige py-5 md:grid-cols-[6.5rem_1fr_auto] md:items-baseline md:gap-6">
            <span className="text-4 leading-5 text-gold-deep">
              {categoryLabel(post.category)}
            </span>
            <span className="truncate font-medium text-ink">{post.title}</span>
            <span className="text-4 leading-5 text-muted tabular-nums">
              {formatDate(post.createdAt)}
            </span>
          </Link>
        ))
      )}
    </div>
  );
};

const NewsListSkeleton = () => (
  <div className="flex flex-col">
    {Array.from({ length: NEWS_COUNT }, (_, index) => (
      <div
        key={index}
        className="grid gap-1 border-b border-beige py-5 md:grid-cols-[6.5rem_1fr_auto] md:items-baseline md:gap-6">
        <span className="text-4 leading-5">
          <SkeletonText>언론보도</SkeletonText>
        </span>
        <span className="truncate font-medium">
          <SkeletonText>재단 소식 제목이 이 자리에 들어갑니다</SkeletonText>
        </span>
        <span className="text-4 leading-5 tabular-nums">
          <SkeletonText>2026.10.27</SkeletonText>
        </span>
      </div>
    ))}
  </div>
);

export default HomeScreen;
