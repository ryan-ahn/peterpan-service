import { Suspense } from "react";

import Link from "next/link";

import { categoryLabel } from "@repo/db/boards";
import { buttonStyle } from "@repo/ui/components/button";
import Icon from "@repo/ui/icon";

import BrandText from "@components/brandText";
import SkeletonText from "@components/skeletonText";
import { formatDate } from "@lib/format";
import { FOUNDING_LEAD, FOUNDING_PREAMBLE } from "@lib/foundation";
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
 * screen — 홈. 비전·소식과 정보공개. 소식 목록만 스켈레톤 뒤에서 따로 들어온다
 */
const HomeScreen = () => (
  <>
    <HeroSection />
    <NewsSection />
  </>
);

/**
 * section
 */
const HeroSection = () => (
  <section className="border-b border-beige bg-white">
    <div className="page-wide py-14 lg:py-20">
      <div className="max-w-3xl">
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
        <BrandText variant="body" color="inkSoft" className="mt-8">
          {FOUNDING_LEAD}
        </BrandText>
        <BrandText variant="bodyCompact" color="muted" className="mt-5">
          {FOUNDING_PREAMBLE}
        </BrandText>
        <div className="mt-10 flex flex-wrap gap-3">
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
        <Link
          href="/village"
          className="mt-8 inline-flex items-center gap-1 border-t border-beige pt-8 text-4 leading-5 font-medium text-pine hover:text-pine-deep">
          피터팬 마을 소개
          <Icon name="chevron-right" size={16} />
        </Link>
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
