import Image from "next/image";
import Link from "next/link";

import WorkCarousel from "@/components/workCarousel";
import { VALUES } from "@/content/foundation";
import { categoryLabel, listLatestNews } from "@/lib/posts";
import { formatDate } from "@/lib/format";

const HomePage = async () => {
  const news = await listLatestNews(3).catch(() => []);
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[680px] w-full max-w-[1400px] items-center lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="relative z-10 px-6 py-16 md:px-12 lg:px-16">
            <p className="text-sm text-muted md:text-base">
              성인 중증 자폐성장애인이 존엄하고 안전한 삶을 이어갈 수 있는 사회
            </p>
            <h1 className="mt-5 text-[2.6rem] leading-[1.2] font-semibold tracking-tight text-green md:text-6xl">
              혼자가 되어도,
              <br />
              <span className="text-gold-deep">혼자가 아닌 삶.</span>
            </h1>
            <p className="mt-6 max-w-md leading-8 text-muted">
              피터팬 재단은 성인 중증 자폐성장애인이 부모의 생애주기 변화와
              관계없이 안정된 환경에서 자신의 삶을 지속할 수 있는
              생활주거공동체를 만들어갑니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="rounded-full bg-green px-5 py-3 text-sm font-medium text-white">
                재단 소개 보기 →
              </Link>
              <Link
                href="/donate"
                className="rounded-full border border-green/30 bg-white/70 px-5 py-3 text-sm font-medium text-green">
                후원하기 ♡
              </Link>
            </div>
          </div>
          <div className="hero-mask relative min-h-[420px] lg:min-h-[720px]">
            <Image
              src="/images/hero.jpg"
              alt="나무 사이에 자리한 낮은 집들"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
            <p className="font-pen absolute top-16 right-8 max-w-48 text-right text-[1.7rem] leading-snug text-green md:right-16 md:text-3xl">
              각자의 속도로,
              <br />
              서로 연결되어 살아가는
              <br />
              따뜻한 마을을 만들어갑니다.
            </p>
          </div>
        </div>
      </section>
      <section className="border-y border-beige/80 bg-paper">
        <div className="mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(value => (
            <div key={value.title} className="flex flex-col items-center text-center">
              <ValueIcon name={value.icon} />
              <h2 className="mt-4 font-semibold text-green">{value.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{value.body}</p>
            </div>
          ))}
        </div>
      </section>
      <WorkCarousel />
      <section className="bg-paper py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold text-green">재단소식</h2>
              <Link href="/news" className="text-sm text-green">
                전체 보기
              </Link>
            </div>
            <div className="mt-5 flex flex-col">
              {news.length === 0 ? (
                <p className="rounded-3xl bg-white px-5 py-8 text-muted">
                  등록된 소식이 없습니다.
                </p>
              ) : (
                news.map(post => (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    className="flex flex-col gap-1 border-b border-beige py-4 md:flex-row md:items-center md:justify-between">
                    <span className="text-sm text-gold-deep">
                      {categoryLabel(post.category)}
                    </span>
                    <span className="flex-1 font-medium md:px-6">{post.title}</span>
                    <span className="text-sm text-muted">{formatDate(post.createdAt)}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
          <aside className="rounded-[2rem] bg-green px-8 py-10 text-paper">
            <p className="text-sm text-gold">정보공개</p>
            <h2 className="mt-2 text-2xl font-semibold">운영은 열려 있어야 합니다.</h2>
            <p className="mt-4 leading-7 text-beige">
              사업계획, 결산, 감사보고서와 기부금 모금·활용 실적은 연도별로
              이 자리에 올립니다. 자료가 준비되는 대로 파일을 공개합니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/disclosure/management" className="rounded-full bg-white px-4 py-2 text-sm text-green">
                경영공시
              </Link>
              <Link href="/disclosure/donations" className="rounded-full border border-white/40 px-4 py-2 text-sm">
                기부금 공시
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

const ValueIcon = ({ name }: { name: (typeof VALUES)[number]["icon"] }) => {
  const common = "size-14";
  if (name === "home") {
    return (
      <svg viewBox="0 0 64 64" className={common} aria-hidden="true">
        <path d="M10 30 L32 14 L54 30 V50 H10Z" fill="#EADCC6" />
        <path d="M28 50 V36 H36 V50" fill="#2E5B4B" />
        <path d="M8 32 L32 12 L56 32" fill="none" stroke="#2E5B4B" strokeWidth="3" />
      </svg>
    );
  }
  if (name === "sprout") {
    return (
      <svg viewBox="0 0 64 64" className={common} aria-hidden="true">
        <path d="M32 50 V28" stroke="#2E5B4B" strokeWidth="3" />
        <path d="M32 34 C20 34 16 22 18 16 C30 18 34 28 32 34Z" fill="#8DAA8E" />
        <path d="M32 30 C44 28 50 18 48 12 C36 16 32 24 32 30Z" fill="#2E5B4B" />
      </svg>
    );
  }
  if (name === "tree") {
    return (
      <svg viewBox="0 0 64 64" className={common} aria-hidden="true">
        <circle cx="32" cy="26" r="14" fill="#2E5B4B" />
        <rect x="29" y="36" width="6" height="16" rx="2" fill="#8B5E3C" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className={common} aria-hidden="true">
      <path d="M32 8 L38 24 H56 L42 34 L47 52 L32 42 L17 52 L22 34 L8 24 H26Z" fill="#F2C15E" />
    </svg>
  );
};

export default HomePage;
