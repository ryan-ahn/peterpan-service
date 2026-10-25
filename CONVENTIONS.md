# 코드 작성 규칙

피터팬 재단 웹 서비스 모노레포. Turborepo, Next.js App Router, React, Tailwind CSS v4.

실행·빌드는 [`README.md`](README.md).

---

## 원칙

- **의존성 최소화.** 타입·헬퍼·UI는 쓰는 파일에 둔다. **두 곳 이상**에서 쓸 때만 아래 [컴포넌트 위치](#컴포넌트-위치) 규칙에 따라 올린다.
- **단일 책임.** 한 파일·한 함수는 한 가지 역할. 이름만 봐도 역할이 드러나게 짓는다.
- **가독성 우선.** 읽기 쉬운 코드를 먼저 둔다. 리렌더가 화면을 따라가기 어려울 때만 메모이제이션을 넣는다.
- **불필요한 분리 금지.** 만들 수 있다는 이유만으로 파일·컴포넌트·훅을 나누지 않는다. 페이지 본문 섹션은 그 `page.tsx` 안에 둔다.
- **작업 후 정리.** 변경으로 쓸모없어진 import·타입·함수·주석 처리 코드를 제거한다. 루트에서 `npm run check`를 통과시킨다.

---

## 모노레포 구조

| 경로                          | 역할                                                       |
| ----------------------------- | ---------------------------------------------------------- |
| `apps/peterpan-website/`      | 재단 소개·소식·공시·기부하기·로그인                        |
| `apps/peterpan-admin/`        | 운영 어드민 (게시물·공지·후원 문의·회원·기본정보)          |
| `packages/ui/`                | 공용 디자인 시스템 (`@repo/ui`)                            |
| `packages/tailwind-config/`   | `@theme` 토큰 CSS, 공용 유틸리티, JS용 `theme.ts`          |
| `packages/db/`                | Drizzle 스키마·연결, 게시판 상수, 하단 연락처 (`@repo/db`) |
| `packages/auth/`              | Supabase 클라이언트, 세션, OAuth (`@repo/auth`)            |
| `packages/typescript-config/` | 공유 `tsconfig` 프리셋                                     |

앱·패키지 `tsconfig.json`은 `@repo/typescript-config`를 `extends`한다. Next 앱은 `nextjs.json`, `ui`·`tailwind-config`는 `react-library.json`, `db`·`auth`는 `library.json`.

### 컴포넌트 위치

| 어디서 쓰나                                                   | 위치                               |
| ------------------------------------------------------------- | ---------------------------------- |
| 두 앱 공통 원자 (버튼·칩·인풋·모달·바텀시트·캐러셀·토스트 등) | `packages/ui`                      |
| 어드민 여러 화면 (셸·표·드로어·페이저)                        | `apps/peterpan-admin/components`   |
| 웹사이트 여러 화면 (헤더·브랜드 글자)                         | `apps/peterpan-website/components` |
| 한 화면만                                                     | 그 `page.tsx` 안                   |

- `packages/ui`에는 도메인 상태·라우팅·데이터 로딩을 넣지 않는다.
- 앱 전용 컴포넌트는 `@repo/ui` 원자를 조합해 만든다. 같은 모양을 앱에서 새로 그리지 않는다.

---

## 경로 별칭

워크스페이스 패키지는 npm 이름으로 import한다.

| 별칭                    | 대상                             |
| ----------------------- | -------------------------------- |
| `@repo/ui/...`          | `packages/ui` (`exports` 경로)   |
| `@repo/tailwind-config` | 토큰 CSS·`theme.ts`              |
| `@repo/db/...`          | `packages/db` (`exports` 경로)   |
| `@repo/auth/...`        | `packages/auth` (`exports` 경로) |
| `@/*`                   | 해당 앱 루트                     |
| `@app/*`                | 해당 앱 `app/`                   |
| `@components/*`         | 해당 앱 `components/`            |
| `@lib/*`                | 해당 앱 `lib/`                   |
| `@assets/*`             | `apps/peterpan-website/assets/`  |
| `@constants/*`          | `apps/peterpan-admin/constants/` |

- 대상 경로는 `./`로 시작한다. `baseUrl`은 쓰지 않는다.
- 앱 안에서는 별칭을 쓴다. 상대 import는 같은 폴더 CSS와 `packages/ui` 내부에서만 쓴다.
- 타입만 가져올 때는 `import type`.

---

## import

파일 첫 줄에 `"use client"`가 필요하면 그것만 두고, 아래 순서로 묶는다. 그룹 사이에는 빈 줄. Prettier(`@trivago/prettier-plugin-sort-imports`)가 이 순서로 정렬한다.

1. `react`, `react-dom`
2. `next`
3. 서드파티 (`tailwind-variants` 등)
4. `@repo/*`
5. `@app`, `@assets`, `@components`, `@constants`, `@lib`
6. `@/`
7. 상대 경로

```tsx
"use client";

import { useState } from "react";

import Link from "next/link";

import Button from "@repo/ui/components/button";
import Text from "@repo/ui/text";

import AdminPageHeader from "@components/adminPageHeader";
import { listMembers } from "@lib/adminData";
```

---

## 컴포넌트 파일

`const`는 호이스팅되지 않는다. 아래는 파일 위→아래 **선언 순서**다. 없는 블록은 주석도 선언도 두지 않는다.

```
imports
→ /** constants */
→ /** types */
→ /** actions */
→ /** pre-root runtime */
→ /** pre-root utils */
→ /** hooks */
→ /** screen */
→ /** section */
→ /** inner components */
→ /** utils */
→ export default
```

| 블록               | 내용                                                                       |
| ------------------ | -------------------------------------------------------------------------- |
| `constants`        | 그 파일에서만 쓰는 상수                                                    |
| `types`            | 그 파일에서만 쓰는 타입. 컴포넌트 props는 `type Props`                     |
| `actions`          | 여러 컴포넌트가 공유하는 side effect. 가능하면 `handlers`에 둔다           |
| `pre-root runtime` | screen이 기다리는 비순수 로딩·환경 읽기. `read*` 접두                      |
| `pre-root utils`   | screen·훅·section이 부르는 **순수 함수**                                   |
| `hooks`            | 그 파일의 컴포넌트가 공유하는 훅                                           |
| `screen`           | 페이지 진입점 하나 (`*Screen`). 섹션 조합·페이지 단위 상태                 |
| `section`          | 본문 큰 단위 `*Section`. screen 바로 아래                                  |
| `inner components` | 같은 파일에서 **두 곳 이상** 쓰는 작은 UI. section 다음                    |
| `utils`            | screen이 **직접 부르지 않는** 순수 함수. inner 다음, `export default` 직전 |

- 파일 레벨 구역은 JSDoc 여러 줄. 첫 줄은 구역 이름 (`screen — 역할`). 한 줄 `/** hooks */`는 쓰지 않는다.
- 라우트 파일 이름은 `page.tsx`, `layout.tsx`. 그 안의 페이지 컴포넌트만 `*Screen`이다.
- 선언과 `export default`는 분리한다. `export default`는 파일 맨 아래다.
- `app/layout.tsx`는 Next 규약대로 `metadata` named export와 `export default function RootLayout`을 둔다.
- 외부에 넘기는 유니온(`Variant`, `Color`, `Size`, `Name`)만 export한다. `Props`는 파일 안에 둔다.

```tsx
/**
 * screen — 회원 관리
 */
const MembersScreen = () => { ... };

/**
 * section
 */
const MemberEditorSection = ({ member, onSaved }: MemberEditorSectionProps) => { ... };

export default MembersScreen;
```

---

## 컴포넌트 내부

함수 컴포넌트 본문은 `//` 한 줄 주석만 쓴다. 필요한 블록만 아래 순서로 둔다.

1. `// hooks` — 커스텀 훅, `useMemo`. 이벤트용 `useCallback`은 `// handlers`
2. `// refs` — `useRef`. 렌더 중 `ref.current` 접근 금지
3. `// states` — `useState`
4. `// variables` — 파생 값·`useParams` 결과
5. `// functions` — 이벤트에 묶이지 않는 순수 함수 (컴포넌트 스코프)
6. `// handlers` — `handle` + 대상 + 동작
7. `// initialize` — 초기 1회 `useEffect` (필요 시)
8. `// effects` — 나머지 `useEffect`
9. `// render` — JSX·early return

`// fetch`, `// routes`처럼 목록 밖 이름은 만들지 않는다.

- 블록 주석 바로 다음에 코드를 둔다. 블록 사이·함수 본문 안 빈 줄을 넣지 않는다.
- 같은 블록의 핸들러·`useEffect`도 빈 줄 없이 이어 쓴다.
- 인자 없는 이벤트는 JSX 인라인 화살표 대신 `handle*` 핸들러로 둔다.
- 스타일은 Tailwind 클래스. 컴포넌트 안에 스타일 객체를 두지 않는다.

---

## 서버와 클라이언트

- 페이지·레이아웃은 서버 컴포넌트가 기본이다. 데이터가 필요하면 `async`.
- 상태, 이펙트, 브라우저 API가 있는 파일만 `"use client"`를 둔다.
- screen이 기다리는 로딩은 `/** pre-root runtime */`의 `read*`. 캐시할 때는 그 함수 안에서 `"use cache"`와 `cacheLife`.

---

## 데이터·로그인

- DB는 `@repo/db`의 `getDb()`·스키마로 Drizzle 쿼리를 짠다. 게시판·소식 분류·후원 방식 이름은 `@repo/db/boards` 한 곳이다.
- Supabase 클라이언트·세션·OAuth는 `@repo/auth`. 앱에서 Supabase 클라이언트를 따로 만들지 않는다.
- 두 앱의 `/auth/{kakao,google}`·콜백 라우트는 `beginOAuth`·`finishOAuth`에 `loginPath`만 다르게 넘긴다.
- 환경 변수는 루트 `.env` 하나. 각 앱 `next.config.ts`가 `loadEnvConfig`로 루트를 읽는다.

---

## 스타일

토큰을 먼저 등록하고, 디자인 시스템과 화면은 그 토큰 이름으로만 그린다.

| 파일                                    | 내용                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `packages/tailwind-config/tokens.css`   | 공용 `@theme` 토큰. 색·글자·줄간격·자간·모서리·그림자·간격              |
| `packages/tailwind-config/tailwind.css` | 토큰 + 공용 유틸리티(`scrollbar-none`, `safe-bottom`)·애니메이션        |
| `packages/tailwind-config/theme.ts`     | JS에서 쓰는 색 (`colors`)                                               |
| `apps/*/app/globals.css`                | `tailwindcss` → 공용 `tailwind.css` import, `@source`, 앱 전용 유틸리티 |

- Tailwind 기본 색·글자·모서리·그림자는 `initial`로 지웠다. 등록한 이름만 쓴다.
- 간격은 4px 단위 (`p-4` = 16px). 글자는 `text-N` = (2N+6)px (`text-5` = 16px), 줄간격은 `leading-N` = (2N+10)px. 모서리는 `rounded-tiny`·`small`·`medium`·`large`·`xlarge`·`sheet`·`2xlarge`·`3xlarge`·`full`.
- 색은 시스템(`gray`·`primary`·`green`·`orange`·`red`)과 브랜드(`pine`·`pine-deep`·`sage`·`gold`·`gold-deep`·`bark`·`beige`·`paper`·`paper-light`·`ink`·`muted`), 외부 브랜드(`kakao`·`kakao-ink`)로 나뉜다.
- 화면은 `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. 모바일 스타일이 기본이고 커질 때만 `md:` `lg:` `xl:`을 붙인다.
- 앱 `globals.css`는 `@source "../../../packages/ui/src"`로 UI 패키지 클래스를 스캔한다.
- 클래스 조합은 `@repo/ui/lib/cn`, variant 묶음은 `@repo/ui/lib/tv`. 둘 다 커스텀 글자 크기를 아는 `tailwind-merge` 설정을 쓴다.
- 글자는 `@repo/ui/text`의 `Text`, 버튼은 `@repo/ui/components/button`의 `Button`.
- 임의 hex·px 하드코딩은 피한다. 웹사이트 장식 그라디언트·safe area·외부 브랜드만 예외.
- 배치는 `flex`, `grid`, `gap`.

---

## 링크

- 페이지 안 이동은 `<a href="#id">`.
- 앱 안 다른 라우트는 `next/link`.
- 바깥 주소는 `<a target="_blank" rel="noreferrer">`.
- `Button`은 `href`를 주면 `<a>`로 그린다. `@repo/ui`는 `next`에 의존하지 않으므로 해시·바깥 주소(`isExternal`)에만 쓴다. 앱 안 라우트로 가는 버튼 모양 링크는 `next/link`에 `buttonStyle({ ... })` 클래스를 준다.

---

## 네이밍

- **파일·폴더:** camelCase. 라우트 그룹은 `(group)`.
- **라우트 파일:** `page.tsx`, `layout.tsx`, `route.ts`.
- **컴포넌트:** PascalCase. 페이지 `*Screen`, 본문 `*Section`.
- **boolean prop:** `is*`, `has*`. `isOpen`, `isDisabled`, `hasArrows`.
- **핸들러:** `handle` + 대상 + 동작. `handleRowClick`, `handleDeleteConfirm`. 콜백 prop은 `on*`.
- **이미지:** kebab-case.

---

## 조건식

`else` 없이 early return으로 걸러 낸다. JSX의 짧은 분기는 삼항을 쓴다.

---

## 함수

- 컴포넌트는 `Props`를 파라미터에 붙이고 그 자리에서 분해한다.
- 유틸·훅은 파라미터 객체에 타입 이름을 붙이고, 분해는 함수 안에서 한다.

```ts
type FormatAdminDateParams = { value: string | null; hasTime?: boolean };

const formatAdminDate = (params: FormatAdminDateParams): string => {
  const { value, hasTime = false } = params;
  ...
};
```

---

## 포맷·린트

- Prettier: 루트 `prettier.config.mjs` (import 정렬, Tailwind 클래스 정렬). `npm run format`.
- ESLint: 앱은 `eslint.config.mjs` (`eslint-config-next`), UI 패키지는 `typescript-eslint` + `react-hooks`.
- 타입 검사: `npm run check-types`. 통합 확인: `npm run check`.
- 공유 컴파일러 옵션은 `packages/typescript-config`. 앱·패키지 `tsconfig`는 `extends`하고 경로 별칭처럼 그 패키지 전용 값만 덮어쓴다.

---

## 영역별 문서

| 경로                         | 문서                                                                                   |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `apps/peterpan-website/app/` | [`apps/peterpan-website/app/CONVENTIONS.md`](apps/peterpan-website/app/CONVENTIONS.md) |
| `apps/peterpan-admin/app/`   | [`apps/peterpan-admin/app/CONVENTIONS.md`](apps/peterpan-admin/app/CONVENTIONS.md)     |
| `packages/ui/`               | [`packages/ui/CONVENTIONS.md`](packages/ui/CONVENTIONS.md)                             |
