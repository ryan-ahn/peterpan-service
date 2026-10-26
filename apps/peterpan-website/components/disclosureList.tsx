import type { ReactNode } from "react";

import Link from "next/link";

import cn from "@repo/ui/lib/cn";

import BrandText from "@components/brandText";
import FoundationHeader from "@components/foundationHeader";

/**
 * types
 */
export type DisclosureRow = {
  id: string;
  title: string;
  date: string;
  href: string | null;
};

type Props = {
  overline: string;
  title: string;
  lead: string;
  years: number[];
  currentYear?: number;
  basePath: string;
  empty: string;
  rows: DisclosureRow[];
  extra?: ReactNode;
};

type YearLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
};

/**
 * 경영공시·기부금 공시 목록. 연도로 거르고 파일을 새 탭으로 연다
 * @param overline 제목 위 영문 분류
 * @param title 제목
 * @param lead 설명
 * @param years 자료가 있는 연도
 * @param currentYear 선택한 연도. 없으면 전체
 * @param basePath 목록 주소
 * @param empty 자료가 없을 때 문구
 * @param rows 목록
 * @param extra 목록 아래 덧붙일 요소
 */
const DisclosureList = ({
  overline,
  title,
  lead,
  years,
  currentYear,
  basePath,
  empty,
  rows,
  extra,
}: Props) => {
  // render
  return (
    <article>
      <FoundationHeader overline={overline} title={title} lead={lead} />
      <div className="page-article py-14 lg:py-16">
        <nav
          aria-label="연도"
          className="flex flex-wrap gap-2 text-4 leading-5">
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
        <div className="mt-6 flex flex-col gap-3">
          {rows.length === 0 ? (
            <BrandText
              variant="bodyCompact"
              color="muted"
              className="rounded-2xlarge border border-beige bg-white px-6 py-10">
              {empty}
            </BrandText>
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
        {extra}
      </div>
    </article>
  );
};

/**
 * inner components
 */
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
