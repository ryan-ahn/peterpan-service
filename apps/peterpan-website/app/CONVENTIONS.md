# app 작성 규칙

`apps/peterpan-website/app/`의 Next.js 라우트·페이지 작성 시 아래를 따른다. 루트 [`CONVENTIONS.md`](../../../CONVENTIONS.md)의 기본 원칙·파일 블록·내부 블록 순서도 함께 적용한다.

---

## 라우트

| 경로                                                     | 화면                                                       |
| -------------------------------------------------------- | ---------------------------------------------------------- |
| `/`                                                      | 홈 (비전·가치·하는 일·최근 소식)                           |
| `/about`, `/about/{greeting,brand,organization,bylaws}`  | 설립 배경과 목적·대표 인사말·상징과 가치·조직도·정관       |
| `/village`, `/village/{spaces,operation}`                | 피터팬 마을 소개·공간·운영                                 |
| `/news`, `/news/[slug]`                                  | 재단 소식 목록(공지·활동·언론 보도)·본문                   |
| `/board`, `/board/[id]`, `/board/write`                  | 회원 게시판 목록·본문·글쓰기(`?id=` 고치기)                |
| `/disclosure`, `/disclosure/{management,donations}`      | 경영 공시·기부금 공시                                      |
| `/donate`                                                | 후원 안내·참여 의사 남기기 (`actions.ts`)                  |
| `/login`                                                 | 카카오·구글 로그인. 로그인했으면 `/mypage`로 보낸다        |
| `/mypage`                                                | 프로필·개인정보 설정·내 문의·내 게시글·탈퇴 (`actions.ts`) |
| `/auth/{kakao,google}`, `/auth/callback`, `/auth/logout` | OAuth 라우트 핸들러. 실패하면 `/login?error=`              |
| `/privacy`                                               | 개인정보 처리방침                                          |

- 메뉴는 헤더에만 두고 `lib/nav.ts` 한 곳에서 관리한다. 하단에는 재단 법정 표기와 개인정보처리방침 링크만 둔다.
- 개인정보처리방침의 보호책임자·담당 부서·시행일은 `app/privacy/page.tsx` 위쪽 상수에서 채운다. 비어 있으면 〔작성 필요〕로 보인다. 수집 항목·위탁사가 바뀌면 이 페이지도 함께 고친다.
- `layout.tsx`가 세션(`getSessionProfile`)과 하단 연락처(`getSiteContact`)를 읽어 `SiteHeader`·`SiteFooter`에 넘긴다.
- SEO: 사이트 주소·이름·대표 설명·키워드는 `@lib/site` 한 곳. 페이지마다 `metadata`에 `title`과 `description`을 둔다(OG·트위터는 여기서 자동으로 채워진다). 검색에 안 보일 화면은 `robots: { index: false }`. 새 고정 화면을 만들면 `sitemap.ts`의 `STATIC_ROUTES`에도 더한다. 아이콘·공유 이미지는 `app/{favicon.ico,icon.png,apple-icon.png,opengraph-image.png}`.
- 관리 기능은 이 앱에 두지 않는다. 운영자는 `peterpan-admin`(`NEXT_PUBLIC_ADMIN_URL`)에서 관리한다. 예외로 게시판 글은 어드민 권한 회원이 본문 화면에서 바로 지울 수 있다.

---

## 페이지 컴포넌트

- `page.tsx` 안의 진입 컴포넌트 이름은 `*Screen`. 본문은 `*Section`.
- 서버 컴포넌트가 기본이다. 데이터가 필요하면 screen을 `async`로 두고 `@lib/posts`의 함수를 기다린다.
- 메뉴 화면(재단소개·마을소개·소통·정보공개·후원하기)의 첫머리는 `FoundationHeader`(영문 overline·제목·금색 선·lead, 아래 선)이고 본문은 `page-article` 칼럼에 `py-10 lg:py-12`으로 놓는다. 글 본문·글쓰기도 `page-article`. 그 밖의 화면(로그인·마이페이지·처리방침)은 `PageIntro`(eyebrow·title·lead). 마을소개·후원하기 본문은 `BandSection` 띠 구역, 공시 목록은 `DisclosureList`.
- 후원은 1구좌 단위 없이 공식 후원 계좌로 받는다. 계좌 정보는 `app/donate/page.tsx`의 `DONATION_ACCOUNT`에 적고, 비어 있으면 "공개 준비 중"으로 보인다. 양식은 보낸 후원을 알리는 후원 알림(`donation_inquiries`)이다. 지금은 계좌이체 일시 후원만 받고(`DONATION_FORM_KINDS`), 정기 후원·카드 결제는 재단 설립과 PG 심사 뒤 결제 연동과 함께 연다.
- 메뉴·캐러셀처럼 브라우저 상태가 필요한 UI만 `components/`에 `"use client"`로 둔다.
- 폼 제출은 그 라우트의 `actions.ts` 서버 액션. 입력값은 `@repo/db/boards`의 `is*` 가드로 거른다.

