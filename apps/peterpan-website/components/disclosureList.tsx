import { type ReactNode, Suspense } from "react";

import Link from "next/link";

import cn from "@repo/ui/lib/cn";

import BrandText from "@components/brandText";
import FoundationHeader from "@components/foundationHeader";
import SkeletonText from "@components/skeletonText";

/**
 * types
 */
export type DisclosureRow = {
  id: string;
  title: string;
  date: string;
  href: string | null;
};

export type DisclosureData = {
  years: number[];
  rows: DisclosureRow[];
};

type Props = {
  overline: string;
  title: string;
  lead: string;
  currentYear?: number;
  basePath: string;
  empty: string;
  data: Promise<DisclosureData>;
  extra?: ReactNode;
};

type RowsSectionProps = {
  currentYear?: number;
  basePath: string;
  empty: string;
  data: Promise<DisclosureData>;
};

type EmptyBoxProps = {
  children: ReactNode;
};

type YearLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
};

/**
 * 경영 공시·기부금 공시 목록. 연도로 거르고 파일을 새 탭으로 연다. 목록만 빈 목록 모양 스켈레톤 뒤에서 들어온다
 * @param overline 제목 위 영문 분류
 * @param title 제목
 * @param lead 설명
 * @param currentYear 선택한 연도. 없으면 전체
 * @param basePath 목록 주소
 * @param empty 자료가 없을 때 문구
 * @param data 자료가 있는 연도와 목록. 연도 탭은 두 해 이상일 때만 보인다
 * @param extra 목록 아래 덧붙일 요소
 */
const DisclosureList = ({
  overline,
  title,
  lead,
  currentYear,
  basePath,
  empty,
  data,
  extra,
}: Props) => {
  // render
  return (
    <article>
      <FoundationHeader overline={overline} title={title} lead={lead} />
      <div className="page-article py-10 lg:py-12">
        <Suspense
          fallback={
            <EmptyBox>
              <SkeletonText>{empty}</SkeletonText>
            </EmptyBox>
          }>
          <RowsSection
            currentYear={currentYear}
            basePath={basePath}
            empty={empty}
            data={data}
          />
        </Suspense>
        {extra}
      </div>
    </article>
  );
};

/**
 * section
 */
const RowsSection = async ({
  currentYear,
  basePath,
  empty,
  data,
}: RowsSectionProps) => {
  // variables
  const { years, rows } = await data;
  // render
  return (
    <>
      {years.length > 1 ? (
        <nav
          aria-label="연도"
          className="mb-6 flex flex-wrap gap-2 text-4 leading-5">
          <YearLink href={basePath} label="전체" isActive={!currentYear} />
          {years.map(year => (
            <YearLink
              key={year}
              href={`${basePath}?year=${year}`}
              label={String(year)}
              isActive={currentYear === year}
            />
          ))}
        </nav>
      ) : null}
      <div className="flex flex-col gap-3">
        {rows.length === 0 ? (
          <EmptyBox>{empty}</EmptyBox>
        ) : (
          rows.map(row => (
            <div
              key={row.id}
              className="flex items-center justify-between gap-4 rounded-xlarge border border-beige bg-white px-5 py-4">
              <div>
                <p className="font-medium">{row.title}</p>
                <p className="text-4 leading-5 text-muted">{row.date}</p>
              </div>
              {row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-full bg-paper px-4 py-2 text-4 leading-5 text-pine hover:bg-beige">
                  열기
                </a>
              ) : (
                <span className="text-4 leading-5 text-muted">
                  파일 준비 중
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

/**
 * inner components
 */
const EmptyBox = ({ children }: EmptyBoxProps) => (
  <BrandText
    variant="bodyCompact"
    color="muted"
    className="rounded-2xlarge border border-beige bg-white px-6 py-10">
    {children}
  </BrandText>
);

const YearLink = ({ href, label, isActive }: YearLinkProps) => (
  <Link
    href={href}
    className={cn(
      "rounded-full border px-4 py-2",
      isActive ? "border-pine bg-pine text-white" : "border-beige bg-white",
    )}>
    {label}
  </Link>
);

export default DisclosureList;
