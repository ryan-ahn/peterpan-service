import type { ReactNode } from "react";

import type { Metadata } from "next";
import Image from "next/image";

import Icon from "@repo/ui/icon";
import cn from "@repo/ui/lib/cn";

import BrandText from "@components/brandText";
import FoundationHeader from "@components/foundationHeader";
import FoundationHeading from "@components/foundationHeading";
import LogoEmblem from "@components/logoEmblem";
import { CREED_HORIZON, CREED_STATEMENT, VALUES } from "@lib/foundation";

export const metadata: Metadata = {
  title: "상징과 미션",
  description:
    "피터팬 재단 로고에 담긴 상징과 재단이 지키는 가치를 소개합니다.",
};

/**
 * constants
 */
const SECTION_CLASS = "flex flex-col gap-6 py-12 first:pt-0 last:pb-0";

const SYMBOL = {
  src: "/brand/logo-symbol-large.png",
  width: 926,
  height: 1034,
};

const KEYWORDS = VALUES.flatMap(value => value.keywords);

const COLORS = [
  {
    name: "포레스트 그린",
    hex: "#2E5B4B",
    swatch: "bg-pine",
    meaning: "신뢰, 안정, 지속 가능한 복지",
  },
  {
    name: "세이지 그린",
    hex: "#80AA8E",
    swatch: "bg-sage",
    meaning: "성장, 존중, 회복",
  },
  {
    name: "앰버 골드",
    hex: "#F2C15E",
    swatch: "bg-gold",
    meaning: "희망, 가능성, 따뜻한 미래",
  },
  {
    name: "클라우드 베이지",
    hex: "#EADCC6",
    swatch: "bg-beige",
    meaning: "안전, 포용, 일상",
  },
] as const;

const TYPEFACES = [
  {
    name: "Pretendard",
    usage: "한글",
    sample: "피터팬 재단",
    sampleClass: "text-11 leading-14 font-bold text-pine",
    weights: ["Bold", "SemiBold", "Medium", "Regular", "Light"],
  },
  {
    name: "Montserrat",
    usage: "영문",
    sample: "PETER PAN FOUNDATION",
    sampleClass:
      "font-en text-5 leading-14 font-semibold tracking-caps text-pine",
    weights: ["SemiBold", "Medium"],
  },
] as const;

/**
 * types
 */
type LogoCardProps = {
  label: string;
  children: ReactNode;
};

/**
 * screen — 상징과 미션. 미션·비전, 로고와 그 뜻, 색·글꼴
 */
const BrandScreen = () => (
  <article>
    <FoundationHeader
      overline="Symbol & Values"
      title="상징과 미션"
      lead="피터팬 재단이 지향하는 가치와 그 가치를 담은 상징과 디자인입니다."
    />
    <div className="page-article flex flex-col divide-y divide-beige py-10 lg:py-12">
      <IdentitySection />
      <LogoSection />
      <ColorSection />
      <TypeSection />
    </div>
  </article>
);

/**
 * section
 */
const IdentitySection = () => (
  <section className={SECTION_CLASS}>
    <FoundationHeading
      title="미션과 비전"
      description="재단이 하려는 일과 바라보는 내일입니다."
    />
    <dl className="flex flex-col divide-y divide-beige border-t border-beige">
      <div className="flex flex-col gap-1 py-4 md:flex-row md:gap-4">
        <dt className="w-20 shrink-0 text-4 leading-7 text-muted">미션</dt>
        <dd className="text-4 leading-7 font-medium text-ink">
          {CREED_STATEMENT}
        </dd>
      </div>
      <div className="flex flex-col gap-1 py-4 md:flex-row md:gap-4">
        <dt className="w-20 shrink-0 text-4 leading-7 text-muted">비전</dt>
        <dd className="text-4 leading-7 font-medium text-ink">
          {CREED_HORIZON}
        </dd>
      </div>
      <div className="flex flex-col gap-1 py-4 md:flex-row md:gap-4">
        <dt className="w-20 shrink-0 text-4 leading-7 text-muted">핵심 가치</dt>
        <dd className="text-4 leading-7 font-medium text-ink">
          {VALUES.map(value => value.title).join(" · ")}
        </dd>
      </div>
      <div className="flex flex-col gap-2 py-4 md:flex-row md:gap-4">
        <dt className="w-20 shrink-0 text-4 leading-7 text-muted">키워드</dt>
        <dd className="flex flex-wrap gap-2">
          {KEYWORDS.map(keyword => (
            <span
              key={keyword}
              className="rounded-full bg-white px-3 py-0.5 text-4 leading-6 font-medium text-pine">
              {keyword}
            </span>
          ))}
        </dd>
      </div>
    </dl>
  </section>
);

