import type { Metadata } from "next";

import Icon from "@repo/ui/icon";

import BandSection from "@components/bandSection";
import BrandText from "@components/brandText";
import FoundationHeader from "@components/foundationHeader";
import InfoCard from "@components/infoCard";
import NumberedList from "@components/numberedList";
import {
  VILLAGE_CHALLENGES,
  VILLAGE_LEAD,
  VILLAGE_PILLARS,
  VILLAGE_PROMISE,
  VILLAGE_ROADMAP,
  VILLAGE_STORY,
  VILLAGE_TARGETS,
} from "@lib/foundation";

export const metadata: Metadata = { title: "피터팬마을" };

/**
 * screen — 마을 소개. 제안 배경, 약속, 대상, 핵심 사업, 로드맵. 조감과 규모는 /village/spaces
 */
const VillageScreen = () => (
  <article>
    <FoundationHeader
      overline="Peter Pan Neverland"
      title="피터팬 네버랜드"
      lead={VILLAGE_LEAD}
    />
    <BackgroundSection />
    <PromiseSection />
    <TargetSection />
    <PillarSection />
    <RoadmapSection />
  </article>
);

/**
 * section
 */
const BackgroundSection = () => (
  <BandSection overline="Why Neverland" title="왜 네버랜드인가" tone="paper">
    <BrandText
      variant="body"
      color="inkSoft"
      className="border-l-2 border-gold pl-5">
      {VILLAGE_STORY}
    </BrandText>
    <h3 className="mt-12 text-7 leading-10 font-semibold text-pine">
      성인 최중증 발달장애인 돌봄의 현실
    </h3>
    <div className="mt-4">
      <NumberedList items={VILLAGE_CHALLENGES} />
    </div>
  </BandSection>
);

const PromiseSection = () => (
  <section className="bg-pine text-paper">
    <div className="page-article py-14 text-center lg:py-18">
      <div className="mx-auto w-10 border-t-2 border-gold" />
      <p className="mt-6 text-7 leading-11 font-semibold text-paper md:text-9 md:leading-13">
        {VILLAGE_PROMISE.title}
      </p>
      <BrandText variant="bodyCompact" color="beige" className="mt-5">
        {VILLAGE_PROMISE.body}
      </BrandText>
    </div>
  </section>
);

const TargetSection = () => (
  <BandSection
    overline="Who it is for"
    title="누구를 위한 마을인가"
    description="‘돌아갈 가정’이 지속될 수 없는 사람이 네버랜드의 주 지원대상입니다.">
    <div className="grid gap-4 md:grid-cols-2">
      {VILLAGE_TARGETS.map(target => (
        <InfoCard
          key={target.title}
          meta={target.meta}
          title={target.title}
          body={target.body}
        />
      ))}
    </div>
  </BandSection>
);

const PillarSection = () => (
  <BandSection
    overline="What we build"
    title="자립과 치유의 융합 복지 모델"
    description="피터팬 자폐인복지재단이 마을에서 펼칠 네 가지 핵심 사업입니다."
    tone="paper">
    <div className="grid gap-4 md:grid-cols-2">
      {VILLAGE_PILLARS.map(pillar => (
        <InfoCard
          key={pillar.title}
          title={pillar.title}
          body={pillar.body}
          leftChildren={
            <span className="grid size-11 shrink-0 place-items-center rounded-large bg-paper text-pine">
              <Icon name={pillar.icon} size={22} />
            </span>
          }
        />
      ))}
    </div>
  </BandSection>
);

const RoadmapSection = () => (
  <BandSection
    overline="Roadmap"
    title="사업 추진 로드맵"
    description="단계별 목표를 이뤄 1호 마을을 안착시키고, 전국 권역으로 넓힙니다.">
    <ol className="grid gap-4 sm:grid-cols-2">
      {VILLAGE_ROADMAP.map(stage => (
        <li
          key={stage.step}
          className="rounded-xlarge border border-beige bg-white px-5 py-6">
          <p className="font-en text-3 leading-4 font-semibold tracking-wide text-gold-deep">
            {stage.step} · {stage.period}
          </p>
          <h3 className="mt-2 text-6 leading-8 font-semibold text-pine">
            {stage.title}
          </h3>
          <ul className="mt-3 flex flex-col gap-1.5">
            {stage.items.map(item => (
              <li
                key={item}
                className="flex gap-2 text-4 leading-7 text-ink/90">
                <Icon
                  name="check"
                  size={16}
                  className="mt-1.5 shrink-0 text-sage"
                />
                {item}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  </BandSection>
);

export default VillageScreen;
