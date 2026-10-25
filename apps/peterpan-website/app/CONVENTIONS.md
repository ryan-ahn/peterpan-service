# app 작성 규칙

`apps/peterpan-website/app/`의 Next.js 라우트·페이지 작성 시 아래를 따른다. 루트 [`CONVENTIONS.md`](../../../CONVENTIONS.md)의 기본 원칙·파일 블록·내부 블록 순서도 함께 적용한다.

---

## 라우트

| 경로                                                | 화면                                      |
| --------------------------------------------------- | ----------------------------------------- |
| `/`                                                 | 홈 (비전·가치·하는 일·최근 소식)          |
| `/about`, `/about/{greeting,organization,bylaws}`   | 재단 소개·인사말·조직·정관                |
| `/village`, `/village/{spaces,operation}`           | 피터팬 마을 소개·공간·운영                |
| `/news`, `/news/[slug]`                             | 재단소식 목록(공지·활동·언론보도)·본문    |
| `/disclosure`, `/disclosure/{management,donations}` | 경영공시·기부금 공시                      |
| `/donate`                                           | 후원 안내·참여 의사 남기기 (`actions.ts`) |
| `/login`                                            | 카카오·구글 로그인                        |
| `/auth/{kakao,google}`, `/callback`, `/auth/logout` | OAuth 라우트 핸들러                       |
| `/privacy`                                          | 개인정보 처리방침                         |

- 헤더·하단 메뉴는 `lib/nav.ts` 한 곳에 둔다.
- `layout.tsx`가 세션(`getSessionProfile`)과 하단 연락처(`getSiteContact`)를 읽어 `SiteHeader`·`SiteFooter`에 넘긴다.
- 관리 기능은 이 앱에 두지 않는다. 운영자는 `peterpan-admin`(`NEXT_PUBLIC_ADMIN_URL`)에서 관리한다.

---

## 페이지 컴포넌트

- `page.tsx` 안의 진입 컴포넌트 이름은 `*Screen`. 본문은 `*Section`.
- 서버 컴포넌트가 기본이다. 데이터가 필요하면 screen을 `async`로 두고 `@lib/posts`의 함수를 기다린다.
- 화면 첫머리 제목은 `PageIntro`(eyebrow·title·lead). 본문 글은 `ArticlePage`, 공시 목록은 `DisclosureList`.
- 메뉴·캐러셀처럼 브라우저 상태가 필요한 UI만 `components/`에 `"use client"`로 둔다.
- 폼 제출은 그 라우트의 `actions.ts` 서버 액션. 입력값은 `@repo/db/boards`의 `is*` 가드로 거른다.

---

## 데이터

- 게시물 조회는 `@lib/posts` (공개된 글만). 날짜·빈 값 표기는 `@lib/format`.
- 재단 고정 문구(설립 취지·인사말·조직·정관·마을·가치·하는 일)는 `@lib/foundation`.
- 원격 이미지는 `next.config.ts`의 `images.remotePatterns`에 호스트를 추가한 뒤 `next/image`로 쓴다. 로컬 이미지는 `@assets`.

---

## 컴포넌트

| 위치                            | 내용                                        |
| ------------------------------- | ------------------------------------------- |
| `@repo/ui`                      | Button, Chip, Icon, Text 등 공용 원자       |
| `components/brandText.tsx`      | `Text` 위에 브랜드 크기·색을 얹은 본문 글자 |
| `components/pageIntro.tsx`      | 화면 첫머리 eyebrow·제목·리드               |
| `components/siteHeader.tsx`     | 상단 메뉴·모바일 메뉴·후원하기              |
| `components/siteFooter.tsx`     | 하단 연락처·메뉴                            |
| `components/logo.tsx`           | 로고 링크 (`horizontal`·`symbol`)           |
| `components/workCarousel.tsx`   | 홈 하는 일 캐러셀                           |
| `components/articlePage.tsx`    | 게시물 본문·첨부                            |
| `components/disclosureList.tsx` | 연도별 공시 목록                            |

- 글자는 `BrandText`의 `variant`로 고른다. `display`·`title`·`section`·`heading`·`cardTitle`·`lead`·`body`·`bodyCompact`·`small`·`smallCompact`·`caption`·`overline`·`pen`(손글씨).
- 글자 색은 `color`로 고른다. `ink`·`inkSoft`·`muted`·`pine`·`pineDeep`·`gold`·`goldDeep`·`sage`·`beige`·`paper`·`white`·`whiteSoft`.
- 버튼은 `@repo/ui` `Button`의 `color`(`pine`·`gold`·`paper`·`white`·`kakao`). 라우트 이동 링크는 `next/link`에 `buttonStyle`.

---

## 스타일

- 공용 토큰은 `@repo/tailwind-config`. 바탕 `bg-paper`, 본문 `text-ink`, 강조 `pine`·`gold`.
- 화면 폭은 `globals.css`의 `page-*` 유틸리티로 잡는다. `page-wide` 1180, `page-form` 1100, `page-list` 980, `page-article` 860, `page-reading` 820, `page-narrow` 640, `page-auth` 480. 양옆 16px 여백은 유틸리티에 들어 있다.
- 히어로 사진의 가장자리 흐림은 `hero-mask`. 계산이 긴 장식만 `globals.css`에 둔다.
- 손글씨는 `layout.tsx`의 `next/font` Nanum Pen Script를 `--font-nanum-pen`으로 연결해 `font-pen`으로 쓴다. 본문은 Pretendard(`font-sans`).
- 모바일이 기본이다. 커질 때만 `md:` `lg:` `xl:`.
