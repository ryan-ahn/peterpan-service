# app 작성 규칙

`apps/peterpan-admin/app/`의 Next.js 라우트·페이지 작성 시 아래를 따른다. 루트 [`CONVENTIONS.md`](../../../CONVENTIONS.md)의 기본 원칙·파일 블록·내부 블록 순서도 함께 적용한다.

---

## 라우트

| 경로                                                     | 화면                                                            |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| `/`                                                      | 운영자 로그인 (카카오·구글). 운영자면 `/dashboard`로 보냄       |
| `/dashboard`                                             | 대시보드 (회원·게시판·후원 개수와 추이. 메뉴 권한 없이 모두 봄) |
| `/members`                                               | 회원 관리 (조회·삭제)                                           |
| `/inquiries`                                             | 후원 관리 (웹사이트 후원하기에서 남긴 후원)                     |
| `/news`                                                  | 소식 관리 — 공지 탭 (기본)                                      |
| `/news/activity`                                         | 소식 관리 — 활동 탭                                             |
| `/news/press`                                            | 소식 관리 — 언론보도 전체                                       |
| `/news/press/pending`                                    | 소식 관리 — 언론보도 승인 대기                                  |
| `/news/press/approved` · `/news/press/hidden`            | 소식 관리 — 언론보도 게시 중·숨김                               |
| `/posts`                                                 | 게시물 관리 (웹사이트 게시판 회원 글. 숨김·삭제·댓글 삭제)      |
| `/disclosures`                                           | 공시 관리 (경영 공시, 기부금 공시)                              |
| `/organization`                                          | 조직도 관리 (그룹·인원을 끌어 놓아 구조를 짜고 저장)            |
| `/bylaws`                                                | 정관 관리 (판마다 올리고 웹사이트 노출 1건 선택)                |
| `/settings`                                              | 기본 정보 (웹사이트 하단 연락처)                                |
| `/logs`                                                  | 관리 기록 (운영자 활동 기록. 읽기 전용)                         |
| `/permissions`                                           | 권한 관리 (오너·슈퍼 관리자. 관리자 등록·해제, 메뉴 권한)       |
| `/auth/{kakao,google}`, `/auth/callback`, `/auth/logout` | OAuth 라우트 핸들러. 실패하면 `/?error=`                        |
| `/api/cron/press`                                        | 언론 보도 수집 크론 (Vercel Cron 매일 09시, `CRON_SECRET` 확인) |

- 관리 화면은 `app/(manage)/` 라우트 그룹에 둔다. 그룹 `layout.tsx`가 `requireAdmin()`으로 운영자를 확인하고 `AdminFrame`으로 감싼다.
- 메뉴는 `lib/adminMenu.ts`의 `ADMIN_MENUS`(메뉴 권한 id 포함)와 `PERMISSIONS_MENU` 한 곳에만 두고, 라우트 표 순서와 같게 둔다. 화면을 추가하면 여기에 메뉴를 더하고, 그 화면의 서버 액션은 `assertMenu("새 id")`로 막는다.
- 권한은 `admin_members` 테이블의 `owner`·`super`·`manager`다. 행이 없으면 일반 회원이라 관리 화면에 못 들어온다.
  - `owner`: 한 명 고정(마이그레이션 `0002_admin_members.sql`이 지정). 바꾸거나 삭제할 수 없다. 슈퍼 관리자 지정·해제·삭제는 오너만 한다.
  - `super`: 모든 메뉴와 권한 관리. 회원을 관리자로 등록하고, 관리자의 메뉴 권한을 주고 빼고, 관리자를 회원으로 내리거나 삭제한다.
  - `manager`: `menus` 배열에 든 메뉴만 쓴다. 권한 없는 메뉴는 왼쪽에 흐리게 보이고, 주소로 들어와도 본문 대신 안내가 보인다.
- 화면에는 `owner`·`super` 모두 "슈퍼 관리자", `manager`는 "관리자"로 보인다. 회원 필터·개수의 슈퍼 관리자에는 오너가 포함된다. "오너"는 권한 규칙 안내(슈퍼 관리자 지정·해제)에만 쓰고, "매니저"는 쓰지 않는다.
- 내 권한은 바꿀 수 없다. 로그인 뒤에는 대시보드로 보내고(`readAdminHome`), 쓸 메뉴가 없으면 로그인 화면에 안내한다.
- 대시보드는 `DASHBOARD_MENU`로 메뉴 권한 밖에 두고, 왼쪽 로고와 첫 메뉴가 여기로 온다. 개인 정보 없이 개수만 보여 주고 액션은 `assertAdmin()`으로 막는다. 차트는 `recharts`, 색은 `colors` CSS 변수로 준다.

---

## 페이지 컴포넌트

