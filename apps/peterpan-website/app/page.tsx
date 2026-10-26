import { Suspense } from "react";

import Link from "next/link";

import { categoryLabel } from "@repo/db/boards";
import { buttonStyle } from "@repo/ui/components/button";
import Icon from "@repo/ui/icon";

import BrandSkeleton from "@components/brandSkeleton";
import BrandText from "@components/brandText";
import VillageAerial from "@components/villageAerial";
import WorkCarousel from "@components/workCarousel";
import { formatDate } from "@lib/format";
import { VALUES } from "@lib/foundation";
import { listLatestNews } from "@lib/posts";

/**
 * constants
 */
const NEWS_COUNT = 3;

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
          <br />
          그 삶을 함께 지키는 작은 마을
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
      <div className="mt-8 grid gap-px overflow-hidden rounded-xlarge border border-beige bg-beige sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map(value => (
          <div key={value.title} className="bg-white px-6 py-8">
            <BrandText variant="overline" color="goldDeep">
              {value.index}
            </BrandText>
            <h3 className="mt-4 text-6 leading-8 font-semibold text-pine">
              {value.title}
            </h3>
            <BrandText variant="smallCompact" color="muted" className="mt-2">
              {value.body}
            </BrandText>
            {"link" in value ? (
              <Link
                href={value.link.href}
                className="mt-3 inline-flex items-center gap-1 text-4 leading-5 font-medium text-pine hover:text-pine-deep">
                {value.link.label}
                <Icon name="chevron-right" size={16} />
              </Link>
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
      <aside className="flex flex-col justify-between rounded-2xlarge bg-pine px-8 py-10 text-paper">
        <div>
          <BrandText variant="overline" color="gold">
            Disclosure
          </BrandText>
          <BrandText as="h2" variant="heading" className="mt-3">
            운영은 투명하게 공개하겠습니다.
          </BrandText>
          <BrandText variant="bodyCompact" color="beige" className="mt-4">
            피터팬 재단은 사업계획과 재정 운영, 기부금의 모금 및 사용 내역을
            투명하게 공개하겠습니다.
          </BrandText>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/disclosure/management"
            className={buttonStyle({
              variant: "solid",
              color: "white",
              size: "small",
            })}>
            경영 공시
          </Link>
          <Link
            href="/disclosure/donations"
            className={buttonStyle({
              variant: "line",
              color: "white",
              size: "small",
            })}>
            기부금 공시
          </Link>
        </div>
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
            <span className="font-medium text-ink">{post.title}</span>
            <span className="text-4 leading-5 text-muted">
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
        className="flex flex-col gap-2 border-b border-beige py-5 md:flex-row md:items-center md:gap-6">
        <BrandSkeleton className="h-5 w-16" />
        <BrandSkeleton className="h-5 w-3/4 md:flex-1" />
        <BrandSkeleton className="h-5 w-20" />
      </div>
    ))}
  </div>
);

export default HomeScreen;
