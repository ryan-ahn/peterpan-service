import { getDb, pressCandidates } from "@repo/db";

/**
 * 언론보도 수집. NAVER API HUB(네이버 클라우드 플랫폼) 뉴스 검색으로 키워드마다 최근 기사를 읽어 press_candidates에 쌓는다.
 * 같은 원문 주소는 한 번만 들어간다. 서버(크론 라우트·서버 액션)에서만 부른다.
 * 환경 변수: NAVER_CLIENT_ID, NAVER_CLIENT_SECRET
 */

/**
 * constants
 */
const SEARCH_URL = "https://naverapihub.apigw.ntruss.com/search/v1/news";

const PRESS_KEYWORDS = [
  "피터팬 자폐인복지재단",
  "피터팬재단 자폐",
  "피터팬 네버랜드 자폐",
];

const DISPLAY_COUNT = 50;

const PUBLISHERS: [string, string][] = [
  ["yna.co.kr", "연합뉴스"],
  ["newsis.com", "뉴시스"],
  ["news1.kr", "뉴스1"],
  ["chosun.com", "조선일보"],
  ["joongang.co.kr", "중앙일보"],
  ["donga.com", "동아일보"],
  ["hani.co.kr", "한겨레"],
  ["khan.co.kr", "경향신문"],
  ["hankookilbo.com", "한국일보"],
  ["seoul.co.kr", "서울신문"],
  ["kmib.co.kr", "국민일보"],
  ["segye.com", "세계일보"],
  ["munhwa.com", "문화일보"],
  ["mk.co.kr", "매일경제"],
  ["hankyung.com", "한국경제"],
  ["mt.co.kr", "머니투데이"],
  ["edaily.co.kr", "이데일리"],
  ["nocutnews.co.kr", "노컷뉴스"],
  ["ohmynews.com", "오마이뉴스"],
  ["kbs.co.kr", "KBS"],
  ["imbc.com", "MBC"],
  ["sbs.co.kr", "SBS"],
  ["jtbc.co.kr", "JTBC"],
  ["ytn.co.kr", "YTN"],
  ["ablenews.co.kr", "에이블뉴스"],
  ["beminor.com", "비마이너"],
  ["welfarenews.net", "웰페어뉴스"],
];

const ENTITIES: Record<string, string> = {
  "&quot;": '"',
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

/**
 * types
 */
type NaverNewsItem = {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
};

type SearchNewsParams = {
  keyword: string;
  clientId: string;
  clientSecret: string;
};

type ToCandidateParams = {
  item: NaverNewsItem;
  keyword: string;
};

export type CollectPressResult = {
  fetched: number;
  added: number;
};

/**
 * actions
 */
export const collectPress = async (): Promise<CollectPressResult> => {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "NAVER API HUB 키가 없어요. NAVER_CLIENT_ID, NAVER_CLIENT_SECRET를 설정해 주세요.",
    );
  }
  let fetched = 0;
  let added = 0;
  const db = getDb();
  for (const keyword of PRESS_KEYWORDS) {
    const items = await searchNews({ keyword, clientId, clientSecret });
    fetched += items.length;
    const values = items.map(item => toCandidate({ item, keyword }));
    if (values.length === 0) {
      continue;
    }
    const inserted = await db
      .insert(pressCandidates)
      .values(values)
      .onConflictDoNothing({ target: pressCandidates.url })
      .returning({ id: pressCandidates.id });
    added += inserted.length;
  }
  return { fetched, added };
};

/**
 * utils
 */
const searchNews = async (
  params: SearchNewsParams,
): Promise<NaverNewsItem[]> => {
  const { keyword, clientId, clientSecret } = params;
  const url = new URL(SEARCH_URL);
  url.searchParams.set("query", `"${keyword}"`);
  url.searchParams.set("display", String(DISPLAY_COUNT));
  url.searchParams.set("sort", "date");
  url.searchParams.set("format", "json");
  const response = await fetch(url, {
    headers: {
      "X-NCP-APIGW-API-KEY-ID": clientId,
      "X-NCP-APIGW-API-KEY": clientSecret,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`네이버 뉴스 검색에 실패했어요. (${response.status})`);
  }
  const data = (await response.json()) as { items?: NaverNewsItem[] };
  return data.items ?? [];
};

const toCandidate = (params: ToCandidateParams) => {
  const { item, keyword } = params;
  const url = item.originallink || item.link;
  const publishedAt = new Date(item.pubDate);
  return {
    url,
    title: cleanText(item.title),
    summary: cleanText(item.description),
    publisher: readPublisher(url),
    publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
    keyword,
  };
};

const cleanText = (value: string) =>
  value
    .replace(/<[^>]+>/g, "")
    .replace(/&[#\w]+;/g, entity => ENTITIES[entity] ?? entity)
    .replace(/\s+/g, " ")
    .trim();

const readPublisher = (url: string) => {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return (
      PUBLISHERS.find(
        ([domain]) => host === domain || host.endsWith(`.${domain}`),
      )?.[1] ?? host
    );
  } catch {
    return "";
  }
};