const LogoSection = () => (
  <section className={SECTION_CLASS}>
    <FoundationHeading
      title="로고"
      description="심볼과 국문·영문 글자를 쓰임에 맞게 조합합니다."
    />
    <div className="grid gap-4 md:grid-cols-3">
      <LogoCard label="기본형 · 세로">
        <div className="flex flex-col items-center">
          <Image
            src={SYMBOL.src}
            alt=""
            width={SYMBOL.width}
            height={SYMBOL.height}
            className="h-16 w-auto"
          />
          <span className="mt-2 text-7 leading-9 font-bold text-pine">
            피터팬 재단
          </span>
          <span className="font-en text-1 leading-3 font-medium tracking-caps text-pine">
            PETER PAN FOUNDATION
          </span>
        </div>
      </LogoCard>
      <LogoCard label="가로형">
        <div className="flex items-center gap-2.5">
          <Image
            src={SYMBOL.src}
            alt=""
            width={SYMBOL.width}
            height={SYMBOL.height}
            className="h-12 w-auto"
          />
          <span className="flex flex-col">
            <span className="text-5 leading-6 font-bold text-pine">
              피터팬 재단
            </span>
            <span className="font-en text-1 leading-3 font-medium tracking-caps text-pine">
              PETER PAN FOUNDATION
            </span>
          </span>
        </div>
      </LogoCard>
      <LogoCard label="심볼형">
        <Image
          src={SYMBOL.src}
          alt=""
          width={SYMBOL.width}
          height={SYMBOL.height}
          className="h-20 w-auto"
        />
      </LogoCard>
    </div>
    <ul className="grid gap-px overflow-hidden rounded-xlarge border border-beige bg-beige md:grid-cols-2">
      {VALUES.map(value => (
        <li key={value.emblem} className="flex gap-4 bg-white px-5 py-5">
          <span
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-full bg-paper",
              value.emblem === "star" ? "text-gold-deep" : "text-pine",
            )}>
            <LogoEmblem name={value.emblem} className="size-6" />
          </span>
          <div>
            <BrandText variant="caption" color="goldDeep">
              {value.keywords.join(" · ")}
            </BrandText>
            <p className="mt-1 text-5 leading-7 font-semibold text-pine">
              {value.title}
            </p>
            <BrandText variant="smallCompact" color="muted" className="mt-1">
              {value.body}
            </BrandText>
          </div>
        </li>
      ))}
    </ul>
    <a
      href={SYMBOL.src}
      download="peterpan-symbol.png"
      className="inline-flex w-fit items-center gap-1.5 text-4 leading-6 font-medium text-pine underline underline-offset-4">
      <Icon name="file-text" size={16} />
      심볼 PNG 내려받기
    </a>
  </section>
);

const ColorSection = () => (
  <section className={SECTION_CLASS}>
    <FoundationHeading
      title="색"
      description="주색인 포레스트 그린을 중심으로 네 가지 색을 씁니다."
    />
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {COLORS.map(color => (
        <li
          key={color.name}
          className="overflow-hidden rounded-xlarge border border-beige bg-white">
          <div className={cn("h-20", color.swatch)} />
          <div className="px-4 py-4">
            <p className="text-4 leading-6 font-semibold text-ink">
              {color.name}
            </p>
            <p className="font-en text-3 leading-5 text-muted">{color.hex}</p>
            <p className="mt-2 text-3.5 leading-5 text-muted">
              {color.meaning}
            </p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

const TypeSection = () => (
  <section className={SECTION_CLASS}>
    <FoundationHeading
      title="글꼴"
      description="한글은 Pretendard, 영문은 Montserrat을 씁니다."
    />
    <ul className="flex flex-col divide-y divide-beige rounded-xlarge border border-beige bg-white">
      {TYPEFACES.map(typeface => (
        <li
          key={typeface.name}
          className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <BrandText variant="caption" color="muted">
              {typeface.name} ({typeface.usage})
            </BrandText>
            <p className={cn("mt-1", typeface.sampleClass)}>
              {typeface.sample}
            </p>
          </div>
          <p className="text-3.5 leading-5 text-muted">
            {typeface.weights.join(" · ")}
          </p>
        </li>
      ))}
    </ul>
  </section>
);

/**
 * inner components
 */
const LogoCard = ({ label, children }: LogoCardProps) => (
  <figure className="flex flex-col overflow-hidden rounded-xlarge border border-beige bg-white">
    <div className="grid h-44 place-items-center px-6">{children}</div>
    <figcaption className="border-t border-beige px-5 py-3 text-3.5 leading-5 text-muted">
      {label}
    </figcaption>
  </figure>
);

export default BrandScreen;
