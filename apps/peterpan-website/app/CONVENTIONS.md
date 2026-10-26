# app 작성 규칙

`apps/peterpan-website/app/`의 Next.js 라우트·페이지 작성 시 아래를 따른다. 루트 [`CONVENTIONS.md`](../../../CONVENTIONS.md)의 기본 원칙·파일 블록·내부 블록 순서도 함께 적용한다.

---

## 라우트

| 경로                                                     | 화면                                                 |
| -------------------------------------------------------- | ---------------------------------------------------- |
| `/`                                                      | 홈 (비전·가치·하는 일·최근 소식)                     |
| `/about`, `/about/{greeting,brand,organization,bylaws}`  | 설립 배경과 목적·대표 인사말·상징과 가치·조직도·정관 |
| `/about/vision`                                          | 이념 (메뉴·링크 밖. 주소로만 접근)                   |
| `/village`, `/village/{spaces,operation}`                | 피터팬 마을 소개·공간·운영                           |
| `/news`, `/news/[slug]`                                  | 재단소식 목록(공지·활동·언론보도)·본문               |
| `/board`, `/board/[id]`, `/board/write`                  | 회원 게시판 목록·본문·글쓰기(`?id=` 고치기)          |
| `/disclosure`, `/disclosure/{management,donations}`      | 경영공시·기부금 공시                                 |
| `/donate`                                                | 후원 안내·참여 의사 남기기 (`actions.ts`)            |
| `/login`                                                 | 카카오·구글 로그인                                   |
| `/auth/{kakao,google}`, `/auth/callback`, `/auth/logout` | OAuth 라우트 핸들러. 실패하면 `/login?error=`        |
| `/privacy`                                               | 개인정보 처리방침                                    |

- 헤더·하단 메뉴는 `lib/nav.ts` 한 곳에 둔다.
- `layout.tsx`가 세션(`getSessionProfile`)과 하단 연락처(`getSiteContact`)를 읽어 `SiteHeader`·`SiteFooter`에 넘긴다.
- 관리 기능은 이 앱에 두지 않는다. 운영자는 `peterpan-admin`(`NEXT_PUBLIC_ADMIN_URL`)에서 관리한다. 예외로 게시판 글은 어드민 권한 회원이 본문 화면에서 바로 지울 수 있다.

---

## 페이지 컴포넌트

- `page.tsx` 안의 진입 컴포넌트 이름은 `*Screen`. 본문은 `*Section`.
- 서버 컴포넌트가 기본이다. 데이터가 필요하면 screen을 `async`로 두고 `@lib/posts`의 함수를 기다린다.
- 화면 첫머리 제목은 `PageIntro`(eyebrow·title·lead). 재단소개·마을소개는 `FoundationHeader`, 마을소개 본문은 `BandSection` 띠 구역, 공시 목록은 `DisclosureList`.
- 메뉴·캐러셀처럼 브라우저 상태가 필요한 UI만 `components/`에 `"use client"`로 둔다.
- 폼 제출은 그 라우트의 `actions.ts` 서버 액션. 입력값은 `@repo/db/boards`의 `is*` 가드로 거른다.

---

## 데이터

- 게시물 조회는 `@lib/posts` (공개된 글만). 회원 게시판(`board_posts`·`board_comments`·`board_likes`)은 `@lib/board`, 글·댓글·좋아요 쓰기는 `app/board/actions.ts`. 날짜·빈 값 표기는 `@lib/format`.
- 재단 고정 문구(설립취지서·이념·마을·가치·하는 일)는 `@lib/foundation`.
- 조직도는 `@repo/db/organization`(site_settings JSON), 정관은 `bylaws` 테이블의 노출 1건. 둘 다 어드민에서 관리한다.
- 원격 이미지는 `next.config.ts`의 `images.remotePatterns`에 호스트를 추가한 뒤 `next/image`로 쓴다. 로컬 이미지는 `@assets`.

---

## 컴포넌트

| 위치                               | 내용                                         |
| ---------------------------------- | -------------------------------------------- |
| `@repo/ui`                         | Button, Chip, Icon, Text 등 공용 원자        |
| `components/brandText.tsx`         | `Text` 위에 브랜드 크기·색을 얹은 본문 글자  |
| `components/pageIntro.tsx`         | 화면 첫머리 eyebrow·제목·리드                |
| `components/foundationHeader.tsx`  | 재단소개·마을소개 공통 머리 (page-article)   |
| `components/foundationHeading.tsx` | 재단소개 탭 본문의 구역 제목·한 줄 설명      |
| `components/bandSection.tsx`       | 마을소개 가로 띠 구역 (영문 소제목·제목)     |
| `components/infoCard.tsx`          | 마을소개 흰 카드 (분류·제목·설명)            |
| `components/numberedList.tsx`      | 01·02 번호 제목·설명 목록                    |
| `components/villageAerial.tsx`     | 치유 마을 조감도 (자리 이름·설명 창, client) |
| `components/siteHeader.tsx`        | 상단 메뉴·모바일 메뉴·후원하기               |
| `components/siteFooter.tsx`        | 하단 연락처·메뉴                             |
| `components/logo.tsx`              | 로고 링크 (`horizontal`·`symbol`)            |
| `components/logoEmblem.tsx`        | 로고 네 모양 선 아이콘 (이념·상징과 가치)    |
| `components/workCarousel.tsx`      | 홈 하는 일 캐러셀                            |
| `components/disclosureList.tsx`    | 연도별 공시 목록                             |

- 글자는 `BrandText`의 `variant`로 고른다. `display`·`title`·`section`·`heading`·`cardTitle`·`lead`·`body`·`bodyCompact`·`small`·`smallCompact`·`caption`·`overline`·`pen`(손글씨).
- 글자 색은 `color`로 고른다. `ink`·`inkSoft`·`muted`·`pine`·`pineDeep`·`gold`·`goldDeep`·`sage`·`beige`·`paper`·`white`·`whiteSoft`.
- 버튼은 `@repo/ui` `Button`의 `color`(`pine`·`gold`·`paper`·`white`·`kakao`). 라우트 이동 링크는 `next/link`에 `buttonStyle`.

---

## 스타일

- 공용 토큰은 `@repo/tailwind-config`. 바탕 `bg-paper`, 본문 `text-ink`, 강조 `pine`·`gold`.
- 화면 폭은 `globals.css`의 `page-*` 유틸리티로 잡는다. `page-wide` 1180, `page-form` 1100, `page-list` 980, `page-article` 860, `page-reading` 820, `page-narrow` 640, `page-auth` 480. 양옆 16px 여백은 유틸리티에 들어 있다.
- 계산이 긴 장식만 `globals.css`에 둔다.
- 손글씨는 `layout.tsx`의 `next/font` Nanum Pen Script를 `--font-nanum-pen`으로 연결해 `font-pen`으로 쓴다. 본문은 Pretendard(`font-sans`).
- 모바일이 기본이다. 커질 때만 `md:` `lg:` `xl:`.
