import type { Metadata } from "next";

import Icon, { type Name as IconName } from "@repo/ui/icon";

import BrandText from "@components/brandText";
import FoundationHeader from "@components/foundationHeader";
import {
  FOUNDING_AIM,
  FOUNDING_BASIS,
  FOUNDING_LEAD,
  FOUNDING_PREAMBLE,
  FOUNDING_PROGRESS,
  FOUNDING_QUOTE,
  FOUNDING_REASONS,
  FOUNDING_WORKS,
} from "@lib/foundation";

export const metadata: Metadata = {
  title: "설립 배경과 목적",
  description:
    "피터팬 재단의 설립 배경과 목적. 부모가 떠난 뒤에도 성인 중증 자폐성장애인이 혼자가 아닌 삶을 이어 가도록 재단을 세운 이유를 소개합니다.",
};

/**
 * types
 */
type MarkProps = {
  name: IconName;
};

/**
 * screen — 설립 배경과 목적. 설립취지서의 취지, 필요성, 목적사업, 준비 경과, 지향점
 */
const AboutScreen = () => (
  <article>
    <FoundationHeader
      overline="About the foundation"
      title="설립 배경과 목적"
      lead={FOUNDING_LEAD}
    />
    <PreambleSection />
    <ReasonSection />
    <QuoteSection />
    <WorksSection />
    <ProgressSection />
    <AimSection />
  </article>
);

/**
 * section
 */
const PreambleSection = () => (
  <section className="border-b border-beige">
    <div className="page-article py-10 lg:py-12">
      <BrandText variant="overline" color="pine">
        Why now
      </BrandText>
      <BrandText as="h2" variant="heading" color="pine" className="mt-2">
        설립 취지
      </BrandText>
      <BrandText variant="body" color="inkSoft" className="mt-6">
        {FOUNDING_PREAMBLE}
      </BrandText>
    </div>
  </section>
);

const ReasonSection = () => (
  <section className="border-b border-beige bg-paper">
    <div className="page-article py-10 lg:py-12">
      <BrandText variant="overline" color="pine">
        Why this foundation
      </BrandText>
      <BrandText as="h2" variant="heading" color="pine" className="mt-2">
        왜 이 재단이 필요한가
      </BrandText>
      <ol className="mt-10 flex flex-col">
        {FOUNDING_REASONS.map((reason, index) => (
          <li
            key={reason.title}
            className="grid gap-4 border-t border-beige py-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)] lg:gap-12">
            <div>
              <p className="font-en text-4 leading-5 font-semibold text-gold-deep">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-7 leading-10 font-semibold text-pine">
                {reason.title}
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {reason.paragraphs.map(paragraph => (
                <BrandText
                  key={paragraph.slice(0, 24)}
                  variant="bodyCompact"
                  color="inkSoft">
                  {paragraph}
                </BrandText>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

const QuoteSection = () => (
  <section className="bg-pine text-paper">
    <div className="page-article py-10 text-center lg:py-14">
      <div className="mx-auto w-10 border-t-2 border-gold" />
      <p className="mt-6 text-7 leading-11 font-semibold text-beige md:text-9 md:leading-13">
        {FOUNDING_QUOTE.before}
        <br />
        <span className="text-paper">{FOUNDING_QUOTE.after}</span>
      </p>
      <BrandText variant="smallCompact" color="beige" className="mt-5">
        재단이 만들고자 하는 생활주거공동체의 모델입니다.
      </BrandText>
    </div>
  </section>
);

const WorksSection = () => (
  <section className="border-b border-beige">
    <div className="page-article py-10 lg:py-12">
      <BrandText variant="overline" color="pine">
        What we will do
      </BrandText>
      <BrandText as="h2" variant="heading" color="pine" className="mt-2">
        주요 목적사업
      </BrandText>
      <BrandText variant="bodyCompact" color="muted" className="mt-4">
        아래 목적사업을 단계적으로 추진합니다.
      </BrandText>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {FOUNDING_WORKS.map(work => (
          <div
            key={work.title}
            className="flex gap-4 rounded-xlarge border border-beige bg-white px-5 py-6">
            <Mark name={work.icon} />
            <div>
              <h3 className="text-6 leading-8 font-semibold text-pine">
                {work.title}
              </h3>
              <BrandText variant="smallCompact" color="muted" className="mt-2">
                {work.body}
              </BrandText>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProgressSection = () => (
  <section className="border-b border-beige bg-paper">
    <div className="page-article py-10 lg:py-12">
      <BrandText variant="overline" color="pine">
        What is in place
      </BrandText>
      <BrandText as="h2" variant="heading" color="pine" className="mt-2">
        설립 준비 경과
      </BrandText>
      <BrandText variant="bodyCompact" color="inkSoft" className="mt-4">
        {FOUNDING_PROGRESS.intro}
      </BrandText>
      <div className="mt-8 grid gap-px overflow-hidden rounded-xlarge border border-beige bg-beige sm:grid-cols-2">
        {FOUNDING_BASIS.map(item => (
          <div key={item.label} className="bg-white px-5 py-6">
            <p className="text-3 leading-4 font-medium tracking-wide text-gold-deep">
              {item.label}
            </p>
            <p className="mt-3 text-8 leading-10 font-semibold text-pine">
              {item.value}
            </p>
            <BrandText variant="smallCompact" color="muted" className="mt-2">
              {item.note}
            </BrandText>
          </div>
        ))}
      </div>
      <BrandText variant="bodyCompact" color="muted" className="mt-6">
        {FOUNDING_PROGRESS.next}
      </BrandText>
    </div>
  </section>
);

const AimSection = () => (
  <section>
    <div className="page-article flex flex-col gap-5 py-10 lg:py-12">
      <BrandText variant="overline" color="pine">
        Our commitment
      </BrandText>
      <BrandText as="h2" variant="heading" color="pine">
        설립의 지향점
      </BrandText>
      <div className="mt-2 flex flex-col gap-4">
        {FOUNDING_AIM.map(paragraph => (
          <BrandText
            key={paragraph.slice(0, 24)}
            variant="body"
            color="inkSoft">
            {paragraph}
          </BrandText>
        ))}
      </div>
    </div>
  </section>
);

/**
 * inner components
 */
const Mark = ({ name }: MarkProps) => (
  <span className="grid size-11 shrink-0 place-items-center rounded-large bg-paper text-pine">
    {name === "pin" ? (
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M12 21s6-5.4 6-10a6 6 0 1 0-12 0c0 4.6 6 10 6 10Z" />
        <circle cx="12" cy="11" r="1.7" />
      </svg>
    ) : (
      <Icon name={name} size={22} />
    )}
  </span>
);

export default AboutScreen;
