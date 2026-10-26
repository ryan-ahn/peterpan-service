import type { Metadata } from "next";

import { eq } from "drizzle-orm";

import { bylaws, getDb } from "@repo/db";
import { publicStorageUrl } from "@repo/db/boards";
import {
  type BylawArticle,
  type BylawOutline,
  readBylawOutline,
} from "@repo/db/bylawOutline";
import { buttonStyle } from "@repo/ui/components/button";
import Icon from "@repo/ui/icon";
import cn from "@repo/ui/lib/cn";

import BrandText from "@components/brandText";
import FoundationHeader from "@components/foundationHeader";
import FoundationHeading from "@components/foundationHeading";
import { formatDate } from "@lib/format";

export const metadata: Metadata = {
  title: "정관",
  description: "재단법인 피터팬 자폐인복지재단 정관 전문을 공개합니다.",
};

/**
 * constants
 */
const ADDENDA_TITLE = "부칙";

const SECTION_CLASS = "flex flex-col gap-6 py-12 first:pt-0 last:pb-0";

/**
 * types
 */
type Bylaw = typeof bylaws.$inferSelect;

type SummarySectionProps = {
  bylaw: Bylaw;
  outline: BylawOutline;
};

type DownloadSectionProps = {
  bylaw: Bylaw;
};

type OutlineSectionProps = {
  outline: BylawOutline;
};

type ArticleItemProps = {
  article: BylawArticle;
};

/**
 * pre-root runtime
 */
const readPublishedBylaw = async () => {
  try {
    const rows = await getDb()
      .select()
      .from(bylaws)
      .where(eq(bylaws.published, true))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
};

/**
 * screen — 정관. 노출한 정관의 요약·조문·내려받기
 */
const BylawsScreen = async () => {
  const bylaw = await readPublishedBylaw();
  const outline = readBylawOutline(bylaw?.outline);
  return (
    <article>
      <FoundationHeader
        overline="Bylaws"
        title="정관"
        lead={
          bylaw
            ? "재단의 목적과 재산, 임원과 이사회, 사무국의 운영 원칙을 정한 정관을 확인할 수 있습니다."
            : "준비 중입니다."
        }
      />
      {bylaw ? (
        <div className="page-article flex flex-col divide-y divide-beige py-14 lg:py-16">
          {outline ? <SummarySection bylaw={bylaw} outline={outline} /> : null}
          {outline ? <OutlineSection outline={outline} /> : null}
          <DownloadSection bylaw={bylaw} />
        </div>
      ) : null}
    </article>
  );
};

/**
 * section
 */
const SummarySection = ({ bylaw, outline }: SummarySectionProps) => {
  // variables
  const chapters = outline.chapters.filter(
    chapter => chapter.title !== ADDENDA_TITLE,
  );
  const addenda = outline.chapters.find(
    chapter => chapter.title === ADDENDA_TITLE,
  );
  const articleCount = chapters
    .flatMap(chapter => chapter.articles)
    .filter(article => !article.number.includes("의")).length;
  const purpose = chapters
    .flatMap(chapter => chapter.articles)
    .find(article => article.title === "목적");
  const facts = [
    {
      label: "구성",
      value: [
        `${chapters.length}장 ${articleCount}조`,
        addenda ? `부칙 ${addenda.articles.length}조` : "",
      ]
        .filter(Boolean)
        .join(" · "),
    },
    {
      label: "제·개정",
      value: bylaw.revisedOn ? formatDate(bylaw.revisedOn) : "—",
    },
    {
      label: "장 구성",
      value: chapters
        .map(chapter => chapter.title.replace(/^제\d+장\s*/, ""))
        .join(" · "),
    },
  ];
  // render
  return (
    <section className={SECTION_CLASS}>
      <FoundationHeading
        title="요약 보기"
        description="정관의 목적과 구성 요약입니다."
      />
      {purpose ? (
        <div className="rounded-xlarge bg-white px-6 py-5">
          <BrandText variant="caption" color="goldDeep">
            {purpose.number}(목적)
          </BrandText>
          <BrandText variant="bodyCompact" color="inkSoft" className="mt-2">
            {purpose.paragraphs.join(" ")}
          </BrandText>
        </div>
      ) : null}
      <dl className="flex flex-col divide-y divide-beige border-t border-beige">
        {facts.map(fact => (
          <div key={fact.label} className="flex gap-4 py-4">
            <dt className="w-20 shrink-0 text-4 leading-7 text-muted">
              {fact.label}
            </dt>
            <dd className="text-4 leading-7 font-medium text-ink">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

const OutlineSection = ({ outline }: OutlineSectionProps) => (
  <section className={SECTION_CLASS}>
    <FoundationHeading
      title="자세히 보기"
      description="펼쳐서 원문을 볼 수 있습니다."
    />
    {outline.chapters.map(chapter => (
      <div key={chapter.title} className="flex flex-col gap-3">
        <BrandText as="h3" variant="caption" color="goldDeep">
          {chapter.title}
        </BrandText>
        <ul className="overflow-hidden rounded-xlarge border border-beige bg-white">
          {chapter.articles.map(article => (
            <ArticleItem key={article.number} article={article} />
          ))}
        </ul>
      </div>
    ))}
  </section>
);

const DownloadSection = ({ bylaw }: DownloadSectionProps) => (
  <section className={SECTION_CLASS}>
    <FoundationHeading
      title="내려받기"
      description="효력은 내려받은 정관 원본을 따릅니다."
    />
    <div className="flex flex-col gap-5 rounded-xlarge border border-beige bg-white p-6 md:flex-row md:items-center">
      <span className="grid size-12 shrink-0 place-items-center rounded-large bg-paper text-pine">
        <Icon name="file-text" size={24} />
      </span>
      <div className="min-w-0 flex-1">
        <BrandText as="h3" variant="cardTitle" color="pine">
          {bylaw.title}
        </BrandText>
        <BrandText variant="smallCompact" color="muted" className="mt-1">
          {[
            bylaw.revisedOn ? `${formatDate(bylaw.revisedOn)} 제·개정` : "",
            formatFileSize(bylaw.size),
          ]
            .filter(Boolean)
            .join(" · ")}
        </BrandText>
      </div>
      <a
        href={`${publicStorageUrl({ bucket: bylaw.bucket, path: bylaw.path })}?download=${encodeURIComponent(bylaw.fileName)}`}
        className={cn(
          buttonStyle({ variant: "solid", color: "pine", isRound: true }),
          "w-fit",
        )}>
        정관 내려받기
      </a>
    </div>
  </section>
);

/**
 * inner components
 */
const ArticleItem = ({ article }: ArticleItemProps) => (
  <li className="border-b border-beige last:border-b-0">
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="w-16 shrink-0 text-4 leading-6 text-gold-deep">
          {article.number}
        </span>
        <span className="flex-1 text-4 leading-6 font-medium text-ink">
          {article.title}
        </span>
        <Icon
          name="chevron-down"
          size={18}
          className="shrink-0 text-muted transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="flex flex-col gap-2 px-5 pb-5 md:pl-24">
        {article.paragraphs.map(paragraph => (
          <p
            key={paragraph.slice(0, 32)}
            className={cn(
              "text-4 leading-8 text-ink/90",
              /^\d+\.\s/.test(paragraph) && "pl-4",
            )}>
            {paragraph}
          </p>
        ))}
      </div>
    </details>
  </li>
);

/**
 * utils
 */
const formatFileSize = (size: number) => {
  if (size <= 0) {
    return "";
  }
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))}KB`;
  }
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
};

export default BylawsScreen;
