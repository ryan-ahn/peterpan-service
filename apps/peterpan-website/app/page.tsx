import Image from "next/image";
import Link from "next/link";

import { categoryLabel } from "@repo/db/boards";
import { buttonStyle } from "@repo/ui/components/button";
import cn from "@repo/ui/lib/cn";

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

type ValueIconProps = {
  name: (typeof VALUES)[number]["icon"];
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
  <section className="relative overflow-hidden">
    <div className="mx-auto grid min-h-170 w-full max-w-350 items-center lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <div className="relative z-10 px-6 py-16 md:px-12 lg:px-16">
        <p className="text-4 leading-5 text-muted md:text-5 md:leading-7">
          성인 중증 자폐성장애인이 존엄하고 안전한 삶을 이어갈 수 있는 사회
        </p>
        <BrandText as="h1" variant="display" color="pine" className="mt-5">
          혼자가 되어도,
          <br />
          <span className="text-gold-deep">혼자가 아닌 삶.</span>
        </BrandText>
        <BrandText variant="body" color="muted" className="mt-6 max-w-md">
          피터팬 재단은 성인 중증 자폐성장애인이 부모의 생애주기 변화와 관계없이
          안정된 환경에서 자신의 삶을 지속할 수 있는 생활주거공동체를
          만들어갑니다.
        </BrandText>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/about"
            className={buttonStyle({
              variant: "solid",
              color: "pine",
              isRound: true,
            })}>
            재단 소개 보기 →
          </Link>
          <Link
            href="/donate"
            className={cn(
              buttonStyle({ variant: "line", color: "pine", isRound: true }),
              "bg-white/70",
            )}>
            후원하기 ♡
          </Link>
        </div>
      </div>
      <div className="relative min-h-105 hero-mask lg:min-h-180">
        <Image
          src="/images/hero.jpg"
          alt="나무 사이에 자리한 낮은 집들"
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 60vw, 100vw"
        />
        <BrandText
          variant="pen"
          color="pine"
          className="absolute top-16 right-8 max-w-48 text-right md:right-16">
          각자의 속도로,
          <br />
          서로 연결되어 살아가는
          <br />
          따뜻한 마을을 만들어갑니다.
        </BrandText>
      </div>
    </div>
  </section>
);

const ValuesSection = () => (
  <section className="border-y border-beige/80 bg-paper">
    <div className="page-wide grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">
      {VALUES.map(value => (
        <div
          key={value.title}
          className="flex flex-col items-center text-center">
          <ValueIcon name={value.icon} />
          <h2 className="mt-4 font-semibold text-pine">{value.title}</h2>
          <BrandText variant="smallCompact" color="muted" className="mt-2">
            {value.body}
          </BrandText>
        </div>
      ))}
    </div>
  </section>
);

const NewsSection = ({ news }: NewsSectionProps) => (
  <section className="bg-paper py-16">
    <div className="page-wide grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="flex items-end justify-between gap-4">
          <BrandText as="h2" variant="heading" color="pine">
            재단소식
          </BrandText>
          <Link href="/news" className="text-4 leading-5 text-pine">
            전체 보기
          </Link>
        </div>
        <div className="mt-5 flex flex-col">
          {news.length === 0 ? (
            <BrandText
              variant="bodyCompact"
              color="muted"
              className="rounded-2xlarge bg-white px-5 py-8">
              등록된 소식이 없습니다.
            </BrandText>
          ) : (
            news.map(post => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="flex flex-col gap-1 border-b border-beige py-4 md:flex-row md:items-center md:justify-between">
                <span className="text-4 leading-5 text-gold-deep">
                  {categoryLabel(post.category)}
                </span>
                <span className="flex-1 font-medium md:px-6">{post.title}</span>
                <span className="text-4 leading-5 text-muted">
                  {formatDate(post.createdAt)}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
      <aside className="rounded-3xlarge bg-pine px-8 py-10 text-paper">
        <BrandText variant="caption" color="gold">
          정보공개
        </BrandText>
        <BrandText as="h2" variant="heading" className="mt-2">
          운영은 열려 있어야 합니다.
        </BrandText>
        <BrandText variant="bodyCompact" color="beige" className="mt-4">
          사업계획, 결산, 감사보고서와 기부금 모금·활용 실적은 연도별로 이
          자리에 올립니다. 자료가 준비되는 대로 파일을 공개합니다.
        </BrandText>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/disclosure/management"
            className={buttonStyle({
              variant: "solid",
              color: "white",
              size: "small",
              isRound: true,
            })}>
            경영공시
          </Link>
          <Link
            href="/disclosure/donations"
            className={buttonStyle({
              variant: "line",
              color: "white",
              size: "small",
              isRound: true,
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
const ValueIcon = ({ name }: ValueIconProps) => {
  // render
  if (name === "home") {
    return (
      <svg viewBox="0 0 64 64" className="size-14" aria-hidden="true">
        <path d="M10 30 L32 14 L54 30 V50 H10Z" className="fill-beige" />
        <path d="M28 50 V36 H36 V50" className="fill-pine" />
        <path
          d="M8 32 L32 12 L56 32"
          className="fill-none stroke-pine"
          strokeWidth="3"
        />
      </svg>
    );
  }
  if (name === "sprout") {
    return (
      <svg viewBox="0 0 64 64" className="size-14" aria-hidden="true">
        <path d="M32 50 V28" className="stroke-pine" strokeWidth="3" />
        <path
          d="M32 34 C20 34 16 22 18 16 C30 18 34 28 32 34Z"
          className="fill-sage"
        />
        <path
          d="M32 30 C44 28 50 18 48 12 C36 16 32 24 32 30Z"
          className="fill-pine"
        />
      </svg>
    );
  }
  if (name === "tree") {
    return (
      <svg viewBox="0 0 64 64" className="size-14" aria-hidden="true">
        <circle cx="32" cy="26" r="14" className="fill-pine" />
        <rect
          x="29"
          y="36"
          width="6"
          height="16"
          rx="2"
          className="fill-bark"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className="size-14" aria-hidden="true">
      <path
        d="M32 8 L38 24 H56 L42 34 L47 52 L32 42 L17 52 L22 34 L8 24 H26Z"
        className="fill-gold"
      />
    </svg>
  );
};

export default HomeScreen;
