import type { Metadata } from "next";

import Icon from "@repo/ui/icon";

import BandSection from "@components/bandSection";
import BrandText from "@components/brandText";
import FoundationHeader from "@components/foundationHeader";
import InfoCard from "@components/infoCard";
import NumberedList from "@components/numberedList";
import {
  CONSORTIUM_ROLES,
  GOVERNANCE_GROUPS,
  GOVERNANCE_QUOTE,
  OPERATION_GAPS,
  OPERATION_LEAD,
  OPERATION_MODEL,
  OPERATION_SUPPORT,
  POLICY_REQUESTS,
  VILLAGE_OUTCOMES,
} from "@lib/foundation";

export const metadata: Metadata = {
  title: "운영 방향",
  description:
    "피터팬의 네버랜드가 어떻게 운영되는지, 입주인의 돌봄과 일상을 지키는 운영 방향을 소개합니다.",
};

/**
 * types
 */
type CheckItemProps = {
  text: string;
};

/**
 * screen — 운영 방향. 365일 지원, 운영 모델, 민간동행 거버넌스, 컨소시엄, 정부 요청, 기대효과
 */
const OperationScreen = () => (
  <article>
    <FoundationHeader
      overline="Operation"
      title="주거와 돌봄의 운영"
      lead={OPERATION_LEAD}
    />
    <SupportSection />
    <ModelSection />
    <GovernanceSection />
    <ConsortiumSection />
    <RequestSection />
    <OutcomeSection />
  </article>
);

/**
 * section
 */
const SupportSection = () => (
  <BandSection
    overline="365 days"
    title="365일, 공백 없는 지원"
    description="현행 최중증 발달장애인 24시간 통합돌봄 서비스의 운영 조건을 기준으로 본 빈자리입니다. 세부 대상과 기간은 연도별 사업지침에 따라 달라질 수 있습니다.">
    <NumberedList items={OPERATION_GAPS} />
    <h3 className="mt-12 text-7 leading-10 font-semibold text-pine">
      네버랜드가 채우는 방식
    </h3>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {OPERATION_SUPPORT.map(item => (
        <InfoCard
          key={item.title}
          meta={item.meta}
          title={item.title}
          body={item.body}
        />
      ))}
    </div>
  </BandSection>
);

const ModelSection = () => (
  <BandSection overline="Operating model" title="운영 모델" tone="paper">
    <div className="rounded-xlarge border border-beige bg-white px-6 py-7">
      <p className="text-8 leading-10 font-semibold text-pine">
        {OPERATION_MODEL.title}
      </p>
      <BrandText variant="bodyCompact" color="inkSoft" className="mt-3">
        {OPERATION_MODEL.body}
      </BrandText>
      <ul className="mt-5 flex flex-col gap-2 border-t border-beige pt-5">
        {OPERATION_MODEL.standards.map(item => (
          <CheckItem key={item} text={item} />
        ))}
      </ul>
    </div>
  </BandSection>
);

const GovernanceSection = () => (
  <BandSection
    overline="2 + 2 governance"
    title="‘2+2’ 민간동행 거버넌스"
    description="시민과 기업이 마을을 실현하고, 당사자의 경험과 전문가가 실천합니다.">
    <p className="border-l-2 border-gold pl-5 text-6 leading-9 font-semibold text-pine">
      “{GOVERNANCE_QUOTE}”
    </p>
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      {GOVERNANCE_GROUPS.map(group => (
        <InfoCard key={group.title} meta={group.meta} title={group.title}>
          <ul className="mt-3 flex flex-col gap-1.5">
            {group.items.map(item => (
              <CheckItem key={item} text={item} />
            ))}
          </ul>
          <p className="mt-4 rounded-large bg-paper px-4 py-3 text-4 leading-6 font-semibold text-pine">
            {group.status}
          </p>
        </InfoCard>
      ))}
    </div>
  </BandSection>
);

const ConsortiumSection = () => (
  <BandSection
    overline="Consortium"
    title="운영 컨소시엄"
    description="네 주체가 역할을 나눠 마을을 짓고 운영합니다."
    tone="paper">
    <dl className="flex flex-col divide-y divide-beige rounded-xlarge border border-beige bg-white">
      {CONSORTIUM_ROLES.map(role => (
        <div
          key={role.title}
          className="flex flex-col gap-1 px-5 py-5 md:flex-row md:gap-6">
          <dt className="w-32 shrink-0 text-5 leading-7 font-semibold text-pine">
            {role.title}
          </dt>
          <dd className="text-4 leading-7 text-ink/90">{role.body}</dd>
        </div>
      ))}
    </dl>
  </BandSection>
);

const RequestSection = () => (
  <BandSection
    overline="Policy"
    title="지속 가능한 돌봄을 위한 제안"
    description="민간에서 시작한 새로운 돌봄 모델이 지속 가능한 제도로 자리 잡을 수 있도록, 공공의 협력과 제도적 개선을 제안합니다.">
    <NumberedList items={POLICY_REQUESTS} />
  </BandSection>
);

const OutcomeSection = () => (
  <BandSection
    overline="Expected impact"
    title="4대 핵심 기대효과"
    tone="paper">
    <div className="grid gap-4 md:grid-cols-2">
      {VILLAGE_OUTCOMES.map(outcome => (
        <InfoCard
          key={outcome.title}
          title={outcome.title}
          body={outcome.body}
        />
      ))}
    </div>
  </BandSection>
);

/**
 * inner components
 */
const CheckItem = ({ text }: CheckItemProps) => (
  <li className="flex gap-2 text-4 leading-7 text-ink/90">
    <Icon name="check" size={16} className="mt-1.5 shrink-0 text-sage" />
    {text}
  </li>
);

export default OperationScreen;
