import Image from "next/image";
import Link from "next/link";

import { categoryLabel } from "@repo/db/boards";
import { buttonStyle } from "@repo/ui/components/button";

import BrandText from "@components/brandText";
import WorkCarousel from "@components/workCarousel";
import { formatDate } from "@lib/format";
import { VALUES } from "@lib/foundation";
import { listLatestNews } from "@lib/posts";

/**
 * constants
 */
const NEWS_COUNT = 3;

/**
 * types
 */
type NewsItem = Awaited<ReturnType<typeof listLatestNews>>[number];

type NewsSectionProps = {
  news: NewsItem[];
};

/**
 * screen — 홈. 첫 화면, 가치, 하는 일, 소식과 정보공개
 */
const HomeScreen = async () => {
  // variables
  const news = await listLatestNews(NEWS_COUNT).catch(() => []);
  // render
  return (
    <>
      <HeroSection />
      <ValuesSection />
      <WorkCarousel />
      <NewsSection news={news} />
    </>
  );
};

/**
 * section
 */
const HeroSection = () => (
  <section className="border-b border-beige">
    <div className="page-wide grid items-center gap-10 py-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:py-20">
      <div>
        <BrandText variant="overline" color="pine">
          Peter Pan Foundation
        </BrandText>
        <div className="mt-4 w-10 border-t-2 border-gold" />
        <BrandText as="h1" variant="display" color="pine" className="mt-5">
          자폐인의 오늘,
          <br />
          더 넓은 내일로
        </BrandText>
        <BrandText variant="body" color="muted" className="mt-6 max-w-md">
          피터팬 재단은 성인 중증 자폐성장애인이 부모의 생애주기 변화와 관계없이
          안정된 환경에서 자신의 삶을 지속할 수 있는 생활주거공동체를
          만들어갑니다.
        </BrandText>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/about"
            className={buttonStyle({ variant: "solid", color: "pine" })}>
            재단 소개
          </Link>
          <Link
            href="/donate"
            className={buttonStyle({ variant: "line", color: "pine" })}>
            후원하기
          </Link>
        </div>
      </div>
      <div className="relative min-h-120 overflow-hidden rounded-2xlarge lg:min-h-140">
        <Image
          src="/images/hero.jpg"
          alt="나무 사이에 자리한 낮은 집들"
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        <div className="absolute inset-x-0 bottom-0 bg-pine-deep/92 px-6 py-5">
          <BrandText variant="caption" color="gold">
            재단의 약속
          </BrandText>
          <BrandText variant="cardTitle" color="paper" className="mt-1">
            혼자가 되어도, 혼자가 아닌 삶.
          </BrandText>
        </div>
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
          </div>
        ))}
      </div>
    </div>
  </section>
);

const NewsSection = ({ news }: NewsSectionProps) => (
  <section className="border-t border-beige bg-paper py-16 lg:py-20">
    <div className="page-wide grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
      <div>
        <div className="flex items-end justify-between gap-4 border-b border-beige pb-4">
          <div>
            <BrandText variant="overline" color="pine">
              News
            </BrandText>
            <BrandText as="h2" variant="heading" color="pine" className="mt-2">
              재단소식
            </BrandText>
          </div>
          <Link href="/news" className="text-4 leading-5 text-pine">
            전체 보기
          </Link>
        </div>
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
      </div>
      <aside className="flex flex-col justify-between rounded-2xlarge bg-pine px-8 py-10 text-paper">
        <div>
          <BrandText variant="overline" color="gold">
            Disclosure
          </BrandText>
          <BrandText as="h2" variant="heading" className="mt-3">
            운영은 열려 있어야 합니다.
          </BrandText>
          <BrandText variant="bodyCompact" color="beige" className="mt-4">
            사업계획, 결산, 감사보고서와 기부금 모금·활용 실적은 연도별로 이
            자리에 올립니다. 자료가 준비되는 대로 파일을 공개합니다.
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
            경영공시
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

export default HomeScreen;
