import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { getDb, notices, posts, siteSettings } from "../src";

/**
 * 기본 연락처, 첫 공지 2건·소식 1건, 정관 PDF를 넣는다. 이미 있으면 건너뛴다.
 */

/**
 * constants
 */
const ROOT_PATH = resolve(import.meta.dirname, "../../..");

const BYLAWS_PATH = resolve(
  ROOT_PATH,
  "apps/peterpan-website/public/docs/bylaws.pdf",
);

const SETTINGS = [
  ["representative", "변경희 (설립발기인 대표)"],
  [
    "address",
    "서울특별시 (주된 사무소) · 설립추진 사무공간은 서울특별시 강동구",
  ],
  ["phone", ""],
  ["email", ""],
  ["registration_number", ""],
] as const;

const NOTICES = [
  {
    slug: "news-founding-purpose",
    title: "성인 중증 자폐성장애인의 삶을 잇기 위해 재단 설립을 추진합니다",
    body: [
      "재단법인 피터팬 자폐인복지재단은 성인 중증 자폐성장애인이 부모의 생애주기와 관계없이 안정된 환경에서 살아갈 수 있도록 설립을 추진하고 있습니다.",
      "설립추진위원회는 운영규약과 고유번호증, 서울 강동구 사무공간, 추진위원회 명의의 계좌를 갖추었고 출연재산 5억 원을 확보했습니다. 2026년 9월 15일 정관을 작성했습니다.",
      "주무관청의 설립허가와 법원 등기가 끝나면 그 재산으로 조직을 갖추고, 생활주거공동체 조성을 핵심 사업으로 시작합니다.",
    ].join("\n\n"),
  },
  {
    slug: "news-transparency",
    title: "사업과 기부금은 이 홈페이지에 공개합니다",
    body: [
      "정관은 기부금의 모금액과 활용실적, 사업실적을 홈페이지에 공개하도록 정하고 있습니다.",
      "설립 등기 이후 회계연도의 사업계획, 결산, 감사보고서, 기부금 실적은 정보공개 메뉴에 PDF로 게시합니다. 지금은 자료가 없어 빈 목록으로 두었습니다.",
      "국세청 공익법인 공시가 시작되면 기부금 공시 화면에서 함께 연결합니다.",
    ].join("\n\n"),
  },
];

const NEWS = [
  {
    slug: "news-neverland-proposal",
    category: "activity",
    title: "피터팬 네버랜드, 20인이 머무는 마을의 밑그림을 공개합니다",
    summary: "수도권 인접 2,000평, 모듈하우스 10채와 커뮤니티동을 제안합니다.",
    body: [
      "2026년 10월 설립추진위원회는 성인 중증 자폐성장애인을 위한 주거·치유 마을 ‘피터팬 네버랜드’를 제안했습니다.",
      "밑그림은 모듈하우스 10채(20인), 2층 커뮤니티동, 무장애 텃밭과 산책로입니다. 집은 거리를 두고 놓고, 침실은 차음으로 나눕니다.",
      "부지와 인허가가 확정되기 전의 계획입니다. 숫자와 일정이 바뀌면 이 게시판과 경영공시에 갱신합니다.",
    ].join("\n\n"),
  },
];

/**
 * pre-root runtime
 */
const readSupabase = () => {
  config({ path: resolve(ROOT_PATH, ".env"), quiet: true });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase 설정이 없습니다.");
  }
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
};

/**
 * utils
 */
const run = async () => {
  const supabase = readSupabase();
  const db = getDb();
  for (const [key, value] of SETTINGS) {
    await db.insert(siteSettings).values({ key, value }).onConflictDoNothing();
  }
  for (const item of NOTICES) {
    await db
      .insert(notices)
      .values({ ...item, pinned: true, published: true })
      .onConflictDoNothing();
  }
  for (const item of NEWS) {
    await db
      .insert(posts)
      .values({ ...item, board: "news", published: true })
      .onConflictDoNothing();
  }
  const uploaded = await supabase.storage
    .from("documents")
    .upload("bylaws/bylaws.pdf", readFileSync(BYLAWS_PATH), {
      contentType: "application/pdf",
      upsert: true,
    });
  if (uploaded.error) {
    console.warn("정관 PDF 버킷 업로드를 건너뜁니다:", uploaded.error.message);
  }
  console.log("bootstrap complete");
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