- `page.tsx` 안의 진입 컴포넌트 이름은 `*Screen`. 목록·검색·드로어 상태가 있으므로 `"use client"`.
- 한 화면은 `AdminPageHeader` → 필터(칩·탭) → `AdminTable` → `AdminPager` 순서로 그린다.
- 상세·작성은 `AdminDrawer` 안의 `*EditorSection`(읽기 전용이면 `*DetailSection`). 열 때 `key`를 바꿔 폼 상태를 새로 만든다.
- 삭제처럼 되돌릴 수 없는 동작은 `@repo/ui` `Modal`로 한 번 더 묻는다. 결과는 `useToast`로 알린다.
- 헤더 검색은 `useAdminHeader({ placeholder, value, onChange, onSubmit })`로 등록한다.

---

## 데이터

- 목록·저장·삭제는 `@lib/adminData`의 서버 액션(`"use server"`)만 부른다. 모든 액션은 첫 줄에서 `assertMenu(메뉴 id...)`로 그 메뉴 권한을 다시 확인한다(넘긴 메뉴 중 하나면 통과. 소식·공시가 같이 쓰는 `postEditor` 액션은 `assertMenu("news", "disclosures")`).
- 무언가 바꾸는 액션(저장·삭제·승인·권한 변경 등)은 끝에 `writeLog({ self, menu, action, target })`로 `admin_logs`에 활동 기록을 남긴다. `action`은 "공지 삭제"처럼 짧은 한국어, `target`은 글 제목·회원 이름처럼 지운 뒤에도 알아볼 이름이다. 기록은 고치거나 지우지 않고 `/logs`(메뉴 권한 `logs`)에서 읽기만 한다. 읽기만 하는 액션은 남기지 않는다.
- 서버 컴포넌트·레이아웃의 권한 확인은 `@lib/adminSession`의 `requireAdmin()`(운영진이 아니면 `/`로 보냄). 권한 관리 화면은 `requireSuper()`, 권한 바꾸기 액션은 첫 줄에서 `assertSuper()`.
- 회원 게시물은 `board_posts`(댓글 `board_comments`, 좋아요 `board_likes`). 어드민은 숨김(`published`)·삭제만 하고 글을 고치지 않는다.
- 소식의 공지는 `notices`, 활동과 공시는 `posts` 테이블이다. 웹사이트 재단 소식은 공지와 활동을 합쳐 보여 준다. `posts` 작성·수정 드로어는 `components/postEditor.tsx` 하나를 소식·공시 화면이 같이 쓴다.
- 언론 보도는 직접 쓰지 않는다. `@lib/pressCollector`가 NAVER API HUB 뉴스 검색(네이버 클라우드 플랫폼 Application 키 `NAVER_SEARCH_CLIENT_ID`·`NAVER_SEARCH_CLIENT_SECRET`)로 키워드 기사를 `press_candidates`에 모으고, 운영자가 승인하면 `posts`(news·press, `externalUrl` 원문 링크)를 만든다. 숨기면 글을 지우고 상태만 남겨 다시 올라오지 않게 한다. 기사 본문은 저장하지 않는다.
- 첨부가 있는 저장은 `FormData`로 `savePost`에 넘긴다. 파일당 20MB, 이미지는 `media`, 나머지는 `documents` 버킷. 서버 액션 본문 한도는 `next.config.ts`의 `serverActions.bodySizeLimit`.
- 목록 화면의 검색·필터·쪽 상태는 `@lib/useAdminList`. 쪽 크기는 `@constants/adminUi`의 `ADMIN_PAGE_SIZE`.
- 날짜 표기는 `@lib/formatDate`의 `formatAdminDate`. 게시판·분류 이름은 `@repo/db/boards`.

---

## 컴포넌트

| 위치                             | 내용                                         |
| -------------------------------- | -------------------------------------------- |
| `@repo/ui`                       | Button, Chip, Input, Select, Modal, Toast 등 |
| `components/adminFrame.tsx`      | 셸 + 헤더 검색 컨텍스트                      |
| `components/adminShell.tsx`      | 사이드바·상단 검색·모바일 메뉴·로그아웃      |
| `components/adminTable.tsx`      | 컬럼 정의로 그리는 표 (로딩·빈 상태 포함)    |
| `components/adminDrawer.tsx`     | 오른쪽 상세 패널                             |
| `components/adminPager.tsx`      | 총 개수 + 쪽 이동                            |
| `components/adminPageHeader.tsx` | 화면 제목·설명·주요 버튼                     |
| `components/memberRoleChip.tsx`  | 회원 권한 칩(슈퍼 관리자·관리자·회원)과 이름 |
| `components/postEditor.tsx`      | posts 글 작성·수정 드로어 (소식 활동·공시)   |

- 어드민 여러 화면에서 쓰는 것만 `components/`에 둔다. 웹사이트와 같이 쓸 원자가 생기면 `packages/ui`로 올린다.

---

## 스타일

- Tailwind + `@repo/ui` + `packages/tailwind-config`. 배경은 `bg-gray-100`, 패널은 흰 바탕.
- 패널·제목·라벨 클래스는 `@constants/adminUi`. 화면마다 같은 테두리를 다시 적지 않는다.
- 상태 표시는 `Chip` 색으로 맞춘다. 공개 `green`, 비공개·일반 회원 `gray`, 고정·관리자 `primary`, 슈퍼 관리자·창립 후원 `gold`.
