import type { Metadata } from "next";

import {
  type OrganizationGroup,
  getOrganizationChart,
} from "@repo/db/organization";
import cn from "@repo/ui/lib/cn";

import BrandText from "@components/brandText";
import FoundationHeader from "@components/foundationHeader";

export const metadata: Metadata = {
  title: "조직도",
  description: "재단법인 피터팬 자폐인복지재단의 조직도와 구성원을 소개합니다.",
};

/**
 * constants
 */
const CARD_WIDTH_CLASS = "w-44 lg:w-52 xl:w-56";

/**
 * types
 */
type ChartLayoutProps = {
  groups: OrganizationGroup[];
};

type TreeProps = {
  groups: OrganizationGroup[];
  items: OrganizationGroup[];
  isNested: boolean;
};

type StackedListProps = {
  groups: OrganizationGroup[];
  parentId: string | null;
};

type HasChildGroupParams = {
  groups: OrganizationGroup[];
  id: string;
};

type GroupCardProps = {
  group: OrganizationGroup;
  className?: string;
};

/**
 * screen — 조직도. 어드민에서 짠 그룹·인원 구조를 그린다
 */
const OrganizationScreen = async () => {
  const chart = await getOrganizationChart();
  return (
    <article>
      <FoundationHeader
        overline="Organization"
        title="조직도"
        lead="재단 임원과 조직원들의 직책 및 소속입니다."
      />
      <section className="bg-paper">
        <div className="page-wide py-10 lg:py-12">
          {chart.groups.length === 0 ? (
            <BrandText variant="body" color="muted" className="text-center">
              준비 중입니다.
            </BrandText>
          ) : (
            <>
              <div className="hidden md:block">
                <ChartLayout groups={chart.groups} />
              </div>
              <div className="md:hidden">
                <StackedList groups={chart.groups} parentId={null} />
              </div>
            </>
          )}
        </div>
      </section>
    </article>
  );
};

/**
 * inner components
 */
const ChartLayout = ({ groups }: ChartLayoutProps) => {
  // variables
  const roots = groups.filter(group => group.parentId === null);
  const branches = roots.filter(root => hasChildGroup({ groups, id: root.id }));
  const singles = roots.filter(root => !hasChildGroup({ groups, id: root.id }));
  // render
  return (
    <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-12">
      {branches.map(branch => (
        <div key={branch.id} className="max-w-full overflow-x-auto pb-2">
          <Tree groups={groups} items={[branch]} isNested={false} />
        </div>
      ))}
      {singles.length > 0 ? (
        <ul
          className={cn(
            "flex gap-4",
            branches.length > 0 ? "flex-col" : "flex-wrap justify-center",
          )}>
          {singles.map(single => (
            <li key={single.id}>
              <GroupCard group={single} className={CARD_WIDTH_CLASS} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

const Tree = ({ groups, items, isNested }: TreeProps) => (
  <ul className="flex">
    {items.map(group => {
      const children = groups.filter(item => item.parentId === group.id);
      return (
        <li
          key={group.id}
          className={cn(
            "relative flex flex-col items-center px-2 lg:px-3",
            isNested &&
              "pt-8 before:absolute before:inset-x-0 before:top-0 before:border-t before:border-sage after:absolute after:top-0 after:left-1/2 after:h-8 after:border-l after:border-sage first:before:left-1/2 last:before:right-1/2",
          )}>
          <GroupCard group={group} className={CARD_WIDTH_CLASS} />
          {children.length > 0 ? (
            <>
              <span className="h-8 border-l border-sage" aria-hidden="true" />
              <Tree groups={groups} items={children} isNested />
            </>
          ) : null}
        </li>
      );
    })}
  </ul>
);

const StackedList = ({ groups, parentId }: StackedListProps) => (
  <ul className="flex flex-col gap-3">
    {groups
      .filter(group => group.parentId === parentId)
      .map(group => (
        <li key={group.id} className="flex flex-col gap-3">
          <GroupCard group={group} />
          {hasChildGroup({ groups, id: group.id }) ? (
            <div className="ml-4 border-l border-sage pl-4">
              <StackedList groups={groups} parentId={group.id} />
            </div>
          ) : null}
        </li>
      ))}
  </ul>
);

const GroupCard = ({ group, className }: GroupCardProps) => (
  <div
    className={cn(
      "overflow-hidden rounded-xlarge border border-beige bg-white shadow-small",
      className,
    )}>
    <p className="bg-pine px-4 py-3 text-center text-5 leading-7 font-semibold text-paper">
      {group.name}
    </p>
    {group.people.length > 0 ? (
      <ul className="flex flex-col divide-y divide-beige px-4 py-1">
        {group.people.map(person => (
          <li
            key={person.id}
            className="flex items-baseline justify-between gap-3 py-2.5">
            <span className="text-3 leading-5 text-muted">{person.title}</span>
            <span className="text-4 leading-6 font-medium text-ink">
              {person.name}
            </span>
          </li>
        ))}
      </ul>
    ) : null}
  </div>
);

/**
 * utils
 */
const hasChildGroup = (params: HasChildGroupParams) => {
  const { groups, id } = params;
  return groups.some(group => group.parentId === id);
};

export default OrganizationScreen;
