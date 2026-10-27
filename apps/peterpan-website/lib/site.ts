/**
 * 사이트 주소와 대표 문구. 메타데이터·사이트맵·robots·구조화 데이터가 같이 쓴다
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "피터팬 재단";

export const SITE_LEGAL_NAME = "재단법인 피터팬 자폐인복지재단";

export const SITE_DESCRIPTION =
  "성인 중증 자폐성장애인이 존엄하게 살아갈 생활주거공동체 '피터팬의 네버랜드'를 준비하는 재단법인 피터팬 자폐인복지재단입니다.";

export const SITE_KEYWORDS = [
  "재단법인 피터팬",
  "재단법인 피터팬 자폐인복지재단",
  "재단법인 피터팬 자폐인복지재단 설립 추진위원회",
  "피터팬 재단",
  "피터팬 자폐인복지재단",
  "피터팬의 네버랜드",
  "피터팬 아빠",
  "안녕, 피터팬",
  "안녕, 엄니",
  "전경철",
  "전경철 작가",
  "자폐성장애인",
  "발달장애인 주거",
  "자폐 생활주거공동체",
  "장애인 자립",
  "자폐인 후원",
  "발달장애인 기부",
];

/** GA4 측정 ID. 미리보기·개발 방문이 섞이지 않게 Vercel 프로덕션 배포에서만 태그를 싣는다 */
export const GA_MEASUREMENT_ID =
  process.env.VERCEL_ENV === "production" ? "G-SQDW4RXGHC" : null;
