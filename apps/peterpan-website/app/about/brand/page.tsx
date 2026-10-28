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
  title: "미션·가치·상징",
  description:
    "피터팬 재단의 미션과 비전, 지키는 네 가지 가치, 로고·색·글꼴 등 브랜드 상징을 소개합니다.",
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
 * screen — 미션·가치·상징. 미션·비전, 네 가지 가치, 로고와 색·글꼴
 */
const BrandScreen = () => (
  <article>
    <FoundationHeader
      overline="Mission, values & symbol"
      title="미션·가치·상징"
      lead="재단이 하려는 일과 지키는 가치, 그리고 그 뜻을 담은 로고와 디자인을 한곳에서 소개합니다."
    />
    <div className="page-article flex flex-col divide-y divide-beige py-10 lg:py-12">
      <MissionSection />
      <ValuesSection />
      <LogoSection />
      <ColorSection />
      <TypeSection />
    </div>
  </article>
);

/**
 * section
 */
const MissionSection = () => (
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
    </dl>
  </section>
);

const ValuesSection = () => (
  <section className={SECTION_CLASS}>
    <FoundationHeading
      title="재단이 지키는 가치"
      description="네 가지 가치는 로고 심볼의 네 모양과 맞닿아 있습니다."
    />
    <div className="grid gap-4 sm:grid-cols-2">
      {VALUES.map(value => (
        <div
          key={value.title}
          className="group relative flex flex-col overflow-hidden rounded-xlarge border border-beige bg-white px-6 pt-7 pb-8 transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-sage">
          <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
          <span
            aria-hidden
            className="pointer-events-none absolute top-3 right-5 font-en text-19 leading-none font-semibold text-beige/60">
            {value.index}
          </span>
          <span
            className={cn(
              "relative grid size-14 place-items-center rounded-full bg-paper",
              value.emblem === "star" ? "text-gold-deep" : "text-pine",
            )}>
            <LogoEmblem name={value.emblem} className="size-8" />
          </span>
          <BrandText variant="caption" color="goldDeep" className="mt-6">
            {value.keywords.join(" · ")}
          </BrandText>
          <h3 className="mt-1 text-6 leading-8 font-semibold text-pine">
            {value.title}
          </h3>
          <div className="mt-3 w-8 border-t-2 border-gold" />
          <BrandText variant="smallCompact" color="muted" className="mt-3">
            {value.body}
          </BrandText>
          {"link" in value ? (
            <a
              href={value.link.href}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-4 leading-5 font-medium text-pine hover:text-pine-deep">
              {value.link.label}
              <Icon name="external-link" size={16} />
            </a>
          ) : null}
        </div>
      ))}
    </div>
  </section>
);

const LogoSection = () => (
  <section className={SECTION_CLASS}>
    <FoundationHeading
      title="로고"
      description="심볼 네 모양은 위 가치를 담고, 국문·영문 글자와 함께 쓰임에 맞게 조합합니다."
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
