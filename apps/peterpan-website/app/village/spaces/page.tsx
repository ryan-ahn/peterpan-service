import type { Metadata } from "next";

import BandSection from "@components/bandSection";
import FoundationHeader from "@components/foundationHeader";
import InfoCard from "@components/infoCard";
import VillageAerial from "@components/villageAerial";
import {
  COMMUNITY_FLOORS,
  HEALING_SPACES,
  VILLAGE_FACTS,
  VILLAGE_HOME,
  VILLAGE_NOTE,
  VILLAGE_ZONES,
} from "@lib/foundation";

export const metadata: Metadata = {
  title: "조감과 공간",
  description:
    "약 2,000평 부지에 주택 10채, 커뮤니티동, 텃밭과 산책로를 담을 피터팬의 네버랜드 조감도와 공간 구성 계획.",
};

/**
 * screen — 조감과 공간. 조감도와 규모·네 구역, 집, 커뮤니티동, 치유 공간
 */
const SpacesScreen = () => (
  <article>
    <FoundationHeader
      overline="Spaces"
      title="조감과 주요 공간"
      lead="약 2,000평의 자연 속에 집과 돌봄, 일과 쉼을 한 마을로 담으려 합니다. 입주민 20명이 10채의 집에서 생활하며, 하루에 필요한 돌봄과 활동을 마을 안에서 누릴 수 있도록 계획하고 있습니다."
    />
    <ZoneSection />
    <HomeSection />
    <CommunitySection />
    <HealingSection />
  </article>
);

/**
 * section
 */
const ZoneSection = () => (
  <BandSection
    overline="Masterplan"
    title="치유 마을 조감도"
    description="약 2,000평 부지를 주거, 커뮤니티, 치유와 일터, 운동장과 산책로의 네 구역으로 나눕니다.">
    <VillageAerial />
    <p className="mt-4 rounded-large bg-paper px-4 py-3 text-4 leading-6 text-ink/90">
      {VILLAGE_NOTE}
    </p>
    <dl className="mt-8 grid gap-px overflow-hidden rounded-xlarge border border-beige bg-beige sm:grid-cols-3">
      {VILLAGE_FACTS.map(fact => (
        <div key={fact.label} className="bg-white px-5 py-5">
          <dt className="text-3 leading-4 font-medium tracking-wide text-gold-deep">
            {fact.label}
          </dt>
          <dd className="mt-2 text-8 leading-10 font-semibold text-pine">
            {fact.value}
          </dd>
          <dd className="text-4 leading-6 text-muted">{fact.note}</dd>
        </div>
      ))}
    </dl>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {VILLAGE_ZONES.map(zone => (
        <InfoCard
          key={zone.title}
          meta={zone.area}
          title={zone.title}
          body={zone.body}
        />
      ))}
    </div>
  </BandSection>
);

const HomeSection = () => (
  <BandSection
    overline="Homes"
    title="한 사람의 속도를 지키는 집"
    description="성인 중증 자폐성장애인 20명이 10채의 주택에서 생활할 수 있도록 계획하고 있습니다. 한 주택에는 두 사람이 거주하되, 각자의 독립된 침실을 두어 개인의 특성과 사생활을 존중합니다."
    tone="paper">
    <dl className="flex flex-col divide-y divide-beige border-t border-beige">
      {VILLAGE_HOME.map(item => (
        <div
          key={item.label}
          className="flex flex-col gap-1 py-4 md:flex-row md:gap-4">
          <dt className="w-24 shrink-0 text-4 leading-7 text-muted">
            {item.label}
          </dt>
          <dd className="text-4 leading-7 font-medium text-ink">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  </BandSection>
);

const CommunitySection = () => (
  <BandSection
    overline="Community center"
    title="커뮤니티동"
    description="생활·교류와 안정을 위한 공간에 전문 치료·상담과 운영관리를 더한 2층 건물입니다.">
    <div className="grid gap-4 md:grid-cols-2">
      {COMMUNITY_FLOORS.map(floor => (
        <InfoCard key={floor.floor} meta={floor.floor} title={floor.title}>
          <ul className="mt-4 flex flex-col divide-y divide-beige border-t border-beige">
            {floor.rooms.map(room => (
              <li key={room.name} className="py-3">
                <p className="text-4 leading-6 font-semibold text-ink">
                  {room.name}
                </p>
                <p className="mt-0.5 text-4 leading-6 text-muted">
                  {room.body}
                </p>
              </li>
            ))}
          </ul>
        </InfoCard>
      ))}
    </div>
  </BandSection>
);

const HealingSection = () => (
  <BandSection
    overline="Healing & work"
    title="신체 활동과 치유를 위한 공간"
    description="매일의 일과와 몸의 움직임이 마음의 안정으로 이어지도록 마을 바깥 공간을 꾸밉니다."
    tone="paper">
    <div className="grid gap-4 md:grid-cols-2">
      {HEALING_SPACES.map(space => (
        <InfoCard key={space.title} title={space.title} body={space.body} />
      ))}
    </div>
  </BandSection>
);

export default SpacesScreen;