---

## 데이터

- 회원 정보는 `profiles` 테이블이 기준이다. 이름·사진·이메일은 처음 가입할 때만 소셜 계정에서 채우고(`@repo/auth/oauth`), 이후 로그인은 덮어쓰지 않는다. 마이페이지 조회는 `@lib/account`, 쓰기는 `app/mypage/actions.ts`. 프로필 사진은 `avatars` 버킷(`AVATAR_UPLOAD`, 2MB)에 회원 세션으로 `{userId}/` 경로에 올린다(스토리지 정책이 자기 폴더만 허용).
- 로그인한 회원이 남긴 후원 문의는 `donation_inquiries.user_id`로 이어져 마이페이지에 보인다.
- 게시물 조회는 `@lib/posts` (공개된 글만). 회원 게시판(`board_posts`·`board_comments`·`board_likes`)은 `@lib/board`, 글·댓글·좋아요 쓰기는 `app/board/actions.ts`. 날짜·빈 값 표기는 `@lib/format`.
- 재단 고정 문구(설립취지서·미션·마을·가치·하는 일)는 `@lib/foundation`.
- 조직도는 `@repo/db/organization`(site_settings JSON), 정관은 `bylaws` 테이블의 노출 1건. 둘 다 어드민에서 관리한다.
- 원격 이미지는 `next.config.ts`의 `images.remotePatterns`에 호스트를 추가한 뒤 `next/image`로 쓴다. 로컬 이미지는 `@assets`.

---

## 컴포넌트

| 위치                               | 내용                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------- |
| `@repo/ui`                         | Button, Chip, Icon, Text 등 공용 원자                                     |
| `components/brandText.tsx`         | `Text` 위에 브랜드 크기·색을 얹은 본문 글자                               |
| `components/pageIntro.tsx`         | 화면 첫머리 eyebrow·제목·리드                                             |
| `components/foundationHeader.tsx`  | 재단소개·마을소개·소통·정보공개 공통 머리 (page-article)                  |
| `components/foundationHeading.tsx` | 재단소개 탭 본문의 구역 제목·한 줄 설명                                   |
| `components/bandSection.tsx`       | 마을소개 가로 띠 구역 (영문 소제목·제목)                                  |
| `components/infoCard.tsx`          | 마을소개 흰 카드 (분류·제목·설명)                                         |
| `components/numberedList.tsx`      | 01·02 번호 제목·설명 목록                                                 |
| `components/villageAerial.tsx`     | 치유 마을 조감도 (자리 이름·설명 창, client). 홈 첫 화면·조감과 공간      |
| `components/siteHeader.tsx`        | 상단 메뉴·모바일 메뉴·후원하기. 로그인하면 사진·닉네임(마이페이지 링크)   |
| `components/avatarPicker.tsx`      | 마이페이지 프로필 사진. 눌러서 골라 바로 올림 (client)                    |
| `components/flashToast.tsx`        | 서버 액션이 쿼리로 넘긴 결과를 토스트로 한 번 띄우고 쿼리를 지움 (client) |
| `components/siteFooter.tsx`        | 하단 재단 정보·개인정보처리방침 링크                                      |
| `components/logo.tsx`              | 로고 링크 (`horizontal`·`symbol`)                                         |
| `components/logoEmblem.tsx`        | 로고 네 모양 선 아이콘 (상징과 가치)                                      |
| `components/workCarousel.tsx`      | 홈 하는 일 캐러셀                                                         |
| `components/disclosureList.tsx`    | 연도별 공시 목록                                                          |

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
