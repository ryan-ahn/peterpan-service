import { eq } from "drizzle-orm";

import { getDb, siteSettings } from "./index";

/**
 * 웹사이트 조직도. site_settings의 한 키에 JSON으로 저장한다.
 * 그룹은 parentId로 위아래를 잇고, 같은 부모 아래 순서는 배열 순서다.
 */

/**
 * constants
 */
const KEY = "organization_chart";

export const SAMPLE_ORGANIZATION: OrganizationChart = {
  groups: [
    {
      id: "sample-board",
      name: "이사회",
      parentId: null,
      people: [
        { id: "sample-chair", title: "이사장", name: "OOO" },
        { id: "sample-vice", title: "부이사장", name: "OOO" },
        { id: "sample-director", title: "이사", name: "OOO 외 3인" },
      ],
    },
    {
      id: "sample-audit",
      name: "감사",
      parentId: null,
      people: [{ id: "sample-auditor", title: "감사", name: "OOO 외 1인" }],
    },
    {
      id: "sample-office",
      name: "사무국",
      parentId: "sample-board",
      people: [{ id: "sample-secretary", title: "사무국장", name: "OOO" }],
    },
    {
      id: "sample-committee",
      name: "운영위원회",
      parentId: "sample-board",
      people: [{ id: "sample-chief", title: "위원장", name: "OOO" }],
    },
    {
      id: "sample-life",
      name: "생활지원팀",
      parentId: "sample-office",
      people: [
        { id: "sample-life-lead", title: "팀장", name: "OOO" },
        { id: "sample-life-staff", title: "생활지원", name: "OOO" },
      ],
    },
    {
      id: "sample-support",
      name: "운영지원팀",
      parentId: "sample-office",
      people: [
        { id: "sample-support-lead", title: "팀장", name: "OOO" },
        { id: "sample-support-staff", title: "회계·행정", name: "OOO" },
      ],
    },
  ],
};

/**
 * types
 */
export type OrganizationPerson = {
  id: string;
  title: string;
  name: string;
};

export type OrganizationGroup = {
  id: string;
  name: string;
  parentId: string | null;
  people: OrganizationPerson[];
};

export type OrganizationChart = {
  groups: OrganizationGroup[];
};

/**
 * actions
 */
export const getOrganizationChart = async (): Promise<OrganizationChart> => {
  try {
    const rows = await getDb()
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, KEY))
      .limit(1);
    const value = rows[0]?.value;
    return value
      ? readOrganizationChart(JSON.parse(value))
      : SAMPLE_ORGANIZATION;
  } catch {
    return SAMPLE_ORGANIZATION;
  }
};

export const saveOrganizationChart = async (chart: OrganizationChart) => {
  const value = JSON.stringify(readOrganizationChart(chart));
  await getDb()
    .insert(siteSettings)
    .values({ key: KEY, value })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value } });
};

/**
 * utils
 */
const readText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const hasLoop = (parents: Map<string, string | null>, id: string) => {
  const seen = new Set([id]);
  let current = parents.get(id) ?? null;
  while (current) {
    if (seen.has(current)) {
      return true;
    }
    seen.add(current);
    current = parents.get(current) ?? null;
  }
  return false;
};

/**
 * 저장·조회 값을 조직도 모양으로 거른다. 없는 부모나 고리를 만드는 부모는 최상위로 올린다
 */
export const readOrganizationChart = (value: unknown): OrganizationChart => {
  const source =
    value && typeof value === "object" && "groups" in value
      ? (value as { groups: unknown }).groups
      : [];
  const groups = (Array.isArray(source) ? source : [])
    .map((group: Record<string, unknown>) => ({
      id: readText(group?.id),
      name: readText(group?.name),
      parentId: readText(group?.parentId) || null,
      people: (Array.isArray(group?.people) ? group.people : [])
        .map((person: Record<string, unknown>) => ({
          id: readText(person?.id),
          title: readText(person?.title),
          name: readText(person?.name),
        }))
        .filter(person => person.id && (person.title || person.name)),
    }))
    .filter(group => group.id);
  const ids = new Set(groups.map(group => group.id));
  const parents = new Map(
    groups.map(group => [
      group.id,
      group.parentId && ids.has(group.parentId) ? group.parentId : null,
    ]),
  );
  groups.forEach(group => {
    if (hasLoop(parents, group.id)) {
      parents.set(group.id, null);
    }
  });
  return {
    groups: groups.map(group => ({
      ...group,
      parentId: parents.get(group.id) ?? null,
    })),
  };
};
