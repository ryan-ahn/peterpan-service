import Link from "next/link";
import type { ReactNode } from "react";

export type DisclosureRow = {
  id: string;
  title: string;
  date: string;
  href: string | null;
};

type DisclosureListProps = {
  title: string;
  lead: string;
  years: number[];
  currentYear?: number;
  basePath: string;
  empty: string;
  rows: DisclosureRow[];
  extra?: ReactNode;
};

const DisclosureList = ({
  title,
  lead,
  years,
  currentYear,
  basePath,
  empty,
  rows,
  extra,
}: DisclosureListProps) => (
  <section className="mx-auto w-[min(860px,calc(100%-2rem))] py-16">
    <p className="text-sm text-gold-deep">정보공개</p>
    <h1 className="mt-2 text-4xl font-semibold text-green">{title}</h1>
    <p className="mt-4 leading-8 text-muted">{lead}</p>
    <div className="mt-8 flex flex-wrap gap-2 text-sm">
      <span className="py-2 text-muted">연도</span>
      <Link
        href={basePath}
        className={`rounded-full px-4 py-2 ${!currentYear ? "bg-green text-white" : "bg-white"}`}>
        전체
      </Link>
      {years.map(year => (
        <Link
          key={year}
          href={`${basePath}?year=${year}`}
          className={`rounded-full px-4 py-2 ${currentYear === year ? "bg-green text-white" : "bg-white"}`}>
          {year}
        </Link>
      ))}
    </div>
    <div className="mt-6 flex flex-col gap-3">
      {rows.length === 0 ? (
        <p className="rounded-3xl bg-white px-6 py-10 text-muted">{empty}</p>
      ) : (
        rows.map(row => (
          <div
            key={row.id}
            className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4">
            <div>
              <p className="font-medium">{row.title}</p>
              <p className="text-sm text-muted">{row.date}</p>
            </div>
            {row.href ? (
              <a
                href={row.href}
                className="shrink-0 rounded-full bg-paper px-4 py-2 text-sm text-green"
                target="_blank"
                rel="noreferrer">
                열기
              </a>
            ) : (
              <span className="text-sm text-muted">파일 준비 중</span>
            )}
          </div>
        ))
      )}
    </div>
    {extra}
  </section>
);

export default DisclosureList;
