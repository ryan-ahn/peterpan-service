# app 작성 규칙

`apps/peterpan-admin/app/`의 Next.js 라우트·페이지 작성 시 아래를 따른다. 루트 [`CONVENTIONS.md`](../../../CONVENTIONS.md)의 기본 원칙·파일 블록·내부 블록 순서도 함께 적용한다.

---

## 라우트

| 경로                                   | 화면                                                        |
| -------------------------------------- | ----------------------------------------------------------- |
| `/`                                    | 운영자 로그인 (카카오·구글). 운영자면 `/posts`로 보냄       |
| `/posts`                               | 게시물 관리 (재단소식 활동·언론보도, 경영공시, 기부금 공시) |
| `/notices`                             | 공지사항 관리 (재단소식의 공지 분류)                        |
| `/inquiries`                           | 후원 문의 (웹사이트 기부하기에서 남긴 참여 의사)            |
| `/members`                             | 회원 관리 (역할 변경·삭제)                                  |
| `/settings`                            | 기본정보 (웹사이트 하단 연락처)                             |
| `/auth/{kakao,google}`, `/auth/logout` | OAuth 라우트 핸들러. 실패하면 `/?error=`                    |

- 관리 화면은 `app/(manage)/` 라우트 그룹에 둔다. 그룹 `layout.tsx`가 `requireAdmin()`으로 운영자를 확인하고 `AdminFrame`으로 감싼다.
- 메뉴는 `components/adminShell.tsx`의 `NAV_LINKS` 한 곳에만 둔다. 화면을 추가하면 여기에 링크를 더한다.
- 운영자는 `ADMIN_EMAILS`에 있는 이메일이다. 로그인할 때마다 다시 올라가므로 회원 관리에서 내려도 목록에 남아 있으면 되돌아온다.

---

## 페이지 컴포넌트

- `page.tsx` 안의 진입 컴포넌트 이름은 `*Screen`. 목록·검색·드로어 상태가 있으므로 `"use client"`.
- 한 화면은 `AdminPageHeader` → 필터(칩·탭) → `AdminTable` → `AdminPager` 순서로 그린다.
- 상세·작성은 `AdminDrawer` 안의 `*EditorSection`(읽기 전용이면 `*DetailSection`). 열 때 `key`를 바꿔 폼 상태를 새로 만든다.
- 삭제처럼 되돌릴 수 없는 동작은 `@repo/ui` `Modal`로 한 번 더 묻는다. 결과는 `useToast`로 알린다.
- 헤더 검색은 `useAdminHeader({ placeholder, value, onChange, onSubmit })`로 등록한다.

---

## 데이터

- 목록·저장·삭제는 `@lib/adminData`의 서버 액션(`"use server"`)만 부른다. 모든 액션은 첫 줄에서 `assertAdmin()`으로 권한을 다시 확인한다.
- 서버 컴포넌트·레이아웃의 권한 확인은 `@lib/adminSession`의 `requireAdmin()`(운영자가 아니면 `/`로 보냄).
- 게시물·공지는 같은 `posts` 테이블이다. 공지는 `board: "news"`, `category: "notice"`로 저장한다.
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

- 어드민 여러 화면에서 쓰는 것만 `components/`에 둔다. 웹사이트와 같이 쓸 원자가 생기면 `packages/ui`로 올린다.

---

## 스타일

- Tailwind + `@repo/ui` + `packages/tailwind-config`. 배경은 `bg-gray-100`, 패널은 흰 바탕.
- 패널·제목·라벨 클래스는 `@constants/adminUi`. 화면마다 같은 테두리를 다시 적지 않는다.
- 상태 표시는 `Chip` 색으로 맞춘다. 공개 `green`, 비공개·일반 회원 `gray`, 고정 `primary`, 운영자·창립 후원 `gold`.
